export class AudioManager {
  private static instance: AudioManager;
  private audioContext?: AudioContext;
  private oscillators: Map<string, OscillatorNode> = new Map();
  private gainNodes: Map<string, GainNode> = new Map();
  private intervals: Map<string, number> = new Map();
  private initialized: boolean = false;
  private enabled: boolean = true;
  private volume: number = 1;

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await this.audioContext.resume();
      this.initialized = true;
    } catch (error) {
      console.error('Audio initialization failed:', error);
      this.initialized = true;
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  setVolume(volume: number): void {
    this.volume = volume;
    this.gainNodes.forEach(gain => {
      gain.gain.value = volume;
    });
  }

  private createFlatlineSound(): [OscillatorNode, GainNode] {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    return [oscillator, gainNode];
  }

  private createPanicSound(): [OscillatorNode, GainNode] {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);

    // Add frequency modulation for urgency
    const now = this.audioContext.currentTime;
    oscillator.frequency.setValueAtTime(880, now);
    oscillator.frequency.linearRampToValueAtTime(1100, now + 0.1);
    oscillator.frequency.linearRampToValueAtTime(880, now + 0.2);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    return [oscillator, gainNode];
  }

  async play(key: string, loop: boolean = false): Promise<void> {
    if (!this.initialized || !this.enabled || !this.audioContext) return;

    try {
      // Stop any existing sound of this type
      this.stop(key);

      const [oscillator, gainNode] = key === 'flatline' 
        ? this.createFlatlineSound()
        : this.createPanicSound();

      this.oscillators.set(key, oscillator);
      this.gainNodes.set(key, gainNode);

      if (!loop) {
        // For non-looping sounds, stop after 200ms
        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.2);
        setTimeout(() => this.stop(key), 200);
      }

      oscillator.start();
    } catch (error) {}
  }

  async playWithInterval(key: string, interval: number): Promise<void> {
    if (!this.initialized || !this.enabled) return;

    this.stopInterval(key);
    
    try {
      await this.play(key);
      
      const intervalId = window.setInterval(async () => {
        await this.play(key);
      }, interval);
      
      this.intervals.set(key, intervalId);
    } catch (error) {}
  }

  stop(key: string): void {
    const oscillator = this.oscillators.get(key);
    const gainNode = this.gainNodes.get(key);

    if (oscillator) {
      try {
        oscillator.stop();
        oscillator.disconnect();
        this.oscillators.delete(key);
      } catch (error) {}
    }

    if (gainNode) {
      try {
        gainNode.disconnect();
        this.gainNodes.delete(key);
      } catch (error) {}
    }

    this.stopInterval(key);
  }

  private stopInterval(key: string): void {
    const existingInterval = this.intervals.get(key);
    if (existingInterval) {
      clearInterval(existingInterval);
      this.intervals.delete(key);
    }
  }

  stopAll(): void {
    Array.from(this.oscillators.keys()).forEach(key => {
      this.stop(key);
    });
    
    this.intervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.intervals.clear();
  }
}