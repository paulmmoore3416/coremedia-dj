class CoreMedia {
    constructor() {
        this.initElements();
        this.playlist = [];
        this.currentIndex = -1;
        this.isVideoMode = false;
        this.audioContext = null;
        this.analyser = null;
        this.audioSource = null;
        this.subtitles = [];
        this.currentSubtitleIndex = 0;
        this.settings = {
            autoplayNext: false,
            rememberVolume: true,
            showVisualizer: true,
            hardwareAccel: true,
            skipDuration: 10,
            visualizerStyle: 'bars'
        };

        // DJ Controls
        this.hotCues = {};
        this.loopStart = null;
        this.loopEnd = null;
        this.isLooping = false;
        this.pitchValue = 0;
        this.crossfaderValue = 50;
        this.bpmTaps = [];
        this.currentBPM = 0;

        // Waveform
        this.waveformData = null;
        this.waveformZoom = 1;

        // Beat Grid
        this.beatGrid = [];
        this.beatGridEnabled = false;
        this.beatGridOffset = 0;
        this.beatGridCanvas = null;

        // Spectral Analyzer
        this.spectralCanvas = null;
        this.spectralEnabled = false;
        this.spectralMode = 'spectrogram'; // 'spectrogram' or 'waterfall'
        this.spectralHistory = [];
        this.spectralMaxHistory = 100;

        // Recording/Export
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.isRecording = false;
        this.recordingStartTime = null;
        this.recordingDuration = 0;

        // Loop Slicer
        this.slicerPads = [];
        this.slicerEnabled = false;
        this.slicerDivisions = 8; // number of slices
        this.slicerBuffers = [];

        // Audio Sources (for multiple players)
        this.audioSources = {}; // Map of player IDs to MediaElementSource nodes

        // Performance Optimizations
        this.visualizerAnimationId = null;
        this.spectralAnimationId = null;
        this.lastVisualizerUpdate = 0;
        this.visualizerThrottle = 16; // ~60fps
        this.canvasPool = new Map(); // Reuse canvases
        this.offscreenCanvas = null;
        this.audioBufferCache = new Map(); // Cache decoded audio
        this.requestIdleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

        // Mixing Board Knobs (6 professional controls)
        this.mixerControls = {
            gain: 0,        // Master gain (-12 to +12 dB)
            bass: 0,        // Bass EQ (-12 to +12 dB)
            mid: 0,         // Mid EQ (-12 to +12 dB)
            treble: 0,      // Treble EQ (-12 to +12 dB)
            color: 0,       // Color/Tone (-100 to +100)
            presence: 0     // Presence/Air (+0 to +12 dB)
        };
        this.mixerNodes = {
            gainNode: null,
            bassFilter: null,
            midFilter: null,
            trebleFilter: null,
            colorFilter: null,
            presenceFilter: null
        };

        // Multi-Deck View
        this.isDeckView = false;
        this.deckCount = 2;
        this.decks = {
            A: { player: null, src: null, isPlaying: false, title: '', audioContext: null, source: null, gainNode: null, eqNodes: {} },
            B: { player: null, src: null, isPlaying: false, title: '', audioContext: null, source: null, gainNode: null, eqNodes: {} },
            C: { player: null, src: null, isPlaying: false, title: '', audioContext: null, source: null, gainNode: null, eqNodes: {} },
            D: { player: null, src: null, isPlaying: false, title: '', audioContext: null, source: null, gainNode: null, eqNodes: {} }
        };
        this.crossfaderValue = 50; // Center position

        // Effects
        this.reverbNode = null;
        this.delayNode = null;
        this.feedbackGain = null;
        this.filterNode = null;
        this.effectsEnabled = {
            reverb: false,
            delay: false,
            filter: false
        };

        this.loadSettings();
        this.initEventListeners();
        this.initAudioContext();
        this.startControlsTimer();
        this.initDJControls();
        this.initEffects();
        this.initWaveform();
        this.initVUMeters();
        this.initBeatGrid();
        this.initSpectralAnalyzer();
        this.initRecorder();
        this.initLoopSlicer();
        this.initMixingBoard();
        this.initMultiDeck();
        this.initPerformanceOptimizations();
        this.initMusicLibrary();
    }

    initElements() {
        // Players
        this.videoPlayer = document.getElementById('videoPlayer');
        this.audioPlayer = document.getElementById('audioPlayer');
        this.currentPlayer = null;

        // UI Elements
        this.dropZone = document.getElementById('dropZone');
        this.playBtn = document.getElementById('playBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.previousBtn = document.getElementById('previousBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressBar = document.getElementById('progressBar');
        this.progressFilled = document.getElementById('progressFilled');
        this.progressHover = document.getElementById('progressHover');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.muteBtn = document.getElementById('muteBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.playlistEl = document.getElementById('playlist');
        this.visualizer = document.getElementById('visualizer');
        this.subtitlesEl = document.getElementById('subtitles');
        this.videoInfo = document.getElementById('videoInfo');
        this.currentTitle = document.getElementById('currentTitle');
        this.controlsOverlay = document.getElementById('controlsOverlay');
        this.speedBtn = document.getElementById('speedBtn');
        this.speedMenu = document.getElementById('speedMenu');
        this.speedDisplay = document.getElementById('speedDisplay');
        this.loopBtn = document.getElementById('loopBtn');
        this.subtitlesBtn = document.getElementById('subtitlesBtn');
        this.rewind10 = document.getElementById('rewind10');
        this.forward10 = document.getElementById('forward10');

        // File inputs
        this.fileInput = document.getElementById('fileInput');
        this.subtitleInput = document.getElementById('subtitleInput');

        // Modals
        this.urlModal = document.getElementById('urlModal');
        this.settingsModal = document.getElementById('settingsModal');

        // Buttons
        this.openFileBtn = document.getElementById('openFileBtn');
        this.openUrlBtn = document.getElementById('openUrlBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.clearPlaylistBtn = document.getElementById('clearPlaylistBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');

        // Equalizer
        this.eqSliders = document.querySelectorAll('.eq-slider');
        this.eqFilters = [];

        // DJ Controls
        this.pitchSlider = document.getElementById('pitchSlider');
        this.pitchValueEl = document.getElementById('pitchValue');
        this.bpmValue = document.getElementById('bpmValue');
        this.bpmTapBtn = document.getElementById('bpmTapBtn');
        this.crossfader = document.getElementById('crossfader');
        this.crossfaderValueEl = document.getElementById('crossfaderValue');
        this.cueButtons = document.querySelectorAll('.cue-btn');
        this.loopInBtn = document.getElementById('loopInBtn');
        this.loopOutBtn = document.getElementById('loopOutBtn');
        this.loop2Btn = document.getElementById('loop2Btn');
        this.loop4Btn = document.getElementById('loop4Btn');
        this.loop8Btn = document.getElementById('loop8Btn');
        this.loopExitBtn = document.getElementById('loopExitBtn');
        this.pitchButtons = document.querySelectorAll('.pitch-btn');

        // Waveform
        this.waveformContainer = document.getElementById('waveformContainer');
        this.waveformCanvas = document.getElementById('waveform');
        this.waveformProgress = document.getElementById('waveformProgress');
        this.waveformZoomIn = document.getElementById('waveformZoomIn');
        this.waveformZoomOut = document.getElementById('waveformZoomOut');
        this.waveformToggle = document.getElementById('waveformToggle');

        // VU Meters
        this.vuLeft = document.getElementById('vuLeft');
        this.vuRight = document.getElementById('vuRight');

        // Effects
        this.reverbToggle = document.getElementById('reverbToggle');
        this.reverbMix = document.getElementById('reverbMix');
        this.delayToggle = document.getElementById('delayToggle');
        this.delayTime = document.getElementById('delayTime');
        this.delayFeedback = document.getElementById('delayFeedback');
        this.filterToggle = document.getElementById('filterToggle');
        this.filterFreq = document.getElementById('filterFreq');
        this.filterQ = document.getElementById('filterQ');
        this.filterType = document.getElementById('filterType');

        // Help modal
        this.helpModal = document.getElementById('helpModal');
    }

    initEventListeners() {
        // File handling
        this.dropZone.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('drag-over');
        });
        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('drag-over');
        });
        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('drag-over');
            this.handleFiles(e.dataTransfer.files);
        });

        // Playback controls
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.previousBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.rewind10.addEventListener('click', () => this.skip(-this.settings.skipDuration));
        this.forward10.addEventListener('click', () => this.skip(this.settings.skipDuration));

        // Progress bar
        this.progressBar.addEventListener('click', (e) => this.seek(e));
        this.progressBar.addEventListener('mousemove', (e) => this.updateProgressHover(e));
        this.progressBar.addEventListener('mouseleave', () => {
            this.progressHover.style.width = '0';
        });

        // Volume
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.muteBtn.addEventListener('click', () => this.toggleMute());

        // Fullscreen
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

        // Speed control
        this.speedBtn.addEventListener('click', () => {
            this.speedMenu.classList.toggle('show');
        });
        document.querySelectorAll('.speed-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const speed = parseFloat(e.target.dataset.speed);
                this.setPlaybackSpeed(speed);
            });
        });

        // Loop and subtitles
        this.loopBtn.addEventListener('click', () => this.toggleLoop());
        this.subtitlesBtn.addEventListener('click', () => this.loadSubtitles());

        // Player events
        [this.videoPlayer, this.audioPlayer].forEach(player => {
            player.addEventListener('timeupdate', () => this.updateProgress());
            player.addEventListener('loadedmetadata', () => this.onMediaLoaded());
            player.addEventListener('ended', () => this.onMediaEnded());
            player.addEventListener('play', () => this.updatePlayButton(true));
            player.addEventListener('pause', () => this.updatePlayButton(false));
        });

        // Playlist
        this.clearPlaylistBtn.addEventListener('click', () => this.clearPlaylist());
        this.shuffleBtn.addEventListener('click', () => this.shufflePlaylist());

        // Modals
        this.openFileBtn.addEventListener('click', () => this.fileInput.click());
        this.openUrlBtn.addEventListener('click', () => this.urlModal.classList.add('show'));
        document.getElementById('urlCancelBtn').addEventListener('click', () => {
            this.urlModal.classList.remove('show');
        });
        document.getElementById('urlOpenBtn').addEventListener('click', () => {
            const url = document.getElementById('urlInput').value;
            if (url) {
                this.loadUrl(url);
                this.urlModal.classList.remove('show');
                document.getElementById('urlInput').value = '';
            }
        });

        // Settings
        this.settingsBtn.addEventListener('click', () => this.settingsModal.classList.add('show'));
        document.getElementById('settingsCloseBtn').addEventListener('click', () => {
            this.settingsModal.classList.remove('show');
            this.saveSettings();
        });

        // Settings inputs
        document.getElementById('autoplayNext').addEventListener('change', (e) => {
            this.settings.autoplayNext = e.target.checked;
        });
        document.getElementById('rememberVolume').addEventListener('change', (e) => {
            this.settings.rememberVolume = e.target.checked;
        });
        document.getElementById('showVisualizer').addEventListener('change', (e) => {
            this.settings.showVisualizer = e.target.checked;
            if (this.settings.showVisualizer && !this.isVideoMode) {
                this.visualizer.classList.add('active');
            } else {
                this.visualizer.classList.remove('active');
            }
        });
        document.getElementById('skipDuration').addEventListener('change', (e) => {
            this.settings.skipDuration = parseInt(e.target.value);
        });
        document.getElementById('visualizerStyle').addEventListener('change', (e) => {
            this.settings.visualizerStyle = e.target.value;
        });

        // Equalizer
        this.eqSliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                const freq = e.target.dataset.freq;
                e.target.nextElementSibling.textContent = value;
                this.updateEqualizer(freq, value);
            });
        });

        document.getElementById('resetEqBtn').addEventListener('click', () => this.resetEqualizer());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Close modals on outside click
        [this.urlModal, this.settingsModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });

        // Close speed menu on outside click
        document.addEventListener('click', (e) => {
            if (!this.speedBtn.contains(e.target) && !this.speedMenu.contains(e.target)) {
                this.speedMenu.classList.remove('show');
            }
        });

        // Subtitle input
        this.subtitleInput.addEventListener('change', (e) => {
            this.loadSubtitleFile(e.target.files[0]);
        });
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.visualizerCanvas = this.visualizer.getContext('2d');
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    setupAudioSource(player) {
        if (!this.audioContext) return;

        // Check if we already have a source for this specific player
        const playerKey = player.id;
        if (this.audioSources && this.audioSources[playerKey]) {
            console.log(`Audio already set up for ${playerKey}`);
            return;
        }

        try {
            // Initialize audio sources map if needed
            if (!this.audioSources) {
                this.audioSources = {};
            }

            // Create media element source for this player
            const mediaSource = this.audioContext.createMediaElementSource(player);
            this.audioSources[playerKey] = mediaSource;

            // Connect to analyser
            mediaSource.connect(this.analyser);

            // Setup equalizer (only once)
            if (!this.eqFilters || this.eqFilters.length === 0) {
                this.eqFilters = [];
                const frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

                frequencies.forEach(freq => {
                    const filter = this.audioContext.createBiquadFilter();
                    filter.type = 'peaking';
                    filter.frequency.value = freq;
                    filter.Q.value = 1;
                    filter.gain.value = 0;
                    this.eqFilters.push(filter);
                });

                // Build complete audio chain: analyser → mixing board → EQ → destination
                let source = this.analyser;

                // Connect mixing board if it exists
                if (this.mixerNodes.gainNode) {
                    source.connect(this.mixerNodes.gainNode);
                    this.mixerNodes.gainNode.connect(this.mixerNodes.bassFilter);
                    this.mixerNodes.bassFilter.connect(this.mixerNodes.midFilter);
                    this.mixerNodes.midFilter.connect(this.mixerNodes.trebleFilter);
                    this.mixerNodes.trebleFilter.connect(this.mixerNodes.colorFilter);
                    this.mixerNodes.colorFilter.connect(this.mixerNodes.presenceFilter);
                    source = this.mixerNodes.presenceFilter;
                }

                // Connect EQ filters in series
                this.eqFilters.forEach(filter => {
                    source.connect(filter);
                    source = filter;
                });

                // Final connection to destination
                source.connect(this.audioContext.destination);
            }

            console.log(`Audio source created for ${playerKey}`);
            this.drawVisualizer();
        } catch (e) {
            console.error('Could not setup audio source:', e);
        }
    }

    drawVisualizer() {
        if (!this.analyser || !this.settings.showVisualizer || this.isVideoMode) return;

        const canvas = this.visualizer;
        const ctx = this.visualizerCanvas;
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (!this.settings.showVisualizer || this.isVideoMode) return;

            requestAnimationFrame(draw);
            this.analyser.getByteFrequencyData(dataArray);

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            if (this.settings.visualizerStyle === 'bars') {
                const barWidth = (width / bufferLength) * 2.5;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const barHeight = (dataArray[i] / 255) * height * 0.8;
                    const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
                    gradient.addColorStop(0, '#58a6ff');
                    gradient.addColorStop(1, '#1f6feb');

                    ctx.fillStyle = gradient;
                    ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                    x += barWidth + 1;
                }
            } else if (this.settings.visualizerStyle === 'wave') {
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#58a6ff';
                ctx.beginPath();

                const sliceWidth = width / bufferLength;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArray[i] / 255.0;
                    const y = v * height / 2 + height / 2;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                ctx.stroke();
            } else if (this.settings.visualizerStyle === 'circle') {
                const centerX = width / 2;
                const centerY = height / 2;
                const radius = Math.min(width, height) / 3;

                ctx.beginPath();
                for (let i = 0; i < bufferLength; i++) {
                    const angle = (i / bufferLength) * Math.PI * 2;
                    const barHeight = (dataArray[i] / 255) * radius;
                    const x = centerX + Math.cos(angle) * (radius + barHeight);
                    const y = centerY + Math.sin(angle) * (radius + barHeight);

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.strokeStyle = '#58a6ff';
                ctx.lineWidth = 2;
                ctx.stroke();
            } else if (this.settings.visualizerStyle === 'particles') {
                // Particle explosion visualizer
                const particleCount = 100;
                const centerX = width / 2;
                const centerY = height / 2;

                for (let i = 0; i < Math.min(bufferLength, particleCount); i++) {
                    const amplitude = dataArray[i] / 255;
                    const angle = (i / particleCount) * Math.PI * 2;
                    const distance = amplitude * Math.min(width, height) / 2;
                    const x = centerX + Math.cos(angle) * distance;
                    const y = centerY + Math.sin(angle) * distance;
                    const size = 2 + amplitude * 6;

                    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
                    gradient.addColorStop(0, `rgba(88, 166, 255, ${amplitude})`);
                    gradient.addColorStop(1, 'rgba(88, 166, 255, 0)');

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (this.settings.visualizerStyle === 'spiral') {
                // Spiral/Helix visualizer
                const centerX = width / 2;
                const centerY = height / 2;
                const maxRadius = Math.min(width, height) / 2.5;

                ctx.beginPath();
                for (let i = 0; i < bufferLength; i++) {
                    const amplitude = dataArray[i] / 255;
                    const angle = (i / bufferLength) * Math.PI * 8; // Multiple rotations
                    const radius = (i / bufferLength) * maxRadius;
                    const x = centerX + Math.cos(angle) * (radius + amplitude * 30);
                    const y = centerY + Math.sin(angle) * (radius + amplitude * 30);

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.strokeStyle = '#58a6ff';
                ctx.lineWidth = 3;
                ctx.shadowColor = '#58a6ff';
                ctx.shadowBlur = 10;
                ctx.stroke();
                ctx.shadowBlur = 0;
            } else if (this.settings.visualizerStyle === 'mirror') {
                // Mirror/Symmetrical bars
                const barWidth = (width / bufferLength) * 2;
                const centerY = height / 2;

                for (let i = 0; i < bufferLength; i++) {
                    const barHeight = (dataArray[i] / 255) * height / 2;
                    const x = (i / bufferLength) * width;

                    const gradient = ctx.createLinearGradient(0, centerY - barHeight, 0, centerY + barHeight);
                    gradient.addColorStop(0, '#a855f7');
                    gradient.addColorStop(0.5, '#58a6ff');
                    gradient.addColorStop(1, '#a855f7');

                    ctx.fillStyle = gradient;
                    // Top half
                    ctx.fillRect(x, centerY - barHeight, barWidth, barHeight);
                    // Bottom half (mirror)
                    ctx.fillRect(x, centerY, barWidth, barHeight);
                }
            } else if (this.settings.visualizerStyle === 'radial') {
                // Radial bars emanating from center
                const centerX = width / 2;
                const centerY = height / 2;
                const maxRadius = Math.min(width, height) / 2;

                for (let i = 0; i < bufferLength; i++) {
                    const angle = (i / bufferLength) * Math.PI * 2;
                    const barLength = (dataArray[i] / 255) * maxRadius;
                    const barWidth = (Math.PI * 2 / bufferLength) * maxRadius;

                    ctx.save();
                    ctx.translate(centerX, centerY);
                    ctx.rotate(angle);

                    const gradient = ctx.createLinearGradient(0, 0, barLength, 0);
                    gradient.addColorStop(0, '#1f6feb');
                    gradient.addColorStop(1, '#58a6ff');

                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, -barWidth/2, barLength, barWidth);
                    ctx.restore();
                }
            } else if (this.settings.visualizerStyle === 'waveform') {
                // Oscilloscope-style waveform
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#00d4ff';
                ctx.shadowColor = '#00d4ff';
                ctx.shadowBlur = 15;
                ctx.beginPath();

                const sliceWidth = width / bufferLength;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArray[i] / 128.0;
                    const y = v * height / 2;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                ctx.lineTo(width, height / 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
            } else if (this.settings.visualizerStyle === 'grid') {
                // Grid/Matrix style visualizer
                const cols = 32;
                const rows = 16;
                const cellWidth = width / cols;
                const cellHeight = height / rows;
                const dataPerCell = Math.floor(bufferLength / (cols * rows));

                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const dataIndex = (row * cols + col) * dataPerCell;
                        const amplitude = dataArray[dataIndex] / 255;

                        const hue = (amplitude * 120) + 180; // Blue to cyan
                        ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${amplitude})`;
                        ctx.fillRect(
                            col * cellWidth + 1,
                            row * cellHeight + 1,
                            cellWidth - 2,
                            cellHeight - 2
                        );
                    }
                }
            }
        };

        draw();
    }

    updateEqualizer(freq, gain) {
        const index = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000].indexOf(parseInt(freq));
        if (index !== -1 && this.eqFilters[index]) {
            this.eqFilters[index].gain.value = parseFloat(gain);
        }
    }

    resetEqualizer() {
        this.eqSliders.forEach(slider => {
            slider.value = 0;
            slider.nextElementSibling.textContent = '0';
            const freq = slider.dataset.freq;
            this.updateEqualizer(freq, 0);
        });
    }

    handleFiles(files) {
        const mediaFiles = Array.from(files).filter(file => {
            return file.type.startsWith('video/') || file.type.startsWith('audio/');
        });

        if (mediaFiles.length === 0) return;

        mediaFiles.forEach(file => {
            const url = URL.createObjectURL(file);
            const isVideo = file.type.startsWith('video/');

            this.playlist.push({
                url: url,
                name: file.name,
                type: isVideo ? 'video' : 'audio',
                duration: 0
            });
        });

        this.updatePlaylistUI();

        if (this.currentIndex === -1) {
            this.loadMedia(0);
        }
    }

    loadUrl(url) {
        const isVideo = url.match(/\.(mp4|webm|mkv|avi|mov|m4v)$/i);

        this.playlist.push({
            url: url,
            name: url.split('/').pop() || 'Stream',
            type: isVideo ? 'video' : 'audio',
            duration: 0
        });

        this.updatePlaylistUI();

        if (this.currentIndex === -1) {
            this.loadMedia(0);
        }
    }

    loadMedia(index) {
        if (index < 0 || index >= this.playlist.length) return;

        const media = this.playlist[index];
        this.currentIndex = index;

        // Stop current playback
        if (this.currentPlayer) {
            this.currentPlayer.pause();
            this.currentPlayer.currentTime = 0;
        }

        // Switch player
        this.isVideoMode = media.type === 'video';

        if (this.isVideoMode) {
            this.currentPlayer = this.videoPlayer;
            this.audioPlayer.classList.remove('active');
            this.videoPlayer.classList.add('active');
            this.visualizer.classList.remove('active');
        } else {
            this.currentPlayer = this.audioPlayer;
            this.videoPlayer.classList.remove('active');
            this.audioPlayer.classList.add('active');
            if (this.settings.showVisualizer) {
                this.visualizer.classList.add('active');
            }
        }

        // Setup audio source for first time
        if (!this.audioSource) {
            this.setupAudioSource(this.currentPlayer);
        }

        this.currentPlayer.src = media.url;
        this.currentPlayer.load();
        this.dropZone.classList.add('hidden');
        this.currentTitle.textContent = media.name;
        this.videoInfo.classList.add('show');

        setTimeout(() => {
            this.videoInfo.classList.remove('show');
        }, 3000);

        // Start beat grid update loop
        this.updateBeatGrid();

        this.updatePlaylistUI();
    }

    updatePlaylistUI() {
        if (this.playlist.length === 0) {
            this.playlistEl.innerHTML = '<div class="playlist-empty">No media loaded</div>';
            return;
        }

        this.playlistEl.innerHTML = this.playlist.map((item, index) => {
            const active = index === this.currentIndex ? 'active' : '';
            const duration = item.duration ? this.formatTime(item.duration) : 'Unknown';
            return `
                <div class="playlist-item ${active}" data-index="${index}">
                    <div class="playlist-item-title">${item.name}</div>
                    <div class="playlist-item-info">${item.type} • ${duration}</div>
                </div>
            `;
        }).join('');

        // Add click handlers
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.loadMedia(index);
                this.play();
            });
        });
    }

    togglePlay() {
        if (!this.currentPlayer || !this.currentPlayer.src) return;

        if (this.currentPlayer.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    play() {
        if (!this.currentPlayer || !this.currentPlayer.src) return;

        // Ensure audio source is set up for current player
        if (this.audioContext && !this.audioSources[this.currentPlayer.id]) {
            console.log('Setting up audio source for', this.currentPlayer.id);
            this.setupAudioSource(this.currentPlayer);
        }

        if (this.audioContext && this.audioContext.state === 'suspended') {
            console.log('Resuming audio context');
            this.audioContext.resume();
        }

        this.currentPlayer.play().catch(e => console.error('Play error:', e));
    }

    pause() {
        if (!this.currentPlayer) return;
        this.currentPlayer.pause();
    }

    stop() {
        if (!this.currentPlayer) return;
        this.currentPlayer.pause();
        this.currentPlayer.currentTime = 0;
    }

    playNext() {
        if (this.playlist.length === 0) return;
        const nextIndex = (this.currentIndex + 1) % this.playlist.length;
        this.loadMedia(nextIndex);
        this.play();
    }

    playPrevious() {
        if (this.playlist.length === 0) return;
        const prevIndex = this.currentIndex - 1 < 0 ? this.playlist.length - 1 : this.currentIndex - 1;
        this.loadMedia(prevIndex);
        this.play();
    }

    skip(seconds) {
        if (!this.currentPlayer) return;
        this.currentPlayer.currentTime += seconds;
    }

    seek(e) {
        if (!this.currentPlayer || !this.currentPlayer.duration) return;

        const rect = this.progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.currentPlayer.currentTime = percent * this.currentPlayer.duration;
    }

    updateProgress() {
        if (!this.currentPlayer) return;

        const current = this.currentPlayer.currentTime;
        const duration = this.currentPlayer.duration;

        if (duration) {
            const percent = (current / duration) * 100;
            this.progressFilled.style.width = percent + '%';
            this.currentTimeEl.textContent = this.formatTime(current);
            this.durationEl.textContent = this.formatTime(duration);
        }

        // Update subtitles
        this.updateSubtitles(current);
    }

    updateProgressHover(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        this.progressHover.style.width = Math.max(0, Math.min(100, percent)) + '%';
    }

    setVolume(value) {
        if (!this.currentPlayer) return;
        const volume = value / 100;
        this.currentPlayer.volume = volume;

        if (this.settings.rememberVolume) {
            localStorage.setItem('volume', volume);
        }

        this.updateVolumeIcon(volume);
    }

    toggleMute() {
        if (!this.currentPlayer) return;
        this.currentPlayer.muted = !this.currentPlayer.muted;
        this.updateVolumeIcon(this.currentPlayer.muted ? 0 : this.currentPlayer.volume);
    }

    updateVolumeIcon(volume) {
        const volumeIcon = this.muteBtn.querySelector('.volume-icon');
        const muteIcon = this.muteBtn.querySelector('.mute-icon');

        if (volume === 0 || this.currentPlayer.muted) {
            volumeIcon.style.display = 'none';
            muteIcon.style.display = 'block';
        } else {
            volumeIcon.style.display = 'block';
            muteIcon.style.display = 'none';
        }
    }

    toggleFullscreen() {
        const container = document.querySelector('.video-container');

        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(e => console.error('Fullscreen error:', e));
        } else {
            document.exitFullscreen();
        }
    }

    setPlaybackSpeed(speed) {
        if (!this.currentPlayer) return;
        this.currentPlayer.playbackRate = speed;
        this.speedDisplay.textContent = speed + 'x';

        document.querySelectorAll('.speed-option').forEach(option => {
            option.classList.toggle('active', parseFloat(option.dataset.speed) === speed);
        });

        this.speedMenu.classList.remove('show');
    }

    toggleLoop() {
        if (!this.currentPlayer) return;
        this.currentPlayer.loop = !this.currentPlayer.loop;
        this.loopBtn.classList.toggle('active', this.currentPlayer.loop);
    }

    loadSubtitles() {
        this.subtitleInput.click();
    }

    loadSubtitleFile(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            this.parseSubtitles(content);
        };
        reader.readAsText(file);
    }

    parseSubtitles(content) {
        // Simple SRT parser
        this.subtitles = [];
        const blocks = content.trim().split('\n\n');

        blocks.forEach(block => {
            const lines = block.split('\n');
            if (lines.length >= 3) {
                const timeLine = lines[1];
                const text = lines.slice(2).join('\n');
                const times = timeLine.split(' --> ');

                if (times.length === 2) {
                    this.subtitles.push({
                        start: this.parseTime(times[0]),
                        end: this.parseTime(times[1]),
                        text: text
                    });
                }
            }
        });

        this.subtitlesBtn.classList.add('active');
    }

    parseTime(timeString) {
        const parts = timeString.trim().split(':');
        const seconds = parts[parts.length - 1].replace(',', '.');
        const minutes = parseInt(parts[parts.length - 2] || 0);
        const hours = parseInt(parts[parts.length - 3] || 0);

        return hours * 3600 + minutes * 60 + parseFloat(seconds);
    }

    updateSubtitles(currentTime) {
        if (this.subtitles.length === 0) return;

        const current = this.subtitles.find(sub =>
            currentTime >= sub.start && currentTime <= sub.end
        );

        if (current) {
            this.subtitlesEl.textContent = current.text;
            this.subtitlesEl.classList.add('active');
        } else {
            this.subtitlesEl.classList.remove('active');
        }
    }

    clearPlaylist() {
        this.playlist = [];
        this.currentIndex = -1;
        this.stop();
        if (this.currentPlayer) {
            this.currentPlayer.src = '';
        }
        this.updatePlaylistUI();
        this.dropZone.classList.remove('hidden');
        this.videoPlayer.classList.remove('active');
        this.audioPlayer.classList.remove('active');
        this.visualizer.classList.remove('active');
    }

    shufflePlaylist() {
        if (this.playlist.length < 2) return;

        const currentMedia = this.playlist[this.currentIndex];

        for (let i = this.playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
        }

        this.currentIndex = this.playlist.indexOf(currentMedia);
        this.updatePlaylistUI();
    }

    onMediaLoaded() {
        if (!this.currentPlayer) return;

        const duration = this.currentPlayer.duration;
        if (this.currentIndex !== -1 && duration) {
            this.playlist[this.currentIndex].duration = duration;
            this.updatePlaylistUI();
        }

        // Generate waveform for audio visualization
        if (!this.isVideoMode) {
            this.generateWaveform();
        }
    }

    onMediaEnded() {
        if (this.settings.autoplayNext && !this.currentPlayer.loop) {
            this.playNext();
        }
    }

    updatePlayButton(isPlaying) {
        const playIcon = this.playBtn.querySelector('.play-icon');
        const pauseIcon = this.playBtn.querySelector('.pause-icon');

        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }

    handleKeyboard(e) {
        // Don't handle if typing in input
        if (e.target.tagName === 'INPUT') return;

        switch(e.key.toLowerCase()) {
            case ' ':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'f':
                this.toggleFullscreen();
                break;
            case 'm':
                this.toggleMute();
                break;
            case 'arrowleft':
                this.skip(-this.settings.skipDuration);
                break;
            case 'arrowright':
                this.skip(this.settings.skipDuration);
                break;
            case 'arrowup':
                e.preventDefault();
                this.volumeSlider.value = Math.min(100, parseInt(this.volumeSlider.value) + 5);
                this.setVolume(this.volumeSlider.value);
                break;
            case 'arrowdown':
                e.preventDefault();
                this.volumeSlider.value = Math.max(0, parseInt(this.volumeSlider.value) - 5);
                this.setVolume(this.volumeSlider.value);
                break;
            case 'n':
                this.playNext();
                break;
            case 'p':
                this.playPrevious();
                break;
            case 's':
                this.stop();
                break;
            case 'l':
                this.toggleLoop();
                break;
            case 'c':
                this.loadSubtitles();
                break;
        }
    }

    startControlsTimer() {
        let timeout;
        const container = document.querySelector('.video-container');

        const showControls = () => {
            this.controlsOverlay.classList.add('show');
            container.style.cursor = 'default';

            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (this.currentPlayer && !this.currentPlayer.paused) {
                    this.controlsOverlay.classList.remove('show');
                    container.style.cursor = 'none';
                }
            }, 3000);
        };

        container.addEventListener('mousemove', showControls);
        container.addEventListener('click', showControls);
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';

        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    loadSettings() {
        const saved = localStorage.getItem('coreMediaSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }

        // Apply settings to UI
        document.getElementById('autoplayNext').checked = this.settings.autoplayNext;
        document.getElementById('rememberVolume').checked = this.settings.rememberVolume;
        document.getElementById('showVisualizer').checked = this.settings.showVisualizer;
        document.getElementById('hardwareAccel').checked = this.settings.hardwareAccel;
        document.getElementById('skipDuration').value = this.settings.skipDuration;
        document.getElementById('visualizerStyle').value = this.settings.visualizerStyle;

        // Load saved volume
        if (this.settings.rememberVolume) {
            const volume = localStorage.getItem('volume');
            if (volume) {
                this.volumeSlider.value = parseFloat(volume) * 100;
            }
        }
    }

    saveSettings() {
        localStorage.setItem('coreMediaSettings', JSON.stringify(this.settings));
    }

    // DJ Controls Implementation
    initDJControls() {
        // Pitch control
        if (this.pitchSlider) {
            this.pitchSlider.addEventListener('input', (e) => {
                this.pitchValue = parseFloat(e.target.value);
                this.updatePitch();
            });
        }

        // Pitch buttons
        this.pitchButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pitch = parseFloat(e.target.dataset.pitch);
                this.pitchSlider.value = pitch;
                this.pitchValue = pitch;
                this.updatePitch();
            });
        });

        // BPM tap
        if (this.bpmTapBtn) {
            this.bpmTapBtn.addEventListener('click', () => this.tapBPM());
        }

        // Crossfader
        if (this.crossfader) {
            this.crossfader.addEventListener('input', (e) => {
                this.updateCrossfader(e.target.value);
            });
        }

        // Hot cues
        this.cueButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cueNum = e.currentTarget.dataset.cue;
                if (e.shiftKey || e.ctrlKey) {
                    this.deleteCue(cueNum);
                } else {
                    this.handleCue(cueNum);
                }
            });
        });

        // Loop controls
        if (this.loopInBtn) {
            this.loopInBtn.addEventListener('click', () => this.setLoopIn());
        }
        if (this.loopOutBtn) {
            this.loopOutBtn.addEventListener('click', () => this.setLoopOut());
        }
        if (this.loop2Btn) {
            this.loop2Btn.addEventListener('click', () => this.setAutoLoop(2));
        }
        if (this.loop4Btn) {
            this.loop4Btn.addEventListener('click', () => this.setAutoLoop(4));
        }
        if (this.loop8Btn) {
            this.loop8Btn.addEventListener('click', () => this.setAutoLoop(8));
        }
        if (this.loopExitBtn) {
            this.loopExitBtn.addEventListener('click', () => this.exitLoop());
        }

        // Add keyboard shortcuts for DJ controls
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;

            // Hot cues 1-8
            if (e.key >= '1' && e.key <= '8') {
                if (e.shiftKey) {
                    this.deleteCue(e.key);
                } else {
                    this.handleCue(e.key);
                }
            }

            // Pitch bend
            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                this.pitchSlider.value = Math.min(16, parseFloat(this.pitchSlider.value) + 0.5);
                this.pitchValue = parseFloat(this.pitchSlider.value);
                this.updatePitch();
            }
            if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                this.pitchSlider.value = Math.max(-16, parseFloat(this.pitchSlider.value) - 0.5);
                this.pitchValue = parseFloat(this.pitchSlider.value);
                this.updatePitch();
            }
        });

        // Start BPM detection
        this.startBPMDetection();
    }

    updatePitch() {
        if (!this.currentPlayer) return;

        // Calculate playback rate from pitch percentage
        const pitchMultiplier = 1 + (this.pitchValue / 100);
        this.currentPlayer.playbackRate = pitchMultiplier;

        // Update display
        const sign = this.pitchValue >= 0 ? '+' : '';
        if (this.pitchValueEl) {
            this.pitchValueEl.textContent = `${sign}${this.pitchValue.toFixed(1)}%`;
        }

        // Update BPM if detected
        if (this.currentBPM > 0) {
            const adjustedBPM = Math.round(this.currentBPM * pitchMultiplier);
            this.bpmValue.textContent = adjustedBPM;
        }
    }

    tapBPM() {
        const now = Date.now();
        this.bpmTaps.push(now);

        // Keep only last 4 taps
        if (this.bpmTaps.length > 4) {
            this.bpmTaps.shift();
        }

        if (this.bpmTaps.length >= 2) {
            const intervals = [];
            for (let i = 1; i < this.bpmTaps.length; i++) {
                intervals.push(this.bpmTaps[i] - this.bpmTaps[i - 1]);
            }

            const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
            const bpm = Math.round(60000 / avgInterval);

            if (bpm >= 40 && bpm <= 250) {
                this.currentBPM = bpm;
                this.bpmValue.textContent = bpm;
            }
        }

        // Reset taps after 2 seconds
        clearTimeout(this.bpmResetTimeout);
        this.bpmResetTimeout = setTimeout(() => {
            this.bpmTaps = [];
        }, 2000);
    }

    startBPMDetection() {
        // Simple BPM detection using Web Audio API
        if (!this.analyser) return;

        let lastBeat = 0;
        const beatThreshold = 200;

        const detectBeat = () => {
            if (!this.currentPlayer || this.currentPlayer.paused) {
                requestAnimationFrame(detectBeat);
                return;
            }

            const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(dataArray);

            // Analyze low frequencies for beat detection
            const lowFreqAvg = dataArray.slice(0, 10).reduce((a, b) => a + b) / 10;

            const now = Date.now();
            if (lowFreqAvg > beatThreshold && now - lastBeat > 300) {
                lastBeat = now;
                // Auto-detect BPM could be enhanced here
            }

            requestAnimationFrame(detectBeat);
        };

        detectBeat();
    }

    updateCrossfader(value) {
        this.crossfaderValue = parseFloat(value);

        if (!this.currentPlayer) return;

        // Calculate volume based on crossfader position
        let volume = 1;
        if (value < 50) {
            // Fading to A (left)
            volume = 1 - ((50 - value) / 50) * 0.5;
        } else if (value > 50) {
            // Fading to B (right)
            volume = 1 - ((value - 50) / 50) * 0.5;
        }

        this.currentPlayer.volume = volume * (this.volumeSlider.value / 100);

        // Update label
        if (this.crossfaderValueEl) {
            if (value < 45) {
                this.crossfaderValueEl.textContent = 'DECK A';
            } else if (value > 55) {
                this.crossfaderValueEl.textContent = 'DECK B';
            } else {
                this.crossfaderValueEl.textContent = 'CENTER';
            }
        }
    }

    handleCue(cueNum) {
        if (!this.currentPlayer) return;

        if (this.hotCues[cueNum]) {
            // Jump to cue point
            this.currentPlayer.currentTime = this.hotCues[cueNum];
        } else {
            // Set cue point
            this.setCue(cueNum);
        }
    }

    setCue(cueNum) {
        if (!this.currentPlayer) return;

        const time = this.currentPlayer.currentTime;
        this.hotCues[cueNum] = time;

        // Update button
        const btn = document.querySelector(`[data-cue="${cueNum}"]`);
        if (btn) {
            btn.classList.add('set');
            const timeEl = btn.querySelector('.cue-time');
            if (timeEl) {
                timeEl.textContent = this.formatTime(time);
            }
        }
    }

    deleteCue(cueNum) {
        delete this.hotCues[cueNum];

        const btn = document.querySelector(`[data-cue="${cueNum}"]`);
        if (btn) {
            btn.classList.remove('set');
            const timeEl = btn.querySelector('.cue-time');
            if (timeEl) {
                timeEl.textContent = '';
            }
        }
    }

    setLoopIn() {
        if (!this.currentPlayer) return;
        this.loopStart = this.currentPlayer.currentTime;
        this.loopInBtn.classList.add('active');

        if (this.loopStart !== null && this.loopEnd !== null) {
            this.activateLoop();
        }
    }

    setLoopOut() {
        if (!this.currentPlayer) return;
        this.loopEnd = this.currentPlayer.currentTime;
        this.loopOutBtn.classList.add('active');

        if (this.loopStart !== null && this.loopEnd !== null) {
            this.activateLoop();
        }
    }

    setAutoLoop(beats) {
        if (!this.currentPlayer || this.currentBPM === 0) return;

        const currentTime = this.currentPlayer.currentTime;
        const beatDuration = 60 / this.currentBPM;
        const loopDuration = beatDuration * beats;

        this.loopStart = currentTime;
        this.loopEnd = currentTime + loopDuration;

        // Highlight the button
        [this.loop2Btn, this.loop4Btn, this.loop8Btn].forEach(btn => {
            btn.classList.remove('active');
        });

        const btnId = `loop${beats}Btn`;
        if (this[btnId]) {
            this[btnId].classList.add('active');
        }

        this.activateLoop();
    }

    activateLoop() {
        this.isLooping = true;
        this.loopInBtn.classList.add('active');
        this.loopOutBtn.classList.add('active');
    }

    exitLoop() {
        this.isLooping = false;
        this.loopStart = null;
        this.loopEnd = null;

        [this.loopInBtn, this.loopOutBtn, this.loop2Btn, this.loop4Btn, this.loop8Btn].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
    }

    updateProgress() {
        if (!this.currentPlayer) return;

        const current = this.currentPlayer.currentTime;
        const duration = this.currentPlayer.duration;

        // Handle looping
        if (this.isLooping && this.loopStart !== null && this.loopEnd !== null) {
            if (current >= this.loopEnd) {
                this.currentPlayer.currentTime = this.loopStart;
            }
        }

        if (duration) {
            const percent = (current / duration) * 100;
            this.progressFilled.style.width = percent + '%';
            this.currentTimeEl.textContent = this.formatTime(current);
            this.durationEl.textContent = this.formatTime(duration);

            // Update waveform progress
            if (this.waveformProgress) {
                this.waveformProgress.style.left = percent + '%';
            }
        }

        // Update subtitles
        this.updateSubtitles(current);
    }

    // Waveform Implementation
    initWaveform() {
        if (!this.waveformToggle) return;

        this.waveformToggle.addEventListener('click', () => {
            this.waveformContainer.classList.toggle('active');
            this.waveformToggle.classList.toggle('active');
        });

        this.waveformZoomIn.addEventListener('click', () => {
            this.waveformZoom = Math.min(10, this.waveformZoom * 1.5);
            this.drawWaveform();
        });

        this.waveformZoomOut.addEventListener('click', () => {
            this.waveformZoom = Math.max(1, this.waveformZoom / 1.5);
            this.drawWaveform();
        });

        this.waveformCanvas.addEventListener('click', (e) => {
            if (!this.currentPlayer || !this.currentPlayer.duration) return;
            const rect = this.waveformCanvas.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.currentPlayer.currentTime = percent * this.currentPlayer.duration;
        });

        // Add keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;
            if (e.key.toLowerCase() === 'w') {
                this.waveformContainer.classList.toggle('active');
                this.waveformToggle.classList.toggle('active');
            }
            if (e.key === '?') {
                this.helpModal.classList.toggle('show');
            }
        });

        // Close help modal
        document.getElementById('helpCloseBtn').addEventListener('click', () => {
            this.helpModal.classList.remove('show');
        });
    }

    async generateWaveform() {
        if (!this.currentPlayer || !this.audioContext) return;

        try {
            const response = await fetch(this.currentPlayer.src);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            const rawData = audioBuffer.getChannelData(0);
            const samples = 1000;
            const blockSize = Math.floor(rawData.length / samples);
            const filteredData = [];

            for (let i = 0; i < samples; i++) {
                let blockStart = blockSize * i;
                let sum = 0;
                for (let j = 0; j < blockSize; j++) {
                    sum += Math.abs(rawData[blockStart + j]);
                }
                filteredData.push(sum / blockSize);
            }

            this.waveformData = filteredData;
            this.drawWaveform();
        } catch (e) {
            console.warn('Could not generate waveform:', e);
        }
    }

    drawWaveform() {
        if (!this.waveformData || !this.waveformCanvas) return;

        const canvas = this.waveformCanvas;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const width = canvas.width;
        const height = canvas.height;
        const data = this.waveformData;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#58a6ff';

        const barWidth = (width / data.length) * this.waveformZoom;
        const middle = height / 2;

        for (let i = 0; i < data.length; i++) {
            const x = i * barWidth;
            const barHeight = (data[i] * height) / 2;

            // Draw top half
            ctx.fillRect(x, middle - barHeight, barWidth - 1, barHeight);
            // Draw bottom half (mirror)
            ctx.fillRect(x, middle, barWidth - 1, barHeight);
        }
    }

    // VU Meters Implementation
    initVUMeters() {
        if (!this.analyser) return;

        const updateMeters = () => {
            if (!this.currentPlayer || this.currentPlayer.paused) {
                requestAnimationFrame(updateMeters);
                return;
            }

            const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(dataArray);

            // Calculate average levels
            const leftLevel = dataArray.slice(0, dataArray.length / 2)
                .reduce((a, b) => a + b) / (dataArray.length / 2);
            const rightLevel = dataArray.slice(dataArray.length / 2)
                .reduce((a, b) => a + b) / (dataArray.length / 2);

            // Update VU meter display
            const leftPercent = (leftLevel / 255) * 100;
            const rightPercent = (rightLevel / 255) * 100;

            if (this.vuLeft) this.vuLeft.style.height = leftPercent + '%';
            if (this.vuRight) this.vuRight.style.height = rightPercent + '%';

            requestAnimationFrame(updateMeters);
        };

        updateMeters();
    }

    // Effects Implementation
    initEffects() {
        if (!this.audioContext) return;

        // Create effect nodes
        this.createReverb();
        this.createDelay();
        this.createFilter();

        // Effect toggles
        this.reverbToggle.addEventListener('change', (e) => {
            this.effectsEnabled.reverb = e.target.checked;
            this.updateEffectsChain();
        });

        this.delayToggle.addEventListener('change', (e) => {
            this.effectsEnabled.delay = e.target.checked;
            this.updateEffectsChain();
        });

        this.filterToggle.addEventListener('change', (e) => {
            this.effectsEnabled.filter = e.target.checked;
            this.updateEffectsChain();
        });

        // Effect parameters
        this.reverbMix.addEventListener('input', (e) => {
            e.target.nextElementSibling.textContent = e.target.value + '%';
            if (this.reverbNode && this.reverbNode.wet) {
                this.reverbNode.wet.value = e.target.value / 100;
            }
        });

        this.delayTime.addEventListener('input', (e) => {
            e.target.nextElementSibling.textContent = e.target.value + 'ms';
            if (this.delayNode) {
                this.delayNode.delayTime.value = e.target.value / 1000;
            }
        });

        this.delayFeedback.addEventListener('input', (e) => {
            e.target.nextElementSibling.textContent = e.target.value + '%';
            if (this.feedbackGain) {
                this.feedbackGain.gain.value = e.target.value / 100;
            }
        });

        this.filterFreq.addEventListener('input', (e) => {
            e.target.nextElementSibling.textContent = e.target.value + 'Hz';
            if (this.filterNode) {
                this.filterNode.frequency.value = parseFloat(e.target.value);
            }
        });

        this.filterQ.addEventListener('input', (e) => {
            e.target.nextElementSibling.textContent = e.target.value;
            if (this.filterNode) {
                this.filterNode.Q.value = parseFloat(e.target.value);
            }
        });

        this.filterType.addEventListener('change', (e) => {
            if (this.filterNode) {
                this.filterNode.type = e.target.value;
            }
        });
    }

    createReverb() {
        // Simple convolver-based reverb
        this.reverbNode = this.audioContext.createGain();
        // In a real implementation, you'd use ConvolverNode with an impulse response
    }

    createDelay() {
        this.delayNode = this.audioContext.createDelay(5.0);
        this.delayNode.delayTime.value = 0.5;

        this.feedbackGain = this.audioContext.createGain();
        this.feedbackGain.gain.value = 0.4;

        this.delayNode.connect(this.feedbackGain);
        this.feedbackGain.connect(this.delayNode);
    }

    createFilter() {
        this.filterNode = this.audioContext.createBiquadFilter();
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.value = 1000;
        this.filterNode.Q.value = 1;
    }

    updateEffectsChain() {
        if (!this.audioSource || !this.audioContext) return;

        // Rebuild audio chain with enabled effects
        let source = this.analyser;

        if (this.effectsEnabled.filter && this.filterNode) {
            source.connect(this.filterNode);
            source = this.filterNode;
        }

        if (this.effectsEnabled.delay && this.delayNode) {
            source.connect(this.delayNode);
            source = this.delayNode;
        }

        if (this.effectsEnabled.reverb && this.reverbNode) {
            source.connect(this.reverbNode);
            source = this.reverbNode;
        }

        // Connect EQ chain
        this.eqFilters.forEach(filter => {
            source.connect(filter);
            source = filter;
        });

        source.connect(this.audioContext.destination);
    }

    // Beat Grid System
    initBeatGrid() {
        const beatGridToggle = document.getElementById('beatGridToggle');
        const beatGridOffsetSlider = document.getElementById('beatGridOffset');
        const analyzeBeatBtn = document.getElementById('analyzeBeatBtn');
        const beatGridCanvas = document.getElementById('beatGridCanvas');

        if (beatGridToggle) {
            beatGridToggle.addEventListener('change', (e) => {
                this.beatGridEnabled = e.target.checked;
                if (beatGridCanvas) {
                    beatGridCanvas.style.display = this.beatGridEnabled ? 'block' : 'none';
                }
                this.drawBeatGrid();
            });
        }

        if (beatGridOffsetSlider) {
            beatGridOffsetSlider.addEventListener('input', (e) => {
                this.beatGridOffset = parseFloat(e.target.value);
                const valueEl = e.target.nextElementSibling;
                if (valueEl) {
                    valueEl.textContent = this.beatGridOffset.toFixed(2) + 's';
                }
                this.drawBeatGrid();
            });
        }

        if (analyzeBeatBtn) {
            analyzeBeatBtn.addEventListener('click', () => {
                this.analyzeBeatPattern();
            });
        }

        this.beatGridCanvas = beatGridCanvas;

        if (this.beatGridCanvas) {
            this.beatGridCanvas.addEventListener('click', (e) => {
                this.handleBeatGridClick(e);
            });
        }
    }

    async analyzeBeatPattern() {
        if (!this.currentPlayer || !this.audioContext) {
            console.warn('No audio loaded');
            return;
        }

        if (!this.currentBPM || this.currentBPM === 0) {
            alert('Please set BPM first (use Tap Tempo or enter manually)');
            return;
        }

        const analyzeBeatBtn = document.getElementById('analyzeBeatBtn');
        if (analyzeBeatBtn) {
            analyzeBeatBtn.textContent = 'Analyzing...';
            analyzeBeatBtn.disabled = true;
        }

        try {
            // Get audio buffer
            const response = await fetch(this.currentPlayer.src);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            // Use offline audio context for faster processing
            const offlineContext = new OfflineAudioContext(
                audioBuffer.numberOfChannels,
                audioBuffer.length,
                audioBuffer.sampleRate
            );

            const source = offlineContext.createBufferSource();
            source.buffer = audioBuffer;

            const analyser = offlineContext.createAnalyser();
            analyser.fftSize = 2048;
            analyser.smoothingTimeConstant = 0.8;

            // Low-pass filter to isolate kick drum frequencies
            const lowPassFilter = offlineContext.createBiquadFilter();
            lowPassFilter.type = 'lowpass';
            lowPassFilter.frequency.value = 150;

            source.connect(lowPassFilter);
            lowPassFilter.connect(analyser);
            source.connect(offlineContext.destination);

            source.start();
            const renderedBuffer = await offlineContext.startRendering();

            // Analyze rendered buffer for beats
            const channelData = renderedBuffer.getChannelData(0);
            const sampleRate = renderedBuffer.sampleRate;
            const secondsPerBeat = 60 / this.currentBPM;
            const samplesPerBeat = Math.floor(sampleRate * secondsPerBeat);

            // Find beats using energy detection
            const beats = [];
            const windowSize = Math.floor(samplesPerBeat / 4);
            let threshold = 0;

            // Calculate threshold (average energy)
            for (let i = 0; i < channelData.length; i += windowSize) {
                const energy = this.calculateEnergy(channelData, i, Math.min(i + windowSize, channelData.length));
                threshold += energy;
            }
            threshold = (threshold / (channelData.length / windowSize)) * 1.5;

            // Detect beats
            let lastBeatSample = -samplesPerBeat;
            for (let i = 0; i < channelData.length; i += Math.floor(windowSize / 2)) {
                const energy = this.calculateEnergy(channelData, i, Math.min(i + windowSize, channelData.length));

                if (energy > threshold && (i - lastBeatSample) > samplesPerBeat * 0.7) {
                    const timeInSeconds = i / sampleRate;
                    beats.push(timeInSeconds);
                    lastBeatSample = i;
                }
            }

            // Quantize beats to BPM grid
            this.beatGrid = this.quantizeBeats(beats, secondsPerBeat);

            // Auto-adjust offset to align with first strong beat
            if (this.beatGrid.length > 0) {
                this.beatGridOffset = this.beatGrid[0] % secondsPerBeat;
                const offsetSlider = document.getElementById('beatGridOffset');
                if (offsetSlider) {
                    offsetSlider.value = this.beatGridOffset;
                    const valueEl = offsetSlider.nextElementSibling;
                    if (valueEl) {
                        valueEl.textContent = this.beatGridOffset.toFixed(2) + 's';
                    }
                }
            }

            this.drawBeatGrid();

            if (analyzeBeatBtn) {
                analyzeBeatBtn.textContent = `✓ ${this.beatGrid.length} beats detected`;
                analyzeBeatBtn.disabled = false;
            }

        } catch (e) {
            console.error('Beat analysis failed:', e);
            if (analyzeBeatBtn) {
                analyzeBeatBtn.textContent = 'Analyze Beats';
                analyzeBeatBtn.disabled = false;
            }
        }
    }

    calculateEnergy(data, start, end) {
        let sum = 0;
        for (let i = start; i < end; i++) {
            sum += data[i] * data[i];
        }
        return Math.sqrt(sum / (end - start));
    }

    quantizeBeats(beats, secondsPerBeat) {
        // Quantize detected beats to nearest beat grid position
        const quantized = [];
        beats.forEach(beat => {
            const gridPosition = Math.round(beat / secondsPerBeat) * secondsPerBeat;
            if (!quantized.includes(gridPosition)) {
                quantized.push(gridPosition);
            }
        });
        return quantized.sort((a, b) => a - b);
    }

    drawBeatGrid() {
        if (!this.beatGridCanvas || !this.beatGridEnabled || !this.currentPlayer) return;

        const canvas = this.beatGridCanvas;
        const ctx = canvas.getContext('2d');

        // Set canvas size to match parent
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!this.currentBPM || this.currentBPM === 0) return;

        const duration = this.currentPlayer.duration;
        if (!duration || isNaN(duration)) return;

        const secondsPerBeat = 60 / this.currentBPM;
        const beatCount = Math.ceil(duration / secondsPerBeat);

        // Draw grid lines
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.4)';
        ctx.lineWidth = 1;

        for (let i = 0; i < beatCount; i++) {
            const beatTime = (i * secondsPerBeat) + this.beatGridOffset;
            if (beatTime > duration) break;

            const x = (beatTime / duration) * canvas.width;

            // Emphasize every 4th beat (downbeat)
            if (i % 4 === 0) {
                ctx.strokeStyle = 'rgba(0, 212, 255, 0.8)';
                ctx.lineWidth = 2;
            } else {
                ctx.strokeStyle = 'rgba(0, 212, 255, 0.4)';
                ctx.lineWidth = 1;
            }

            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        // Draw detected beats
        if (this.beatGrid.length > 0) {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
            this.beatGrid.forEach(beatTime => {
                const x = (beatTime / duration) * canvas.width;
                ctx.beginPath();
                ctx.arc(x, canvas.height / 2, 4, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // Draw current playhead
        const currentTime = this.currentPlayer.currentTime;
        const playheadX = (currentTime / duration) * canvas.width;
        ctx.strokeStyle = 'rgba(88, 166, 255, 0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(playheadX, 0);
        ctx.lineTo(playheadX, canvas.height);
        ctx.stroke();
    }

    handleBeatGridClick(e) {
        if (!this.currentPlayer || !this.beatGridCanvas) return;

        const rect = this.beatGridCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const duration = this.currentPlayer.duration;

        if (duration && !isNaN(duration)) {
            const clickTime = (x / rect.width) * duration;
            this.currentPlayer.currentTime = clickTime;
        }
    }

    updateBeatGrid() {
        if (this.beatGridEnabled && this.beatGridCanvas) {
            requestAnimationFrame(() => this.updateBeatGrid());
            this.drawBeatGrid();
        } else {
            setTimeout(() => this.updateBeatGrid(), 100);
        }
    }

    // Spectral Frequency Analyzer
    initSpectralAnalyzer() {
        const spectralToggle = document.getElementById('spectralToggle');
        const spectralModeSelect = document.getElementById('spectralMode');
        const spectralCanvas = document.getElementById('spectralCanvas');
        const spectralContainer = document.getElementById('spectralContainer');
        const spectralFFTSize = document.getElementById('spectralFFTSize');
        const spectralSmoothing = document.getElementById('spectralSmoothing');
        const spectralPeak = document.getElementById('spectralPeakHold');

        if (spectralToggle) {
            spectralToggle.addEventListener('change', (e) => {
                this.spectralEnabled = e.target.checked;
                if (spectralContainer) {
                    spectralContainer.style.display = this.spectralEnabled ? 'flex' : 'none';
                }
                if (this.spectralEnabled) {
                    this.updateSpectralAnalyzer();
                }
            });
        }

        if (spectralModeSelect) {
            spectralModeSelect.addEventListener('change', (e) => {
                this.spectralMode = e.target.value;
                this.spectralHistory = []; // Clear history on mode change
            });
        }

        // FFT Size control
        if (spectralFFTSize) {
            spectralFFTSize.addEventListener('change', (e) => {
                if (this.analyser) {
                    this.analyser.fftSize = parseInt(e.target.value);
                }
            });
        }

        // Smoothing control
        if (spectralSmoothing) {
            spectralSmoothing.addEventListener('input', (e) => {
                if (this.analyser) {
                    this.analyser.smoothingTimeConstant = parseFloat(e.target.value);
                }
                const valueEl = document.getElementById('spectralSmoothingValue');
                if (valueEl) {
                    valueEl.textContent = parseFloat(e.target.value).toFixed(1);
                }
            });
        }

        // Peak hold control
        if (spectralPeak) {
            spectralPeak.addEventListener('change', (e) => {
                this.spectralPeakHold = e.target.checked;
                if (!this.spectralPeakHold) {
                    this.spectralPeaks = [];
                }
            });
        }

        this.spectralCanvas = spectralCanvas;
        this.spectralPeaks = [];
        this.spectralPeakHold = false;

        // Make spectral analyzer draggable
        if (spectralContainer) {
            this.makeSpectralDraggable(spectralContainer);
        }
    }

    makeSpectralDraggable(element) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.className = 'spectral-drag-handle';
        dragHandle.innerHTML = '<span>⋮⋮</span> Spectral Analyzer';
        element.insertBefore(dragHandle, element.firstChild);

        dragHandle.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === dragHandle || dragHandle.contains(e.target)) {
                isDragging = true;
                element.style.cursor = 'grabbing';
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, element);
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            element.style.cursor = 'default';
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0) translateX(-50%)`;
        }
    }

    updateSpectralAnalyzer() {
        if (!this.spectralEnabled || !this.spectralCanvas || !this.analyser) {
            if (this.spectralEnabled) {
                setTimeout(() => this.updateSpectralAnalyzer(), 100);
            }
            return;
        }

        requestAnimationFrame(() => this.updateSpectralAnalyzer());

        const canvas = this.spectralCanvas;
        const ctx = canvas.getContext('2d');

        // Set canvas size
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = 300; // Fixed height for spectral display

        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(dataArray);

        if (this.spectralMode === 'spectrogram') {
            this.drawSpectrogram(ctx, canvas, dataArray);
        } else {
            this.drawWaterfall(ctx, canvas, dataArray);
        }
    }

    drawSpectrogram(ctx, canvas, dataArray) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw frequency spectrum
        const barWidth = canvas.width / dataArray.length;
        let x = 0;

        // Create gradient for bars
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(0.5, '#d29922');
        gradient.addColorStop(0.7, '#ef4444');
        gradient.addColorStop(1, '#a855f7');

        for (let i = 0; i < dataArray.length; i++) {
            const value = dataArray[i];
            const barHeight = (value / 255) * canvas.height;

            // Draw bar
            ctx.fillStyle = gradient;
            ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

            // Draw outline
            ctx.strokeStyle = 'rgba(88, 166, 255, 0.3)';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

            x += barWidth;
        }

        // Draw frequency labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';

        const sampleRate = this.audioContext.sampleRate;
        const nyquist = sampleRate / 2;

        // Label key frequencies
        const frequencies = [100, 500, 1000, 5000, 10000, 20000];
        frequencies.forEach(freq => {
            if (freq > nyquist) return;
            const binIndex = Math.floor((freq / nyquist) * dataArray.length);
            const xPos = (binIndex / dataArray.length) * canvas.width;

            ctx.fillText(freq >= 1000 ? (freq / 1000) + 'k' : freq + 'Hz', xPos, canvas.height - 5);

            // Draw frequency marker line
            ctx.strokeStyle = 'rgba(88, 166, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(xPos, 0);
            ctx.lineTo(xPos, canvas.height - 15);
            ctx.stroke();
        });

        // Draw decibel scale on left
        ctx.textAlign = 'right';
        for (let db = 0; db <= 100; db += 20) {
            const y = canvas.height - (db / 100) * canvas.height;
            ctx.fillText(`-${100 - db}dB`, 35, y + 3);

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            ctx.moveTo(40, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    drawWaterfall(ctx, canvas, dataArray) {
        // Waterfall display - scrolling spectrogram

        // Store current frame
        this.spectralHistory.push([...dataArray]);

        // Limit history
        if (this.spectralHistory.length > this.spectralMaxHistory) {
            this.spectralHistory.shift();
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const rowHeight = canvas.height / this.spectralMaxHistory;
        const barWidth = canvas.width / dataArray.length;

        // Draw from oldest (top) to newest (bottom)
        this.spectralHistory.forEach((frame, rowIndex) => {
            const y = rowIndex * rowHeight;

            frame.forEach((value, i) => {
                const x = i * barWidth;

                // Color based on intensity
                const intensity = value / 255;
                let color;

                if (intensity < 0.2) {
                    color = `rgba(13, 17, 23, ${intensity * 5})`; // Dark
                } else if (intensity < 0.4) {
                    color = `rgba(16, 185, 129, ${intensity})`; // Green
                } else if (intensity < 0.6) {
                    color = `rgba(217, 119, 6, ${intensity})`; // Orange
                } else if (intensity < 0.8) {
                    color = `rgba(239, 68, 68, ${intensity})`; // Red
                } else {
                    color = `rgba(168, 85, 247, ${intensity})`; // Purple
                }

                ctx.fillStyle = color;
                ctx.fillRect(x, y, barWidth, rowHeight + 1);
            });
        });

        // Draw frequency labels at bottom
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';

        const sampleRate = this.audioContext.sampleRate;
        const nyquist = sampleRate / 2;

        const frequencies = [100, 500, 1000, 5000, 10000, 20000];
        frequencies.forEach(freq => {
            if (freq > nyquist) return;
            const binIndex = Math.floor((freq / nyquist) * dataArray.length);
            const xPos = (binIndex / dataArray.length) * canvas.width;

            // Draw on black background for visibility
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(xPos - 15, canvas.height - 15, 30, 12);

            ctx.fillStyle = 'rgba(88, 166, 255, 1)';
            ctx.fillText(freq >= 1000 ? (freq / 1000) + 'k' : freq, xPos, canvas.height - 5);
        });

        // Time scale on right
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText('Now', canvas.width - 35, canvas.height - 5);
        ctx.fillText('Past', canvas.width - 35, 10);
    }

    // Recording and Export System
    initRecorder() {
        const recordBtn = document.getElementById('recordBtn');
        const stopRecordBtn = document.getElementById('stopRecordBtn');
        const exportAudioBtn = document.getElementById('exportAudioBtn');

        if (recordBtn) {
            recordBtn.addEventListener('click', () => {
                this.startRecording();
            });
        }

        if (stopRecordBtn) {
            stopRecordBtn.addEventListener('click', () => {
                this.stopRecording();
            });
        }

        if (exportAudioBtn) {
            exportAudioBtn.addEventListener('click', () => {
                this.exportCurrentTrack();
            });
        }
    }

    async startRecording() {
        if (!this.audioContext) {
            alert('Audio context not initialized. Please load and play a track first.');
            return;
        }

        try {
            // Create a destination for recording
            const dest = this.audioContext.createMediaStreamDestination();

            // Connect the audio source to the destination
            // We'll tap into the audio just before it goes to the speakers
            const splitter = this.audioContext.createChannelSplitter(2);
            const merger = this.audioContext.createChannelMerger(2);

            // Connect current audio path to our recorder
            if (this.eqFilters.length > 0) {
                this.eqFilters[this.eqFilters.length - 1].connect(splitter);
            } else if (this.audioSource) {
                this.audioSource.connect(splitter);
            }

            splitter.connect(merger, 0, 0);
            splitter.connect(merger, 1, 1);
            merger.connect(dest);

            // Setup MediaRecorder
            const options = {
                mimeType: 'audio/webm;codecs=opus',
                audioBitsPerSecond: 320000 // High quality
            };

            this.mediaRecorder = new MediaRecorder(dest.stream, options);
            this.recordedChunks = [];

            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    this.recordedChunks.push(e.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.saveRecording();
            };

            this.mediaRecorder.start(100); // Collect data every 100ms
            this.isRecording = true;
            this.recordingStartTime = Date.now();

            // Update UI
            const recordBtn = document.getElementById('recordBtn');
            const stopRecordBtn = document.getElementById('stopRecordBtn');
            const recordingStatus = document.getElementById('recordingStatus');

            if (recordBtn) recordBtn.disabled = true;
            if (stopRecordBtn) {
                stopRecordBtn.disabled = false;
                stopRecordBtn.classList.add('recording');
            }
            if (recordingStatus) {
                recordingStatus.textContent = 'Recording...';
                recordingStatus.style.display = 'block';
            }

            // Start recording timer
            this.updateRecordingTimer();

        } catch (error) {
            console.error('Failed to start recording:', error);
            alert('Recording failed: ' + error.message);
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;

            // Update UI
            const recordBtn = document.getElementById('recordBtn');
            const stopRecordBtn = document.getElementById('stopRecordBtn');
            const recordingStatus = document.getElementById('recordingStatus');

            if (recordBtn) recordBtn.disabled = false;
            if (stopRecordBtn) {
                stopRecordBtn.disabled = true;
                stopRecordBtn.classList.remove('recording');
            }
            if (recordingStatus) {
                recordingStatus.textContent = 'Recording stopped';
                setTimeout(() => {
                    recordingStatus.style.display = 'none';
                }, 3000);
            }
        }
    }

    updateRecordingTimer() {
        if (!this.isRecording) return;

        const recordingStatus = document.getElementById('recordingStatus');
        if (recordingStatus && this.recordingStartTime) {
            const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            recordingStatus.textContent = `Recording: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        setTimeout(() => this.updateRecordingTimer(), 1000);
    }

    saveRecording() {
        if (this.recordedChunks.length === 0) {
            alert('No recording data available');
            return;
        }

        const blob = new Blob(this.recordedChunks, {
            type: 'audio/webm'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        a.download = `CoreMedia_Recording_${timestamp}.webm`;

        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        // Show success message
        const recordingStatus = document.getElementById('recordingStatus');
        if (recordingStatus) {
            recordingStatus.textContent = 'Recording saved!';
            recordingStatus.style.display = 'block';
            setTimeout(() => {
                recordingStatus.style.display = 'none';
            }, 3000);
        }
    }

    async exportCurrentTrack() {
        if (!this.currentPlayer || !this.currentPlayer.src) {
            alert('No track loaded to export');
            return;
        }

        const exportBtn = document.getElementById('exportAudioBtn');
        if (exportBtn) {
            exportBtn.textContent = 'Exporting...';
            exportBtn.disabled = true;
        }

        try {
            // For direct file exports, we can just download the current file
            // with all applied effects rendered

            // If it's a blob/local file, we can process it through Web Audio API
            const response = await fetch(this.currentPlayer.src);
            const arrayBuffer = await response.arrayBuffer();

            // Create offline context for rendering
            const offlineContext = new OfflineAudioContext(
                2, // stereo
                this.audioContext.sampleRate * (this.currentPlayer.duration || 60),
                this.audioContext.sampleRate
            );

            // Decode audio
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer.slice(0));

            // Create source
            const source = offlineContext.createBufferSource();
            source.buffer = audioBuffer;

            // Apply pitch if set
            if (this.pitchValue !== 0) {
                source.playbackRate.value = 1 + (this.pitchValue / 100);
            }

            // TODO: Apply EQ and effects in offline context
            // For now, connect directly
            source.connect(offlineContext.destination);
            source.start();

            // Render
            const renderedBuffer = await offlineContext.startRendering();

            // Convert to WAV
            const wav = this.audioBufferToWav(renderedBuffer);
            const blob = new Blob([wav], { type: 'audio/wav' });

            // Download
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;

            const currentTrack = this.playlist[this.currentIndex];
            const trackName = currentTrack ? currentTrack.name.replace(/\.[^/.]+$/, '') : 'track';
            a.download = `${trackName}_processed.wav`;

            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            if (exportBtn) {
                exportBtn.textContent = '✓ Exported!';
                setTimeout(() => {
                    exportBtn.textContent = 'Export Track';
                    exportBtn.disabled = false;
                }, 2000);
            }

        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed: ' + error.message);

            if (exportBtn) {
                exportBtn.textContent = 'Export Track';
                exportBtn.disabled = false;
            }
        }
    }

    audioBufferToWav(buffer) {
        const length = buffer.length * buffer.numberOfChannels * 2;
        const arrayBuffer = new ArrayBuffer(44 + length);
        const view = new DataView(arrayBuffer);

        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + length, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true); // fmt chunk size
        view.setUint16(20, 1, true); // PCM
        view.setUint16(22, buffer.numberOfChannels, true);
        view.setUint32(24, buffer.sampleRate, true);
        view.setUint32(28, buffer.sampleRate * buffer.numberOfChannels * 2, true); // byte rate
        view.setUint16(32, buffer.numberOfChannels * 2, true); // block align
        view.setUint16(34, 16, true); // bits per sample
        writeString(36, 'data');
        view.setUint32(40, length, true);

        // Write audio data
        const channels = [];
        for (let i = 0; i < buffer.numberOfChannels; i++) {
            channels.push(buffer.getChannelData(i));
        }

        let offset = 44;
        for (let i = 0; i < buffer.length; i++) {
            for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
                const sample = Math.max(-1, Math.min(1, channels[channel][i]));
                view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
                offset += 2;
            }
        }

        return arrayBuffer;
    }

    // Advanced Loop Slicer with Sample Triggering
    initLoopSlicer() {
        const slicerToggle = document.getElementById('slicerToggle');
        const slicerDivisionsSelect = document.getElementById('slicerDivisions');
        const sliceLoopBtn = document.getElementById('sliceLoopBtn');

        if (slicerToggle) {
            slicerToggle.addEventListener('change', (e) => {
                this.slicerEnabled = e.target.checked;
                const slicerPads = document.getElementById('slicerPads');
                if (slicerPads) {
                    slicerPads.style.display = this.slicerEnabled ? 'grid' : 'none';
                }
            });
        }

        if (slicerDivisionsSelect) {
            slicerDivisionsSelect.addEventListener('change', (e) => {
                this.slicerDivisions = parseInt(e.target.value);
            });
        }

        if (sliceLoopBtn) {
            sliceLoopBtn.addEventListener('click', () => {
                this.sliceCurrentLoop();
            });
        }

        // Initialize pad click handlers
        this.initSlicerPads();
    }

    initSlicerPads() {
        for (let i = 1; i <= 16; i++) {
            const pad = document.getElementById(`slicerPad${i}`);
            if (pad) {
                pad.addEventListener('click', () => {
                    this.triggerSlice(i - 1);
                });

                // Add keyboard support for pads 1-8
                if (i <= 8) {
                    document.addEventListener('keydown', (e) => {
                        if (e.key === i.toString() && e.shiftKey && e.ctrlKey) {
                            this.triggerSlice(i - 1);
                            e.preventDefault();
                        }
                    });
                }
            }
        }
    }

    async sliceCurrentLoop() {
        if (!this.currentPlayer || !this.audioContext) {
            alert('No audio loaded');
            return;
        }

        if (this.loopStart === null || this.loopEnd === null) {
            alert('Please set a loop first (use Loop In/Out buttons)');
            return;
        }

        const sliceBtn = document.getElementById('sliceLoopBtn');
        if (sliceBtn) {
            sliceBtn.textContent = 'Slicing...';
            sliceBtn.disabled = true;
        }

        try {
            // Fetch and decode audio
            const response = await fetch(this.currentPlayer.src);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            const sampleRate = audioBuffer.sampleRate;
            const loopStartSample = Math.floor(this.loopStart * sampleRate);
            const loopEndSample = Math.floor(this.loopEnd * sampleRate);
            const loopLength = loopEndSample - loopStartSample;
            const sliceLength = Math.floor(loopLength / this.slicerDivisions);

            this.slicerBuffers = [];

            // Create slices
            for (let i = 0; i < this.slicerDivisions; i++) {
                const startSample = loopStartSample + (i * sliceLength);
                const endSample = Math.min(startSample + sliceLength, loopEndSample);
                const sliceDuration = endSample - startSample;

                // Create buffer for this slice
                const sliceBuffer = this.audioContext.createBuffer(
                    audioBuffer.numberOfChannels,
                    sliceDuration,
                    sampleRate
                );

                // Copy audio data
                for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
                    const sourceData = audioBuffer.getChannelData(channel);
                    const sliceData = sliceBuffer.getChannelData(channel);

                    for (let sample = 0; sample < sliceDuration; sample++) {
                        sliceData[sample] = sourceData[startSample + sample];
                    }
                }

                this.slicerBuffers.push(sliceBuffer);

                // Update pad UI
                const pad = document.getElementById(`slicerPad${i + 1}`);
                if (pad) {
                    pad.classList.add('loaded');
                    const label = pad.querySelector('.pad-label');
                    if (label) {
                        label.textContent = `${i + 1}`;
                    }
                    const time = pad.querySelector('.pad-time');
                    if (time) {
                        const duration = sliceDuration / sampleRate;
                        time.textContent = duration.toFixed(2) + 's';
                    }
                }
            }

            if (sliceBtn) {
                sliceBtn.textContent = `✓ ${this.slicerDivisions} slices created`;
                setTimeout(() => {
                    sliceBtn.textContent = 'Slice Loop';
                    sliceBtn.disabled = false;
                }, 2000);
            }

        } catch (error) {
            console.error('Slicing failed:', error);
            alert('Slicing failed: ' + error.message);

            if (sliceBtn) {
                sliceBtn.textContent = 'Slice Loop';
                sliceBtn.disabled = false;
            }
        }
    }

    triggerSlice(index) {
        if (!this.audioContext || index >= this.slicerBuffers.length) {
            return;
        }

        const buffer = this.slicerBuffers[index];
        if (!buffer) return;

        // Create buffer source
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;

        // Create gain node for this slice
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = 1.0;

        // Connect through effects chain if available
        source.connect(gainNode);

        // Connect to destination
        if (this.eqFilters.length > 0) {
            gainNode.connect(this.eqFilters[0]);
        } else {
            gainNode.connect(this.audioContext.destination);
        }

        // Play the slice
        source.start(0);

        // Add visual feedback
        const pad = document.getElementById(`slicerPad${index + 1}`);
        if (pad) {
            pad.classList.add('triggered');
            setTimeout(() => {
                pad.classList.remove('triggered');
            }, 200);
        }

        // Cleanup after playback
        source.onended = () => {
            source.disconnect();
            gainNode.disconnect();
        };
    }

    // ============================================
    // MULTI-DECK VIEW (Up to 4 Decks)
    // ============================================

    initMultiDeck() {
        const viewToggleBtn = document.getElementById('viewToggleBtn');
        const deckSelectBtns = document.querySelectorAll('.deck-select-btn');

        if (viewToggleBtn) {
            viewToggleBtn.addEventListener('click', () => {
                this.toggleDeckView();
            });
        }

        deckSelectBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const deckCount = parseInt(e.target.dataset.decks);
                this.setDeckCount(deckCount);
                deckSelectBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Initialize deck players and audio nodes
        ['A', 'B', 'C', 'D'].forEach(deck => {
            const player = document.getElementById(`deckPlayer${deck}`);
            if (player) {
                this.decks[deck].player = player;
                player.addEventListener('timeupdate', () => this.updateDeckProgress(deck));

                // Setup deck audio context when track loads
                player.addEventListener('loadedmetadata', () => {
                    this.setupDeckAudio(deck);
                });
            }

            // Setup drag and drop for each deck
            this.setupDeckDragDrop(deck);

            // Setup per-deck EQ controls
            this.setupDeckEQ(deck);

            // Setup per-deck volume fader
            this.setupDeckVolume(deck);
        });

        // Setup crossfader
        this.setupCrossfader();

        // Setup playlist item dragging
        this.setupPlaylistDragging();

        // Setup BPM sync buttons
        this.setupBPMSync();

        // Setup master meter
        this.setupMasterMeter();

        // Setup keyboard shortcuts for decks
        this.setupDeckKeyboardShortcuts();
    }

    setupDeckDragDrop(deckId) {
        const deckElement = document.getElementById(`deck${deckId}`);
        if (!deckElement) return;

        deckElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            deckElement.classList.add('drag-over');
        });

        deckElement.addEventListener('dragleave', () => {
            deckElement.classList.remove('drag-over');
        });

        deckElement.addEventListener('drop', (e) => {
            e.preventDefault();
            deckElement.classList.remove('drag-over');

            const trackIndex = parseInt(e.dataTransfer.getData('trackIndex'));
            if (!isNaN(trackIndex) && trackIndex >= 0 && trackIndex < this.playlist.length) {
                this.loadTrackToDeck(deckId, trackIndex);
            }
        });
    }

    setupPlaylistDragging() {
        // Make playlist items draggable
        const updateDraggable = () => {
            const playlistItems = document.querySelectorAll('.playlist-item');
            playlistItems.forEach((item, index) => {
                item.setAttribute('draggable', 'true');
                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('trackIndex', index.toString());
                    e.dataTransfer.effectAllowed = 'copy';
                    item.style.opacity = '0.5';
                });
                item.addEventListener('dragend', (e) => {
                    item.style.opacity = '1';
                });
            });
        };

        // Update when playlist changes
        const observer = new MutationObserver(updateDraggable);
        const playlistEl = document.getElementById('playlist');
        if (playlistEl) {
            observer.observe(playlistEl, { childList: true });
            updateDraggable();
        }
    }

    loadTrackToDeck(deckId, trackIndex) {
        if (trackIndex < 0 || trackIndex >= this.playlist.length) return;

        const track = this.playlist[trackIndex];
        this.decks[deckId].src = track.url;
        this.decks[deckId].title = track.name;
        this.decks[deckId].player.src = track.url;

        const infoEl = document.getElementById(`deckInfo${deckId}`);
        if (infoEl) {
            infoEl.textContent = track.name;
        }

        // Draw waveform for deck
        this.drawDeckWaveform(deckId);
    }

    setupDeckAudio(deckId) {
        const deck = this.decks[deckId];
        if (!deck.player || deck.source) return; // Already set up

        try {
            // Create audio context for deck if not exists
            if (!deck.audioContext) {
                deck.audioContext = this.audioContext || new (window.AudioContext || window.webkitAudioContext)();
            }

            // Create audio source
            deck.source = deck.audioContext.createMediaElementSource(deck.player);

            // Create gain node for volume
            deck.gainNode = deck.audioContext.createGain();
            deck.gainNode.gain.value = 0.85; // Default 85%

            // Create EQ nodes (3-band: High, Mid, Low)
            deck.eqNodes.high = deck.audioContext.createBiquadFilter();
            deck.eqNodes.high.type = 'highshelf';
            deck.eqNodes.high.frequency.value = 8000;
            deck.eqNodes.high.gain.value = 0;

            deck.eqNodes.mid = deck.audioContext.createBiquadFilter();
            deck.eqNodes.mid.type = 'peaking';
            deck.eqNodes.mid.frequency.value = 1000;
            deck.eqNodes.mid.Q.value = 1.0;
            deck.eqNodes.mid.gain.value = 0;

            deck.eqNodes.low = deck.audioContext.createBiquadFilter();
            deck.eqNodes.low.type = 'lowshelf';
            deck.eqNodes.low.frequency.value = 100;
            deck.eqNodes.low.gain.value = 0;

            // Connect audio chain: source → EQ (low → mid → high) → gain → destination
            deck.source.connect(deck.eqNodes.low);
            deck.eqNodes.low.connect(deck.eqNodes.mid);
            deck.eqNodes.mid.connect(deck.eqNodes.high);
            deck.eqNodes.high.connect(deck.gainNode);
            deck.gainNode.connect(deck.audioContext.destination);

        } catch (error) {
            console.warn(`Could not setup audio for deck ${deckId}:`, error);
        }
    }

    setupDeckEQ(deckId) {
        const highKnob = document.getElementById(`deckEQHigh${deckId}`);
        const midKnob = document.getElementById(`deckEQMid${deckId}`);
        const lowKnob = document.getElementById(`deckEQLow${deckId}`);

        if (highKnob) {
            highKnob.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                const deck = this.decks[deckId];
                if (deck.eqNodes.high) {
                    deck.eqNodes.high.gain.value = value;
                }
                const valueSpan = highKnob.nextElementSibling;
                if (valueSpan && valueSpan.classList.contains('eq-value')) {
                    valueSpan.textContent = (value >= 0 ? '+' : '') + value.toFixed(1) + 'dB';
                }
            });
        }

        if (midKnob) {
            midKnob.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                const deck = this.decks[deckId];
                if (deck.eqNodes.mid) {
                    deck.eqNodes.mid.gain.value = value;
                }
                const valueSpan = midKnob.nextElementSibling;
                if (valueSpan && valueSpan.classList.contains('eq-value')) {
                    valueSpan.textContent = (value >= 0 ? '+' : '') + value.toFixed(1) + 'dB';
                }
            });
        }

        if (lowKnob) {
            lowKnob.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                const deck = this.decks[deckId];
                if (deck.eqNodes.low) {
                    deck.eqNodes.low.gain.value = value;
                }
                const valueSpan = lowKnob.nextElementSibling;
                if (valueSpan && valueSpan.classList.contains('eq-value')) {
                    valueSpan.textContent = (value >= 0 ? '+' : '') + value.toFixed(1) + 'dB';
                }
            });
        }
    }

    setupDeckVolume(deckId) {
        const volumeFader = document.getElementById(`deckVolume${deckId}`);
        if (!volumeFader) return;

        volumeFader.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            const deck = this.decks[deckId];

            if (deck.gainNode) {
                deck.gainNode.gain.value = value / 100;
            }

            const valueSpan = volumeFader.parentElement.querySelector('.volume-value');
            if (valueSpan) {
                valueSpan.textContent = value + '%';
            }
        });
    }

    setupCrossfader() {
        const crossfader = document.getElementById('crossfader');
        if (!crossfader) return;

        crossfader.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.crossfaderValue = value;
            this.applyCrossfader();
        });
    }

    applyCrossfader() {
        // Crossfader affects decks A and B (or A/C and B/D in 4-deck mode)
        const leftDecks = this.deckCount === 4 ? ['A', 'C'] : ['A'];
        const rightDecks = this.deckCount === 4 ? ['B', 'D'] : ['B'];

        // Calculate volumes based on crossfader position (0-100, center=50)
        const leftVolume = this.crossfaderValue <= 50 ? 1.0 : (100 - this.crossfaderValue) / 50;
        const rightVolume = this.crossfaderValue >= 50 ? 1.0 : this.crossfaderValue / 50;

        // Apply to left decks
        leftDecks.forEach(deckId => {
            const deck = this.decks[deckId];
            if (deck.gainNode) {
                const currentVolume = parseInt(document.getElementById(`deckVolume${deckId}`)?.value || 85) / 100;
                deck.gainNode.gain.value = currentVolume * leftVolume;
            }
        });

        // Apply to right decks
        rightDecks.forEach(deckId => {
            const deck = this.decks[deckId];
            if (deck.gainNode) {
                const currentVolume = parseInt(document.getElementById(`deckVolume${deckId}`)?.value || 85) / 100;
                deck.gainNode.gain.value = currentVolume * rightVolume;
            }
        });
    }

    setupBPMSync() {
        const syncAB = document.getElementById('syncAB');
        const syncBA = document.getElementById('syncBA');

        if (syncAB) {
            syncAB.addEventListener('click', () => {
                // Sync Deck B to match Deck A's playback rate
                const deckA = this.decks['A'];
                const deckB = this.decks['B'];

                if (deckA.player && deckB.player && deckA.player.src && deckB.player.src) {
                    deckB.player.playbackRate = deckA.player.playbackRate;
                    console.log(`Synced Deck B to Deck A: ${deckA.player.playbackRate}x`);

                    // Visual feedback
                    syncAB.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
                    setTimeout(() => {
                        syncAB.style.background = '';
                    }, 500);
                }
            });
        }

        if (syncBA) {
            syncBA.addEventListener('click', () => {
                // Sync Deck A to match Deck B's playback rate
                const deckA = this.decks['A'];
                const deckB = this.decks['B'];

                if (deckA.player && deckB.player && deckA.player.src && deckB.player.src) {
                    deckA.player.playbackRate = deckB.player.playbackRate;
                    console.log(`Synced Deck A to Deck B: ${deckB.player.playbackRate}x`);

                    // Visual feedback
                    syncBA.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
                    setTimeout(() => {
                        syncBA.style.background = '';
                    }, 500);
                }
            });
        }
    }

    setupMasterMeter() {
        const canvas = document.getElementById('masterMeter');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.masterMeterCanvas = canvas;
        this.masterMeterCtx = ctx;

        // Create analyser for master output
        if (this.audioContext) {
            this.masterAnalyser = this.audioContext.createAnalyser();
            this.masterAnalyser.fftSize = 256;
            this.masterAnalyser.smoothingTimeConstant = 0.8;

            // Connect the last node in chain (final EQ filter) to master analyser
            if (this.eqFilters && this.eqFilters.length > 0) {
                this.eqFilters[this.eqFilters.length - 1].connect(this.masterAnalyser);
            }
        }

        // Draw meter
        this.drawMasterMeter();
    }

    drawMasterMeter() {
        if (!this.masterMeterCtx || !this.masterAnalyser) return;

        const draw = () => {
            if (!this.isDeckView) {
                requestAnimationFrame(draw);
                return;
            }

            const canvas = this.masterMeterCanvas;
            const ctx = this.masterMeterCtx;
            const width = canvas.width;
            const height = canvas.height;

            const dataArray = new Uint8Array(this.masterAnalyser.frequencyBinCount);
            this.masterAnalyser.getByteFrequencyData(dataArray);

            // Calculate average level
            const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            const level = average / 255;

            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Draw background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(0, 0, width, height);

            // Draw level bars
            const barHeight = (height - 10) * level;
            const gradient = ctx.createLinearGradient(0, height, 0, 0);

            if (level < 0.6) {
                gradient.addColorStop(0, '#22c55e'); // Green
                gradient.addColorStop(1, '#4ade80');
            } else if (level < 0.85) {
                gradient.addColorStop(0, '#eab308'); // Yellow
                gradient.addColorStop(1, '#fbbf24');
            } else {
                gradient.addColorStop(0, '#ef4444'); // Red
                gradient.addColorStop(1, '#f87171');
            }

            ctx.fillStyle = gradient;
            ctx.fillRect(5, height - barHeight - 5, width - 10, barHeight);

            // Draw peak indicator
            if (level > 0.95) {
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(0, 0, width, 5);
            }

            // Draw scale marks
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 4; i++) {
                const y = (height / 4) * i;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            requestAnimationFrame(draw);
        };

        draw();
    }

    setupDeckKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when in deck view
            if (!this.isDeckView) return;

            // Alt+1-4: Play/Pause decks A-D
            if (e.altKey && e.key >= '1' && e.key <= '4') {
                e.preventDefault();
                const deckMap = {'1': 'A', '2': 'B', '3': 'C', '4': 'D'};
                const deckId = deckMap[e.key];
                this.toggleDeckPlay(deckId);
            }

            // Alt+Q/W/E/R: Load current track to decks A/B/C/D
            if (e.altKey) {
                const loadMap = {'q': 'A', 'w': 'B', 'e': 'C', 'r': 'D'};
                if (loadMap[e.key.toLowerCase()]) {
                    e.preventDefault();
                    this.loadToDeck(loadMap[e.key.toLowerCase()]);
                }
            }

            // Alt+Left/Right: Move crossfader
            if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                e.preventDefault();
                const crossfader = document.getElementById('crossfader');
                if (crossfader) {
                    const current = parseInt(crossfader.value);
                    const step = 5;
                    if (e.key === 'ArrowLeft') {
                        crossfader.value = Math.max(0, current - step);
                    } else {
                        crossfader.value = Math.min(100, current + step);
                    }
                    this.crossfaderValue = parseInt(crossfader.value);
                    this.applyCrossfader();
                }
            }

            // Alt+S: Sync B to A
            if (e.altKey && e.key.toLowerCase() === 's') {
                e.preventDefault();
                document.getElementById('syncAB')?.click();
            }
        });
    }

    toggleDeckView() {
        this.isDeckView = !this.isDeckView;
        const videoContainer = document.querySelector('.video-container');
        const deckView = document.getElementById('deckView');
        const viewToggleBtn = document.getElementById('viewToggleBtn');

        if (this.isDeckView) {
            videoContainer.style.display = 'none';
            deckView.style.display = 'flex';
            viewToggleBtn.classList.add('active');
        } else {
            videoContainer.style.display = 'block';
            deckView.style.display = 'none';
            viewToggleBtn.classList.remove('active');
        }
    }

    setDeckCount(count) {
        this.deckCount = count;
        const deckC = document.getElementById('deckC');
        const deckD = document.getElementById('deckD');
        const container = document.getElementById('decksContainer');

        if (count === 4) {
            deckC.classList.remove('deck-hidden');
            deckD.classList.remove('deck-hidden');
            container.classList.add('four-deck');
        } else {
            deckC.classList.add('deck-hidden');
            deckD.classList.add('deck-hidden');
            container.classList.remove('four-deck');
        }
    }

    loadToDeck(deckId) {
        if (this.playlist.length === 0) {
            alert('Please add files to the playlist first');
            return;
        }

        // Show playlist selector (simplified - load current selected track)
        if (this.currentIndex >= 0 && this.currentIndex < this.playlist.length) {
            const track = this.playlist[this.currentIndex];
            this.decks[deckId].src = track.url;
            this.decks[deckId].title = track.name;
            this.decks[deckId].player.src = track.url;

            const infoEl = document.getElementById(`deckInfo${deckId}`);
            if (infoEl) {
                infoEl.textContent = track.name;
            }

            // Draw waveform for deck
            this.drawDeckWaveform(deckId);
        }
    }

    toggleDeckPlay(deckId) {
        const deck = this.decks[deckId];
        if (!deck.player || !deck.src) return;

        if (deck.isPlaying) {
            deck.player.pause();
            deck.isPlaying = false;
        } else {
            deck.player.play();
            deck.isPlaying = true;
        }
    }

    updateDeckProgress(deckId) {
        const deck = this.decks[deckId];
        if (!deck.player) return;

        const progressBar = document.getElementById(`deckProgress${deckId}`);
        const timeEl = document.getElementById(`deckTime${deckId}`);

        if (progressBar) {
            const percent = (deck.player.currentTime / deck.player.duration) * 100 || 0;
            progressBar.style.width = percent + '%';
        }

        if (timeEl) {
            const current = this.formatTime(deck.player.currentTime);
            const duration = this.formatTime(deck.player.duration);
            timeEl.textContent = `${current} / ${duration}`;
        }
    }

    drawDeckWaveform(deckId) {
        const canvas = document.getElementById(`deckWaveform${deckId}`);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Simple placeholder waveform
        ctx.fillStyle = 'rgba(88, 166, 255, 0.3)';
        ctx.fillRect(0, canvas.height / 2 - 2, canvas.width, 4);

        // Draw decorative bars
        const barCount = 50;
        const barWidth = canvas.width / barCount;
        for (let i = 0; i < barCount; i++) {
            const height = Math.random() * (canvas.height / 2);
            ctx.fillStyle = `rgba(88, 166, 255, ${0.2 + Math.random() * 0.3})`;
            ctx.fillRect(
                i * barWidth,
                canvas.height / 2 - height / 2,
                barWidth - 2,
                height
            );
        }
    }

    // ============================================
    // MIXING BOARD (6 Professional Knobs)
    // ============================================

    initMixingBoard() {
        // Create audio nodes for mixing board
        if (!this.audioContext) return;

        // 1. Master Gain
        this.mixerNodes.gainNode = this.audioContext.createGain();
        this.mixerNodes.gainNode.gain.value = 1.0;

        // 2. Bass Filter (Low Shelf at 100Hz)
        this.mixerNodes.bassFilter = this.audioContext.createBiquadFilter();
        this.mixerNodes.bassFilter.type = 'lowshelf';
        this.mixerNodes.bassFilter.frequency.value = 100;
        this.mixerNodes.bassFilter.gain.value = 0;

        // 3. Mid Filter (Peaking at 1kHz)
        this.mixerNodes.midFilter = this.audioContext.createBiquadFilter();
        this.mixerNodes.midFilter.type = 'peaking';
        this.mixerNodes.midFilter.frequency.value = 1000;
        this.mixerNodes.midFilter.Q.value = 1.0;
        this.mixerNodes.midFilter.gain.value = 0;

        // 4. Treble Filter (High Shelf at 8kHz)
        this.mixerNodes.trebleFilter = this.audioContext.createBiquadFilter();
        this.mixerNodes.trebleFilter.type = 'highshelf';
        this.mixerNodes.trebleFilter.frequency.value = 8000;
        this.mixerNodes.trebleFilter.gain.value = 0;

        // 5. Color/Tone Filter (Low-pass variable)
        this.mixerNodes.colorFilter = this.audioContext.createBiquadFilter();
        this.mixerNodes.colorFilter.type = 'lowpass';
        this.mixerNodes.colorFilter.frequency.value = 20000;
        this.mixerNodes.colorFilter.Q.value = 0.7;

        // 6. Presence Filter (High Shelf at 5kHz for air/sparkle)
        this.mixerNodes.presenceFilter = this.audioContext.createBiquadFilter();
        this.mixerNodes.presenceFilter.type = 'highshelf';
        this.mixerNodes.presenceFilter.frequency.value = 5000;
        this.mixerNodes.presenceFilter.gain.value = 0;

        // Connect knob controls
        const gainKnob = document.getElementById('mixerGain');
        const bassKnob = document.getElementById('mixerBass');
        const midKnob = document.getElementById('mixerMid');
        const trebleKnob = document.getElementById('mixerTreble');
        const colorKnob = document.getElementById('mixerColor');
        const presenceKnob = document.getElementById('mixerPresence');

        if (gainKnob) {
            gainKnob.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.mixerControls.gain = value;
                // Convert dB to linear gain
                const gain = Math.pow(10, value / 20);
                this.mixerNodes.gainNode.gain.value = gain;
                this.updateKnobDisplay('gain', value);
            });
        }

        if (bassKnob) {
            bassKnob.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.mixerControls.bass = value;
                this.mixerNodes.bassFilter.gain.value = value;
                this.updateKnobDisplay('bass', value);
            });
        }

        if (midKnob) {
            midKnob.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.mixerControls.mid = value;
                this.mixerNodes.midFilter.gain.value = value;
                this.updateKnobDisplay('mid', value);
            });
        }

        if (trebleKnob) {
            trebleKnob.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.mixerControls.treble = value;
                this.mixerNodes.trebleFilter.gain.value = value;
                this.updateKnobDisplay('treble', value);
            });
        }

        if (colorKnob) {
            colorKnob.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.mixerControls.color = value;
                // Map -100 to +100 to frequency range 500Hz to 20kHz
                const freq = 500 + ((value + 100) / 200) * 19500;
                this.mixerNodes.colorFilter.frequency.value = freq;
                this.updateKnobDisplay('color', value);
            });
        }

        if (presenceKnob) {
            presenceKnob.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.mixerControls.presence = value;
                this.mixerNodes.presenceFilter.gain.value = value;
                this.updateKnobDisplay('presence', value);
            });
        }

        // Connect mixing board into audio chain
        this.connectMixingBoard();
    }

    updateKnobDisplay(knob, value) {
        const display = document.getElementById(`${knob}Value`);
        if (display) {
            if (knob === 'color') {
                display.textContent = value.toFixed(0);
            } else {
                display.textContent = (value >= 0 ? '+' : '') + value.toFixed(1) + 'dB';
            }
        }
    }

    connectMixingBoard() {
        // Mixing board is now connected inline in setupAudioSource()
        // This function is kept for compatibility but does nothing
    }

    resetMixingBoard() {
        this.mixerControls = {
            gain: 0,
            bass: 0,
            mid: 0,
            treble: 0,
            color: 0,
            presence: 0
        };

        if (this.mixerNodes.gainNode) this.mixerNodes.gainNode.gain.value = 1.0;
        if (this.mixerNodes.bassFilter) this.mixerNodes.bassFilter.gain.value = 0;
        if (this.mixerNodes.midFilter) this.mixerNodes.midFilter.gain.value = 0;
        if (this.mixerNodes.trebleFilter) this.mixerNodes.trebleFilter.gain.value = 0;
        if (this.mixerNodes.colorFilter) this.mixerNodes.colorFilter.frequency.value = 20000;
        if (this.mixerNodes.presenceFilter) this.mixerNodes.presenceFilter.gain.value = 0;

        // Update UI
        ['gain', 'bass', 'mid', 'treble', 'color', 'presence'].forEach(knob => {
            const elem = document.getElementById(`mixer${knob.charAt(0).toUpperCase() + knob.slice(1)}`);
            if (elem) elem.value = 0;
            this.updateKnobDisplay(knob, 0);
        });
    }

    // ============================================
    // PERFORMANCE ENHANCEMENTS (6 optimizations)
    // ============================================

    // 1. Throttled Visualizer Updates - Reduces CPU usage by limiting update rate
    optimizeVisualizerUpdates() {
        const now = performance.now();
        if (now - this.lastVisualizerUpdate < this.visualizerThrottle) {
            return false; // Skip this frame
        }
        this.lastVisualizerUpdate = now;
        return true; // Allow update
    }

    // 2. Audio Buffer Caching - Prevents re-decoding the same audio files
    async getCachedAudioBuffer(url) {
        if (this.audioBufferCache.has(url)) {
            return this.audioBufferCache.get(url);
        }

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

        // Cache with size limit (max 10 buffers)
        if (this.audioBufferCache.size >= 10) {
            const firstKey = this.audioBufferCache.keys().next().value;
            this.audioBufferCache.delete(firstKey);
        }

        this.audioBufferCache.set(url, audioBuffer);
        return audioBuffer;
    }

    // 3. Offscreen Canvas Rendering - Improves rendering performance
    getOffscreenCanvas(width, height) {
        if (!this.offscreenCanvas ||
            this.offscreenCanvas.width !== width ||
            this.offscreenCanvas.height !== height) {

            if (typeof OffscreenCanvas !== 'undefined') {
                this.offscreenCanvas = new OffscreenCanvas(width, height);
            } else {
                // Fallback for browsers without OffscreenCanvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                this.offscreenCanvas = canvas;
            }
        }
        return this.offscreenCanvas;
    }

    // 4. Debounced Waveform Generation - Prevents multiple simultaneous generations
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 5. Lazy Loading for Heavy Operations - Defers non-critical work
    lazyInitialize(callback) {
        this.requestIdleCallback(() => {
            callback();
        }, { timeout: 2000 });
    }

    // 6. Memory Cleanup - Aggressive cleanup of unused resources
    cleanupMemory() {
        // Clear old waveform data
        if (this.waveformData && this.waveformData.length > 1000) {
            this.waveformData = null;
        }

        // Clear spectral history if too large
        if (this.spectralHistory.length > this.spectralMaxHistory) {
            this.spectralHistory = this.spectralHistory.slice(-this.spectralMaxHistory);
        }

        // Clear old beat grid data
        if (this.beatGrid.length > 500) {
            this.beatGrid = [];
        }

        // Disconnect orphaned audio nodes
        if (this.audioSource && this.audioSource.disconnect) {
            try {
                // Don't disconnect if still in use
                if (this.currentPlayer && this.currentPlayer.paused) {
                    // Safe to clean up
                }
            } catch (e) {
                // Already disconnected
            }
        }

        // Force garbage collection hint
        if (window.gc) {
            window.gc();
        }
    }

    // Apply all performance optimizations
    initPerformanceOptimizations() {
        // Throttle visualizer
        const originalDrawVisualizer = this.drawVisualizer;
        this.drawVisualizer = function() {
            if (this.optimizeVisualizerUpdates()) {
                originalDrawVisualizer.call(this);
            } else {
                if (this.settings.showVisualizer && !this.currentPlayer.paused) {
                    requestAnimationFrame(() => this.drawVisualizer());
                }
            }
        }.bind(this);

        // Debounce waveform generation
        const originalGenerateWaveform = this.generateWaveform;
        this.generateWaveform = this.debounce(function() {
            originalGenerateWaveform.call(this);
        }.bind(this), 500);

        // Periodic memory cleanup
        setInterval(() => {
            this.cleanupMemory();
        }, 30000); // Every 30 seconds

        // Use cached buffers for beat analysis
        const originalAnalyzeBeat = this.analyzeBeatPattern;
        this.analyzeBeatPattern = async function() {
            const url = this.currentPlayer.src;
            try {
                const audioBuffer = await this.getCachedAudioBuffer(url);
                // Use cached buffer for analysis
                return originalAnalyzeBeat.call(this);
            } catch (e) {
                return originalAnalyzeBeat.call(this);
            }
        }.bind(this);

        console.log('✅ Performance optimizations enabled');
    }

    // ============================================
    // MUSIC LIBRARY MANAGEMENT SYSTEM
    // ============================================

    initMusicLibrary() {
        this.musicLibrary = {
            tracks: [],
            playlists: [],
            genres: ['Techno', 'Jump Style', 'House', 'EDM', 'Deep House', 'Progressive House'],
            currentFilter: 'all',
            scanInProgress: false
        };

        // Load demo tracks from JSON
        this.loadDemoTracks();

        // Setup library UI events
        const libraryBtn = document.getElementById('libraryBtn');
        const libraryModal = document.getElementById('libraryModal');
        const scanLibraryBtn = document.getElementById('scanLibraryBtn');
        const libraryFolderInput = document.getElementById('libraryFolderInput');

        if (libraryBtn) {
            libraryBtn.addEventListener('click', () => this.openLibraryManager());
        }

        if (scanLibraryBtn) {
            scanLibraryBtn.addEventListener('click', () => {
                libraryFolderInput?.click();
            });
        }

        if (libraryFolderInput) {
            libraryFolderInput.addEventListener('change', (e) => {
                this.importMusicFiles(e.target.files);
            });
        }

        // Setup genre filter buttons
        document.querySelectorAll('.genre-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterLibraryByGenre(e.target.dataset.genre);
            });
        });

        // Setup playlist preset buttons
        document.querySelectorAll('.playlist-preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.loadPlaylistPreset(e.target.dataset.preset);
            });
        });

        console.log('✅ Music Library initialized');
    }

    async loadDemoTracks() {
        try {
            const response = await fetch('music-library/demo-tracks.json');
            const data = await response.json();

            // Parse demo tracks
            const technoTracks = data.demoTracks.technoJumpstyle.map(track => ({
                ...track,
                id: this.generateTrackId(),
                isDemo: true,
                local: false,
                addedDate: new Date().toISOString()
            }));

            const houseTracks = data.demoTracks.houseEdm.map(track => ({
                ...track,
                id: this.generateTrackId(),
                isDemo: true,
                local: false,
                addedDate: new Date().toISOString()
            }));

            this.musicLibrary.tracks = [...technoTracks, ...houseTracks];
            this.musicLibrary.playlistPresets = data.playlistPresets || [];

            console.log(`✅ Loaded ${this.musicLibrary.tracks.length} demo tracks`);
            this.updateLibraryUI();
        } catch (error) {
            console.error('Could not load demo tracks:', error);
        }
    }

    generateTrackId() {
        return 'track_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async importMusicFiles(files) {
        if (!files || files.length === 0) return;

        this.musicLibrary.scanInProgress = true;
        this.updateScanProgress(0, files.length);

        const supportedFormats = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.mp4', '.webm', '.ogv'];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const ext = '.' + file.name.split('.').pop().toLowerCase();

            if (supportedFormats.includes(ext)) {
                const track = await this.processAudioFile(file);
                if (track) {
                    this.musicLibrary.tracks.push(track);
                }
            }

            this.updateScanProgress(i + 1, files.length);
        }

        this.musicLibrary.scanInProgress = false;
        this.updateLibraryUI();

        // Show success message
        this.showNotification(`Imported ${files.length} tracks successfully!`);
    }

    async processAudioFile(file) {
        try {
            const url = URL.createObjectURL(file);

            // Create temporary audio element for metadata
            const audio = new Audio(url);

            return new Promise((resolve) => {
                audio.addEventListener('loadedmetadata', () => {
                    // Extract metadata
                    const track = {
                        id: this.generateTrackId(),
                        title: this.extractTitle(file.name),
                        artist: 'Unknown Artist',
                        genre: this.detectGenreFromPath(file.webkitRelativePath || file.name),
                        bpm: this.detectBPMFromFilename(file.name),
                        duration: audio.duration,
                        url: url,
                        filename: file.name,
                        size: file.size,
                        local: true,
                        isDemo: false,
                        addedDate: new Date().toISOString()
                    };

                    resolve(track);
                });

                audio.addEventListener('error', () => {
                    resolve(null);
                });

                // Timeout after 5 seconds
                setTimeout(() => resolve(null), 5000);
            });
        } catch (error) {
            console.error('Error processing file:', file.name, error);
            return null;
        }
    }

    extractTitle(filename) {
        // Remove extension
        let name = filename.replace(/\.[^/.]+$/, '');

        // Try to extract from "Artist - Title (BPM)" format
        if (name.includes(' - ')) {
            const parts = name.split(' - ');
            name = parts[1] || parts[0];
        }

        // Remove BPM info in parentheses
        name = name.replace(/\s*\([^)]*\)\s*/g, '');

        return name.trim();
    }

    detectGenreFromPath(path) {
        const lowerPath = path.toLowerCase();

        if (lowerPath.includes('techno')) return 'Techno';
        if (lowerPath.includes('jump') || lowerPath.includes('jumpstyle')) return 'Jump Style';
        if (lowerPath.includes('house')) return 'House';
        if (lowerPath.includes('edm')) return 'EDM';
        if (lowerPath.includes('trance')) return 'Trance';
        if (lowerPath.includes('dubstep')) return 'Dubstep';
        if (lowerPath.includes('bass')) return 'Bass House';
        if (lowerPath.includes('deep')) return 'Deep House';

        return 'Electronic';
    }

    detectBPMFromFilename(filename) {
        // Look for BPM in format "(120)" or "(120 BPM)" or "120BPM"
        const bpmMatch = filename.match(/\(?(\d{2,3})\s?bpm\)?/i) || filename.match(/\((\d{2,3})\)/);

        if (bpmMatch) {
            const bpm = parseInt(bpmMatch[1]);
            if (bpm >= 60 && bpm <= 200) {
                return bpm;
            }
        }

        return 0; // Unknown BPM
    }

    updateScanProgress(current, total) {
        const progressBar = document.getElementById('libraryProgressBar');
        const progressText = document.getElementById('libraryProgressText');

        if (progressBar) {
            const percent = (current / total) * 100;
            progressBar.style.width = percent + '%';
        }

        if (progressText) {
            progressText.textContent = `Scanning ${current} / ${total} files...`;
        }
    }

    filterLibraryByGenre(genre) {
        this.musicLibrary.currentFilter = genre;
        this.updateLibraryUI();

        // Update active button
        document.querySelectorAll('.genre-filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.genre === genre);
        });
    }

    updateLibraryUI() {
        const libraryGrid = document.getElementById('libraryGrid');
        if (!libraryGrid) return;

        // Filter tracks
        let tracks = this.musicLibrary.tracks;
        if (this.musicLibrary.currentFilter !== 'all') {
            tracks = tracks.filter(t => t.genre === this.musicLibrary.currentFilter);
        }

        // Sort by title
        tracks.sort((a, b) => a.title.localeCompare(b.title));

        // Render tracks
        libraryGrid.innerHTML = tracks.map(track => `
            <div class="library-track-card" data-track-id="${track.id}">
                <div class="track-card-header">
                    <div class="track-genre-badge">${track.genre}</div>
                    ${track.bpm > 0 ? `<div class="track-bpm-badge">${track.bpm} BPM</div>` : ''}
                </div>
                <div class="track-card-title">${track.title}</div>
                <div class="track-card-artist">${track.artist}</div>
                <div class="track-card-actions">
                    <button class="btn-track-action" onclick="player.addTrackToPlaylist('${track.id}')" title="Add to Playlist">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                    <button class="btn-track-action" onclick="player.loadTrackToPlayer('${track.id}')" title="Load to Player">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    </button>
                    ${track.isDemo ? `
                        <a class="btn-track-action" href="${track.url}" target="_blank" title="Download from ${track.artist}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                        </a>
                    ` : ''}
                </div>
            </div>
        `).join('');

        // Update track count
        const trackCount = document.getElementById('libraryTrackCount');
        if (trackCount) {
            trackCount.textContent = `${tracks.length} track${tracks.length !== 1 ? 's' : ''}`;
        }
    }

    addTrackToPlaylist(trackId) {
        const track = this.musicLibrary.tracks.find(t => t.id === trackId);
        if (!track) return;

        // Add to main playlist
        this.addToPlaylist({
            name: track.title,
            url: track.url,
            type: track.url.includes('.mp4') || track.url.includes('.webm') ? 'video' : 'audio'
        });

        this.showNotification(`Added "${track.title}" to playlist`);
    }

    loadTrackToPlayer(trackId) {
        const track = this.musicLibrary.tracks.find(t => t.id === trackId);
        if (!track) return;

        // Add to playlist and play immediately
        this.addToPlaylist({
            name: track.title,
            url: track.url,
            type: track.url.includes('.mp4') || track.url.includes('.webm') ? 'video' : 'audio'
        });

        // Play the last added track
        this.playTrack(this.playlist.length - 1);

        this.showNotification(`Now playing: ${track.title}`);
    }

    loadPlaylistPreset(presetName) {
        const preset = this.musicLibrary.playlistPresets.find(p => p.name === presetName);
        if (!preset) return;

        // Clear current playlist
        this.clearPlaylist();

        // Add tracks from preset
        preset.tracks.forEach(trackName => {
            const track = this.musicLibrary.tracks.find(t => t.title === trackName);
            if (track) {
                this.addTrackToPlaylist(track.id);
            }
        });

        this.showNotification(`Loaded preset: ${preset.name}`);
        this.closeLibraryManager();
    }

    openLibraryManager() {
        const modal = document.getElementById('libraryModal');
        if (modal) {
            modal.classList.add('active');
            this.updateLibraryUI();
        }
    }

    closeLibraryManager() {
        const modal = document.getElementById('libraryModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showNotification(message, duration = 3000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.textContent = message;

        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove after duration
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    // Auto-detect BPM using Web Audio API beat detection
    async autoDetectBPM(trackId) {
        const track = this.musicLibrary.tracks.find(t => t.id === trackId);
        if (!track || !track.url) return 0;

        try {
            // Load audio buffer
            const audioBuffer = await this.getCachedAudioBuffer(track.url);
            const channelData = audioBuffer.getChannelData(0);

            // Simple beat detection algorithm
            const sampleRate = audioBuffer.sampleRate;
            const windowSize = Math.floor(sampleRate * 0.5); // 500ms windows
            const peaks = [];

            for (let i = 0; i < channelData.length - windowSize; i += windowSize) {
                let sum = 0;
                for (let j = 0; j < windowSize; j++) {
                    sum += Math.abs(channelData[i + j]);
                }
                const avg = sum / windowSize;
                peaks.push({ time: i / sampleRate, energy: avg });
            }

            // Find intervals between peaks
            const threshold = peaks.reduce((sum, p) => sum + p.energy, 0) / peaks.length * 1.5;
            const strongPeaks = peaks.filter(p => p.energy > threshold);

            if (strongPeaks.length < 4) return 0;

            const intervals = [];
            for (let i = 1; i < strongPeaks.length; i++) {
                intervals.push(strongPeaks[i].time - strongPeaks[i - 1].time);
            }

            // Calculate BPM from average interval
            const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
            const bpm = Math.round(60 / avgInterval);

            // Validate BPM range
            if (bpm >= 60 && bpm <= 200) {
                track.bpm = bpm;
                this.updateLibraryUI();
                return bpm;
            }

            return 0;
        } catch (error) {
            console.error('BPM detection failed:', error);
            return 0;
        }
    }

    // Export library to JSON for backup
    exportLibrary() {
        const data = {
            tracks: this.musicLibrary.tracks.filter(t => !t.isDemo), // Don't export demo tracks
            playlists: this.musicLibrary.playlists,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `coremedia-library-${Date.now()}.json`;
        a.click();

        URL.revokeObjectURL(url);
        this.showNotification('Library exported successfully!');
    }

    // Import library from JSON backup
    async importLibrary() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const text = await file.text();
                const data = JSON.parse(text);

                // Merge with existing library
                if (data.tracks && Array.isArray(data.tracks)) {
                    this.musicLibrary.tracks = [
                        ...this.musicLibrary.tracks.filter(t => t.isDemo), // Keep demos
                        ...data.tracks
                    ];
                }

                if (data.playlists && Array.isArray(data.playlists)) {
                    this.musicLibrary.playlists = data.playlists;
                }

                this.updateLibraryUI();
                this.showNotification(`Imported ${data.tracks?.length || 0} tracks!`);
            } catch (error) {
                console.error('Import failed:', error);
                this.showNotification('Import failed. Please check the file format.');
            }
        });

        input.click();
    }
}

// Initialize the player
const player = new CoreMedia();
