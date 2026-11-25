import { useCallback, useEffect, useRef, useState } from 'react';

export function useInterfaceSound() {
  const [enabled, setEnabled] = useState(false);
  const context = useRef<AudioContext | null>(null);
  const tick = useCallback((kind: 'hover' | 'click' = 'click') => {
    try {
      if (!window.AudioContext) return;
      context.current ??= new AudioContext();
      const audio = context.current;
      if (audio.state === 'suspended') void audio.resume();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      const now = audio.currentTime;
      const frequency = kind === 'hover' ? 520 : 640;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * .72, now + .045);
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(kind === 'hover' ? .025 : .06, now + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, now + .085);
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start(now);
      oscillator.stop(now + .09);
    } catch { /* Audio is optional on devices that do not support it. */ }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const click = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a, button, .lanyard-hit-zone')) tick();
    };
    const hover = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('.nav-link, .btn-primary, .btn-secondary, .social-icon');
      if (link && !(event.relatedTarget instanceof Node && link.contains(event.relatedTarget))) tick('hover');
    };
    document.addEventListener('click', click);
    document.addEventListener('pointerover', hover);
    return () => {
      document.removeEventListener('click', click);
      document.removeEventListener('pointerover', hover);
    };
  }, [enabled, tick]);

  useEffect(() => () => { void context.current?.close().catch(() => {}); context.current = null; }, []);

  return { enabled, toggle: () => { if (!enabled) tick(); setEnabled((value) => !value); } };
}
