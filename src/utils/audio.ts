// Web Audio API ambient nostalgic chord generator (No external MP3 required)
class NostalgiaAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: number | null = null;

  private notes = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
  ];

  public init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playWarmChime(freq: number, duration = 3.5, gainLevel = 0.08) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + duration);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(gainLevel, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  public playMemorySpark() {
    this.init();
    if (!this.ctx) return;
    // Play an uplifting gentle chord arpeggio
    const chord = [392.00, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        this.playWarmChime(freq, 2.0, 0.09);
      }, idx * 90);
    });
  }

  public toggleAmbient(onStateChange?: (playing: boolean) => void) {
    this.init();
    if (this.isPlaying) {
      this.stop();
      onStateChange?.(false);
      return false;
    } else {
      this.start();
      onStateChange?.(true);
      return true;
    }
  }

  public start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;

    // Progression loop
    const chords = [
      [261.63, 329.63, 392.00], // C maj
      [220.00, 261.63, 329.63], // A min
      [349.23, 440.00, 523.25], // F maj
      [196.00, 246.94, 293.66], // G maj
    ];

    let chordIdx = 0;
    const playNext = () => {
      if (!this.isPlaying || !this.ctx) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((f, i) => {
        setTimeout(() => {
          if (this.isPlaying) {
            this.playWarmChime(f, 4.0, 0.04);
          }
        }, i * 200);
      });

      // Random gentle single chime
      setTimeout(() => {
        if (this.isPlaying) {
          const randNote = this.notes[Math.floor(Math.random() * this.notes.length)];
          this.playWarmChime(randNote, 3.0, 0.03);
        }
      }, 1800);

      this.timer = window.setTimeout(playNext, 4200);
    };

    playNext();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const nostalgiaAudio = new NostalgiaAudioEngine();
