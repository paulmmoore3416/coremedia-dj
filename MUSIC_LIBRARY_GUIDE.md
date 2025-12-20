# CoreMedia DJ - Music Library Guide

## Overview

The Music Library system allows you to organize, manage, and quickly access your music collection. It includes 30 demo tracks (10 Techno/Jump Style + 20 House/EDM) with legal Creative Commons links, plus the ability to import your own music.

## Features

### 1. Demo Track Library (30 Tracks)

**Techno & Jump Style (10 tracks)**
- Cyber Dreams (138 BPM)
- Digital Pulse (140 BPM)
- Neon Nights (145 BPM)
- Synth Wave Runner (135 BPM)
- Acid Machine (142 BPM)
- Hard Bass Kick (150 BPM)
- Rave Generator (160 BPM)
- Minimal Groove (128 BPM)
- Industrial Storm (136 BPM)
- Electric Energy (148 BPM)

**House & EDM (20 tracks)**
- Deep Space House (122 BPM)
- Progressive Horizon (128 BPM)
- Electro Funk (130 BPM)
- Miami Vice (125 BPM)
- Bass Drop (126 BPM)
- Future Bounce (124 BPM)
- Tropical Vibes (115 BPM)
- EDM Anthem (132 BPM)
- Dubstep Wobble (140 BPM)
- Future Bass Emotion (150 BPM)
- Trance Odyssey (138 BPM)
- Drum and Bass Rush (174 BPM)
- Garage Shuffle (130 BPM)
- Disco House Party (120 BPM)
- Melodic Techno Journey (124 BPM)
- Big Room Energy (128 BPM)
- Chill Wave Sunset (110 BPM)
- Synthwave Cruise (118 BPM)
- Breakbeat Madness (135 BPM)
- Hands Up Euphoria (145 BPM)

### 2. Quick Playlist Presets

**2009-2010 Jump Style Mix**
- High energy jump style and techno tracks
- Average BPM: 145
- Perfect for peak hour sets

**2009-2010 House Classics**
- Essential house and EDM hits
- Average BPM: 125
- Great for warm-up or main sets

**Peak Hour Energy**
- High BPM tracks for maximum energy
- Average BPM: 155
- Festival-ready bangers

**Deep Grooves**
- Deep house and melodic techno
- Average BPM: 120
- Ideal for opening sets

### 3. Auto-Import System

The library automatically:
- Detects file formats (MP3, WAV, OGG, M4A, AAC, FLAC, MP4, WEBM)
- Extracts metadata (title, artist, duration)
- Detects genre from folder path
- Extracts BPM from filename (supports "(120)" or "120BPM" formats)
- Organizes tracks by genre

### 4. Genre Filtering

Filter your library by:
- All Genres
- Techno
- Jump Style
- House
- EDM
- Deep House
- Progressive House
- (Auto-detected: Trance, Dubstep, Bass House, etc.)

### 5. Track Management

Each track card shows:
- **Genre Badge** - Track genre/style
- **BPM Badge** - Tempo in beats per minute
- **Title & Artist** - Track information
- **Actions**:
  - **Add to Playlist** - Queue track in main playlist
  - **Load to Player** - Play track immediately
  - **Download Link** (demo tracks only) - Visit source to download legally

### 6. Library Import/Export

**Import Your Music:**
- Click "Import Files" to select multiple tracks
- Supports folder import (select entire directory)
- Automatically scans and processes all supported formats

**Export Library:**
- Backup your library metadata to JSON
- Saves track info, playlists, and organization

**Import Backup:**
- Restore library from previously exported JSON file
- Merges with existing library (keeps demo tracks)

## Using the Music Library

### Opening the Library

Click the **Music Library** icon (🎵) in the header toolbar.

### Browsing Tracks

1. Use **Genre Filters** to narrow down tracks by style
2. Scroll through the track grid
3. Click any track card for quick actions

### Adding Tracks to Playlist

**Method 1: Add to Queue**
- Click the **+** icon on any track
- Track is added to the end of current playlist
- Notification confirms addition

**Method 2: Play Immediately**
- Click the **▶** icon on any track
- Track is added and starts playing right away

