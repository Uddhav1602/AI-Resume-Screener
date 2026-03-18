import pdfplumber
import os
from fastapi import HTTPException

def extract_text_from_pdf(file_path: str) -> str:
    """Extract all text content from a PDF file"""

    # Check file exists
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Resume file not found")

    extracted_text = ""

    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    extracted_text += page_text + "\n"
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Could not read PDF file: {str(e)}"
        )

    # Check if any text was found
    if not extracted_text.strip():
        raise HTTPException(
            status_code=400,
            detail="No text found in PDF. Make sure it's not a scanned image."
        )

    return extracted_text.strip()