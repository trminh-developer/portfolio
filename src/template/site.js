import { createScope } from './scope.js';
import { initializeMirror } from './mirror.js';

export function initializePageEffects() {
  const scope = createScope();
  scope.requestAnimationFrame(() => {
    initializeMirror(scope);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealBar = (bar) => { bar.style.width = `${bar.dataset.value}%`; };
    const bars = document.querySelectorAll('#page-content .skill-bar-fill');
    if (reduced) bars.forEach(revealBar);
    else {
      const observer = new scope.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealBar(entry.target);
          observer.unobserve(entry.target);
        });
      }, { threshold: .1 });
      bars.forEach((bar) => observer.observe(bar));
    }
    if (reduced) return;
    const observer = new scope.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .05 });
    document.querySelectorAll('#page-content .fade-up').forEach((element, index) => {
      element.classList.add('reveal-ready');
      element.style.setProperty('--reveal-delay', `${Math.min(index * 65, 195)}ms`);
      observer.observe(element);
    });
  });
  return () => scope.dispose();
}