**Method 3: Use Preset Playlists**
- Click any of the 4 Quick Playlist buttons
- Entire preset loads into playlist
- Ready to start DJing

### Importing Your Own Music

**Step 1: Prepare Your Files**

Organize music in folders:
```
music-library/
├── techno-jumpstyle/
│   ├── Artist - Track (145).mp3
│   └── Another Track.mp3
├── house-edm/
│   ├── Deep House Track (122).mp3
│   └── Progressive Track.mp3
└── user-tracks/
    └── Your files here
```

**Step 2: Import**

1. Click "Import Files" button
2. Select files OR entire folder
3. Wait for scanning progress
4. Tracks appear in library

**Naming Convention for Best Results:**
```
Artist - Track Title (BPM).mp3
Example: Daft Punk - Around The World (121).mp3
```

This format allows auto-detection of:
- Artist name
- Track title
- BPM

### Genre Detection

Tracks are auto-assigned genres based on folder path:

| Folder Name Contains | Detected Genre |
|---------------------|----------------|
| techno | Techno |
| jump / jumpstyle | Jump Style |
| house | House |
| edm | EDM |
| trance | Trance |
| dubstep | Dubstep |
| bass | Bass House |
| deep | Deep House |

If no match, defaults to "Electronic"

### BPM Detection

BPM is extracted from filename patterns:
- `Track Name (120).mp3` → 120 BPM
- `Track (120 BPM).mp3` → 120 BPM
- `Track 120BPM.mp3` → 120 BPM

Valid range: 60-200 BPM

### Managing Your Library

**Filtering:**
- Click genre buttons to show only that style
- "All Genres" shows complete library
- Track count updates automatically

**Exporting for Backup:**
1. Click "Export Library"
2. Downloads JSON file with metadata
3. Save to safe location

**Importing Backup:**
1. Click "Import Backup"
2. Select previously exported JSON file
3. Library merges with existing tracks

