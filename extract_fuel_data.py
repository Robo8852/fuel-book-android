#!/usr/bin/env python3
"""
Extract fuel station data from Covenant Fuel Book PDF
Organizes data by state with all station details
"""

import fitz  # PyMuPDF
import json
import re
from pathlib import Path

# List of US states to identify
STATES = [
    'ALABAMA', 'ALASKA', 'ARIZONA', 'ARKANSAS', 'CALIFORNIA', 'COLORADO',
    'CONNECTICUT', 'DELAWARE', 'FLORIDA', 'GEORGIA', 'HAWAII', 'IDAHO',
    'ILLINOIS', 'INDIANA', 'IOWA', 'KANSAS', 'KENTUCKY', 'LOUISIANA',
    'MAINE', 'MARYLAND', 'MASSACHUSETTS', 'MICHIGAN', 'MINNESOTA',
    'MISSISSIPPI', 'MISSOURI', 'MONTANA', 'NEBRASKA', 'NEVADA',
    'NEW HAMPSHIRE', 'NEW JERSEY', 'NEW MEXICO', 'NEW YORK',
    'NORTH CAROLINA', 'NORTH DAKOTA', 'OHIO', 'OKLAHOMA', 'OREGON',
    'PENNSYLVANIA', 'RHODE ISLAND', 'SOUTH CAROLINA', 'SOUTH DAKOTA',
    'TENNESSEE', 'TEXAS', 'UTAH', 'VERMONT', 'VIRGINIA', 'WASHINGTON',
    'WEST VIRGINIA', 'WISCONSIN', 'WYOMING'
]

def extract_fuel_stations(pdf_path):
    """Extract all fuel station data from PDF."""
    doc = fitz.open(pdf_path)
    
    # Data structure: {state: {terminals: [], fuel_stations: []}}
    data = {}
    current_state = None
    
    # First, extract Covenant terminals (pages 10-20 approx)
    covenant_terminals = []
    for page_num in range(9, 20):  # Pages 10-20
        if page_num >= doc.page_count:
            break
        
        text = doc[page_num].get_text()
        if "Covenant Logistics:" in text:
            terminal = parse_covenant_terminal(text, page_num + 1)
            if terminal:
                covenant_terminals.append(terminal)
    
    # Extract state-by-state fuel stations (start from page 1 to catch all states)
    for page_num in range(0, doc.page_count):
        text = doc[page_num].get_text()
        
        # Check if this page has a state header
        found_state = None
        for state in STATES:
            if state in text and "SITE TYPE KEY" in text:
                found_state = state
                break
        
        if found_state:
            current_state = found_state
            if current_state not in data:
                data[current_state] = {
                    'terminals': [],
                    'fuel_stations': []
                }
        
        # Extract fuel stations from this page
        if current_state and "#" in text:  # Station entries have #number
            stations = parse_fuel_stations(text, current_state, page_num + 1)
            if stations:
                data[current_state]['fuel_stations'].extend(stations)
    
    # Add Covenant terminals to data
    data['COVENANT_TERMINALS'] = {
        'terminals': covenant_terminals,
        'fuel_stations': []
    }
    
    doc.close()
    return data

def parse_covenant_terminal(text, page_num):
    """Parse Covenant Logistics terminal information."""
    lines = text.split('\n')
    terminal = {'page': page_num, 'type': 'Covenant Terminal'}
    
    # Extract name and location
    for line in lines:
        if "Covenant Logistics:" in line:
            terminal['name'] = line.strip()
            break
    
    # Extract address
    address_pattern = r'([0-9]+\s+[^,]+,\s*[A-Z]{2}\s+[0-9]{5})'
    address_match = re.search(address_pattern, text)
    if address_match:
        terminal['address'] = address_match.group(1)
    
    # Extract phone
    phone_pattern = r'Phone:\s*(\([0-9]{3}\)\s*[0-9]{3}-[0-9]{4})'
    phone_match = re.search(phone_pattern, text)
    if phone_match:
        terminal['phone'] = phone_match.group(1)
    
    # Extract NaviGo ID
    navigo_pattern = r'NAVIGO ID:\s*([A-Z0-9-]+)'
    navigo_match = re.search(navigo_pattern, text)
    if navigo_match:
        terminal['navigo_id'] = navigo_match.group(1)
    
    # Extract amenities
    amenities = []
    in_amenities = False
    for line in lines:
        if "AMENITIES:" in line:
            in_amenities = True
            continue
        if in_amenities and line.strip().startswith('-'):
            amenities.append(line.strip().replace('- ', ''))
        elif in_amenities and not line.strip().startswith('-') and line.strip():
            break
    if amenities:
        terminal['amenities'] = amenities
    
    # Extract basic info
    if "SHOWERS:" in text:
        terminal['showers'] = re.search(r'SHOWERS:\s*([A-Z0-9]+)', text).group(1) if re.search(r'SHOWERS:\s*([A-Z0-9]+)', text) else 'NO'
    if "PARKING SPOTS:" in text:
        terminal['parking'] = re.search(r'PARKING SPOTS:\s*([0-9]+)', text).group(1) if re.search(r'PARKING SPOTS:\s*([0-9]+)', text) else '0'
    if "SHOP:" in text:
        terminal['shop'] = re.search(r'SHOP:\s*([A-Z]+)', text).group(1) if re.search(r'SHOP:\s*([A-Z]+)', text) else 'NO'
    
    return terminal if 'name' in terminal else None

