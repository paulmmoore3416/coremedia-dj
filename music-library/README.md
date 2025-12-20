# CoreMedia DJ Music Library

This directory is for organizing your music collection by genre.

## Directory Structure

- **techno-jumpstyle/** - Techno, Jump Style, and Hard Dance tracks
- **house-edm/** - House, EDM, and electronic dance music
- **user-tracks/** - Your personal music collection

## How to Add Your Music

### Method 1: Manual Copy
Simply copy your audio/video files into the appropriate genre folders:
```bash
cp ~/Downloads/my-track.mp3 music-library/house-edm/
```

### Method 2: Drag & Drop (In-App)
1. Open CoreMedia DJ
2. Click "Music Library" button
3. Drag files directly into the genre sections
4. Files will be organized automatically

### Method 3: Auto-Import
Place music in these folders and use the "Scan Library" button in the app to automatically import all tracks with metadata detection.

## Supported Formats

- **Audio**: MP3, WAV, OGG, M4A, AAC, FLAC
- **Video**: MP4, WEBM, OGV (will extract audio)

## Legal Sources for Music

### Free & Royalty-Free (Creative Commons)
- **Free Music Archive**: https://freemusicarchive.org/genre/Electronic/
- **Free Stock Music**: https://www.free-stock-music.com/dance-edm.html
- **SoundCloud Copyright Free**: https://soundcloud.com/copyright-free-edm
- **eProves Techno**: https://eproves.com/techno-no-copyright-music/
- **eProves House**: https://eproves.com/vlog-no-copyright-music/house/

### Paid Royalty-Free
- **Epidemic Sound**: https://www.epidemicsound.com/music/genres/electronic/
- **Bensound**: https://www.bensound.com/royalty-free-music/electronic

### Commercial Purchase
- **Beatport**: Professional DJ music store
- **iTunes/Apple Music**: Purchase individual tracks
- **Amazon Music**: Buy MP3s
- **Bandcamp**: Support independent artists directly

## Track Metadata

The app will automatically detect:
- **Title**: From filename or ID3 tags
- **Artist**: From ID3 tags
- **BPM**: Auto-detected via beat analysis
- **Genre**: From folder location
- **Duration**: Automatically calculated

You can also manually edit metadata in the app's Library Manager.

## Demo Tracks

The app includes links to several Creative Commons demo tracks to get you started. Check the "Demo Playlist" in the app.

## Important Legal Notice

⚠️ **Only add music you have legal rights to use:**
- Music you purchased
- Music you created
- Royalty-free music (check license)
- Creative Commons music (follow attribution requirements)

Do NOT add:
- Downloaded copyrighted music without purchase
- Ripped CDs you don't own
- Unauthorized downloads

## Organizing Tips

### Naming Convention
Use this format for best results:
```
Artist - Track Title (BPM).mp3
Example: Daft Punk - Around The World (121).mp3
```

### Folder Organization
Create subfolders for better organization:
```
house-edm/
  ├── deep-house/
  ├── progressive-house/
  ├── electro-house/
  └── tech-house/

techno-jumpstyle/
  ├── hard-techno/
  ├── jump-style/
  ├── hardstyle/
  └── hardcore/
```

## Backup Your Library

Remember to backup this folder regularly:
```bash
# Create backup
tar -czf music-library-backup-$(date +%Y%m%d).tar.gz music-library/

# Restore backup
tar -xzf music-library-backup-20231219.tar.gz
```

## Need Help?

- Check the app's built-in "Library Help" section
- See ENHANCEMENTS.md for feature documentation
- Visit the GitHub repository for updates
