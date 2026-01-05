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
const audioPlayer = document.getElementById('audioPlayer');

// Lyrics State
let lyricsData = [];
let currentLyricIndex = -1;
let lyricTimeout = null;

function getPrefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

let lyricsFocusTimeoutId = null;
let lyricsFocusArmed = false;

function scheduleLyricsFocus(delayMs = 3000) {
    if (lyricsFocusTimeoutId) clearTimeout(lyricsFocusTimeoutId);
    lyricsFocusTimeoutId = setTimeout(() => {
        const musicView = document.getElementById('musicView');
        if (musicView) musicView.classList.add('lyrics-focused');
    }, delayMs);
}

function clearLyricsFocus() {
    if (lyricsFocusTimeoutId) clearTimeout(lyricsFocusTimeoutId);
    lyricsFocusTimeoutId = null;
    const musicView = document.getElementById('musicView');
    if (musicView) musicView.classList.remove('lyrics-focused');
}

function enterVoid(btn) {
    const overlay = document.getElementById('voidOverlay');
    const trackTitle = btn ? btn.getAttribute('data-track') : null;

    if (!overlay) {
        transitionToMusic(trackTitle, 0);
        return;
    }

    if (btn) btn.classList.add('shutting');

    const replyText = btn ? btn.getAttribute('data-reply') : 'You are not alone';
    const voidTextEl = overlay.querySelector('.void-text');
    if (voidTextEl) voidTextEl.textContent = replyText;

    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');

    const delay = getPrefersReducedMotion() ? 0 : 4000;
    transitionToMusic(trackTitle, delay);

    setTimeout(() => {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        if (btn) btn.classList.remove('shutting');
    }, delay);
}

function transitionToMusic(autoplayTrackTitle, pageReadyDelay = 0) {
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

    // Always build the EP UI when entering from home
    loadEP('doomed');

    if (autoplayTrackTitle) {
        setTimeout(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    autoplayTrackByTitle('doomed', autoplayTrackTitle);
                });
            });
        }, pageReadyDelay);
    }

    setTimeout(() => {
        lyricsFocusArmed = true;
        clearLyricsFocus();
    }, pageReadyDelay);

    setTimeout(() => {
        musicView.classList.add('organized');

    }, 100);
}

function autoplayTrackByTitle(epKey, title) {
    const ep = musicData[epKey];
    if (!ep || !Array.isArray(ep.tracks)) return;

    const matchTitle = String(title).trim().toLowerCase();
    const track = ep.tracks.find(t => String(t.title).trim().toLowerCase() === matchTitle);
    if (!track) return;

    const trackList = document.getElementById('trackList');
    const trackEls = trackList ? Array.from(trackList.querySelectorAll('.track-item')) : [];
    const trackEl = trackEls.find((el) => {
        const label = el.querySelector('.track-title');
        return label && String(label.textContent).trim().toLowerCase() === String(track.title).trim().toLowerCase();
    });

    if (trackEl) {
        selectTrack(track, trackEl);
    }
}

// Deprecated legacy function kept for safety if linked elsewhere (modified to use new flow)
function goToMusic() {
    enterVoid(null);
}

function goToArchive() {
    const musicView = document.getElementById('musicView');
    const archiveView = document.getElementById('archiveView');
    if (!archiveView) return; // Safety check

    clearLyricsFocus();

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

    clearLyricsFocus();

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
        trackEl.setAttribute('role', 'button');
        trackEl.tabIndex = 0;

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
                                <span class="track-meta-right">
                                    <span class="track-duration-inline">${track.duration}</span>
                                    <button class="duration-download-btn" onclick="downloadTrack(event, '${epKey}', ${index})" aria-label="Download ${track.title}">
                                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                            <path d="M12 3v10.17l3.59-3.58L17 11l-5 5-5-5 1.41-1.41L11 13.17V3h1zM5 19h14v2H5v-2z" />
                                        </svg>
                                    </button>
                                </span>
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
            if (e.target.closest('.inline-support-btn, .duration-download-btn')) return;
            selectTrack(track, trackEl);
        };

        trackEl.addEventListener('keydown', (e) => {
            if (e.target.closest('.inline-support-btn, .duration-download-btn')) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectTrack(track, trackEl);
            }
        });

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
    lyricsFocusArmed = true;
    clearLyricsFocus();

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
    if (!audioPlayer || !audioPlayer.src || !audioPlayer.duration) return;
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
    if (!audioPlayer || !audioPlayer.src || !audioPlayer.duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
}

if (audioPlayer) {
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

    // Removed syncLyrics() from here to use high-precision loop requestAnimationFrame
});

audioPlayer.addEventListener('pause', () => {
    cancelLyricSync(); // Stop high precision loop
});