def parse_fuel_stations(text, state, page_num):
    """Parse fuel station entries from a page."""
    stations = []
    
    # Pattern to match station entries: #123 TA Location or #123 Petro Location
    station_pattern = r'#([0-9]{3})\s+(TA|Petro)\s+([^\n]+)'
    matches = re.finditer(station_pattern, text)
    
    for match in matches:
        station = {
            'page': page_num,
            'state': state,
            'number': match.group(1),
            'type': match.group(2),
            'name': f"#{match.group(1)} {match.group(2)} {match.group(3).strip()}"
        }
        
        # Extract full details for this station
        # Find the text block for this specific station
        start_pos = match.start()
        # Find next station or end of relevant text
        next_match = re.search(r'#[0-9]{3}\s+(TA|Petro)', text[start_pos + 20:])
        end_pos = start_pos + next_match.start() + 20 if next_match else len(text)
        station_block = text[start_pos:end_pos]
        
        # Extract address and city/state/zip
        # Some stations have: Name → Address → City,ST ZIP
        # Others have: Name → City,ST ZIP → Address (swapped!)
        lines = station_block.split('\n')
        
        # Check which line has city/state/zip format (contains comma and state abbreviation)
        city_state_zip_line = None
        address_line = None
        
        if len(lines) > 1:
            line1 = lines[1].strip()
            line2 = lines[2].strip() if len(lines) > 2 else ''
            
            # City/state/zip format: "City, ST ZIP" (has comma and 2-letter state)
            if ',' in line1 and re.search(r',\s*[A-Z]{2}\s+[0-9]{5}', line1):
                city_state_zip_line = line1
                address_line = line2
            elif ',' in line2 and re.search(r',\s*[A-Z]{2}\s+[0-9]{5}', line2):
                address_line = line1
                city_state_zip_line = line2
            else:
                # Fallback: assume standard format
                address_line = line1
                city_state_zip_line = line2
        
        if address_line:
            station['address'] = address_line
        if city_state_zip_line:
            station['city_state_zip'] = city_state_zip_line
        
        if len(lines) > 3:
            station['exit_info'] = lines[3].strip()
        
        # Extract phone/fax
        phone_match = re.search(r'Ph:\s*(\([0-9]{3}\)\s*[0-9]{3}-[0-9]{4})', station_block)
        if phone_match:
            station['phone'] = phone_match.group(1)
        
        fax_match = re.search(r'Fx:\s*(\([0-9]{3}\)\s*[0-9]{3}-[0-9]{4})', station_block)
        if fax_match:
            station['fax'] = fax_match.group(1)
        
        # Extract NaviGo ID
        navigo_match = re.search(r'NaviGo:\s*([A-Z0-9-]+)', station_block)
        if navigo_match:
            station['navigo_id'] = navigo_match.group(1)
        
        # Determine site type from symbols
        if '★' in station_block:
            station['site_type'] = 'Exclusive'
        elif '●' in station_block:
            # Check if it says "Primary" or "Limited" nearby
            if 'Primary' in station_block:
                station['site_type'] = 'Primary'
            elif 'Limited' in station_block:
                station['site_type'] = 'Limited'
            else:
                station['site_type'] = 'Primary'  # Default for ●
        else:
            station['site_type'] = 'Unknown'
        
        stations.append(station)
    
    return stations

def main():
    pdf_path = Path("pdfs/Fuel_Book_Covenant_Last_Revised_3-2023-2.pdf")
    
    print("📖 Extracting fuel station data from PDF...")
    data = extract_fuel_stations(pdf_path)
    
    # Save to JSON
    output_file = Path("fuel_stations_data.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print(f"\n✅ Extraction complete!")
    print(f"📄 Data saved to: {output_file}")
    print(f"\n📊 Summary:")
    
    total_stations = 0
    for state, info in data.items():
        if state == 'COVENANT_TERMINALS':
            print(f"  Covenant Terminals: {len(info['terminals'])}")
        else:
            total_stations += len(info['fuel_stations'])
            if info['fuel_stations']:
                print(f"  {state}: {len(info['fuel_stations'])} stations")
    
    print(f"\n  Total Fuel Stations: {total_stations}")

if __name__ == "__main__":
    main()



