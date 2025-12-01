// ============================================
// SOUND SYSTEM (Web Audio API)
// ============================================
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playBrake() {
    if (!audioCtx) return;
    const bufferSize = audioCtx.sampleRate * 0.3;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const source = audioCtx.createBufferSource();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();
    source.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.3);
    gain.gain.value = 0.2;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    source.start();
}

function playPerfect() {
    playTone(880, 0.15, 'sine', 0.3);
    setTimeout(() => playTone(1100, 0.2, 'sine', 0.3), 100);
}

function playGreat() {
    playTone(660, 0.15, 'sine', 0.25);
    setTimeout(() => playTone(880, 0.15, 'sine', 0.25), 80);
}

function playGood() {
    playTone(440, 0.2, 'square', 0.15);
}

function playOk() {
    playTone(330, 0.2, 'triangle', 0.2);
}

function playMiss() {
    playTone(220, 0.3, 'sawtooth', 0.15);
    setTimeout(() => playTone(165, 0.3, 'sawtooth', 0.15), 150);
}

function playCorrection() {
    playTone(200, 0.1, 'sine', 0.1);
}

function playGameOver() {
    playTone(440, 0.3, 'sine', 0.2);
    setTimeout(() => playTone(349, 0.3, 'sine', 0.2), 200);
    setTimeout(() => playTone(294, 0.3, 'sine', 0.2), 400);
    setTimeout(() => playTone(220, 0.5, 'sine', 0.2), 600);
}

let activeFootsteps = 0;
const MAX_FOOTSTEPS = 3;  // Limit concurrent footstep sounds

function playFootstep() {
    if (!audioCtx) return;
    // Limit concurrent footsteps to prevent audio overload
    if (activeFootsteps >= MAX_FOOTSTEPS) return;

    activeFootsteps++;

    // Cheerful little musical blip - like a xylophone tap
    const duration = 0.08;
    // Random note from a happy major pentatonic scale (C major pentatonic, higher octave)
    const notes = [523, 587, 659, 784, 880, 1047];  // C5, D5, E5, G5, A5, C6
    const freq = notes[Math.floor(Math.random() * notes.length)];

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    // Quick fade in and out for smooth sound
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.025, audioCtx.currentTime + 0.005);  // Quick attack
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);  // Smooth decay

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);

    // Release the slot after the sound finishes
    setTimeout(() => { activeFootsteps--; }, duration * 1000);
}

// Stub functions for compatibility
function setCrowdLevel(level) {}
function stopCrowdSound() {}

function playDoorOpen() {
    if (!audioCtx) return;
    // Pneumatic hiss sound for doors
    const bufferSize = audioCtx.sampleRate * 0.4;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        // White noise with envelope
        const envelope = Math.sin((i / bufferSize) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * envelope * 0.5;
    }
    const source = audioCtx.createBufferSource();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();
    source.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.value = 2000;
    filter.Q.value = 1;
    gain.gain.value = 0.15;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    source.start();
}
