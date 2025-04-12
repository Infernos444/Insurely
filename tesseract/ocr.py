import pytesseract
from PIL import Image
from pdf2image import convert_from_path
import cv2
import numpy as np
import re
import os
import docx
from io import BytesIO

# Optional: Windows users can set this path
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

POPPLER_PATH = r"C:\Codes\BGSC\Release-24.08.0-0\poppler-24.08.0\Library\bin"

def preprocess_image(image_path):
    """Preprocess image for better OCR results"""
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not read image from {image_path}")
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    scaled = cv2.resize(thresh, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)
    temp_path = "preprocessed_temp.png"
    cv2.imwrite(temp_path, scaled)
    return temp_path

def extract_text_from_docx(docx_path):
    """Extract text from DOCX files directly"""
    try:
        doc = docx.Document(docx_path)
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        raise ValueError(f"Error reading DOCX file: {str(e)}")

def extract_text_from_file(path):
    """Universal text extractor for DOCX, PDF, and image files"""
    if not os.path.exists(path):
        raise FileNotFoundError(f"File not found: {path}")
    
    if path.lower().endswith('.docx'):
        return extract_text_from_docx(path)
    elif path.lower().endswith('.pdf'):
        try:
            images = convert_from_path(path, poppler_path=POPPLER_PATH)
            if not images:
                raise ValueError("No pages found in PDF")
            images[0].save("temp_image.png")
            path = "temp_image.png"
        except Exception as e:
            raise ValueError(f"Error processing PDF: {str(e)}")
    
    # Process image files (including converted PDFs)
    try:
        preprocessed = preprocess_image(path)
        text = pytesseract.image_to_string(Image.open(preprocessed), config='--oem 3')
        # Clean up temporary files
        if os.path.exists(preprocessed):
            os.remove(preprocessed)
        if path == "temp_image.png" and os.path.exists(path):
            os.remove(path)
        return text
    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")

def extract_fields(text):
    """Extract structured fields from insurance document text"""
    extracted = {}

    # Age
    match = re.search(r'Age[:\s]*([0-9]{1,3})', text, re.IGNORECASE)
    extracted['age'] = int(match.group(1)) if match else None

    # Pre-existing conditions
    match = re.search(r'Pre-existing.*?(Yes|No|ves|na)\b', text, re.IGNORECASE)
    if match:
        val = match.group(1).lower()
        extracted['pre_existing'] = 1 if val in ('yes', 'ves') else (0 if val in ('no', 'na') else None)
    else:
        extracted['pre_existing'] = None

    # Treatment cost
    match = re.search(r'Treatment cost.*?(INR|Rs\.?)\s?([0-9,]+)', text, re.IGNORECASE)
    if match:
        extracted['treatment_cost'] = int(match.group(2).replace(",", ""))
    else:
        extracted['treatment_cost'] = None

    # Diagnosis group
    match = re.search(r'Diagnosis[:\s]*([A-Za-z\s]+?)(?:\n|$)', text, re.IGNORECASE)
    extracted['diagnosis_group'] = match.group(1).strip().capitalize() if match else None

    # Policy age
    match = re.search(r'Policy\s*(?:age|since|for)\D*([0-9]+)', text, re.IGNORECASE)
    extracted['policy_age'] = int(match.group(1)) if match else None

    # Sum insured
    match = re.search(r'Sum\s*Insured.*?(INR|Rs\.?)\s?([0-9,]+)', text, re.IGNORECASE)
    if match:
        extracted['sum_insured'] = int(match.group(2).replace(",", ""))
    else:
        extracted['sum_insured'] = None

    # Claim history
    match = re.search(r'Claim\s*history.*?([0-9]+)', text, re.IGNORECASE)
    extracted['claim_history'] = int(match.group(1)) if match else None

    # Hospital rating
    match = re.search(r'Hospital.*?Rating[:\s]*([1-5])', text, re.IGNORECASE)
    extracted['hospital_rating'] = int(match.group(1)) if match else None

    # Network status
    if re.search(r'in[- ]network', text, re.IGNORECASE):
        extracted['in_network'] = 1
    elif re.search(r'out[- ]of[- ]network', text, re.IGNORECASE):
        extracted['in_network'] = 0
    else:
        extracted['in_network'] = None

    return extracted

if __name__ == "__main__":
    try:
        # Example usage - change this path to your document
        path = r"/Users/thirumalaivasan/Downloads/sample_insurance_info.png"  # Works with DOCX, PDF, PNG, JPG
        
        print(f"🔍 Processing file: {path}")
        text = extract_text_from_file(path)
        
        print("\n📄 Extracted Text:\n", text[:500] + "..." if len(text) > 500 else text)  # Show first 500 chars
        print("\n✅ Structured Data:\n", extract_fields(text))
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")