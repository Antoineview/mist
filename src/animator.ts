export interface AnimateOptions {
  duration: number;
  blur: number;
  y: number;
  easing: string;
  reverse: boolean;
  delay: number;
}

const PROP_FILTER = 'filter';
const PROP_OPACITY = 'opacity';
const PROP_TRANSFORM = 'transform';

export function animatePart(el: HTMLElement, opts: AnimateOptions): Animation {
  const fromBlur = `blur(${opts.blur}px)`;
  const toBlur = 'blur(0px)';
  const fromTransform = `translate3d(0, ${opts.y}px, 0)`;
  const toTransform = 'translate3d(0, 0, 0)';

  const fromKeyframe: Keyframe = {
    [PROP_FILTER]: fromBlur,
    [PROP_OPACITY]: 0,
    [PROP_TRANSFORM]: fromTransform,
  };
  const toKeyframe: Keyframe = {
    [PROP_FILTER]: toBlur,
    [PROP_OPACITY]: 1,
    [PROP_TRANSFORM]: toTransform,
  };

  const keyframes = opts.reverse ? [toKeyframe, fromKeyframe] : [fromKeyframe, toKeyframe];

  const anim = el.animate(keyframes, {
    duration: opts.duration,
    delay: opts.delay,
    easing: opts.easing,
    fill: 'both',
  });
  return anim;
}