audioPlayer.addEventListener('play', () => {
    startLyricSync(); // Start high precision loop
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
}

// Setup Mini Player Scrubbing
function setupMiniScrubbing() {
    const container = document.getElementById('miniProgressContainer');
    if (!container || !audioPlayer) return;

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

const PENDING_DOWNLOAD_STORAGE_KEY = 'pendingDownload';

function setPendingDownload(downloadUrl, itemTitle) {
    if (!downloadUrl || !itemTitle) return;
    try {
        localStorage.setItem(PENDING_DOWNLOAD_STORAGE_KEY, JSON.stringify({ downloadUrl, itemTitle }));
    } catch { }
}

function getPendingDownload() {
    try {
        const raw = localStorage.getItem(PENDING_DOWNLOAD_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function clearPendingDownload() {
    try {
        localStorage.removeItem(PENDING_DOWNLOAD_STORAGE_KEY);
    } catch { }
}

function startFreeDownload() {
    closeModal('sympathyModal');

    const itemTitle = isFullEPDownload ? "Doomed to Live (Full EP)" : (currentTrack ? currentTrack.title : "Doomed to Live (Full EP)");
    const downloadUrl = isFullEPDownload
        ? musicData.doomed.fullEpZip
        : (currentTrack && currentTrack.mp3Url ? currentTrack.mp3Url : musicData.doomed.fullEpZip);

    setPendingDownload(downloadUrl, itemTitle);
    downloadFile(downloadUrl, itemTitle);
    openPostDownloadModal();
}

function openPostDownloadModal() {
    const modal = document.getElementById('postDownloadModal');
    if (!modal) return;

    const pending = getPendingDownload();
    const downloadWrap = document.getElementById('postDownloadDownload');
    if (downloadWrap) {
        downloadWrap.style.display = pending && pending.downloadUrl ? 'block' : 'none';
    }

    modal.classList.add('active');
    const emailInput = document.getElementById('postDownloadEmail');
    if (emailInput) emailInput.focus();
}

function downloadPending() {
    const pending = getPendingDownload();
    if (!pending || !pending.downloadUrl || !pending.itemTitle) return;
    downloadFile(pending.downloadUrl, pending.itemTitle);
}

function submitPostDownloadEmail(event) {
    event.preventDefault();
    const email = (document.getElementById('postDownloadEmail')?.value || '').trim();
    const statusEl = document.getElementById('postDownloadEmailStatus');

    if (!email) {
        if (statusEl) statusEl.textContent = 'No worries — you can skip this.';
        return;
    }

    // Placeholder: integrate Mailchimp/Buttondown/custom API here.
    if (statusEl) statusEl.textContent = 'Saved. I’ll only email when it matters.';
}

function skipPostDownloadEmail() {
    closeModal('postDownloadModal');
}

function answerIdentity(answerKey) {
    try {
        localStorage.setItem('identityAnswer', String(answerKey));
    } catch { }
    showToast('Thank you.');
    closeModal('postDownloadModal');
}

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

// Support modal (hotlines, region-aware)
let supportModalOpener = null;
let supportModalKeyHandler = null;

const SUPPORT_REGION_STORAGE_KEY = 'supportRegion';

const SUPPORT_RESOURCES = {
    us: [
        {
            name: '988 Suicide & Crisis Lifeline',
            url: 'https://988lifeline.org/',
            tel: '988',
            note: 'Call, text, or chat'
        }
    ],
    ca: [
        {
            name: '9-8-8 Suicide Crisis Helpline',
            url: 'https://988.ca/',
            tel: '988',
            note: 'Call or text'
        }
    ],
    uk: [
        {
            name: 'Samaritans (UK)',
            url: 'https://www.samaritans.org/how-we-can-help/contact-samaritan/talk-us-phone/',
            tel: '116123',
            note: '24/7'
        }
    ],
    roi: [
        {
            name: 'Samaritans (Republic of Ireland)',
            url: 'https://www.samaritans.org/how-we-can-help/contact-samaritan/',
            note: 'Official contact options'
        }
    ],
    au: [
        {
            name: 'Lifeline Australia',
            url: 'https://www.lifeline.org.au/131114',
            tel: '131114',
            note: '24/7'
        }
    ],
    int: [
        {
            name: 'Find a Helpline (worldwide directory)',
            url: 'https://findahelpline.com/',
            note: 'Directory by country/region'
        }
    ]
};

const SUPPORT_REGION_LABELS = {
    us: 'United States',
    ca: 'Canada',
    uk: 'United Kingdom',
    roi: 'Republic of Ireland',
    au: 'Australia',
    int: 'International'
};

function getFocusableElements(rootEl) {
    return Array.from(
        rootEl.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])'
        )
    ).filter((el) => el.offsetParent !== null || el === document.activeElement);
}

function guessSupportRegionFromCountryCode(countryCode) {
    const code = (countryCode || '').toUpperCase();
    if (code === 'US') return 'us';
    if (code === 'CA') return 'ca';
    if (code === 'GB' || code === 'UK') return 'uk';
    if (code === 'IE') return 'roi';
    if (code === 'AU') return 'au';
    return 'int';
}

function guessSupportRegionClientSide() {
    const language = (navigator.language || '').toUpperCase();
    const regionPart = language.includes('-') ? language.split('-')[1] : '';
    if (regionPart === 'US') return 'us';
    if (regionPart === 'CA') return 'ca';
    if (regionPart === 'GB' || regionPart === 'UK') return 'uk';
    if (regionPart === 'IE') return 'roi';
    if (regionPart === 'AU') return 'au';

    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        if (tz.includes('Australia')) return 'au';
        if (tz === 'Europe/Dublin') return 'roi';
        if (tz === 'Europe/London') return 'uk';
        if (tz.startsWith('America/')) return 'us';
    } catch {
        // ignore
    }

    return 'int';
}

// NOTE: Region detection is local-only (no IP / API calls).

function renderSupportHotlines(regionKey) {
    const listEl = document.getElementById('supportHotlineList');
    if (!listEl) return;
    listEl.innerHTML = '';

    const regionInfo = document.getElementById('supportRegionInfo');
    if (regionInfo) {
        const label = SUPPORT_REGION_LABELS[regionKey] || SUPPORT_REGION_LABELS.int;
        regionInfo.innerHTML = `Showing support services for: <strong>${label}</strong>`;
    }

    const resources = SUPPORT_RESOURCES[regionKey] || SUPPORT_RESOURCES.int;
    resources.forEach((resource) => {
        const card = document.createElement('div');
        card.className = 'support-hotline-card';

        const name = document.createElement('div');
        name.className = 'support-hotline-name';
        name.textContent = resource.name;
        card.appendChild(name);

        const details = document.createElement('div');
        details.className = 'support-hotline-details';
        details.textContent = resource.note || 'Official support information';
        card.appendChild(details);

        const methods = document.createElement('div');
        methods.className = 'support-contact-methods';

        if (resource.tel) {
            const telLink = document.createElement('a');
            telLink.className = 'support-contact-btn';
            telLink.href = `tel:${resource.tel}`;
            telLink.textContent = `Call ${resource.tel}`;
            methods.appendChild(telLink);
        }

        const infoLink = document.createElement('a');
        infoLink.className = 'support-contact-btn';
        infoLink.href = resource.url;
        infoLink.target = '_blank';
        infoLink.rel = 'noopener noreferrer';
        infoLink.textContent = 'Official info';
        methods.appendChild(infoLink);

        card.appendChild(methods);
        listEl.appendChild(card);
    });
}

async function resolveInitialSupportRegion() {
    const saved = localStorage.getItem(SUPPORT_REGION_STORAGE_KEY);
    if (saved && SUPPORT_RESOURCES[saved]) return saved;

    return guessSupportRegionClientSide();
}

function openSupportModal(openerEl) {
    const modal = document.getElementById('supportModal');
    if (!modal) return;

    supportModalOpener = openerEl || document.activeElement;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    const content = modal.querySelector('.support-modal-content') || modal.querySelector('.modal-content');
    const closeBtn = document.getElementById('supportModalClose');

    const focusTarget = closeBtn || content;
    if (focusTarget) {
        setTimeout(() => focusTarget.focus(), 0);
    }

    supportModalKeyHandler = (e) => {
        if (!modal.classList.contains('active')) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            closeSupportModal();
            return;
        }

        if (e.key === 'Tab') {
            const focusables = getFocusableElements(modal);
            if (!focusables.length) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    };

    document.addEventListener('keydown', supportModalKeyHandler);
}

function closeSupportModal() {
    const modal = document.getElementById('supportModal');
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');

    if (supportModalKeyHandler) {
        document.removeEventListener('keydown', supportModalKeyHandler);
        supportModalKeyHandler = null;
    }

    if (supportModalOpener && typeof supportModalOpener.focus === 'function') {
        supportModalOpener.focus();
    }
    supportModalOpener = null;
}

async function initSupportUI() {
    const openBtn = document.getElementById('supportNowBtn');
    const modal = document.getElementById('supportModal');
    const closeBtn = document.getElementById('supportModalClose');
    const regionSelect = document.getElementById('supportRegionSelect');

    if (!openBtn || !modal || !closeBtn || !regionSelect) return;

    openBtn.addEventListener('click', async () => {
        const region = await resolveInitialSupportRegion();
        regionSelect.value = region;
        renderSupportHotlines(region);
        openSupportModal(openBtn);
    });

    closeBtn.addEventListener('click', closeSupportModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeSupportModal();
    });

    regionSelect.addEventListener('change', () => {
        const value = regionSelect.value;
        localStorage.setItem(SUPPORT_REGION_STORAGE_KEY, value);
        renderSupportHotlines(value);
    });
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
    setPendingDownload(downloadUrl, itemTitle);

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

    // Updated Parsing to allow empty lines (manual clear)
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
    }).filter(item => item !== null); // Removed check for empty text to allow manual clearing
}

