import { describe, it, expect, beforeEach } from 'vitest';
import { splitElement } from '../src/utils/split';

describe('splitElement', () => {
  let host: HTMLDivElement;

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
  });

  it('splits into word spans preserving whitespace tokens', () => {
    host.textContent = 'hello world friend';
    const { parts } = splitElement(host, 'word');
    expect(parts.filter((p) => /\S/.test(p.textContent ?? '')).length).toBe(3);
    expect(host.querySelectorAll('span').length).toBe(parts.length);
  });

  it('splits into char spans', () => {
    host.textContent = 'abc';
    const { parts } = splitElement(host, 'char');
    expect(parts.length).toBe(3);
    expect(parts.map((p) => p.textContent).join('')).toBe('abc');
  });

  it('cleanup restores original innerHTML', () => {
    host.innerHTML = '<em>hi</em> there';
    const { cleanup } = splitElement(host, 'word');
    expect(host.innerHTML).not.toBe('<em>hi</em> there');
    cleanup();
    expect(host.innerHTML).toBe('<em>hi</em> there');
  });
});
