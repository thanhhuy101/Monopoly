import themeSrc from '../assets/theme.mp3';

let audio: HTMLAudioElement | null = null;
let pendingResume = false;

const MUTED_KEY = 'music_muted';
const VOLUME_KEY = 'music_volume';

function loadMuted(): boolean {
  return localStorage.getItem(MUTED_KEY) === '1';
}

function saveMuted(v: boolean) {
  localStorage.setItem(MUTED_KEY, v ? '1' : '0');
}

function loadVolume(): number {
  const raw = localStorage.getItem(VOLUME_KEY);
  return raw !== null ? Number(raw) : 0.3;
}

function saveVolume(v: number) {
  localStorage.setItem(VOLUME_KEY, String(v));
}

function getAudio() {
  if (!audio) {
    audio = new Audio(themeSrc);
    audio.loop = true;
    audio.volume = loadVolume();
  }
  return audio;
}

function cleanupListeners() {
  pendingResume = false;
  window.removeEventListener('click', onFirstInteraction);
  window.removeEventListener('keydown', onFirstInteraction);
}

function onFirstInteraction() {
  if (pendingResume) {
    pendingResume = false;
    getAudio().play().catch(() => {});
  }
  cleanupListeners();
}

export function playTheme() {
  cleanupListeners();
  saveMuted(false);
  getAudio().play().catch(() => {});
}

/** Try to resume music for an existing session (no user gesture yet). */
export function resumeTheme() {
  if (loadMuted()) return;
  const a = getAudio();
  const p = a.play();
  if (p) {
    p.catch(() => {
      pendingResume = true;
      window.addEventListener('click', onFirstInteraction);
      window.addEventListener('keydown', onFirstInteraction);
    });
  }
}

export function stopTheme() {
  cleanupListeners();
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

export function toggleTheme(): boolean {
  cleanupListeners();
  const a = getAudio();
  if (a.paused) {
    saveMuted(false);
    a.play().catch(() => {});
    return true;
  } else {
    saveMuted(true);
    a.pause();
    return false;
  }
}

export function isMuted(): boolean {
  return loadMuted();
}

export function isPlaying(): boolean {
  return audio ? !audio.paused : false;
}

export function setVolume(v: number) {
  const clamped = Math.max(0, Math.min(1, v));
  getAudio().volume = clamped;
  saveVolume(clamped);
}

export function getVolume(): number {
  return loadVolume();
}