// Optimized Sync Loop
let lyricRequestFrame;

function startLyricSync() {
    cancelLyricSync();

    const audio = document.getElementById('audioPlayer');

    function loop() {
        syncLyrics();
        // Use the source of truth (audio.paused) instead of manual isPlaying state
        // to avoid race conditions where the play event fires before isPlaying is set to true.
        if (!audio.paused) {
            lyricRequestFrame = requestAnimationFrame(loop);
        }
    }
    loop();
}

function cancelLyricSync() {
    if (lyricRequestFrame) cancelAnimationFrame(lyricRequestFrame);
}

function syncLyrics() {
    if (!lyricsData.length) return;

    const audio = document.getElementById('audioPlayer');
    const time = audio.currentTime;

    // 1. Find the current active line index
    // We look for the latest timestamp that has passed
    let activeIndex = -1;
    for (let i = 0; i < lyricsData.length; i++) {
        if (time >= lyricsData[i].time) {
            activeIndex = i;
        } else {
            // Since time is increasing, we can break early if list is sorted (mostly true)
            break;
        }
    }

    // 2. Handle Auto-Fade Out (Heuristic)
    // If we are deep into the line but haven't hit the next one yet, check if we should fade out
    if (activeIndex !== -1) {
        const currentLine = lyricsData[activeIndex];
        const nextLine = lyricsData[activeIndex + 1];

        // Calculate a reasonable duration for this line
        // Base: 2.5s buffer + 0.4s per word
        // This prevents lyrics from hanging during long instrumentals
        const wordCount = currentLine.text ? currentLine.text.split(' ').length : 0;
        const estimatedDuration = 2.5 + (wordCount * 0.4);

        // If there is a next line, the gap is the hard limit, but we might fade earlier
        const timeSinceStart = time - currentLine.time;

        if (timeSinceStart > estimatedDuration && currentLine.text !== '') {
            // If we've exceeded our estimated duration, treat as silence
            // But only if we aren't already showing nothing
            if (currentLyricIndex === activeIndex) {
                // Force a clear by pretending we are in a "gap" state
                // We do this by updating display to empty, but keeping index to avoid loops
                updateLyricDisplay('');
                currentLyricIndex = -2; // Special state: "Cleared for current line"
                return;
            } else if (currentLyricIndex === -2) {
                return; // Already cleared
            }
        }
    }

    // 3. Update Display if Index Changed
    if (activeIndex !== currentLyricIndex && activeIndex !== -2) {
        currentLyricIndex = activeIndex;

        if (activeIndex === -1) {
            updateLyricDisplay('');
        } else {
            const line = lyricsData[activeIndex];
            updateLyricDisplay(line.text);
        }
    }
}

