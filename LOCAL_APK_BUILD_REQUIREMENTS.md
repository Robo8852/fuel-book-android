# LOCAL APK BUILD REQUIREMENTS

## 🖥️ HARDWARE REQUIREMENTS FOR LOCAL ANDROID APK BUILDS

### **Minimum Specs:**
- **RAM:** 8 GB (16 GB recommended)
- **CPU:** Quad-core processor (Intel i5/AMD Ryzen 5 or better)
- **Storage:** 15-20 GB free space
- **OS:** Linux, macOS, or Windows with WSL2

### **Why These Requirements?**
Local Gradle builds are **extremely resource-intensive**:
- Downloads 2-3 GB of dependencies
- Compiles thousands of Java/Kotlin files
- Runs parallel build processes
- Uses aggressive RAM caching

---

## 📦 WHAT WE ALREADY INSTALLED

### ✅ **Android SDK Command-Line Tools** (Installed: Oct 16, 2025)
- **Location:** `~/Android/cmdline-tools/latest/`
- **Version:** 12.0
- **Size:** ~150 MB

### ✅ **SDK Packages Installed:**
- `platform-tools` (adb, fastboot)
- `platforms;android-34` (Android 14 SDK)
- `build-tools;34.0.0`
- **Total Size:** ~2.5 GB

### ✅ **Environment Variables Set:**
```bash
export ANDROID_HOME=$HOME/Android
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
```

**NOTE:** These are already added to `~/.bashrc`

---

## 🚀 HOW TO BUILD APK LOCALLY (WHEN YOU HAVE STRONGER COMPUTER)

### **Step 1: Verify SDK Installation**
```bash
export ANDROID_HOME=$HOME/Android
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
sdkmanager --version
```
Should output: `12.0`

### **Step 2: Navigate to Project**
```bash
cd /home/owner/Github/Fuel\ Book\ Android/fuel-book-mobile
```

### **Step 3: Generate Native Android Folder (If Needed)**
```bash
npx expo prebuild --platform android
```
This creates the `android/` folder with Gradle configs.

### **Step 4: Build APK**
```bash
cd android
./gradlew assembleRelease
```

**⏱️ Expected Time:** 10-20 minutes (first build)  
**⏱️ Subsequent Builds:** 3-5 minutes

### **Step 5: Find Your APK**
```bash
find android -name "*.apk"
```
Usually located at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### **Step 6: Transfer to Phone**
```bash
# Option A: USB
adb install android/app/build/outputs/apk/release/app-release.apk

# Option B: Manual
# Copy APK to phone via USB and install manually
```

---

## 🌩️ ALTERNATIVE: CLOUD BUILD (NO POWERFUL COMPUTER NEEDED)

### **EAS Build (Expo Application Services)**
- **Requirements:** Just internet connection + Expo account
- **Build Time:** 10-15 minutes
- **Cost:** Free for limited builds/month
- **Your Computer:** Does nothing (all work on cloud)

### **Commands:**
```bash
cd /home/owner/Github/Fuel\ Book\ Android/fuel-book-mobile

# Login to Expo
npx eas-cli login

# Configure EAS
npx eas build:configure

# Build APK
npx eas build --platform android --profile preview

# After build completes, download APK from the link provided
```

---

## 📊 WHAT HAPPENED ON OCT 16, 2025

### **Attempt 1: Local Gradle Build**
- ✅ SDK installed successfully
- ✅ Licenses accepted
- ✅ Gradle started
- ❌ **Computer froze** (insufficient RAM/CPU)
- ❌ Build never completed

### **Diagnosis:**
Current computer specs insufficient for heavy Gradle compilation. Recommend:
- Upgrading to 16 GB RAM
- OR using cloud build option

---

## 🎯 RECOMMENDED UPGRADE SPECS

### **Budget Option ($300-500):**
- RAM: 16 GB DDR4
- CPU: Intel i5-12400 / AMD Ryzen 5 5600
- Storage: 256 GB SSD

### **Optimal Option ($700-1000):**
- RAM: 32 GB DDR4/DDR5
- CPU: Intel i7-13700 / AMD Ryzen 7 5800X
- Storage: 512 GB NVMe SSD

---

## 📱 CURRENT WORKING SOLUTION

### **Expo Go (Development Mode)**
- ✅ **Currently Working**
- ✅ Full app functionality
- ✅ Real device testing
- ✅ Live updates via QR code
- ❌ Not a standalone APK (requires Expo Go app)

**To use Expo Go:**
```bash
cd /home/owner/Github/Fuel\ Book\ Android/fuel-book-mobile
npx expo start
# Scan QR code with Expo Go app on phone
```

---

## 🔧 TROUBLESHOOTING

### **If Gradle Build Freezes:**
1. Check RAM usage: `free -h`
2. Check CPU usage: `htop`
3. Kill frozen Gradle: `pkill -9 gradle`
4. Clear Gradle cache:
   ```bash
   cd /home/owner/Github/Fuel\ Book\ Android/fuel-book-mobile
   rm -rf android/.gradle
   rm -rf android/app/build
   ```

### **If Out of Disk Space:**
```bash
# Check space
df -h

# Clean Gradle cache
rm -rf ~/.gradle/caches/

# Clean Android SDK cache
rm -rf ~/Android/build-cache/
```

---

## 📚 ADDITIONAL RESOURCES

- **Android Studio Download:** https://developer.android.com/studio
- **Gradle Build Guide:** https://developer.android.com/build
- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **Expo Prebuild:** https://docs.expo.dev/workflow/prebuild/

---

## ✅ CHECKLIST FOR NEXT TIME (STRONGER COMPUTER)

- [ ] Verify RAM: `free -h` (need 8+ GB available)
- [ ] Verify disk space: `df -h` (need 15+ GB free)
- [ ] Verify CPU: `lscpu` (need 4+ cores)
- [ ] Verify Android SDK: `sdkmanager --version`
- [ ] Run prebuild: `npx expo prebuild --platform android`
- [ ] Start build: `./gradlew assembleRelease`
- [ ] Monitor build: Watch for errors, don't close terminal
- [ ] Wait patiently: First build takes 10-20 mins
- [ ] Find APK: `find android -name "*.apk"`
- [ ] Test APK: `adb install <path-to-apk>`

---

**Document Created:** October 16, 2025  
**Next Steps:** Get stronger computer OR use EAS cloud build  
**Current Status:** SDK fully installed and ready for when you upgrade! 🚀

