#!/bin/bash
# Non-interactive No-Click Vulnerability Scanner
# Run this after setting your credentials below

echo "🚨 Gmail No-Click Vulnerability Scanner - Automated"
echo "============================================================"
echo ""

# ⚠️ SET YOUR CREDENTIALS HERE:
# Get app password from: https://myaccount.google.com/apppasswords
GMAIL_EMAIL="REPLACE_WITH_YOUR_EMAIL@gmail.com"
GMAIL_APP_PASSWORD="REPLACE_WITH_YOUR_APP_PASSWORD"

# Check if credentials are set
if [ "$GMAIL_EMAIL" = "REPLACE_WITH_YOUR_EMAIL@gmail.com" ]; then
    echo "❌ ERROR: You need to edit this file and add your credentials!"
    echo ""
    echo "📝 Instructions:"
    echo "1. Get app password: https://myaccount.google.com/apppasswords"
    echo "2. Edit this file: nano run_noclick_scan.sh"
    echo "3. Replace GMAIL_EMAIL with your email"
    echo "4. Replace GMAIL_APP_PASSWORD with your app password"
    echo "5. Save and run: bash run_noclick_scan.sh"
    echo ""
    exit 1
fi

echo "📧 Target Email: $GMAIL_EMAIL"
echo "🔑 Using App Password: ${GMAIL_APP_PASSWORD:0:4}****"
echo ""
echo "🚀 Starting no-click vulnerability scan..."
echo ""

# Run the scanner with credentials piped in
echo -e "$GMAIL_EMAIL\n$GMAIL_APP_PASSWORD" | python3 noclick_vulnerability_scanner.py

echo ""
echo "✅ Scan complete! Check the JSON report for findings."
echo ""


