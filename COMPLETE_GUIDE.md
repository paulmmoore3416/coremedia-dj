# CoreMedia - Complete User Guide

## 🎵 Welcome to CoreMedia DJ Edition

CoreMedia is a professional-grade media player with advanced DJ features, built entirely with web technologies. No installation required—just open and play!

---

## 🚀 Quick Start

### Getting Started in 3 Steps

1. **Start the Server**
   ```bash
   python3 -m http.server 8080
   # OR
   npm start
   ```

2. **Open in Browser**
   - Navigate to `http://localhost:8080`

3. **Load Music**
   - Drag & drop files onto the player
   - OR click the folder icon
   - OR paste a media URL

**You're ready to DJ!** 🎧

---

## 📊 Interface Overview

### Main Areas

```
┌─────────────────────────────────────────────────┐
│  🎵 CoreMedia           📁 🔗 ⚙️               │ Header
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ PLAYLIST │         VIDEO/WAVEFORM               │
│          │                                      │
│   DJ     │         [VU METERS]                  │
│ CONTROLS │                                      │
│          │         ══════════════               │ Waveform
│ EFFECTS  │                                      │
│  RACK    │         ▶ ⏸ ⏹ ⏭                     │
│          │         ════════░░░                  │ Progress
│   EQ     │         [Controls]                   │
│          │                                      │
└──────────┴──────────────────────────────────────┘
```

---

## 🎛️ Feature Reference

### 1. Playlist Management

**Location:** Top of left sidebar

**Actions:**
- Click track to play
- Drag to reorder (future feature)
- Clear All: Remove all tracks
- Shuffle: Randomize order

**Info Display:**
- Track name
- Media type (audio/video)
- Duration

---

### 2. DJ Controls

**Location:** First DJ section in sidebar

#### BPM Detection
- **Display:** Large glowing number
- **Tap Tempo:** Click button in rhythm
- **Auto-Detect:** Analyzes audio automatically
- **Range:** 40-250 BPM
- **Pitch Sync:** Updates with pitch changes

#### Pitch Control
- **Range:** ±16%
- **Precision:** 0.1% steps
- **Quick Set:** -8%, Reset, +8% buttons
- **Keyboard:** +/- keys for fine adjustment
- **Display:** Shows percentage with sign

#### Hot Cue Points (8 Total)
- **Colors:** Red, Cyan, Green, Orange, Purple, Pink, Blue, Green
- **Set:** Click empty cue during playback
- **Jump:** Click set cue to jump
- **Delete:** Shift+Click or Ctrl+Click
- **Keyboard:** Number keys 1-8
- **Display:** Time stamp on each cue

#### Loop Controls
- **Manual:** Set In/Out points
- **Auto:** 2, 4, 8 beat loops (requires BPM)
- **Exit:** Clear loop and resume
- **Visual:** Active buttons glow green

#### Crossfader
- **Range:** Deck A ↔ Deck B
- **Position:** Left (A), Center, Right (B)
- **Effect:** Volume distribution
- **Display:** Shows current position

---

### 3. Effects Rack

**Location:** Second DJ section in sidebar

#### Reverb
- **Parameter:** Mix (0-100%)
- **Effect:** Adds space and ambience
- **Best For:** Smooth transitions, atmospheric sound

#### Delay
- **Parameters:**
  - Time: 0-2000ms (delay interval)
  - Feedback: 0-90% (echo repeats)
- **Effect:** Echo/repeat effect
- **Best For:** Build-ups, rhythmic effects

#### Filter
- **Parameters:**
  - Frequency: 20Hz-20kHz
  - Resonance: 0-30 (peak emphasis)
  - Type: Low/High/Band/Notch Pass
- **Effect:** Frequency filtering
- **Best For:** DJ filter sweeps, creative EQ

**Controls:**
- Toggle: iOS-style switch (glows when on)
- Sliders: Real-time adjustment
- Values: Displayed next to sliders

---

### 4. Equalizer

**Location:** Bottom of left sidebar

**Bands:** 10 frequencies
- 60Hz, 170Hz, 310Hz, 600Hz, 1kHz
- 3kHz, 6kHz, 12kHz, 14kHz, 16kHz

**Range:** -12dB to +12dB per band

**Visual:**
- Gradient sliders (green→yellow→red)
- Glowing knobs (20px circles)
- Center line indicator
- Value display below each band

