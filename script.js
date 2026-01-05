function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return; // Safety
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Remove after 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
    }, 3000);
}

const musicData = {
    doomed: {
        title: 'Doomed to Live',
        type: 'EP',
        year: '2025',
        cover: 'doomedtolivecoverart.webp',
        tracks: [
            {
                title: 'Doomed to Live',
                duration: '3:45',
                mp3Url: 'downloads/singles/mp3/doomedtolive.mp3',
                wavUrl: 'https://music.doomed2live.com/DOOMED%20TO%20LIVE.wav'
            },
            {
                title: 'If Only',
                duration: '4:12',
                mp3Url: 'downloads/singles/mp3/if only.mp3',
                wavUrl: 'https://music.doomed2live.com/IF%20ONLY.wav'
            },
            {
                title: 'Why Do Fools Fall In Love',
                duration: '3:58',
                mp3Url: 'downloads/singles/mp3/why do fools fall in love.mp3',
                wavUrl: 'https://music.doomed2live.com/WHY%20DO%20FOOLS%20FALL%20IN%20LOVE.wav'
            },
            {
                title: 'Mayday',
                duration: '3:32',
                mp3Url: 'downloads/singles/mp3/Mayday.mp3',
                wavUrl: 'https://music.doomed2live.com/MAYDAY.wav'
            },
            {
                title: 'End Like This',
                duration: '4:28',
                mp3Url: 'downloads/singles/mp3/end likethis.mp3',
                wavUrl: 'https://music.doomed2live.com/END%20LIKE%20THIS.wav'
            }
        ],
        fullEpZip: 'https://music.doomed2live.com/DOOMED%20TO%20LIVE%20FULL%20EP.zip'
    },
    // ... (rest of old data kept as is, assumed plain placeholders for now)
    armor: {
        title: 'Armor',
        type: 'Single',
        year: '2025',
        cover: 'old cover art/armor.jpg',
        tracks: [{ title: 'Armor', duration: '2:45', downloadUrl: '#' }]
    },
    overu: {
        title: 'Over U',
        type: 'Single',
        year: '2025',
        cover: 'old cover art/over u.jpg',
        tracks: [{ title: 'Over U', duration: '2:50', downloadUrl: '#' }]
    },
    rain: {
        title: 'Rain',
        type: 'Single',
        year: '2025',
        cover: 'old cover art/rain.jpg',
        tracks: [{ title: 'Rain', duration: '3:20', downloadUrl: '#' }]
    },
    legaltender: {
        title: 'Legal Tender',
        type: 'Single',
        year: '2025',
        cover: 'old cover art/legal tender.jpg',
        tracks: [{ title: 'Legal Tender', duration: '2:55', downloadUrl: '#' }]
    },
    americandream: {
        title: 'American Dream',
        type: 'Single',
        year: '2025',
        cover: 'old cover art/americandreams.jpg',
        tracks: [{ title: 'American Dream', duration: '3:15', downloadUrl: '#' }]
    },
    interim: {
        title: 'Interim',
        type: 'Single',
        year: '2025',
        cover: 'old cover art/interim.jpg',
        tracks: [{ title: 'Interim', duration: '3:05', downloadUrl: '#' }]
    },
    setmefree: {
        title: 'Set Me Free',
        type: 'Single',
        year: '2025',
        cover: 'old cover art/set me free.jpg',
        tracks: [{ title: 'Set Me Free', duration: '3:10', downloadUrl: '#' }]
    },
    deepend: {
        title: 'Deep End',
        type: 'Single',
        year: '2024',
        cover: 'old cover art/Deep End.jpg',
        tracks: [{ title: 'Deep End', duration: '3:00', downloadUrl: '#' }]
    },
    dejavu: {
        title: 'Deja Vu',
        type: 'Single',
        year: '2024',
        cover: 'old cover art/deja vu.jpg',
        tracks: [{ title: 'Deja Vu', duration: '3:00', downloadUrl: '#' }]
    },
    mademan: {
        title: 'Made Man',
        type: 'Single',
        year: '2024',
        cover: 'old cover art/made man.jpg',
        tracks: [{ title: 'Made Man', duration: '3:00', downloadUrl: '#' }]
    },
    playstation: {
        title: 'Playstation',
        type: 'Single',
        year: '2024',
        cover: 'old cover art/playstation.jpg',
        tracks: [{ title: 'Playstation', duration: '3:00', downloadUrl: '#' }]
    },
    go: {
        title: 'GO',
        type: 'Single',
        year: '2023',
        cover: 'old cover art/go.jpg',
        tracks: [
            { title: 'GO', duration: '2:30', downloadUrl: '#' }
        ]
    }
};

