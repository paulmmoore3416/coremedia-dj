# CoreMedia - Professional DJ Media Player

A feature-rich, professional media player with advanced DJ controls built with modern web technologies. CoreMedia supports all major video and audio formats with an elegant GitHub-themed interface and professional DJing capabilities.

## Features

### Media Support
- **Video Formats**: MP4, WebM, MKV, AVI, MOV, M4V, OGG
- **Audio Formats**: MP3, WAV, FLAC, OGG, AAC, M4A
- **Streaming**: Support for HTTP/HTTPS URLs
- **Subtitles**: SRT, VTT, and ASS subtitle formats

### Playback Controls
- Play, pause, stop functionality
- Skip forward/backward (configurable duration)
- Playback speed control (0.25x to 2x)
- Loop mode
- Volume control with mute
- Fullscreen support
- Progress bar with seek functionality

### Advanced Features

- **Playlist Management**: Add multiple files, shuffle, clear all
- **10-Band Equalizer**: Fine-tune audio output (60Hz - 16kHz) with professional DJ-style controls
- **Audio Visualizer**: Three visualization modes (Bars, Waveform, Circular)
- **Subtitle Support**: Load and display external subtitle files
- **Keyboard Shortcuts**: Full keyboard control
- **Settings**: Customizable preferences with local storage
- **Drag & Drop**: Easy file loading

### DJ Controls

- **Pitch Control**: ±16% pitch adjustment with precise control
- **Hot Cue Points**: 8 programmable cue points with color coding
- **BPM Detection**: Tap tempo and automatic BPM detection
- **Looping**: Manual loop in/out points and auto-loops (2, 4, 8 beats)
- **Crossfader**: Smooth transition control between decks
- **Beat Sync**: Adjust tempo and BPM in real-time
- **Keyboard DJ Controls**: Number keys 1-8 for cue points, +/- for pitch bend

### Professional UI

- GitHub gray theme with neon accents
- Responsive design
- Auto-hiding controls
- Smooth transitions and glow animations
- Professional icons and layout
- DJ-style glowing buttons and indicators

## Getting Started

### Installation

1. Clone or download this repository
2. No build process required - pure HTML, CSS, and JavaScript

### Running the Player

#### Option 1: Using Python (Recommended)
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

#### Option 2: Using Node.js
```bash
npm start
```

#### Option 3: Using any HTTP server
Simply serve the files from any web server or open `index.html` directly in your browser.

### Opening the Player

Navigate to `http://localhost:8080` in your web browser.

## Usage

### Loading Media

**Drag & Drop**
- Drag media files directly onto the player window

**File Browser**
- Click the folder icon in the header
- Or click the drop zone in the center