function updateLyricDisplay(text) {
    const el = document.getElementById('currentLyricLine');
    if (!el) return;

    // Direct update without animation logic
    el.textContent = text;
    const musicView = document.getElementById('musicView');

    if (text) {
        el.classList.add('visible');
        if (lyricsFocusArmed) {
            lyricsFocusArmed = false;
            // Give the lyric line a moment to render before dimming.
            setTimeout(() => scheduleLyricsFocus(0), 100);
        }
    } else {
        el.classList.remove('visible');
    }
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
    initSupportUI();

    // Home splash -> doors after 2s
    const homeSplash = document.getElementById('homeSplash');
    const doors = document.getElementById('doorsContainer');
    if (homeSplash && doors) {
        setTimeout(() => {
            homeSplash.style.display = 'none';
            homeSplash.setAttribute('aria-hidden', 'true');
            doors.style.display = '';
        }, 2000);
    }

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
                showToast(`Thank you <3`);

                const pending = getPendingDownload();
                if (pending && pending.downloadUrl && pending.itemTitle) {
                    // Paid path: download is ready after checkout, show modal with download button.
                    openPostDownloadModal();
                } else {
                    openPostDownloadModal();
                }
            }
        } catch (error) {
            console.error('Error checking session status:', error);
        }
    }
});