// Global state
let currentTrack = null;
let selectedAmount = 0;
let isPlaying = false;
let isSwitchingTrack = false;
let isFullEPDownload = false;
let previousView = 'home'; // Track where we came from
let placeholderAudio = null; // Cache for placeholder audio
const trackPlaceholders = {}; // Cache placeholders per track

// Lyrics State
let lyricsData = [];
let currentLyricIndex = -1;
let lyricTimeout = null;

function enterVoid(btn) {
    const overlay = document.getElementById('voidOverlay');

    // Interaction: Shut Door (Visual Feedback)
    if (btn) btn.classList.add('shutting');

    // Update Overlay Text with Whisper
    const replyText = btn ? btn.getAttribute('data-reply') : 'You are not alone';
    const voidTextEl = overlay.querySelector('.void-text');
    if (voidTextEl) voidTextEl.textContent = replyText;

    // Short delay for button animation
    setTimeout(() => {
        // Show Overlay
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');

        // Determine Delay (Respect Reduced Motion)
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const delay = prefersReducedMotion ? 0 : 4000;

        setTimeout(() => {
            transitionToMusic();

            // Hide Overlay after transition starts
            setTimeout(() => {
                overlay.classList.remove('active');
                overlay.setAttribute('aria-hidden', 'true');
                if (btn) btn.classList.remove('shutting');
            }, 500);

        }, delay);
    }, 100);
}

function transitionToMusic() {
    previousView = 'home';
    document.body.classList.add('music-active');

    const homeView = document.getElementById('homeView');
    if (homeView) homeView.style.display = 'none';

    const archiveView = document.getElementById('archiveView');
    if (archiveView) archiveView.style.display = 'none';

    const musicView = document.getElementById('musicView');
    musicView.style.display = 'flex';
    void musicView.offsetWidth;
    musicView.classList.add('visible');

    // Load content if not loaded
    if (!currentTrack) {
        loadEP('doomed');
    }

    setTimeout(() => {
        musicView.classList.add('organized');

        // Scroll to EP Anchor
        const epAnchor = document.getElementById('ep');
        if (epAnchor) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
    }, 100);
}

// Deprecated legacy function kept for safety if linked elsewhere (modified to use new flow)
function goToMusic() {
    enterVoid(null);
}

function goToArchive() {
    const musicView = document.getElementById('musicView');
    const archiveView = document.getElementById('archiveView');
    if (!archiveView) return; // Safety check

    // Hide Music View
    musicView.classList.remove('visible', 'organized');

    setTimeout(() => {
        musicView.style.display = 'none';

        // Show Archive View
        archiveView.style.display = 'flex';
        void archiveView.offsetWidth;
        archiveView.classList.add('visible');

        loadArchive();

        setTimeout(() => {
            archiveView.classList.add('organized');
        }, 100);
    }, 500);
}

function returnToLatest() {
    // Go back to the main Music View (Doomed to Live)
    const musicView = document.getElementById('musicView');
    const archiveView = document.getElementById('archiveView');

    if (archiveView) archiveView.classList.remove('visible', 'organized');

    setTimeout(() => {
        if (archiveView) archiveView.style.display = 'none';

        musicView.style.display = 'flex';
        void musicView.offsetWidth;
        musicView.classList.add('visible');
        loadEP('doomed'); // Reset to latest

        setTimeout(() => {
            musicView.classList.add('organized');
        }, 100);
    }, 500);
}

function goHome() {
    document.body.classList.remove('music-active');
    const musicView = document.getElementById('musicView');
    const archiveView = document.getElementById('archiveView');

    // Stop audio and hide mini-player
    audioPlayer.pause();
    isPlaying = false;
    currentTrack = null;
    updateMiniPlayer();

    // Handle closing whichever view is open
    if (musicView.style.display !== 'none') {
        musicView.classList.remove('visible', 'organized');
        setTimeout(() => { musicView.style.display = 'none'; finishHomeTransition(); }, 500);
    } else if (archiveView) {
        archiveView.classList.remove('visible', 'organized');
        setTimeout(() => { archiveView.style.display = 'none'; finishHomeTransition(); }, 500);
    } else {
        finishHomeTransition();
    }
}