**Note:** Demo tracks are NOT included in exports (they're always available)

## Demo Track Sources

All demo tracks are linked to legal Creative Commons sources:

### Free Music Archive
- URL: https://freemusicarchive.org/
- License: Various CC licenses (check individual tracks)
- Download: Click track → visit link → download

### Free Stock Music
- URL: https://www.free-stock-music.com/dance-edm.html
- License: CC BY (attribution required)
- Download: Browse site → download tracks

### eProves
- Techno: https://eproves.com/techno-no-copyright-music/
- House: https://eproves.com/vlog-no-copyright-music/house/
- License: Royalty Free
- Download: Visit → browse → download

### SoundCloud Copyright Free
- URL: https://soundcloud.com/copyright-free-edm
- License: CC0 / Public Domain
- Download: Check track permissions

### Bensound
- URL: https://www.bensound.com/royalty-free-music/electronic
- License: Royalty Free
- Download: Requires attribution for free tier

### EDM Royalty Free
- URL: https://edmroyaltyfree.net/
- License: CC BY
- Download: Free with attribution

## Legal Notice

### Demo Tracks
Demo tracks are LINKS to legal sources. To actually use them:
1. Click the download icon on the track card
2. Visit the source website
3. Download according to their license terms
4. Add to your local music library

### Your Music
Only add music you have legal rights to use:
- ✅ Music you purchased
- ✅ Music you created
- ✅ Royalty-free music with proper license
- ✅ Creative Commons music (follow attribution rules)

Do NOT add:
- ❌ Downloaded copyrighted music without purchase
- ❌ Ripped CDs you don't own
- ❌ Unauthorized downloads from YouTube/torrents

## Advanced Features

### Auto BPM Detection

For tracks without BPM in filename:
```javascript
player.autoDetectBPM(trackId)
```

Uses Web Audio API beat detection algorithm to analyze audio and calculate BPM.

### Track Metadata

Each track stores:
```javascript
{
  id: "track_xxxxx",
  title: "Track Name",
  artist: "Artist Name",
  genre: "House",
  bpm: 128,
  duration: 240.5,
  url: "blob:xxx or file path",
  filename: "track.mp3",
  size: 5242880,
  local: true,
  isDemo: false,
  addedDate: "2025-12-19T..."
}
```

### Keyboard Shortcuts

While browsing library:
- **Esc** - Close library modal
- **Enter** - Play selected track (if implemented)

## Supported File Formats

### Audio
- MP3 (.mp3)
- WAV (.wav)
- OGG Vorbis (.ogg)
- M4A/AAC (.m4a, .aac)
- FLAC (.flac)

### Video (audio extracted)
- MP4 (.mp4)
- WebM (.webm)
- OGV (.ogv)

## Tips & Best Practices

### Organization
1. **Use folders** - Organize by genre before importing
2. **Name consistently** - "Artist - Title (BPM).mp3" format
3. **Tag properly** - Use ID3 tags for better metadata
4. **Backup regularly** - Export library JSON monthly

### Performance
- Library caches track metadata for fast loading
- Supports hundreds of tracks without slowdown
- Uses lazy loading for optimal performance

### DJ Workflow
1. **Browse library** - Filter by genre/BPM
2. **Load preset** - Start with curated playlist
3. **Add tracks** - Queue next tracks as you play
4. **Export set** - Save library for next session

### Playlist Building
1. Start with **Deep Grooves** preset (warm-up)
2. Transition to **House Classics** (main set)
3. Peak with **Peak Hour Energy** (climax)
4. Cool down with lower BPM tracks

## Troubleshooting

### Tracks not appearing after import
- Check file format (must be supported type)
- Verify file isn't corrupted
- Check browser console for errors

### BPM not detected
- Add BPM to filename: "Track (128).mp3"
- Or use auto-detect: `player.autoDetectBPM(trackId)`

### Demo tracks won't play
- Demo tracks are LINKS, not actual audio files
- Click download icon to visit source and download
- Add downloaded files to your library

### Library export/import not working
- Check browser allows file downloads
- Verify JSON format is valid
- Make sure you selected correct file type

## Future Enhancements

Potential additions:
- Smart playlist generation based on BPM/energy
- Harmonic mixing (key detection)
- Waveform preview in library cards
- Duplicate track detection
- Multi-select for batch operations
- Library statistics dashboard

## Directory Structure

```
mediaplayer/
├── music-library/
│   ├── README.md                    # Setup guide
│   ├── demo-tracks.json            # Demo track database
│   ├── techno-jumpstyle/          # Techno music folder
│   ├── house-edm/                  # House/EDM folder
│   └── user-tracks/                # Your music folder
├── app.js                           # Library code (lines 3731-4207)
├── index.html                       # Library UI (lines 961-1059)
└── styles.css                       # Library CSS (lines 2604-2876)
```

## Code Reference

### Key Functions

**Library Management:**
- `initMusicLibrary()` - Initialize system
- `loadDemoTracks()` - Load demo track database
- `updateLibraryUI()` - Refresh track grid

**Import/Export:**
- `importMusicFiles(files)` - Process file import
- `exportLibrary()` - Export to JSON
- `importLibrary()` - Import from JSON

**Track Operations:**
- `addTrackToPlaylist(trackId)` - Add to queue
- `loadTrackToPlayer(trackId)` - Play immediately
- `loadPlaylistPreset(presetName)` - Load preset

**Metadata:**
- `extractTitle(filename)` - Parse track title
- `detectGenreFromPath(path)` - Auto-detect genre
- `detectBPMFromFilename(filename)` - Extract BPM
- `autoDetectBPM(trackId)` - Analyze audio for BPM

### Event Handlers

- Library button click → `openLibraryManager()`
- Genre filter click → `filterLibraryByGenre(genre)`
- Preset button click → `loadPlaylistPreset(preset)`
- Import button click → File selector

## Support

For issues or questions:
1. Check browser console for errors
2. Verify file formats are supported
3. Review this guide's troubleshooting section
4. Check GitHub repository for updates

---

**Version:** 1.0
**Last Updated:** 2025-12-19
**Tracks:** 30 demo tracks + unlimited user tracks
**Formats:** 8 audio/video formats supported
