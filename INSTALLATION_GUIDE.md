# CoreMedia DJ - Installation Guide

## Quick Installation (Recommended)

### Method 1: One-Command Install

```bash
./INSTALL.sh
```

Enter your password when prompted. That's it!

---

## Manual Installation

### Step 1: Install the .deb Package

```bash
sudo dpkg -i dist/coremedia-dj_1.0.0_amd64.deb
```

### Step 2: Fix Dependencies (if needed)

```bash
sudo apt-get install -f -y
```

---

## Launching CoreMedia DJ

### Option 1: Application Menu
1. Open your application menu (KDE Menu / GNOME Activities)
2. Search for "CoreMedia DJ"
3. Click to launch

### Option 2: Terminal
```bash
coremedia-dj
```

### Option 3: Run Dialog
1. Press `Alt+F2`
2. Type: `coremedia-dj`
3. Press Enter

---

## Package Information

- **Name**: CoreMedia DJ
- **Version**: 1.0.0
- **Size**: 70 MB
- **Category**: AudioVideo
- **Installed Location**: `/opt/CoreMedia DJ/`
- **Desktop Entry**: `/usr/share/applications/coremedia-dj.desktop`
- **Icon**: `/usr/share/icons/hicolor/512x512/apps/coremedia-dj.png`

---

## System Requirements

### Minimum Requirements
- **OS**: Ubuntu 20.04+ / KDE Plasma 5.20+
- **RAM**: 2 GB
- **Disk Space**: 200 MB
- **Processor**: Dual-core 2.0 GHz

### Recommended Requirements
- **OS**: Ubuntu 22.04+ / KDE Plasma 5.27+
- **RAM**: 4 GB
- **Disk Space**: 500 MB (including music library)
- **Processor**: Quad-core 2.5 GHz
- **Graphics**: GPU with WebGL support

---

## Supported File Formats

### Audio Formats
- MP3 (.mp3)
- WAV (.wav)
- OGG Vorbis (.ogg)
- M4A/AAC (.m4a, .aac)
- FLAC (.flac)

### Video Formats
- MP4 (.mp4)
- WebM (.webm)
- OGV (.ogv)

---

## Features

### DJ Features
- ✅ Multi-deck mixing (up to 4 decks)
- ✅ BPM synchronization
- ✅ Hot cue points
- ✅ Loop controls
- ✅ Pitch/tempo control
- ✅ Crossfader
- ✅ 3-band EQ per deck
- ✅ Master output meter

### Audio Features
- ✅ 10-band equalizer
- ✅ 6-channel mixing board
- ✅ Audio effects (reverb, delay, filter)
- ✅ Beat grid with auto-detection
- ✅ Waveform display
- ✅ Spectral analyzer

### Library Features
- ✅ Music library management
- ✅ 30 demo tracks with legal sources
- ✅ Genre filtering
- ✅ BPM tagging
- ✅ Playlist presets
- ✅ Auto-import system

### Visualizer Features
- ✅ 12+ visualizer modes
- ✅ Real-time audio response
- ✅ Particle effects
- ✅ Neon glow effects
- ✅ Customizable themes

---

## Uninstallation

To remove CoreMedia DJ from your system:

```bash
sudo apt-get remove coremedia-dj
```

To remove including configuration files:

```bash
sudo apt-get purge coremedia-dj
```

---

## Troubleshooting

### Issue: Application won't start
**Solution**: Check dependencies
```bash
sudo apt-get install -f
```

### Issue: No sound output
**Solution**: Check PulseAudio/PipeWire
```bash
systemctl --user restart pipewire
```

### Issue: Glassmorphism effects not showing
**Solution**: Enable hardware acceleration in browser settings or update GPU drivers

### Issue: High CPU usage
**Solution**: Reduce visualizer complexity or disable particle effects in settings

---

## Keyboard Shortcuts

### Global
- `Space` - Play/Pause
- `S` - Stop
- `←/→` - Previous/Next track
- `Ctrl+O` - Open file
- `Ctrl+U` - Open URL
- `Ctrl+L` - Music library
- `Ctrl+D` - Toggle DJ view
- `F11` - Fullscreen
- `F1` - Help

### DJ View (when active)
- `Alt+1-4` - Play/Pause decks A-D
- `Alt+Q/W/E/R` - Load track to decks A-D
- `Alt+←/→` - Move crossfader
- `Alt+S` - Sync decks

### Playback
- `M` - Mute
- `+/-` - Volume up/down
- `[/]` - Pitch down/up
- `1-8` - Hot cues
- `W` - Toggle waveform

---

## Desktop Integration

### File Associations
CoreMedia DJ registers itself for these MIME types:
- audio/mpeg, audio/x-mp3, audio/mp3
- audio/x-wav, audio/ogg, audio/x-vorbis+ogg
- audio/x-flac
- video/mp4, video/webm, video/ogg

Right-click any supported audio/video file and select "Open with CoreMedia DJ"

### System Tray
- Minimize to tray for background playback
- Media controls in system tray menu
- Desktop notifications for track changes

---

## Configuration Files

### User Config Location
```
~/.config/CoreMedia DJ/
```

### Music Library Location
```
~/Documents/mediaplayer/music-library/
```
or custom location set in settings

---

## Building from Source

If you want to build the .deb yourself:

### Prerequisites
```bash
sudo apt-get install nodejs npm
```

### Build Steps
```bash
# Clone or download the source
cd /path/to/mediaplayer

# Install dependencies
npm install

# Build .deb package
npm run build
```

The .deb file will be created in `dist/coremedia-dj_1.0.0_amd64.deb`

---

## Support

### Documentation
- **Music Library Guide**: See `MUSIC_LIBRARY_GUIDE.md`
- **Styling Enhancements**: See `STYLING_ENHANCEMENTS.md`
- **GitHub Pages**: https://paulmmoore3416.github.io/coremedia-dj/

### Getting Help
1. Check this guide first
2. Review keyboard shortcuts (F1 in app)
3. Check GitHub repository issues
4. Consult documentation files

---

## License

CoreMedia DJ is released under the MIT License.

---

## Credits

- **Built with**: Electron, Web Audio API, HTML5
- **Theme**: GitHub Gray with Neon Accents
- **Version**: 1.0.0
- **Release Date**: December 2025

---

## What's Next?

After installation:
1. Launch CoreMedia DJ
2. Click **Music Library** button
3. Import your music or use demo tracks
4. Start mixing!

Enjoy your professional DJ experience! 🎧🎵

---

**Last Updated**: 2025-12-28
**Package**: coremedia-dj_1.0.0_amd64.deb