function finishHomeTransition() {
    document.getElementById('homeView').style.display = 'flex';
    audioPlayer.pause();
    isPlaying = false;
    if (document.getElementById('playBtn')) document.getElementById('playBtn').textContent = '▶ Play';

    const message = document.querySelector('.message');
    message.classList.remove('clicked');
}

function loadEP(epKey) {
    const data = musicData[epKey];
    const musicView = document.getElementById('musicView');

    // Reset player state - move player back to template if it's in an old track
    const player = document.getElementById('player');
    const playerTemplate = document.getElementById('playerTemplate');

    // Remove active states from old tracks before clearing
    document.querySelectorAll('.track-item').forEach(item => {
        item.classList.remove('active');
        const wrapper = item.querySelector('.track-player-wrapper');
        if (wrapper) {
            wrapper.classList.remove('expanded');
        }
    });

    // Ensure player is in template before clearing track list
    if (player && player.parentElement) {
        const currentParent = player.parentElement;
        // If player is not already in template, move it there
        if (currentParent.id !== 'playerTemplate') {
            if (currentParent.removeChild) {
                currentParent.removeChild(player);
            }
            if (playerTemplate) {
                playerTemplate.appendChild(player);
            }
            player.style.display = 'none';
        }
    }

    // Reset current track state
    currentTrack = null;
    isPlaying = false;
    const audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.src = '';
        audioPlayer.load();
    }
    updateMiniPlayer();

    // Update Header Info
    // Title removed - only showing type now
    const releaseTypeEl = musicView.querySelector('#releaseType');
    if (releaseTypeEl) {
        releaseTypeEl.textContent = data.type;
    }

    // Update Cover Art
    const artworkImg = musicView.querySelector('.ep-artwork img');
    if (data.cover) {
        artworkImg.src = data.cover;
    } else {
        artworkImg.src = 'doomedtolivecoverart.webp'; // Fallback
    }

    const trackList = document.getElementById('trackList');
    trackList.innerHTML = '';

    // Handle Download Button Visibility
    const downloadBtn = musicView.querySelector('.download-full-ep-btn');
    if (epKey === 'doomed') {
        downloadBtn.style.display = 'inline-block';
        // Also ensure Back button goes to Home
        musicView.querySelector('.back-button').onclick = goHome;
        musicView.querySelector('.back-button').textContent = "← Back";
        // Show Archive Button
        const olderMusicSection = musicView.querySelector('.older-music-section');
        if (olderMusicSection) olderMusicSection.style.display = 'block';
    } else {
        // If viewing an older release inside the main player view
        downloadBtn.style.display = 'none'; // Only Doomed has full EP download logic for now

        // Change Back button to return to Archive
        musicView.querySelector('.back-button').onclick = goToArchive;
        musicView.querySelector('.back-button').textContent = "← Archives";

        // Hide Archive Button (we are already in a sub-view)
        const olderMusicSection = musicView.querySelector('.older-music-section');
        if (olderMusicSection) olderMusicSection.style.display = 'none';
    }

    data.tracks.forEach((track, index) => {
        const trackEl = document.createElement('div');
        trackEl.className = 'track-item';

        // Random values for disorganization effect
        const tx = (Math.random() * 60 - 30) + 'px';
        const ty = (Math.random() * 60 + 20) + 'px';
        const r = (Math.random() * 10 - 5) + 'deg';

        trackEl.style.setProperty('--tx', tx);
        trackEl.style.setProperty('--ty', ty);
        trackEl.style.setProperty('--r', r);
        // Stagger transition delays
        trackEl.style.transitionDelay = (index * 0.05) + 's';

        // Static HTML structure for inline player
        trackEl.innerHTML = `
                    <div class="track-item-content">
                        <div class="track-left">
                            <div class="play-icon-btn">▶</div>
                            <div class="track-text-container">
                                <span class="track-title">${track.title}</span>
                                <span class="track-duration-inline">${track.duration}</span>
                            </div>
                        </div>
                        <div class="track-right">
                            <button class="inline-support-btn" onclick="downloadTrack(event, '${epKey}', ${index})">Download</button>
                        </div>
                    </div>
                `;

        // Pass event to prevent bubbles handled by buttons
        trackEl.onclick = (e) => {
            // If clicked explicitly on support button, it's handled there
            if (e.target.closest('.inline-support-btn')) return;
            selectTrack(track, trackEl);
        };

        trackList.appendChild(trackEl);
    });
}

