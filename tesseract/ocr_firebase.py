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

# ✅ Path to Poppler for macOS
POPPLER_PATH = "/opt/homebrew/bin"

# ✅ Firebase Initialization
cred = credentials.Certificate("firebase_config/insurely-24724-firebase-adminsdk-fbsvc-21710bace8.json")

firebase_admin.initialize_app(cred, {
    'storageBucket': 'insurely-24724.firebasestorage.app'
})

bucket = storage.bucket()
db = firestore.client()
print(f"✅ Connected to bucket: {bucket.name}")

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

def process_single_file(file_path):
    try:
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

        # ✅ UPDATED: Extract UID from folder structure
        # Path format: estimates/zyp5xt3REQUa8k8IXzqdvXr52G3/&zyp5xt3REQUa8k8lXzqdvXr52G3_1758815225632_sample_policy
        path_parts = file_path.split('/')
        
        if len(path_parts) >= 3:
            # The UID is the folder name (second part)
            uid = path_parts[1]  # zyp5xt3REQUa8k8IXzqdvXr52G3
            filename = path_parts[2].split('.')[0]  # Remove file extension
            
            db.collection("users").document(uid).collection("estimates").document(filename).set(fields)
            print(f"🔥 Saved to Firestore: users/{uid}/estimates/{filename}")
        else:
            # Fallback for unexpected path structure
            doc_id = file_path.replace('/', '_').replace('&', '')
            db.collection("estimates").document(doc_id).set(fields)
            print(f"🔥 Saved to Firestore: estimates/{doc_id}")

        os.remove(local_path)
        return fields

    except Exception as e:
        print(f"❌ Error processing {file_path}: {str(e)}")
        return None

def process_all_estimate_files():
    print("🔍 Recursively listing files in 'estimates/' folder and subfolders...")
    blobs = bucket.list_blobs(prefix="estimates/")  # This will include all nested files
    file_count = 0
    
    for blob in blobs:
        if blob.name.endswith("/"):  # Skip folder entries
            continue
        print(f"📄 Processing: {blob.name}")
        process_single_file(blob.name)
        file_count += 1
    
    print(f"✅ Processed {file_count} files")

def listen_for_new_files():
    print("👂 Listening for new files in 'estimates/' folder and subfolders...")
    known_files = set(blob.name for blob in bucket.list_blobs(prefix="estimates/") if not blob.name.endswith("/"))

    while True:
        try:
            current_files = set(blob.name for blob in bucket.list_blobs(prefix="estimates/") if not blob.name.endswith("/"))
            new_files = current_files - known_files

            for file_path in new_files:
                print(f"🆕 New file detected: {file_path}")
                process_single_file(file_path)

            known_files = current_files
            time.sleep(10)

        except KeyboardInterrupt:
            print("🛑 Stopping listener...")
            break
        except Exception as e:
            print(f"⚠️ Error in listener: {str(e)}")
            time.sleep(30)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        print(f"🔍 Processing specific file: {file_path}")
        result = process_single_file(file_path)
        if result:
            print("🎉 Successfully processed file")
        else:
            print("❌ Failed to process file")
    else:
        print("🔍 Processing all estimate files...")
        process_all_estimate_files()
        # Uncomment this if you want real-time listener
        # listen_for_new_files()