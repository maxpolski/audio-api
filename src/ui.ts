import { Synth } from './engine';

import { Notes } from './engine/types';

enum Keys {
  'a' = 'a',
  's' = 's',
  'd' = 'd',
  'f' = 'f',
  'g' = 'g',
  'h' = 'h',
  'j' = 'j',
}

const ButtonToNote: { [key in Keys]: Notes } = {
  [Keys.a]: Notes.c,
  [Keys.s]: Notes.d,
  [Keys.d]: Notes.e,
  [Keys.f]: Notes.f,
  [Keys.g]: Notes.g,
  [Keys.h]: Notes.a,
  [Keys.j]: Notes.b,
};

type Octave = { name: string; value: number };

type SynthUIConfig = {
  octaves: Array<Octave>;
};

export class SynthUI {
  private rootElement: HTMLElement;
  private octaves: Array<Octave>;
  private onOctaveChange: (oct: number) => void;
  private octave = 4;
  private synth: Synth;

  constructor(rootElem: HTMLElement, config: SynthUIConfig) {
    this.rootElement = rootElem;
    this.octaves = config.octaves;
    this.synth = new Synth();
    this.onOctaveChange = (newOctave: number) =>
      (this.synth.octave = newOctave);
  }

  initialize() {
    document.addEventListener('keydown', (e) => {
      if (e.key in Keys) {
        this.synth.handlePlay(ButtonToNote[e.key as Keys]);
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.key in Keys) {
        this.synth.handleStop(ButtonToNote[e.key as Keys]);
      }
    });

    this.synth.octave = this.octave;
    this.render();
  }

  private createRadio(radioName: string, octave: Octave) {
    const p = document.createElement('p');
    const label = document.createElement('label');
    const radio = document.createElement('input');
    const radioId = `radio-${radioName}-${octave.value}`;

    label.innerText = octave.name;
    label.htmlFor = radioId;

    radio.id = radioId;
    radio.type = 'radio';
    radio.name = radioName;
    radio.value = octave.value.toString();
    radio.checked = octave.value === this.octave;
    radio.addEventListener('change', (evt) => {
      // @ts-ignore
      const selectedVal = evt.target.value;
      this.octave = selectedVal;
      this.onOctaveChange(selectedVal);
    });

    p.appendChild(label);
    p.appendChild(radio);

    return p;
  }

  private createOctaveSelector() {
    const div = document.createElement('div');
    const legend = document.createElement('legend');

    legend.innerText = 'Octave';

    div.appendChild(legend);

    const octavesRadios = this.octaves.map((oct) =>
      this.createRadio('octave', oct)
    );
    octavesRadios.forEach((r) => div.appendChild(r));

    return div;
  }

  render() {
    this.rootElement.appendChild(this.createOctaveSelector());
  }
}
