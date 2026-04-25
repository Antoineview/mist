export type SplitMode = 'word' | 'line' | 'char';

export interface SplitResult {
  parts: HTMLElement[];
  cleanup: () => void;
}

const ATTR = 'data-mist-original';

function captureOriginal(el: HTMLElement): void {
  if (el.hasAttribute(ATTR)) return;
  el.setAttribute(ATTR, el.innerHTML);
}

function restoreOriginal(el: HTMLElement): void {
  const orig = el.getAttribute(ATTR);
  if (orig !== null) {
    el.innerHTML = orig;
    el.removeAttribute(ATTR);
  }
}

function makePart(content: string, isWhitespace = false): HTMLSpanElement {
  const span = document.createElement('span');
  span.textContent = content;
  span.style.display = 'inline-block';
  span.style.willChange = 'filter, opacity, transform';
  if (isWhitespace) {
    span.style.whiteSpace = 'pre';
  }
  return span;
}

function splitWords(text: string): HTMLElement[] {
  const parts: HTMLElement[] = [];
  const tokens = text.split(/(\s+)/);
  for (const token of tokens) {
    if (token.length === 0) continue;
    if (/^\s+$/.test(token)) {
      parts.push(makePart(token, true));
    } else {
      parts.push(makePart(token));
    }
  }
  return parts;
}

function splitChars(text: string): HTMLElement[] {
  const parts: HTMLElement[] = [];
  for (const ch of Array.from(text)) {
    parts.push(makePart(ch, /\s/.test(ch)));
  }
  return parts;
}

// Lines are computed by measuring word offsetTop after layout.
function splitLines(el: HTMLElement, text: string): HTMLElement[] {
  const wordSpans = splitWords(text);
  el.innerHTML = '';
  for (const span of wordSpans) el.appendChild(span);

  const lines: HTMLElement[][] = [];
  let currentTop: number | null = null;
  let currentLine: HTMLElement[] = [];

  for (const span of wordSpans) {
    if (/^\s+$/.test(span.textContent ?? '')) {
      if (currentLine.length > 0) currentLine.push(span);
      continue;
    }
    const top = span.offsetTop;
    if (currentTop === null || top !== currentTop) {
      if (currentLine.length > 0) lines.push(currentLine);
      currentLine = [span];
      currentTop = top;
    } else {
      currentLine.push(span);
    }
  }
  if (currentLine.length > 0) lines.push(currentLine);

  el.innerHTML = '';
  const lineSpans: HTMLElement[] = [];
  for (const line of lines) {
    const wrap = document.createElement('span');
    wrap.style.display = 'block';
    wrap.style.willChange = 'filter, opacity, transform';
    let buf = '';
    for (const w of line) buf += w.textContent ?? '';
    wrap.textContent = buf.trim();
    el.appendChild(wrap);
    lineSpans.push(wrap);
  }
  return lineSpans;
}

export function splitElement(el: HTMLElement, mode: SplitMode): SplitResult {
  captureOriginal(el);
  const text = el.textContent ?? '';

  let parts: HTMLElement[];
  if (mode === 'line') {
    parts = splitLines(el, text);
  } else {
    el.innerHTML = '';
    parts = mode === 'char' ? splitChars(text) : splitWords(text);
    for (const p of parts) el.appendChild(p);
  }

  return {
    parts,
    cleanup: () => restoreOriginal(el),
  };
}
