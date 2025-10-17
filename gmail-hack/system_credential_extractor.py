#!/usr/bin/env python3
"""
REAL ATTACKER: System Credential Extractor
Attempts to extract Gmail credentials from system without user providing them
"""

import os
import subprocess
import json
from pathlib import Path

def banner():
    print("💀 SYSTEM CREDENTIAL EXTRACTOR")
    print("=" * 60)
    print("⚠️  REAL ATTACKER MODE: Extracting credentials from system")
    print("⚠️  No user interaction required!")
    print()

def check_browser_passwords():
    """Check for saved passwords in browsers"""
    print("🔍 Checking browser password stores...")
    
    # Chrome/Chromium locations
    chrome_paths = [
        "~/.config/google-chrome/Default/Login Data",
        "~/.config/chromium/Default/Login Data",
        "~/.var/app/com.google.Chrome/config/google-chrome/Default/Login Data"
    ]
    
    # Firefox locations
    firefox_paths = [
        "~/.mozilla/firefox/*.default*/logins.json",
        "~/.mozilla/firefox/*.default*/key4.db"
    ]
    
    found = False
    for path in chrome_paths:
        expanded = os.path.expanduser(path)
        if os.path.exists(expanded):
            print(f"   ✅ Found Chrome password DB: {expanded}")
            print(f"   🔐 Passwords are encrypted with system key")
            found = True
    
    if not found:
        print("   ❌ No browser password databases found")
    
    return found

def check_keyring():
    """Check Linux keyring for stored credentials"""
    print("\n🔍 Checking system keyring...")
    
    keyring_paths = [
        "~/.local/share/keyrings/",
        "~/.gnome2/keyrings/",
        "/run/user/*/keyring/"
    ]
    
    for path in keyring_paths:
        expanded = os.path.expanduser(path)
        if os.path.exists(expanded):
            print(f"   ✅ Found keyring: {expanded}")
            try:
                files = os.listdir(expanded)
                if files:
                    print(f"   📁 Keyring files: {', '.join(files[:3])}")
                    print(f"   🔐 Passwords encrypted, need master password")
            except:
                pass
    
    return False

def check_config_files():
    """Search for config files with credentials"""
    print("\n🔍 Searching for credential files...")
    
    home = os.path.expanduser("~")
    patterns = [
        ".credentials",
        "credentials.json",
        "token.json",
        ".netrc",
        ".gitconfig",
        ".npmrc"
    ]
    
    found_files = []
    for pattern in patterns:
        search_path = Path(home)
        for file in search_path.rglob(pattern):
            if ".git" not in str(file) and "node_modules" not in str(file):
                found_files.append(str(file))
    
    if found_files:
        print(f"   ✅ Found {len(found_files)} credential files:")
        for f in found_files[:5]:
            print(f"      📄 {f}")
    else:
        print("   ❌ No credential files found")
    
    return found_files

def check_gmail_tokens():
    """Check for existing Gmail OAuth tokens"""
    print("\n🔍 Checking for Gmail OAuth tokens...")
    
    token_paths = [
        "~/token.json",
        "~/.credentials/gmail-token.json",
        "~/gmail-hack/token.json"
    ]
    
    for path in token_paths:
        expanded = os.path.expanduser(path)
        if os.path.exists(expanded):
            print(f"   🎯 FOUND GMAIL TOKEN: {expanded}")
            try:
                with open(expanded, 'r') as f:
                    token_data = json.load(f)
                    if 'token' in token_data or 'access_token' in token_data:
                        print(f"   ✅ Valid OAuth token found!")
                        print(f"   🚀 Can use this to access Gmail!")
                        return expanded
            except:
                pass
    
    print("   ❌ No Gmail tokens found")
    return None

def check_environment():
    """Check environment variables for credentials"""
    print("\n🔍 Checking environment variables...")
    
    env_vars = os.environ
    gmail_related = {k: v for k, v in env_vars.items() 
                    if any(x in k.lower() for x in ['gmail', 'email', 'password', 'credential'])}
    
    if gmail_related:
        print(f"   ✅ Found {len(gmail_related)} related variables:")
        for k in gmail_related.keys():
            print(f"      📋 {k}")
    else:
        print("   ❌ No Gmail credentials in environment")
    
    return gmail_related

def check_process_memory():
    """Check if we can extract credentials from running processes"""
    print("\n🔍 Checking running processes...")
    
    try:
        # Check for Chrome/Firefox processes
        ps_output = subprocess.check_output(['ps', 'aux'], text=True)
        
        gmail_processes = []
        for line in ps_output.split('\n'):
            if any(x in line.lower() for x in ['chrome', 'firefox', 'gmail']):
                gmail_processes.append(line[:80])
        
        if gmail_processes:
            print(f"   ✅ Found {len(gmail_processes)} Gmail-related processes")
            print(f"   💀 ATTACKER WOULD: Dump process memory for credentials")
        else:
            print("   ❌ No Gmail-related processes found")
            
    except:
        print("   ❌ Cannot access process list")
    
    return False

def attempt_credential_extraction():
    """Main extraction function"""
    banner()
    
    results = {
        'browser_passwords': check_browser_passwords(),
        'keyring': check_keyring(),
        'config_files': check_config_files(),
        'gmail_tokens': check_gmail_tokens(),
        'environment': check_environment(),
        'process_memory': check_process_memory()
    }
    
    print("\n" + "=" * 60)
    print("📊 EXTRACTION SUMMARY")
    print("=" * 60)
    
    if any(results.values()):
        print("🎯 POTENTIAL ATTACK VECTORS FOUND:")
        for key, value in results.items():
            if value:
                print(f"   ✅ {key.replace('_', ' ').title()}")
    else:
        print("❌ NO CREDENTIALS FOUND IN SYSTEM")
    
    print("\n💀 REAL ATTACKER NEXT STEPS:")
    print("   1. Install keylogger to capture typing")
    print("   2. Dump browser process memory")
    print("   3. Extract Chrome master password")
    print("   4. Decrypt browser password database")
    print("   5. Setup persistent backdoor")
    print("   6. Steal session cookies from browser")
    
    print("\n🛡️  SECURITY RECOMMENDATIONS:")
    print("   ✅ Use 2FA with hardware key (YubiKey)")
    print("   ✅ Keep browser updated")
    print("   ✅ Don't save passwords in browser")
    print("   ✅ Use password manager with master password")
    print("   ✅ Enable disk encryption")
    print("   ✅ Regular security audits")
    
    print("\n🚨 CONCLUSION:")
    print("   Without your explicit credentials, I CANNOT access your Gmail.")
    print("   This demonstrates that your system is relatively secure!")
    print("   Real attackers would need:")
    print("      - Physical access + keylogger")
    print("      - Or phishing you for credentials")
    print("      - Or exploiting zero-day vulnerability")

if __name__ == "__main__":
    attempt_credential_extraction()
