# mist

Apple Vision-style fluid blur animations for text entry / exit.

Framework-agnostic core + a thin React wrapper. Uses the Web Animations API and native CSS `filter: blur()` so the compositor handles the heavy lifting.

## Install

```sh
npm install mist
```

## Vanilla usage

```ts
import { Mist } from 'mist';

const el = document.querySelector('h1')!;
const m = new Mist(el, {
  split: 'word',
  stagger: 60,
  duration: 800,
  blur: 20,
  y: 12,
});

m.in();
m.out();
m.toggle();
m.destroy();
```

## React usage

```tsx
import { MistText } from 'mist/react';

<MistText text="A small thing, well-made, can change a day." split="word" />
```

`react` and `react-dom` are peer dependencies.

## Options

| Option     | Type                            | Default                              |
| ---------- | ------------------------------- | ------------------------------------ |
| `split`    | `'word' \| 'line' \| 'char'`    | `'word'`                             |
| `stagger`  | `number` (ms)                   | `60`                                 |
| `duration` | `number` (ms)                   | `800`                                |
| `blur`     | `number` (px)                   | `20`                                 |
| `y`        | `number` (px)                   | `12`                                 |
| `easing`   | `string`                        | `'cubic-bezier(0.22, 1, 0.36, 1)'`   |
| `autoIn`   | `boolean`                       | `false`                              |

## Licence

MIT.
