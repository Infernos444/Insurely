import pytesseract
from PIL import Image
from pdf2image import convert_from_path
import cv2
import numpy as np
import re
import os
import docx
import tempfile
import firebase_admin
from firebase_admin import credentials, storage, firestore
from google.cloud.storage import Blob
import magic
import time
import sys
import json
from datetime import datetime

# ✅ Path to Poppler for macOS
POPPLER_PATH = "/opt/homebrew/bin"

# ✅ Firebase Initialization
cred = credentials.Certificate("firebase_config/insurely-24724-firebase-adminsdk-fbsvc-194ed311fb.json")

firebase_admin.initialize_app(cred, {
    'storageBucket': 'insurely-24724.firebasestorage.app'
})

bucket = storage.bucket()
db = firestore.client()
print(f"✅ Connected to bucket: {bucket.name}")

# ✅ Track processed files
PROCESSED_FILES_FILE = "processed_files.json"

def load_processed_files():
    """Load the list of already processed files"""
    try:
        if os.path.exists(PROCESSED_FILES_FILE):
            with open(PROCESSED_FILES_FILE, 'r') as f:
                return set(json.load(f))
        return set()
    except Exception as e:
        print(f"⚠️ Error loading processed files: {e}")
        return set()

def save_processed_files(processed_files):
    """Save the list of processed files"""
    try:
        with open(PROCESSED_FILES_FILE, 'w') as f:
            json.dump(list(processed_files), f)
    except Exception as e:
        print(f"⚠️ Error saving processed files: {e}")

def is_file_processed(file_path, processed_files):
    """Check if file has already been processed"""
    return file_path in processed_files

def mark_file_processed(file_path, processed_files):
    """Mark file as processed"""
    processed_files.add(file_path)
    save_processed_files(processed_files)

def preprocess_image(image_path):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not read image from {image_path}")
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    scaled = cv2.resize(thresh, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)
    temp_path = "preprocessed_temp.png"
    cv2.imwrite(temp_path, scaled)
    return temp_path

def extract_text_from_file(path):
    print(f"🛠 Using Poppler path: {POPPLER_PATH}")

    if path.lower().endswith('.docx'):
        doc = docx.Document(path)
        return "\n".join([p.text for p in doc.paragraphs])

    elif path.lower().endswith('.pdf'):
        try:
            images = convert_from_path(path, poppler_path=POPPLER_PATH)
            if not images:
                raise ValueError("No pages found in PDF")
            images[0].save("temp_image.png")
            path = "temp_image.png"
        except Exception as e:
            raise ValueError(f"PDF Conversion error: {str(e)}")

    preprocessed = preprocess_image(path)
    text = pytesseract.image_to_string(Image.open(preprocessed), config='--oem 3')

    if os.path.exists(preprocessed):
        os.remove(preprocessed)
    if path == "temp_image.png" and os.path.exists(path):
        os.remove(path)

    return text

def extract_fields(text):
    extracted = {}
    patterns = {
        "age": r'Age[:\s]*([0-9]{1,3})',
        "treatment_cost": r'Treatment cost.*?(INR|Rs\.?)\s?([0-9,]+)',
        "diagnosis_group": r'Diagnosis[:\s]*([A-Za-z\s]+?)(?:\n|$)',
        "policy_age": r'Policy\s*(?:age|since|for)\D*([0-9]+)',
        "sum_insured": r'Sum\s*Insured.*?(INR|Rs\.?)\s?([0-9,]+)',
        "claim_history": r'Claim\s*history.*?([0-9]+)',
        "hospital_rating": r'Hospital.*?Rating[:\s]*([1-5])'
    }

    for key, pattern in patterns.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted[key] = int(match.group(2).replace(",", "")) if "cost" in key or "insured" in key else (
                int(match.group(1)) if match.group(1).isdigit() else match.group(1).strip()
            )
        else:
            extracted[key] = None

    pre_existing = re.search(r'Pre-existing.*?(Yes|No|ves|na)\b', text, re.IGNORECASE)
    extracted["pre_existing"] = 1 if pre_existing and pre_existing.group(1).lower() in ['yes', 'ves'] else (
        0 if pre_existing and pre_existing.group(1).lower() in ['no', 'na'] else None
    )

    if re.search(r'in[- ]network', text, re.IGNORECASE):
        extracted['in_network'] = 1
    elif re.search(r'out[- ]of[- ]network', text, re.IGNORECASE):
        extracted['in_network'] = 0
    else:
        extracted['in_network'] = None

    # ✅ Add timestamp
    extracted["processed_at"] = datetime.now().isoformat()
    
    return extracted

def get_file_mimetype(file_path):
    mime = magic.Magic(mime=True)
    return mime.from_file(file_path)

def download_blob(blob):
    filename = os.path.basename(blob.name)
    
    if not os.path.splitext(filename)[1]:
        _, temp_path = tempfile.mkstemp()
    else:
        _, temp_path = tempfile.mkstemp(suffix=os.path.splitext(filename)[-1])

    blob.download_to_filename(temp_path)
    print(f"📥 Downloaded: {blob.name} to {temp_path}")
    return temp_path

