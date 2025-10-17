#!/usr/bin/env python3
"""
Debug script to find why PETRO stations were missed in extraction
"""

import fitz  # PyMuPDF
import re
from pathlib import Path

def debug_alabama_page():
    """Debug the Alabama page specifically to see what's happening."""
    
    pdf_path = Path("pdfs/Fuel_Book_Covenant_Last_Revised_3-2023-2.pdf")
    doc = fitz.open(pdf_path)
    
    print(f"📄 PDF has {doc.page_count} total pages")
    
    # Search for Alabama across all pages
    alabama_pages = []
    for page_num in range(doc.page_count):
        text = doc[page_num].get_text()
        if "ALABAMA" in text:
            alabama_pages.append(page_num + 1)  # +1 for human readable page numbers
    
    print(f"🔍 Found 'ALABAMA' on pages: {alabama_pages}")
    
    # Check each Alabama page
    for page_num in alabama_pages:
        page_index = page_num - 1  # Convert back to 0-based index
        text = doc[page_index].get_text()
        
        print(f"\n📖 PAGE {page_num} ANALYSIS:")
        print(f"   Text length: {len(text)} characters")
        
        # Check for state detection criteria
        has_alabama = "ALABAMA" in text
        has_site_type_key = "SITE TYPE KEY" in text
        has_hash_symbol = "#" in text
        
        print(f"   ✅ Has 'ALABAMA': {has_alabama}")
        print(f"   ✅ Has 'SITE TYPE KEY': {has_site_type_key}")
        print(f"   ✅ Has '#' symbol: {has_hash_symbol}")
        
        # Check for TA/PETRO patterns
        ta_matches = re.findall(r'#([0-9]{3})\s+TA\s+([^\n]+)', text)
        petro_matches = re.findall(r'#([0-9]{3})\s+PETRO\s+([^\n]+)', text)
        
        print(f"   🎯 TA matches found: {len(ta_matches)}")
        print(f"   🎯 PETRO matches found: {len(petro_matches)}")
        
        if ta_matches:
            print(f"   📋 TA stations: {ta_matches}")
        if petro_matches:
            print(f"   📋 PETRO stations: {petro_matches}")
        
        # Show raw text around station entries
        if "#" in text:
            print(f"\n   📝 Raw text sample (first 1000 chars):")
            print(f"   {repr(text[:1000])}")
            
            # Find all # patterns
            all_hash_patterns = re.findall(r'#([0-9]{3})\s+([A-Z]+)', text)
            print(f"   🎯 All # patterns found: {all_hash_patterns}")
    
    # Check the page range that the original script processes
    print(f"\n🔧 ORIGINAL SCRIPT ANALYSIS:")
    print(f"   Original script processes pages: 21-{doc.page_count}")
    print(f"   Alabama pages found: {alabama_pages}")
    
    for alabama_page in alabama_pages:
        if alabama_page >= 21:
            print(f"   ✅ Page {alabama_page} WOULD BE PROCESSED")
        else:
            print(f"   ❌ Page {alabama_page} WOULD BE SKIPPED (too early!)")
    
    doc.close()

def debug_regex_patterns():
    """Test regex patterns on sample text."""
    
    # Sample text from the image you showed
    sample_text = """#348 PETRO Shorter
428 Main Street
Shorter, AL 36075
I-85, Exit 22
Ph: (334) 727-3354

#016 TA Tuscaloosa
3501 Buttermilk Road
Cottondale, AL 35453
I-20/I-59, Exit 77
Ph: (205) 554-0215"""
    
    print(f"\n🧪 REGEX TESTING:")
    print(f"Sample text:\n{sample_text}\n")
    
    # Test original pattern
    original_pattern = r'#([0-9]{3})\s+(TA|PETRO)\s+([^\n]+)'
    matches = re.findall(original_pattern, sample_text)
    print(f"Original pattern matches: {matches}")
    
    # Test alternative patterns
    alt_patterns = [
        r'#(\d{3})\s+(TA|PETRO)\s+(.+)',  # More flexible
        r'#(\d{3})\s+(TA|PETRO)\s+([^#\n]+)',  # Stop at next # or newline
        r'#(\d{3})\s+(TA|PETRO)\s+([^\n]*)',   # Allow empty
    ]
    
    for i, pattern in enumerate(alt_patterns):
        matches = re.findall(pattern, sample_text)
        print(f"Alt pattern {i+1} matches: {matches}")

if __name__ == "__main__":
    print("🐛 DEBUG: Why PETRO Stations Were Missed")
    print("=" * 50)
    
    debug_alabama_page()
    debug_regex_patterns()
    
    print(f"\n✅ Debug complete! Check the output above.")


