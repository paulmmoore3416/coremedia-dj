#!/bin/bash

# CoreMedia DJ Installation Script
# This script installs CoreMedia DJ on your Ubuntu/KDE system

set -e

echo "================================================"
echo "  CoreMedia DJ - Installation Script"
echo "================================================"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "This script requires sudo privileges to install the package."
    echo "You will be prompted for your password."
    echo ""
fi

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEB_FILE="$SCRIPT_DIR/dist/coremedia-dj_1.0.0_amd64.deb"

# Check if .deb file exists
if [ ! -f "$DEB_FILE" ]; then
    echo "Error: .deb package not found at: $DEB_FILE"
    echo "Please run 'npm run build' first to create the package."
    exit 1
fi

echo "Installing CoreMedia DJ..."
echo "Package: $DEB_FILE"
echo ""

# Install the .deb package
sudo dpkg -i "$DEB_FILE"

# Fix any dependency issues
sudo apt-get install -f -y

echo ""
echo "================================================"
echo "  Installation Complete!"
echo "================================================"
echo ""
echo "You can now launch CoreMedia DJ:"
echo "  1. From Application Menu: Search for 'CoreMedia DJ'"
echo "  2. From Terminal: coremedia-dj"
echo "  3. Press Alt+F2 and type: coremedia-dj"
echo ""
echo "Package Details:"
echo "  - Name: CoreMedia DJ"
echo "  - Version: 1.0.0"
echo "  - Size: $(du -h "$DEB_FILE" | cut -f1)"
echo "  - Installed to: /opt/CoreMedia DJ/"
echo ""
echo "Enjoy your professional DJ experience!"
echo "================================================"