function loadArchive() {
    const list = document.getElementById('archiveList');
    list.innerHTML = '';

    // Filter keys (excluding 'doomed') and assume they are in chronological order (or user provided order)
    // If explicit sorting is needed based on year, we can do:
    // const keys = Object.keys(musicData)
    //    .filter(k => k !== 'doomed')
    //    .sort((a, b) => parseInt(musicData[b].year || 0) - parseInt(musicData[a].year || 0));
    // But preserving object definition order usually works if defined correctly.
    const keys = Object.keys(musicData).filter(k => k !== 'doomed');

    keys.forEach((key, index) => {
        const item = musicData[key];
        const el = document.createElement('div');
        el.className = 'track-item'; // Reuse animation class for fade in

        // Simplified animation for grid
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        el.style.transitionDelay = (index * 0.05) + 's';

        // Add organized class logic
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 50);

        el.innerHTML = `
                    <div class="archive-item" onclick="viewRelease('${key}')">
                        <div class="archive-thumb">
                            <img src="${item.cover || 'doomedtolivecoverart.webp'}" 
                                 alt="${item.title}" 
                                 onerror="this.src='doomedtolivecoverart.webp'">
                        </div>
                        <div class="archive-info">
                            <div class="archive-title">${item.title}</div>
                            <div class="archive-meta">${item.type} • ${item.year || '2025'}</div>
                        </div>
                    </div>
                `;
        list.appendChild(el);
    });
}

function viewRelease(key) {
    // Switch from Archive View to Music View (populated with release)
    const archiveView = document.getElementById('archiveView');
    const musicView = document.getElementById('musicView');

    archiveView.classList.remove('visible', 'organized');

    setTimeout(() => {
        archiveView.style.display = 'none';

        musicView.style.display = 'flex';
        void musicView.offsetWidth;
        musicView.classList.add('visible');

        loadEP(key);

        setTimeout(() => {
            musicView.classList.add('organized');
        }, 100);
    }, 500);
}

function selectTrack(track, trackEl) {
    const audioPlayer = document.getElementById('audioPlayer');

    if (!audioPlayer) return;

    // Check if clicking the same track
    if (currentTrack === track) {
        // Toggle Play/Pause
        if (isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
        } else {
            audioPlayer.play();
            isPlaying = true;
        }
        updateTrackIcons();
        updateMiniPlayer();
        return;
    }

    // New Track Selection
    isSwitchingTrack = true; // Prevent pause handler from clearing focus

    // Reset previous active class
    document.querySelectorAll('.track-item').forEach(item => item.classList.remove('active'));
    trackEl.classList.add('active');

    // Reset text but KEEP focus mode (it prevents flash)
    const lyricEl = document.getElementById('currentLyricLine');
    if (lyricEl) {
        lyricEl.classList.remove('visible');
        lyricEl.textContent = '';
    }

    currentTrack = track;
    loadLyrics(track.title);

    // Audio Logic
    audioPlayer.pause();
    isPlaying = false;

    if (track.mp3Url) {
        audioPlayer.src = track.mp3Url;
    } else if (track.downloadUrl && track.downloadUrl !== '#') {
        // Fallback for older data structure if any
        audioPlayer.src = track.downloadUrl;
    } else {
        // Placeholder generation logic (Fallback)
        const durationParts = track.duration.split(':');
        const minutes = parseInt(durationParts[0]) || 0;
        const seconds = parseInt(durationParts[1]) || 0;
        const totalSeconds = minutes * 60 + seconds;
        const duration = totalSeconds || 180;

        if (!trackPlaceholders[track.title]) {
            trackPlaceholders[track.title] = generatePlaceholderAudio(duration);
        }
        audioPlayer.src = trackPlaceholders[track.title];
    }

    audioPlayer.load();

    // Auto play
    audioPlayer.play().then(() => {
        isPlaying = true;
        isSwitchingTrack = false; // Reset flag after play starts
        updateTrackIcons();
        updateMiniPlayer();
    }).catch(e => {
        console.log('Autoplay prevented', e);
        isSwitchingTrack = false;
    });
}

