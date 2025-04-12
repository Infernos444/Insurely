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

# ✅ Path to Poppler for macOS
POPPLER_PATH = "/opt/homebrew/bin"

# ✅ Firebase Initialization
cred = credentials.Certificate("firebase_config/insurely-24724-firebase-adminsdk-fbsvc-7a30017133.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'insurely-24724.firebasestorage.app'
})

bucket = storage.bucket()
db = firestore.client()

def preprocess_image(image_path):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not read image from {image_path}")
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    scaled = cv2.resize(thresh, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)
    temp = "preprocessed_temp.png"
    cv2.imwrite(temp, scaled)
    return temp

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

    if os.path.exists(preprocessed): os.remove(preprocessed)
    if path == "temp_image.png" and os.path.exists(path): os.remove(path)

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

def download_blob(blob):
    _, temp_path = tempfile.mkstemp(suffix=os.path.splitext(blob.name)[-1])
    blob.download_to_filename(temp_path)
    print(f"📥 Downloaded: {blob.name}")
    return temp_path

def process_all_estimate_files():
    print("🔍 Listing files in 'estimates/'...")
    blobs = bucket.list_blobs(prefix="estimates/")
    for blob in blobs:
        if blob.name.endswith("/"):
            continue  # skip folders
        try:
            local_path = download_blob(blob)
            text = extract_text_from_file(local_path)
            fields = extract_fields(text)

            print(f"\n📝 File: {blob.name}")
            print(f"📄 First 300 chars:\n{text[:300]}...\n")
            print(f"✅ Extracted Fields:\n{fields}\n{'-'*60}")

            # ✅ Save to Firestore
            doc_id = blob.name.split("/")[-1].split(".")[0]
            db.collection("estimates").document(doc_id).set(fields)
            print(f"🔥 Saved to Firestore: {doc_id}")

            os.remove(local_path)
        except Exception as e:
            print(f"❌ Error processing {blob.name}: {str(e)}")

if __name__ == "__main__":
    process_all_estimate_files()
