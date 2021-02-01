import { Notes } from './types';

const NoteToFreq: { [key in Notes]: number } = {
  [Notes.c]: 261.63,
  [Notes.d]: 293.66,
  [Notes.e]: 329.63,
  [Notes.f]: 349.23,
  [Notes.g]: 392.0,
  [Notes.a]: 440.0,
  [Notes.b]: 493.88,
};

type Oscilator = {
  start: () => void;
  stop: () => void;
  change: (freq: number) => void;
};

const Oscilators: { [key in Notes]: Oscilator } = {
  [Notes.c]: null,
  [Notes.d]: null,
  [Notes.e]: null,
  [Notes.f]: null,
  [Notes.g]: null,
  [Notes.a]: null,
  [Notes.b]: null,
};

export class Synth {
  private _baseOctave = 4;
  private _octave: number;

  private audioCtx: AudioContext = null;

  get octave() {
    return this._octave;
  }

  set octave(newOctave) {
    this._octave = newOctave;
  }

  constructor(octave: number = 4) {
    this._octave = octave;
  }

  handlePlay = (note: Notes) => {
    if (Oscilators[note] === null) {
      const baseFrequency = NoteToFreq[note];
      const frequency =
        baseFrequency * Math.pow(2, this._octave - this._baseOctave);

      const oscillator = this.getOscillator(frequency);

      Oscilators[note] = oscillator;
      Oscilators[note].start();
    }
  };

  handleStop = (note: Notes) => {
    if (Oscilators[note] !== null) {
      Oscilators[note].stop();
      Oscilators[note] = null;
    }
  };

  getOscillator(startFrequency: number) {
    this.audioCtx = this.audioCtx
      ? this.audioCtx
      : // @ts-ignore
        new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = this.audioCtx.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(
      startFrequency,
      this.audioCtx.currentTime
    );
    oscillator.connect(this.audioCtx.destination);

    const start = () => oscillator.start();
    const stop = () => oscillator.stop();
    const change = (frequency: number) =>
      oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime); // value in hertz

    return { start, stop, change };
  }
}