function updateTrackIcons() {
    const isMobile = window.innerWidth <= 768;

    document.querySelectorAll('.track-item').forEach(item => {
        const btn = item.querySelector('.play-icon-btn');

        // If this is the active track
        if (item.classList.contains('active')) {
            if (isPlaying) {
                // Use universally supported pause bars (II) instead of emoji
                btn.textContent = '❚❚';
            } else {
                btn.textContent = '▶';
            }
        } else {
            // Inactive tracks always play icon
            btn.textContent = '▶';
        }
    });

    // Update mini player button if exists
    const miniBtn = document.getElementById('miniPlayBtn');
    if (miniBtn) miniBtn.textContent = isPlaying ? '❚❚' : '▶';
}

// Ensure icon updates on resize if needed
window.addEventListener('resize', updateTrackIcons);

function generatePlaceholderAudio(durationSeconds = 180) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const duration = durationSeconds || 180; // Default to 3 minutes
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    // Create a more interesting tone with slight variation
    const baseFreq = 261.63; // C4
    for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate;
        const freq = baseFreq + Math.sin(t * 0.5) * 10; // Slight vibrato
        data[i] = Math.sin(t * freq * 2 * Math.PI) * 0.2 * (1 - t / duration); // Fade out
    }

    const wav = audioBufferToWav(buffer);
    const blob = new Blob([wav], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
}

function audioBufferToWav(audioBuffer) {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1;
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numberOfChannels * bytesPerSample;
    const channels = [];
    for (let i = 0; i < numberOfChannels; i++) {
        channels.push(audioBuffer.getChannelData(i));
    }
    const length = audioBuffer.length * numberOfChannels * bytesPerSample;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);

    const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    const floatTo16BitPCM = (output, offset, input) => {
        for (let i = 0; i < input.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, length, true);

    let offset = 44;
    for (let i = 0; i < numberOfChannels; i++) {
        floatTo16BitPCM(view, offset, channels[i]);
        offset += channels[i].length * bytesPerSample;
    }

    return arrayBuffer;
}

function togglePlay(event) {
    if (event) event.stopPropagation();
    if (!currentTrack) return;
    const audioPlayer = document.getElementById('audioPlayer');

    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
    } else {
        audioPlayer.play();
        isPlaying = true;
    }
    updateTrackIcons();
    updateMiniPlayer();
}

function togglePlayFromMini() {
    togglePlay(null);
}

function seekFooter(event) {
    if (!audioPlayer.src || !audioPlayer.duration) return;
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
}

function updateMiniPlayer() {
    const discreetPlayer = document.getElementById('discreetPlayer');
    const trackName = document.getElementById('discreetTrackName');
    const playBtn = document.getElementById('discreetPlayBtn');

    if (!currentTrack) {
        discreetPlayer.classList.remove('visible');
        document.body.classList.remove('has-mini-player');
        return;
    }

    // Show discreet player
    discreetPlayer.classList.add('visible');
    document.body.classList.add('has-mini-player');

    if (trackName) trackName.textContent = currentTrack.title;
    if (playBtn) playBtn.textContent = isPlaying ? '⏸' : '▶';
}





