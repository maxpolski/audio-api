import { SynthUI } from './ui';

const synthUI = new SynthUI(document.getElementById('app')!, {
  octaves: [
    { name: '1', value: 1 },
    { name: '2', value: 2 },
    { name: '3', value: 3 },
    { name: '4', value: 4 },
    { name: '5', value: 5 },
  ],
});

synthUI.initialize();