**URL Stream**
- Click the link icon in the header
- Enter the media URL (http:// or https://)

### Keyboard Shortcuts

#### Playback Controls

| Key | Action |
|-----|--------|
| **Space** | Play/Pause |
| **F** | Toggle fullscreen |
| **M** | Mute/Unmute |
| **N** | Next track |
| **P** | Previous track |
| **S** | Stop |
| **L** | Toggle loop |
| **C** | Load subtitles |
| **Left Arrow** | Skip backward |
| **Right Arrow** | Skip forward |
| **Up Arrow** | Increase volume |
| **Down Arrow** | Decrease volume |

#### DJ Controls

| Key | Action |
|-----|--------|
| **1-8** | Jump to/Set hot cue point |
| **Shift + 1-8** | Delete hot cue point |
| **+** or **=** | Increase pitch (+0.5%) |
| **-** | Decrease pitch (-0.5%) |

### Playlist

- **Single Click**: Play track
- **Clear All**: Remove all tracks from playlist
- **Shuffle**: Randomize playlist order

### DJ Features in Detail

#### Equalizer

- Professional 10-band equalizer with visual feedback
- Frequency range: 60Hz to 16kHz
- Each band: -12dB to +12dB range
- Glowing sliders with gradient indicators
- **Reset EQ**: Return all bands to 0dB

#### Pitch Control

- Range: ±16% pitch adjustment
- Real-time playback speed control
- Visual feedback with color-coded slider
- Quick-set buttons: -8%, Reset, +8%
- Affects BPM display in real-time

#### Hot Cue Points

- 8 color-coded cue points (press 1-8 keys)
- Click empty cue to set at current position
- Click set cue to jump to that position
- Shift+Click to delete a cue point
- Visual glow effect when cue is set
- Time display on each cue button

#### Looping

- **Loop In/Out**: Manually set loop boundaries
- **2 Beat Loop**: Auto-loop 2 beats based on BPM
- **4 Beat Loop**: Auto-loop 4 beats based on BPM
- **8 Beat Loop**: Auto-loop 8 beats based on BPM
- **Exit Loop**: Clear loop and return to normal playback
- Visual feedback when loop is active

#### BPM Detection

- **Tap Tempo**: Tap the button to manually set BPM
- Automatic beat detection from audio
- BPM adjusts with pitch changes
- Large, glowing display for easy reading

#### Crossfader

- Smooth transitions between virtual decks
- Visual feedback: DECK A / CENTER / DECK B
- Affects volume distribution
- Professional DJ-style slider

#### Audio Visualizer

Three visualization modes available in settings:

1. **Bars**: Frequency bars (default)
2. **Waveform**: Wave visualization
3. **Circular**: Radial frequency display

### Settings

Access via the gear icon in the header:

- **Autoplay Next**: Automatically play next track when current ends
- **Remember Volume**: Save volume level between sessions
- **Show Audio Visualizer**: Display visualizer for audio files
- **Hardware Acceleration**: Use GPU acceleration
- **Skip Duration**: Set skip forward/backward time (5-60 seconds)
- **Visualizer Style**: Choose visualization type

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**Required Features:**
- HTML5 Video/Audio
- Web Audio API
- Canvas API
- FileReader API
- Local Storage

## Technical Details

### Technologies Used
- Pure JavaScript (ES6+)
- HTML5 Video/Audio APIs
- Web Audio API (Equalizer & Visualizer)
- Canvas API (Visualizer)
- CSS3 (Animations & Layout)
- Local Storage (Settings)

### Architecture
- Object-oriented design
- Event-driven architecture
- No external dependencies
- Modular code structure

## Supported Formats

CoreMedia supports all formats that your browser's HTML5 video/audio implementation supports:

**Common Video Codecs:**
- H.264 (AVC)
- H.265 (HEVC) - browser dependent
- VP8, VP9
- AV1 - modern browsers

**Common Audio Codecs:**
- AAC
- MP3
- Opus
- Vorbis
- FLAC
- PCM/WAV

## Troubleshooting

**Media won't play:**
- Ensure your browser supports the codec
- Check browser console for errors
- Try converting to a widely supported format (MP4/H.264 for video, MP3 for audio)

**No audio visualization:**
- Check "Show audio visualizer" in settings
- Visualizer only works with audio files
- Ensure Web Audio API is supported

**Subtitles not showing:**
- Ensure subtitle file is SRT, VTT, or ASS format
- Check subtitle timing matches video
- Reload subtitle file if needed

**Equalizer not working:**
- Web Audio API must be supported
- Some browsers require user interaction before audio context starts
- Try playing media first, then adjust EQ

## License

MIT License - Feel free to use and modify as needed.

## Quick DJ Guide

### Getting Started with DJ Features

1. **Load Your Music**: Drag and drop audio files or use the file browser
2. **Set the BPM**: Use tap tempo or let the player detect it automatically
3. **Set Cue Points**: Play the track and press 1-8 at key moments to mark cue points
4. **Adjust Pitch**: Use the pitch slider to match beats between tracks (±16% range)
5. **Create Loops**: Set loop in/out points or use auto-loops (2, 4, 8 beats)
6. **Mix Tracks**: Use the crossfader for smooth transitions

### Pro Tips

- **Hot Cues**: Use keyboard numbers 1-8 for quick cue access during live mixing
- **Pitch Bend**: Press +/- keys for temporary pitch adjustments to sync beats
- **Loop DJ Sets**: Use 4-beat or 8-beat loops to extend build-ups and drops
- **EQ Mixing**: Cut lows on one track while bringing in another for clean transitions
- **Visual Feedback**: All DJ controls glow when active for easy visual reference
- **BPM Sync**: Pitch changes automatically update BPM display for beat matching

## Credits

Built with modern web standards and best practices.
Icons and UI inspired by professional media players and DJ software.