function seek(event) {
    if (!audioPlayer.src || !audioPlayer.duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
}

audioPlayer.addEventListener('timeupdate', () => {
    const current = Math.floor(audioPlayer.currentTime);
    const minutes = Math.floor(current / 60);
    const seconds = current % 60;
    const currentTimeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    document.getElementById('currentTime').textContent = currentTimeStr;

    // Update mini-player time (Legacy)
    if (document.getElementById('miniTime')) {
        const totalMinutes = Math.floor(audioPlayer.duration / 60) || 0;
        const totalSeconds = Math.floor(audioPlayer.duration % 60) || 0;
        const durationStr = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
        document.getElementById('miniTime').textContent = `${currentTimeStr} / ${durationStr}`;
    }

    // Update Discreet Time
    if (document.getElementById('discreetTime')) {
        const totalMinutes = Math.floor(audioPlayer.duration / 60) || 0;
        const totalSeconds = Math.floor(audioPlayer.duration % 60) || 0;
        const durationStr = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
        document.getElementById('discreetTime').textContent = `${currentTimeStr} / ${durationStr}`;
    }

    const percent = audioPlayer.duration ? (audioPlayer.currentTime / audioPlayer.duration) * 100 : 0;
    document.getElementById('progressFill').style.width = percent + '%';

    // Sync Footer Progress
    const footerProgressBar = document.getElementById('footerProgressBar');
    if (footerProgressBar) footerProgressBar.style.width = percent + '%';

    syncLyrics();
});

// Ensure focus mode is cleared on pause (unless switching tracks)
audioPlayer.addEventListener('pause', () => {
    if (!isSwitchingTrack) {
        document.getElementById('musicView').classList.remove('lyrics-focused');
    }
});

// Dynamic Duration Fix: Update track list duration when file loads
audioPlayer.addEventListener('loadedmetadata', () => {
    if (currentTrack) {
        const totalMinutes = Math.floor(audioPlayer.duration / 60);
        const totalSeconds = Math.floor(audioPlayer.duration % 60);
        const durationStr = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;

        // Update the specific track item in the DOM if visible
        // We look for titles that match currentTrack.title
        // This assumes titles are unique enough for this purpose
        const trackItems = document.querySelectorAll('.track-item');
        trackItems.forEach(item => {
            const titleEl = item.querySelector('.track-title');
            if (titleEl && titleEl.textContent === currentTrack.title) {
                const timeEl = item.querySelector('.track-time');
                if (timeEl) timeEl.textContent = durationStr;
            }
        });
    }
});

audioPlayer.addEventListener('ended', () => {
    if (document.getElementById('playBtn')) document.getElementById('playBtn').textContent = '▶ Play';
    if (document.getElementById('discreetPlayBtn')) document.getElementById('discreetPlayBtn').textContent = '▶';
    isPlaying = false;
    updateTrackIcons();
    updateMiniPlayer();
});

// Setup Mini Player Scrubbing
function setupMiniScrubbing() {
    const container = document.getElementById('miniProgressContainer');
    if (!container) return;

    container.addEventListener('click', (e) => {
        if (!audioPlayer.duration) return;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        audioPlayer.currentTime = percentage * audioPlayer.duration;
    });
}

// Call this on init
setupMiniScrubbing();



// Initialize Stripe
let stripe;

async function initStripe() {
    try {
        const response = await fetch('/api/config');
        const { publishableKey } = await response.json();
        if (publishableKey) {
            stripe = Stripe(publishableKey);
        }
    } catch (e) {
        console.error("Could not fetch Stripe key", e);
    }
}
initStripe();

// Multi-Step Modal Logic
let selectedPaymentType = 'min'; // 'min' or 'custom'
let stripeCheckout = null;

function downloadTrack(event, epKey, index) {
    if (event) event.stopPropagation();

    // If specific track args provided, update context
    if (epKey && typeof index === 'number') {
        const track = musicData[epKey].tracks[index];


        if (track) {
            currentTrack = track;
            // Note: We update currentTrack for metadata context, 
            // but we don't necessarily start playing it unless they click play.
        }
    }

    if (!currentTrack) return;
    isFullEPDownload = false;
    document.getElementById('sympathyModal').classList.add('active');
}

function downloadFullEP() {
    isFullEPDownload = true;
    document.getElementById('sympathyModal').classList.add('active');
}

function openPaymentModal() {
    closeModal('sympathyModal');
    document.getElementById('paymentModal').classList.add('active');

    // Set correct minimum message
    const minMsg = document.getElementById('minAmountMsg');
    const desc = document.getElementById('paymentDescription');
    if (isFullEPDownload) {
        minMsg.textContent = "Minimum: £3.99";
        desc.textContent = "Support the Full EP (Min £3.99)";
    } else {
        minMsg.textContent = "Minimum: £1.00";
        desc.textContent = "Support this Track (Min £1.00)";
    }

    setPaymentAmount('min'); // Default to minimum
}

function openContactModal() {
    closeModal('sympathyModal');
    document.getElementById('contactModal').classList.add('active');
}

function backToSympathy() {
    closeModal('paymentModal');
    closeModal('contactModal');
    closeModal('checkoutModal');
    document.getElementById('sympathyModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');

    // Reset states if needed
    if (modalId === 'paymentModal') {
        document.getElementById('paymentAmountInput').value = '';
    }
    if (modalId === 'checkoutModal' && stripeCheckout) {
        stripeCheckout.unmount();
        stripeCheckout = null;
        document.getElementById('stripe-checkout-container').innerHTML = '';
    }
}

function setPaymentAmount(type) {
    selectedPaymentType = type;
    const input = document.getElementById('paymentAmountInput');
    const buttons = document.querySelectorAll('.amount-option-btn');

    buttons.forEach(btn => btn.classList.remove('active'));

    if (type === 'min') {
        buttons[0].classList.add('active');
        input.value = isFullEPDownload ? 3.99 : 1.00;
        input.readOnly = true;
    } else {
        buttons[1].classList.add('active');
        input.value = '';
        input.readOnly = false;
        input.focus();
    }
}

async function initiateStripeCheckout() {
    const amountInput = document.getElementById('paymentAmountInput');
    let amount = parseFloat(amountInput.value);
    const minAmount = isFullEPDownload ? 3.99 : 1.00;
    const itemTitle = isFullEPDownload ? "Doomed to Live (Full EP)" : currentTrack.title;
    const downloadUrl = isFullEPDownload ? musicData.doomed.fullEpZip : currentTrack.wavUrl;

    if (isNaN(amount) || amount < minAmount) {
        showToast(`Please enter a valid amount (Minimum £${minAmount})`);
        return;
    }

    // Capture Email/Name for record (Optional: send to your DB here)
    // But main focus is checkout

    // Open Checkout Modal
    closeModal('paymentModal');
    document.getElementById('checkoutModal').classList.add('active');

    try {
        // Call backend to create checkout session
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: amount, // Send amount in GBP (backend converts to pence)
                itemTitle: itemTitle,
                // We could capture email/name from a form before this step if desired
                // but current UI asks for amount -> checkout. Checkout collects email.
            })
        });

        const { clientSecret, error } = await response.json();

        if (error) {
            console.error('API Error:', error);
            showToast('Error starting checkout: ' + error);
            closeModal('checkoutModal');
            return;
        }

        // Initialize embedded checkout
        stripeCheckout = await stripe.initEmbeddedCheckout({
            clientSecret: clientSecret
        });

        // Mount the checkout form
        stripeCheckout.mount(document.getElementById('stripe-checkout-container'));

    } catch (err) {
        console.error('Checkout error:', err);
        showToast('Could not initiate checkout. Check console.');
        closeModal('checkoutModal');
    }
}

