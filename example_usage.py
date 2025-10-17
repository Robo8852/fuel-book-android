#!/usr/bin/env python3
"""
Example usage of the PDF Extractor
"""

from pdf_extractor import PDFExtractor
from pathlib import Path


def example_basic_text_extraction():
    """Example: Extract just text from a PDF."""
    pdf_path = "pdfs/your_file.pdf"
    
    if not Path(pdf_path).exists():
        print(f"Please place a PDF file at: {pdf_path}")
        return
    
    extractor = PDFExtractor(pdf_path)
    
    # Extract text using different methods
    text = extractor.extract_text_pymupdf()  # Fastest
    # text = extractor.extract_text_pdfplumber()  # Better layout
    # text = extractor.extract_text_pypdf()  # Basic
    
    print(text[:500])  # Print first 500 characters


def example_table_extraction():
    """Example: Extract tables from a PDF."""
    pdf_path = "pdfs/your_file.pdf"
    
    if not Path(pdf_path).exists():
        print(f"Please place a PDF file at: {pdf_path}")
        return
    
    extractor = PDFExtractor(pdf_path)
    tables = extractor.extract_tables_pdfplumber()
    
    print(f"Found {len(tables)} table(s)")
    
    for table in tables:
        print(f"\nTable on page {table['page']}, table #{table['table_number']}:")
        print(table['dataframe'].head())


def example_metadata_extraction():
    """Example: Extract PDF metadata."""
    pdf_path = "pdfs/your_file.pdf"
    
    if not Path(pdf_path).exists():
        print(f"Please place a PDF file at: {pdf_path}")
        return
    
    extractor = PDFExtractor(pdf_path)
    metadata = extractor.extract_metadata()
    
    print("PDF Metadata:")
    for key, value in metadata.items():
        print(f"  {key}: {value}")


def example_complete_extraction():
    """Example: Extract everything from a PDF."""
    pdf_path = "pdfs/your_file.pdf"
    
    if not Path(pdf_path).exists():
        print(f"Please place a PDF file at: {pdf_path}")
        return
    
    extractor = PDFExtractor(pdf_path)
    summary = extractor.extract_all(output_dir="output")
    
    print("\nExtraction Summary:")
    print(f"  PDF: {summary['pdf_file']}")
    print(f"  Tables found: {summary['tables_count']}")
    print(f"  Images found: {summary['images_count']}")


if __name__ == "__main__":
    print("PDF Extractor Examples\n" + "="*50)
    
    # Uncomment the example you want to run:
    
    # example_basic_text_extraction()
    # example_table_extraction()
    # example_metadata_extraction()
    example_complete_extraction()