**Reset:** Returns all bands to 0dB

---

### 5. Waveform Display

**Location:** Bottom of video area

**Features:**
- Full track visualization
- Click to seek
- Zoom in/out (1x to 10x)
- Progress indicator line
- Toggle: W key or button

**Colors:**
- Waveform: Blue (#58a6ff)
- Background: Semi-transparent black
- Progress: Glowing blue line

**Use Cases:**
- See track structure
- Visual mixing
- Precise navigation
- Drop identification

---

### 6. VU Meters

**Location:** Top-right of video area

**Channels:** Left and Right

**Colors:**
- 🟢 Green: Safe (0-60%)
- 🟡 Yellow: Hot (60-90%)
- 🔴 Red: Peak (90-100%)

**Purpose:**
- Monitor levels
- Prevent clipping
- Visual feedback

---

### 7. Audio Visualizer

**Location:** Behind video area

**Modes:**
- Bars: Frequency bars (default)
- Waveform: Wave visualization
- Circular: Radial display

**Settings:** Change mode in settings panel

**Auto-Show:** Displays for audio files

---

## ⌨️ Complete Keyboard Reference

### Playback
| Key | Action | Context |
|-----|--------|---------|
| `Space` | Play/Pause | Always |
| `S` | Stop | Always |
| `N` | Next Track | Playlist |
| `P` | Previous Track | Playlist |
| `←` | Skip Backward | Playing |
| `→` | Skip Forward | Playing |

### Volume & Display
| Key | Action | Context |
|-----|--------|---------|
| `M` | Mute/Unmute | Always |
| `↑` | Volume +5% | Always |
| `↓` | Volume -5% | Always |
| `F` | Fullscreen | Always |
| `L` | Toggle Loop | Playing |
| `C` | Load Subtitles | Video |

### DJ Controls
| Key | Action | Context |
|-----|--------|---------|
| `1-8` | Set/Jump Cue | Playing |
| `Shift+1-8` | Delete Cue | Always |
| `+` or `=` | Pitch +0.5% | Playing |
| `-` | Pitch -0.5% | Playing |

### Interface
| Key | Action | Context |
|-----|--------|---------|
| `W` | Toggle Waveform | Audio |
| `?` | Show Help | Always |

---

## 🎯 Workflows & Techniques

### DJ Mixing Workflow

1. **Preparation**
   ```
   → Load tracks into playlist
   → Tap BPM for each track
   → Set cue points (intro, drop, outro)
   → Adjust pitch to match BPMs
   ```

2. **Mixing**
   ```
   → Play Track A (crossfader left)
   → Cue Track B at mix point
   → Match BPMs with pitch control
   → Use filter for transition
   → Crossfade from A to B
   ```

3. **Effects**
   ```
   → Add delay to build tension
   → Use filter sweep for drops
   → Apply reverb for smooth exits
   ```

---

### Practice Session Workflow

1. **Learning a Track**
   ```
   → Load track
   → View waveform structure
   → Set cue points at sections
   → Practice loops (4/8 beat)
   → Experiment with effects
   ```

2. **Technique Practice**
   ```
   → Use hot cues for scratching
   → Practice filter sweeps
   → Master crossfader curves
   → Monitor levels with VU meters
   ```

---

### Production/Editing Workflow

1. **Audio Analysis**
   ```
   → Load file
   → View waveform for structure
   → Use EQ to isolate frequencies
   → Apply filter for problem areas
   → Monitor with VU meters
   ```

2. **Creative Effects**
   ```
   → Experiment with delay patterns
   → Create reverb tails
   → Design filter automations
   → Layer multiple effects
   ```

---

## 🔧 Settings & Customization

### Settings Panel

**Access:** Gear icon in header

**Options:**

1. **Autoplay Next**
   - Auto-play next track in playlist
   - Default: Off

2. **Remember Volume**
   - Save volume between sessions
   - Default: On

3. **Show Visualizer**
   - Display audio visualizer
   - Default: On

4. **Hardware Acceleration**
   - GPU acceleration
   - Default: On

5. **Skip Duration**
   - Arrow key skip time (5-60s)
   - Default: 10s

6. **Visualizer Style**
   - Bars, Waveform, or Circular
   - Default: Bars

---

## 💾 Data Storage

### Local Storage Items
- Settings preferences
- Volume level
- EQ settings (planned)
- Effect presets (planned)
- Hot cue points (session only)

### Session Data (Not Saved)
- Playlist
- Current playback position
- Loop points
- BPM values

---

## 🎨 Visual Design System

### Color Palette

**Theme:** GitHub Gray + Neon Accents

**Backgrounds:**
- Primary: #0d1117 (deep black)
- Secondary: #161b22 (dark gray)
- Tertiary: #21262d (medium gray)

**Accents:**
- Primary: #58a6ff (blue)
- Hover: #1f6feb (dark blue)
- Success: #10b981 (green)
- Warning: #d29922 (orange)
- Danger: #ef4444 (red)

**Neon:**
- Cyan: #00d4ff
- Purple: #a855f7
- Pink: #ec4899

### Visual States

**Active:**
- Glow pulse animation
- Bright accent color
- Enhanced shadows

**Hover:**
- Lighter overlay
- Increased glow
- Scale transform

**Disabled:**
- Reduced opacity
- Muted colors
- No interaction

---

## 🛠️ Troubleshooting

### Common Issues

#### No Audio
1. Check browser audio permissions
2. Try playing/pausing
3. Check system volume
4. Verify file format support

#### Waveform Not Showing
1. Press `W` to toggle
2. Wait for generation (large files)
3. Check audio file validity
4. Try reloading track

#### Effects Not Working
1. Enable effect toggle
2. Check audio context state
3. Verify parameter values
4. Reload page if needed

#### BPM Not Detecting
1. Use tap tempo manually
2. Ensure audio is playing
3. Check file has strong beat
4. Try adjusting threshold

---

## 📱 Supported Formats

### Video
- MP4, WebM, MKV, AVI, MOV, M4V, OGG

### Audio
- MP3, WAV, FLAC, OGG, AAC, M4A, Opus

### Subtitles
- SRT, VTT, ASS

### Streaming
- HTTP/HTTPS URLs
- Direct file links

---

## 🌐 Browser Support

### Fully Supported
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Opera 76+

### Partial Support
- ⚠️ Safari 14+ (limited Web Audio)

### Required APIs
- Web Audio API
- Canvas API
- HTML5 Media
- Local Storage
- FileReader API

---

## 🚀 Performance Tips

1. **Large Files:** Use lower quality for testing
2. **Multiple Effects:** May increase CPU usage
3. **Waveform Zoom:** Higher zoom = more rendering
4. **Visualizer:** Disable if performance issues
5. **Hardware Accel:** Keep enabled for smooth graphics

---

## 📚 Learning Resources

### For DJs
- Practice beat matching with pitch control
- Learn EQ mixing techniques
- Master crossfader curves
- Experiment with effect timing

### For Producers
- Understand frequency ranges (EQ)
- Learn effect parameters
- Practice level monitoring
- Experiment with sound design

### For Developers
- Inspect browser console
- Study Web Audio API usage
- Examine canvas rendering
- Learn effect chain architecture

---

## 🎓 Pro Tips

1. **Hot Cues:** Set cues before live mixing
2. **BPM First:** Always set BPM before auto-loops
3. **EQ Mixing:** Cut lows when mixing in new track
4. **Filter Sweeps:** Use high-pass filter for builds
5. **VU Meters:** Keep levels in green/yellow
6. **Waveform:** Use to find track energy changes
7. **Effects:** Less is more—don't overdo it
8. **Practice:** Use loop function to perfect transitions
9. **Keyboard:** Learn shortcuts for faster workflow
10. **Monitor:** Always use headphones for best results

---

## 📖 Glossary

- **BPM:** Beats Per Minute (tempo)
- **Cue Point:** Marked position in track
- **Crossfader:** Volume control for two decks
- **EQ:** Equalizer (frequency adjustment)
- **Filter:** Frequency removal/emphasis
- **Loop:** Repeated section of audio
- **Pitch:** Playback speed/tempo
- **VU Meter:** Volume Unit meter
- **Waveform:** Visual representation of audio

---

## 🎉 You're All Set!

CoreMedia is now ready for professional DJing, music production, or casual listening. Explore the features, practice the techniques, and create amazing mixes!

**Need help?** Press `?` anytime for keyboard shortcuts.

**Have fun mixing!** 🎧✨

---

*CoreMedia - Professional DJ Media Player*
*Built with ❤️ and modern web technologies*
