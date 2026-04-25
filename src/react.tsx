import { useEffect, useRef } from 'react';
import { Mist, type MistOptions } from './Mist';

export interface MistTextProps extends MistOptions {
  text: string;
  as?: keyof HTMLElementTagNameMap;
  className?: string;
  style?: React.CSSProperties;
  show?: boolean;
}

export function MistText({
  text,
  as = 'div',
  className,
  style,
  show = true,
  split,
  stagger,
  duration,
  blur,
  y,
  easing,
}: MistTextProps): JSX.Element {
  const ref = useRef<HTMLElement | null>(null);
  const mistRef = useRef<Mist | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const m = new Mist(ref.current, { split, stagger, duration, blur, y, easing });
    mistRef.current = m;
    if (show) m.in();
    return () => m.destroy();
  }, []);

  useEffect(() => {
    mistRef.current?.update({ split, stagger, duration, blur, y, easing });
  }, [split, stagger, duration, blur, y, easing]);

  useEffect(() => {
    if (!mistRef.current) return;
    if (show) mistRef.current.in();
    else mistRef.current.out();
  }, [show]);

  useEffect(() => {
    if (!ref.current || !mistRef.current) return;
    ref.current.textContent = text;
    mistRef.current.update({ split });
    if (show) mistRef.current.in();
  }, [text]);

  const Tag = as as 'div';
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={className} style={style}>
      {text}
    </Tag>
  );
}
