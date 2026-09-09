// Original low-level procedural sound. No downloads, trackers or paid services.
// Off until the player explicitly enables it. Sound never advances the game.
export class Soundscape {
  enabled = false;
  scene = '';
  volume = 0.3;
  async toggle() {
    if (this.enabled) { this.enabled = false; await this.context.suspend(); return false; }
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) throw new Error('This browser does not support sound.');
    if (!this.context) this.init(Audio);
    await this.context.resume();
    this.enabled = true;
    return true;
  }
  init(Audio) {
    const ctx = this.context = new Audio();
    this.master = ctx.createGain(); this.master.gain.value = this.volume; this.master.connect(ctx.destination);
    this.noise = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const channel = this.noise.getChannelData(0);
    for (let i = 0; i < channel.length; i++) channel[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource(); source.buffer = this.noise; source.loop = true;
    this.filter = ctx.createBiquadFilter(); this.filter.type = 'lowpass';
    this.ambient = ctx.createGain();
    source.connect(this.filter); this.filter.connect(this.ambient); this.ambient.connect(this.master); source.start();
    this.setScene(this.scene);
    this.timer = window.setInterval(() => {
      if (!this.enabled || ctx.state !== 'running') return;
      if (this.scene === 'outdoors') this.tone(1750 + Math.random() * 450, 0.16, 0.025, 'sine', 2300);
      if (['cellar','stone','passage','chasm'].includes(this.scene)) {
        const chasm=this.scene==='chasm';
        this.tone(chasm?420:600, 0.15, chasm?0.025:0.035, 'sine', 220, chasm?-0.65:0.35, chasm?0.6:0.18);
      }
    }, 8500);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) ctx.suspend().catch(() => {});
      else if (this.enabled) ctx.resume().catch(() => {});
    });
  }
  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.master) this.master.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.08);
  }
  setScene(scene) {
    this.scene = scene;
    if (!this.context) return;
    const settings = { outdoors: [900, 0.024], house: [180, 0.009], cellar: [310, 0.018], dark: [150, 0.012], stone: [220,0.012], passage: [260,0.012], chasm: [450,0.022], quiet: [150,0.006], gallery:[180,0.006],studio:[240,0.009] };
    const [hz, gain] = settings[scene] ?? [180, 0.008];
    this.filter.frequency.setTargetAtTime(hz, this.context.currentTime, 0.5);
    this.ambient.gain.setTargetAtTime(gain, this.context.currentTime, 0.5);
  }
  tone(hz, duration, level, type = 'sine', end = hz, pan = 0, echo = 0) {
    const ctx = this.context, start = ctx.currentTime;
    const oscillator = ctx.createOscillator(), gain = ctx.createGain();
    oscillator.type = type; oscillator.frequency.setValueAtTime(hz, start); oscillator.frequency.exponentialRampToValueAtTime(end, start + duration);
    gain.gain.setValueAtTime(0.0001, start); gain.gain.exponentialRampToValueAtTime(level, start + 0.015); gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    const panner=ctx.createStereoPanner(), delay=ctx.createDelay(1), reflection=ctx.createGain();
    panner.pan.value=pan; delay.delayTime.value=echo; reflection.gain.value=echo?0.22:0;
    oscillator.connect(gain); gain.connect(panner); panner.connect(this.master);
    panner.connect(delay); delay.connect(reflection); reflection.connect(this.master);
    oscillator.start(start); oscillator.stop(start + duration + echo + 0.1);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); panner.disconnect(); delay.disconnect(); reflection.disconnect(); };
  }
  effect(name) {
    if (!this.enabled || this.context.state !== 'running') return;
    if (name === 'wood') this.tone(180, 0.32, 0.1, 'triangle', 75);
    if (name === 'click') this.tone(950, 0.055, 0.065, 'triangle', 320);
    const settings = { step: [0.12, 260, 0.12], scrape: [0.5, 700, 0.075], take: [0.1, 1500, 0.04] };
    if (!settings[name]) return;
    const [duration, hz, level] = settings[name], ctx = this.context, start = ctx.currentTime;
    const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
    source.buffer = this.noise; filter.type = 'lowpass'; filter.frequency.value = hz;
    gain.gain.setValueAtTime(level, start); gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter); filter.connect(gain); gain.connect(this.master); source.start(start); source.stop(start + duration);
    source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
  }
}