def process_single_file(file_path, processed_files):
    """Process a single file if it hasn't been processed before"""
    try:
        # ✅ Check if file already processed
        if is_file_processed(file_path, processed_files):
            print(f"⏭️ Skipping already processed file: {file_path}")
            return None

        blob = bucket.blob(file_path)
        if not blob.exists():
            print(f"❌ File {file_path} does not exist in storage")
            return None

        local_path = download_blob(blob)

        file_type = get_file_mimetype(local_path)
        print(f"📦 Detected file type: {file_type}")

        if file_type.startswith("image"):
            text = extract_text_from_file(local_path)

        elif file_type == "application/pdf":
            new_path = local_path + ".pdf"
            os.rename(local_path, new_path)
            local_path = new_path
            text = extract_text_from_file(local_path)

        elif file_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            new_path = local_path + ".docx"
            os.rename(local_path, new_path)
            local_path = new_path
            text = extract_text_from_file(local_path)

        else:
            print("❌ Unsupported file type, skipping...")
            os.remove(local_path)
            return None

        fields = extract_fields(text)

        print(f"\n📝 File: {file_path}")
        print(f"📄 First 300 chars:\n{text[:300]}...\n")
        print(f"✅ Extracted Fields:\n{fields}\n{'-'*60}")

        # Extract UID from folder structure
        path_parts = file_path.split('/')
        
        if len(path_parts) >= 3:
            uid = path_parts[1]
            filename = path_parts[2].split('.')[0]
            
            # ✅ Check if document already exists in Firestore
            doc_ref = db.collection("users").document(uid).collection("estimates").document(filename)
            existing_doc = doc_ref.get()
            
            if existing_doc.exists:
                print(f"⏭️ Document already exists in Firestore: users/{uid}/estimates/{filename}")
                # Optionally update instead of skipping:
                # doc_ref.set(fields, merge=True)
                # print(f"🔥 Updated Firestore: users/{uid}/estimates/{filename}")
            else:
                doc_ref.set(fields)
                print(f"🔥 Saved to Firestore: users/{uid}/estimates/{filename}")
                
        else:
            doc_id = file_path.replace('/', '_').replace('&', '')
            db.collection("estimates").document(doc_id).set(fields)
            print(f"🔥 Saved to Firestore: estimates/{doc_id}")

        # ✅ Mark file as processed
        mark_file_processed(file_path, processed_files)
        os.remove(local_path)
        return fields

    except Exception as e:
        print(f"❌ Error processing {file_path}: {str(e)}")
        return None

def process_new_estimate_files():
    """Process only NEW files that haven't been processed before"""
    print("🔍 Checking for NEW files in 'estimates/' folder...")
    processed_files = load_processed_files()
    print(f"📊 Already processed: {len(processed_files)} files")
    
    blobs = bucket.list_blobs(prefix="estimates/")
    new_files_count = 0
    total_files = 0
    
    for blob in blobs:
        if blob.name.endswith("/"):  # Skip folder entries
            continue
            
        total_files += 1
        
        if not is_file_processed(blob.name, processed_files):
            print(f"🆕 NEW FILE FOUND: {blob.name}")
            process_single_file(blob.name, processed_files)
            new_files_count += 1
        else:
            print(f"⏭️ Already processed: {blob.name}")
    
    print(f"✅ Total files in storage: {total_files}")
    print(f"✅ New files processed: {new_files_count}")
    print(f"✅ Already processed: {total_files - new_files_count}")

def listen_for_new_files_realtime():
    """Real-time listener that only processes new files"""
    print("👂 Listening for NEW files in real-time...")
    processed_files = load_processed_files()
    
    # First, mark all existing files as processed
    blobs = bucket.list_blobs(prefix="estimates/")
    for blob in blobs:
        if not blob.name.endswith("/"):
            if not is_file_processed(blob.name, processed_files):
                mark_file_processed(blob.name, processed_files)
    
    save_processed_files(processed_files)
    print(f"📊 Marked existing {len(processed_files)} files as processed")
    
    while True:
        try:
            current_files = set(blob.name for blob in bucket.list_blobs(prefix="estimates/") if not blob.name.endswith("/"))
            new_files = current_files - processed_files

            for file_path in new_files:
                print(f"🆕 NEW FILE UPLOADED: {file_path}")
                process_single_file(file_path, processed_files)

            time.sleep(10)  # Check every 10 seconds

        except KeyboardInterrupt:
            print("🛑 Stopping real-time listener...")
            break
        except Exception as e:
            print(f"⚠️ Error in listener: {str(e)}")
            time.sleep(30)

def reset_processed_files():
    """Reset the processed files list (use carefully!)"""
    if os.path.exists(PROCESSED_FILES_FILE):
        os.remove(PROCESSED_FILES_FILE)
        print("✅ Processed files list reset")
    else:
        print("ℹ️ No processed files list found")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == "--reset":
            reset_processed_files()
        elif sys.argv[1] == "--realtime":
            listen_for_new_files_realtime()
        else:
            file_path = sys.argv[1]
            print(f"🔍 Processing specific file: {file_path}")
            processed_files = load_processed_files()
            result = process_single_file(file_path, processed_files)
            if result:
                print("🎉 Successfully processed file")
            else:
                print("❌ Failed to process file")
    else:
        print("🔍 Processing ONLY NEW estimate files...")
        process_new_estimate_files()