async function submitFreeForm(event) {
    event.preventDefault();
    const name = document.getElementById('freeName').value;
    const email = document.getElementById('freeEmail').value;
    const phone = document.getElementById('freePhone').value;

    // Google Form Submission info (Config)
    const CONFIG = {
        FORM_ID: "1HJFNpv5LnyQFUd9yNgDGIhoMBBc9VdDj18NU3T8Qcpg",
        ENTRIES: {
            NAME: "entry.1740210107",
            EMAIL: "entry.1802953598",
            PHONE: "entry.5498969"
        }
    };

    const submitUrl = `https://docs.google.com/forms/d/${CONFIG.FORM_ID}/formResponse`;

    // Create a hidden iframe to target the form submission (prevents redirect)
    let iframe = document.getElementById('hidden_iframe');
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.name = 'hidden_iframe';
        iframe.id = 'hidden_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }

    // Create a temporary form to submit
    const form = document.createElement('form');
    form.target = 'hidden_iframe';
    form.action = submitUrl;
    form.method = 'POST';

    // Add inputs
    const addInput = (name, value) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
    };

    addInput(CONFIG.ENTRIES.NAME, name);
    addInput(CONFIG.ENTRIES.EMAIL, email);
    if (phone) addInput(CONFIG.ENTRIES.PHONE, phone);

    document.body.appendChild(form);
    form.submit();

    // Cleanup
    setTimeout(() => {
        document.body.removeChild(form);
    }, 1000);

    // Close modal and show success logic
    closeModal('contactModal');

    const itemTitle = isFullEPDownload ? "Doomed to Live (Full EP)" : currentTrack.title;
    const downloadUrl = isFullEPDownload ? musicData.doomed.fullEpZip : currentTrack.mp3Url;

    showToast(`Thanks ${name}! Your details have been sent to the list.\n\nDownloading ${itemTitle}...`);

    // Trigger download
    downloadFile(downloadUrl, itemTitle);
}

// --- Helper Functions for Lyrics and Volume ---

function setVolume(value) {
    const audio = document.getElementById('audioPlayer');
    if (audio) audio.volume = Math.max(0, Math.min(1, value));
}

