#!/usr/bin/env python3
"""
Extract fuel station data from the HTML review file.
This is more reliable than PDF extraction since the HTML structure is consistent.
"""

import re
import json
from bs4 import BeautifulSoup

def extract_fuel_data_from_html(html_file):
    """Parse fuel station data from HTML review file."""
    
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    data = {}
    current_state = None
    
    # Find all state sections
    state_sections = soup.find_all('div', class_='state-section')
    
    for section in state_sections:
        # Extract state name from header
        header = section.find('div', class_='state-header')
        if not header:
            continue
            
        state_span = header.find('span')
        if not state_span:
            continue
            
        state_name = state_span.text.strip()
        # Remove emoji and clean up
        state_name = re.sub(r'^[📍❌🇨🇦]\s*', '', state_name)
        
        # Skip covenant terminals section (we'll handle separately)
        if 'COVENANT' in state_name.upper():
            continue
            
        current_state = state_name
        data[current_state] = {
            'fuel_stations': [],
            'terminals': []
        }
            
        # Find all station cards in this section
        station_cards = section.find_all('div', class_='station-card')
        
        for card in station_cards:
            station = {}
            
            # Extract station name
            name_div = card.find('div', class_='station-name')
            if name_div:
                station['name'] = name_div.text.strip()
                # Extract number from name (#123)
                number_match = re.search(r'#(\d{3})', station['name'])
                if number_match:
                    station['number'] = number_match.group(1)
            
            # Extract brand (TA or Petro)
            brand_div = card.find('div', class_='brand-badge')
            if brand_div:
                station['type'] = brand_div.text.strip()
            
            # Extract site type
            site_type_div = card.find('div', class_='site-type')
            if site_type_div:
                station['site_type'] = site_type_div.text.strip()
            
            # Extract details
            details_div = card.find('div', class_='station-details')
            if details_div:
                detail_divs = details_div.find_all('div')
                
                # Track what we find
                location_text = None
                exit_text = None
                
                for div in detail_divs:
                    text = div.text.strip()
                    
                    if text.startswith('Address:'):
                        # Street address or city name
                        station['address'] = text.replace('Address:', '').strip()
                    
                    elif text.startswith('Location:'):
                        # This is CITY, ST ZIP format - use this!
                        location_text = text.replace('Location:', '').strip()
                    
                    elif text.startswith('Exit:'):
                        # Exit info - might be City, ST ZIP OR just exit numbers
                        exit_text = text.replace('Exit:', '').strip()
                    
                    elif text.startswith('Phone:'):
                        station['phone'] = text.replace('Phone:', '').strip()
                    
                    elif text.startswith('Fax:'):
                        station['fax'] = text.replace('Fax:', '').strip()
                    
                    elif text.startswith('NaviGo ID:'):
                        station['navigo_id'] = text.replace('NaviGo ID:', '').strip()
                
                # Smart detection: Which field has "City, ST ZIP" format?
                # Look for pattern: comma + 2-letter state + 5-digit ZIP
                city_state_zip_pattern = r',\s*[A-Z]{2}\s+\d{5}'
                
                if location_text and re.search(city_state_zip_pattern, location_text):
                    # Location has city/state/zip format
                    station['city_state_zip'] = location_text
                    if exit_text:
                        station['exit_info'] = exit_text
                elif exit_text and re.search(city_state_zip_pattern, exit_text):
                    # Exit has city/state/zip format
                    station['city_state_zip'] = exit_text
                    if location_text:
                        # Location is probably the street address in this case
                        if not station.get('address'):
                            station['address'] = location_text
                else:
                    # Fallback: use whatever we have
                    station['city_state_zip'] = location_text or exit_text or ''
            
            # Only add if we have essential data
            if 'name' in station and 'city_state_zip' in station:
                data[current_state]['fuel_stations'].append(station)
    
    # Handle Covenant Terminals
    covenant_section = soup.find('h2', string=re.compile(r'COVENANT.*TERMINALS', re.I))
    if covenant_section:
        data['COVENANT_TERMINALS'] = {
            'terminals': [],
            'fuel_stations': []
        }
        
        section = covenant_section.find_next_sibling('div', class_='covenant-section')
        if section:
            terminal_cards = section.find_all('div', class_='terminal-card')
            
            for card in terminal_cards:
                terminal = {'type': 'Covenant Terminal'}
                
                name_div = card.find('div', class_='terminal-name')
                if name_div:
                    terminal['name'] = name_div.text.strip()
                
                details_div = card.find('div', class_='terminal-details')
                if details_div:
                    detail_divs = details_div.find_all('div')
                    
                    for div in detail_divs:
                        text = div.text.strip()
                        
                        if text.startswith('Address:'):
                            terminal['address'] = text.replace('Address:', '').strip()
                        elif text.startswith('Phone:'):
                            terminal['phone'] = text.replace('Phone:', '').strip()
                        elif text.startswith('NaviGo ID:'):
                            terminal['navigo_id'] = text.replace('NaviGo ID:', '').strip()
                
                if 'name' in terminal:
                    data['COVENANT_TERMINALS']['terminals'].append(terminal)
    
    return data

if __name__ == '__main__':
    print("📖 Extracting fuel station data from HTML...")
    
    html_file = 'fuel_stations_review.html'
    data = extract_fuel_data_from_html(html_file)
    
    # Save to JSON
    output_file = 'fuel_stations_data.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Extraction complete!")
    print(f"📄 Data saved to: {output_file}")
    
    # Print summary
    print(f"\n📊 Summary:")
    total_stations = 0
    for state, info in data.items():
        if state == 'COVENANT_TERMINALS':
            terminal_count = len(info['terminals'])
            print(f"  Covenant Terminals: {terminal_count}")
        else:
            station_count = len(info['fuel_stations'])
            total_stations += station_count
            print(f"  {state}: {station_count} stations")
    
    print(f"\n  Total Fuel Stations: {total_stations}")

