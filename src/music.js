// User-supplied Suno download; see public/audio/README.md. No runtime provider.
// Explicit opt-in only. Room changes and game actions never trigger music.
export class MusicCue {
  enabled = false;
  volume = 0.3;
  constructor(onChange = () => {}) {
    this.onChange = onChange;
    this.audio = new Audio();
    this.audio.preload = 'none';
    this.audio.loop = false;
    this.audio.addEventListener('timeupdate', () => this.update());
    this.audio.addEventListener('ended', () => this.stop());
    this.audio.addEventListener('error', () => {
      this.stop();
      this.onChange(false, 'Music could not be loaded. You can continue playing.');
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.audio.pause();
      else if (this.enabled) this.audio.play().catch(() => this.stop());
    });
  }
  async toggle() {
    if (this.enabled) { this.stop(); return false; }
    if (!this.audio.getAttribute('src')) this.audio.src = `${import.meta.env.BASE_URL}audio/lantern-depths.mp3`;
    this.audio.currentTime = 0;
    this.audio.volume = 0;
    this.enabled = true;
    try { await this.audio.play(); }
    catch { this.stop(); throw new Error('Music playback could not start. Please try again.'); }
    if (!this.enabled || document.hidden) this.audio.pause();
    this.onChange(this.enabled);
    return this.enabled;
  }
  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
    this.update();
  }
  update() {
    const end = Math.min(60, Number.isFinite(this.audio.duration) ? this.audio.duration : 60);
    const t = this.audio.currentTime;
    if (this.enabled && t >= end) { this.stop(); return; }
    const fade = Math.max(0, Math.min(1, t / 3, (end - t) / 8));
    this.audio.volume = this.volume * 0.45 * fade;
  }
  stop() {
    this.enabled = false;
    this.audio.pause();
    this.onChange(false);
  }
}