async function loadLyrics(title) {
    lyricsData = [];
    currentLyricIndex = -1;
    const container = document.getElementById('currentLyricLine');
    if (container) {
        container.textContent = '';
        container.classList.remove('visible');
    }

    // Convert Title to filename format (Sentence case + .lrc)
    // "Doomed to Live" -> "Doomed to live.lrc"
    let filename = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase() + '.lrc';

    try {
        const res = await fetch('lyrics/' + filename);
        if (!res.ok) throw new Error('No lyrics');
        const text = await res.text();
        parseLyrics(text);
    } catch (e) {
        console.log('Lyrics not found for:', title, e);
        // Fallback 1: Try exact title
        try {
            const res2 = await fetch('lyrics/' + title + '.lrc');
            if (res2.ok) {
                const text2 = await res2.text();
                parseLyrics(text2);
                return; // Found it
            }
            throw new Error('Not found exact');
        } catch (e2) {
            // Fallback 2: Try slugified (lowercase, no spaces)
            // "Doomed to Live" -> "doomedtolive.lrc"
            try {
                const slug = title.replace(/\s+/g, '').toLowerCase() + '.lrc';
                const res3 = await fetch('lyrics/' + slug);
                if (res3.ok) {
                    const text3 = await res3.text();
                    parseLyrics(text3);
                }
            } catch (e3) { }
        }
    }
}

function parseLyrics(text) {
    const lines = text.split('\n');
    const regex = /^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

    lyricsData = lines.map(line => {
        const match = line.match(regex);
        if (!match) return null;
        const min = parseInt(match[1]);
        const sec = parseInt(match[2]);
        const msPart = match[3];
        const content = match[4].trim();

        // Calculate time in seconds
        let ms = parseInt(msPart);
        if (msPart.length === 2) ms = ms / 100;
        else if (msPart.length === 3) ms = ms / 1000;

        return {
            time: min * 60 + sec + ms,
            text: content
        };
    }).filter(item => item !== null && item.text !== '');
}

function syncLyrics() {
    if (!lyricsData.length) return;

    const audio = document.getElementById('audioPlayer');
    const time = audio.currentTime;

    // Find current line (last line passed)
    let activeIndex = -1;
    for (let i = 0; i < lyricsData.length; i++) {
        if (time >= lyricsData[i].time) {
            activeIndex = i;
        } else {
            break;
        }
    }

    if (activeIndex !== currentLyricIndex) {
        currentLyricIndex = activeIndex;
        const line = lyricsData[activeIndex];
        const text = line ? line.text : ''; // Empty if before first timestamp
        updateLyricDisplay(text);
    }
}

function updateLyricDisplay(text) {
    const el = document.getElementById('currentLyricLine');
    if (!el) return;

    // Fade out
    el.classList.remove('visible');

    if (lyricTimeout) clearTimeout(lyricTimeout);

    // Wait for fade out, then swap text and fade in
    // Wait for fade out, then swap text and fade in
    lyricTimeout = setTimeout(() => {
        el.textContent = text;
        const musicView = document.getElementById('musicView');

        if (text) {
            el.classList.add('visible');
            // Enable Focus Mode
            if (musicView) musicView.classList.add('lyrics-focused');
        } else {
            // Disable Focus Mode if no lyrics
            if (musicView) musicView.classList.remove('lyrics-focused');
        }
    }, 100); // Matches CSS transition duration
}

/*
 * NOTE: To make this work with REAL Stripe payments without a backend:
 * 1. Go to Stripe Dashboard -> Products -> Add Product
 * 2. Create a "Pay What You Want" pricing or fixed prices (£1, £3, etc.)
 * 3. Get the "Payment Link" for each
 * 4. Redirect the user to that link in the submitDonation function
 */

async function captureEmail(email, name, track, amount) {
    // Placeholder if you want to log paid donations to DB
    console.log('Payment Success:', email, amount);
}

function downloadFile(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    // Extract extension from URL
    const extension = url.split('.').pop();
    const cleanName = filename.replace(/\s+/g, '-').toLowerCase();
    a.download = `${cleanName}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}



// Check for completed checkout session on page load
window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
        // Check if payment was successful
        try {
            const response = await fetch(`/api/session-status?session_id=${sessionId}`);
            const { status, customer_email } = await response.json();

            if (status === 'complete') {
                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);
                showToast(`Payment successful! Welcome to the club, ${customer_email || 'friend'}.`);
            }
        } catch (error) {
            console.error('Error checking session status:', error);
        }
    }
});