#!/usr/bin/env python3
"""
PDF Extraction Utility
Supports multiple extraction methods for text, tables, images, and metadata.
"""

import os
import sys
from pathlib import Path
import json

# PDF Libraries
import pypdf
import pdfplumber
import fitz  # PyMuPDF
from pdfminer.high_level import extract_text as pdfminer_extract
import pandas as pd


class PDFExtractor:
    """Comprehensive PDF extraction tool supporting multiple methods."""
    
    def __init__(self, pdf_path):
        """Initialize with path to PDF file."""
        self.pdf_path = Path(pdf_path)
        if not self.pdf_path.exists():
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")
    
    def extract_text_pypdf(self):
        """Extract text using pypdf (basic method)."""
        print(f"Extracting text using pypdf from {self.pdf_path.name}...")
        text = ""
        with open(self.pdf_path, 'rb') as file:
            reader = pypdf.PdfReader(file)
            for page_num, page in enumerate(reader.pages, 1):
                text += f"\n--- Page {page_num} ---\n"
                text += page.extract_text()
        return text
    
    def extract_text_pdfplumber(self):
        """Extract text using pdfplumber (better layout preservation)."""
        print(f"Extracting text using pdfplumber from {self.pdf_path.name}...")
        text = ""
        with pdfplumber.open(self.pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages, 1):
                text += f"\n--- Page {page_num} ---\n"
                text += page.extract_text() or ""
        return text
    
    def extract_text_pymupdf(self):
        """Extract text using PyMuPDF (fast and accurate)."""
        print(f"Extracting text using PyMuPDF from {self.pdf_path.name}...")
        text = ""
        doc = fitz.open(self.pdf_path)
        for page_num, page in enumerate(doc, 1):
            text += f"\n--- Page {page_num} ---\n"
            text += page.get_text()
        doc.close()
        return text
    
    def extract_tables_pdfplumber(self):
        """Extract tables using pdfplumber."""
        print(f"Extracting tables using pdfplumber from {self.pdf_path.name}...")
        all_tables = []
        with pdfplumber.open(self.pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages, 1):
                tables = page.extract_tables()
                for table_num, table in enumerate(tables, 1):
                    df = pd.DataFrame(table[1:], columns=table[0])
                    all_tables.append({
                        'page': page_num,
                        'table_number': table_num,
                        'dataframe': df
                    })
        return all_tables
    
    def extract_metadata(self):
        """Extract PDF metadata."""
        print(f"Extracting metadata from {self.pdf_path.name}...")
        doc = fitz.open(self.pdf_path)
        metadata = doc.metadata
        metadata['page_count'] = doc.page_count
        doc.close()
        return metadata
    
    def extract_images_pymupdf(self, output_dir='output/images'):
        """Extract images using PyMuPDF."""
        print(f"Extracting images from {self.pdf_path.name}...")
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        doc = fitz.open(self.pdf_path)
        image_list = []
        
        for page_num, page in enumerate(doc, 1):
            image_dict = page.get_images()
            for img_num, img in enumerate(image_dict, 1):
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                image_name = f"page{page_num}_img{img_num}.{image_ext}"
                image_path = output_path / image_name
                
                with open(image_path, "wb") as img_file:
                    img_file.write(image_bytes)
                
                image_list.append({
                    'page': page_num,
                    'image_number': img_num,
                    'path': str(image_path),
                    'format': image_ext
                })
        
        doc.close()
        return image_list
    
    def extract_all(self, output_dir='output'):
        """Extract all information from PDF."""
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        results = {}
        
        # Extract text (using PyMuPDF as default)
        results['text'] = self.extract_text_pymupdf()
        
        # Extract metadata
        results['metadata'] = self.extract_metadata()
        
        # Extract tables
        tables = self.extract_tables_pdfplumber()
        results['tables'] = []
        for table in tables:
            table_info = {
                'page': table['page'],
                'table_number': table['table_number']
            }
            # Save table to CSV
            csv_name = f"table_page{table['page']}_num{table['table_number']}.csv"
            csv_path = output_path / csv_name
            table['dataframe'].to_csv(csv_path, index=False)
            table_info['csv_path'] = str(csv_path)
            results['tables'].append(table_info)
        
        # Extract images
        results['images'] = self.extract_images_pymupdf(output_dir=output_path / 'images')
        
        # Save text output
        text_path = output_path / f"{self.pdf_path.stem}_text.txt"
        with open(text_path, 'w', encoding='utf-8') as f:
            f.write(results['text'])
        
        # Save metadata
        metadata_path = output_path / f"{self.pdf_path.stem}_metadata.json"
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(results['metadata'], f, indent=2)
        
        # Save summary
        summary = {
            'pdf_file': str(self.pdf_path),
            'text_output': str(text_path),
            'metadata_output': str(metadata_path),
            'tables_count': len(results['tables']),
            'tables': results['tables'],
            'images_count': len(results['images']),
            'images': results['images']
        }
        
        summary_path = output_path / f"{self.pdf_path.stem}_summary.json"
        with open(summary_path, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2)
        
        print(f"\n✓ Extraction complete!")
        print(f"  Text saved to: {text_path}")
        print(f"  Metadata saved to: {metadata_path}")
        print(f"  Tables extracted: {len(results['tables'])}")
        print(f"  Images extracted: {len(results['images'])}")
        print(f"  Summary saved to: {summary_path}")
        
        return summary


def main():
    """Main entry point for CLI usage."""
    if len(sys.argv) < 2:
        print("Usage: python pdf_extractor.py <path_to_pdf>")
        print("Example: python pdf_extractor.py pdfs/sample.pdf")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    
    try:
        extractor = PDFExtractor(pdf_path)
        extractor.extract_all()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()







