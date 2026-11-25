import { createScope } from './scope.js';
import { initializeIntro } from './intro.js';
import { initializeLoading } from './loading.js';
import { initializeScene } from './scene.js';
import { initializeAbout } from './about.js';
import { initializeReveal } from './reveal.js';
import { initializeComments } from './comments.js';
import { initializeAmbient } from './ambient.js';
import { connectContactForm } from './contact';

export function initializePortfolio() {
  const scope = createScope();
  // StrictMode's first effect is cleaned up before the next browser frame.
  scope.requestAnimationFrame(() => {
    for (const initialize of [initializeIntro, initializeLoading, initializeScene,
      initializeAbout, initializeReveal, initializeComments, initializeAmbient]) {
      try {
        Promise.resolve(initialize(scope)).catch((error) => {
          if (scope.active) console.error('Portfolio effect failed', error);
        });
      } catch (error) {
        console.error('Portfolio effect failed', error);
      }
    }
    scope.defer(connectContactForm());
  });
  return () => scope.dispose();
}
