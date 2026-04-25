import { Mist } from '../src';
import type { SplitMode } from '../src';

const target = document.getElementById('target') as HTMLDivElement;
const textEl = document.getElementById('text') as HTMLInputElement;
const splitEl = document.getElementById('split') as HTMLSelectElement;
const staggerEl = document.getElementById('stagger') as HTMLInputElement;
const durationEl = document.getElementById('duration') as HTMLInputElement;
const blurEl = document.getElementById('blur') as HTMLInputElement;
const yEl = document.getElementById('y') as HTMLInputElement;

const inBtn = document.getElementById('in') as HTMLButtonElement;
const outBtn = document.getElementById('out') as HTMLButtonElement;
const toggleBtn = document.getElementById('toggle') as HTMLButtonElement;
const replayBtn = document.getElementById('replay') as HTMLButtonElement;

const valueSpans = {
  stagger: document.getElementById('stagger-v')!,
  duration: document.getElementById('duration-v')!,
  blur: document.getElementById('blur-v')!,
  y: document.getElementById('y-v')!,
};

let opts = {
  split: 'word' as SplitMode,
  stagger: 60,
  duration: 800,
  blur: 20,
  y: 12,
};

const mist = new Mist(target, { ...opts, autoIn: true });

textEl.addEventListener('input', () => {
  target.textContent = textEl.value;
  mist.update({ split: opts.split });
  mist.in();
});

splitEl.addEventListener('change', () => {
  opts.split = splitEl.value as SplitMode;
  target.textContent = textEl.value;
  mist.update({ split: opts.split });
  mist.in();
});

function bindRange(el: HTMLInputElement, key: 'stagger' | 'duration' | 'blur' | 'y') {
  el.addEventListener('input', () => {
    const v = parseFloat(el.value);
    valueSpans[key].textContent = String(v);
    opts = { ...opts, [key]: v };
    mist.update({ [key]: v });
  });
}
bindRange(staggerEl, 'stagger');
bindRange(durationEl, 'duration');
bindRange(blurEl, 'blur');
bindRange(yEl, 'y');

inBtn.addEventListener('click', () => mist.in());
outBtn.addEventListener('click', () => mist.out());
toggleBtn.addEventListener('click', () => mist.toggle());
replayBtn.addEventListener('click', async () => {
  await mist.out();
  await mist.in();
});
