import { animatePart } from './animator';
import { splitElement, type SplitMode, type SplitResult } from './utils/split';

export interface MistOptions {
  split?: SplitMode;
  stagger?: number;
  duration?: number;
  blur?: number;
  y?: number;
  easing?: string;
  autoIn?: boolean;
}

const DEFAULTS: Required<MistOptions> = {
  split: 'word',
  stagger: 60,
  duration: 800,
  blur: 20,
  y: 12,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  autoIn: false,
};

type Direction = 'in' | 'out';

export class Mist {
  private readonly el: HTMLElement;
  private opts: Required<MistOptions>;
  private split: SplitResult | null = null;
  private animations: Animation[] = [];
  private state: Direction = 'out';

  constructor(el: HTMLElement, options: MistOptions = {}) {
    this.el = el;
    this.opts = { ...DEFAULTS, ...options };
    this.applySplit();
    this.setInitialHidden();
    if (this.opts.autoIn) this.in();
  }

  in(): Promise<void> {
    return this.run('in');
  }

  out(): Promise<void> {
    return this.run('out');
  }

  toggle(): Promise<void> {
    return this.state === 'in' ? this.out() : this.in();
  }

  update(patch: MistOptions): void {
    const prevSplit = this.opts.split;
    this.opts = { ...this.opts, ...patch };
    if (patch.split && patch.split !== prevSplit) {
      this.applySplit();
      if (this.state === 'out') this.setInitialHidden();
    }
  }

  destroy(): void {
    this.cancelAnimations();
    if (this.split) this.split.cleanup();
    this.split = null;
  }

  private applySplit(): void {
    if (this.split) this.split.cleanup();
    this.split = splitElement(this.el, this.opts.split);
  }

  private setInitialHidden(): void {
    if (!this.split) return;
    for (const part of this.split.parts) {
      part.style.opacity = '0';
      part.style.filter = `blur(${this.opts.blur}px)`;
      part.style.transform = `translate3d(0, ${this.opts.y}px, 0)`;
    }
  }

  private cancelAnimations(): void {
    for (const a of this.animations) a.cancel();
    this.animations = [];
  }

  private async run(direction: Direction): Promise<void> {
    if (!this.split) return;
    this.cancelAnimations();
    this.state = direction;

    const reverse = direction === 'out';
    const parts = reverse ? [...this.split.parts].reverse() : this.split.parts;

    parts.forEach((part, i) => {
      const anim = animatePart(part, {
        duration: this.opts.duration,
        blur: this.opts.blur,
        y: this.opts.y,
        easing: this.opts.easing,
        reverse,
        delay: i * this.opts.stagger,
      });
      this.animations.push(anim);
    });

    await Promise.all(this.animations.map((a) => a.finished.catch(() => undefined)));
  }
}
