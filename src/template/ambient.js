
export function initializeAmbient(scope) {
const { requestAnimationFrame, cancelAnimationFrame, setTimeout, clearTimeout, setInterval, clearInterval, IntersectionObserver, MutationObserver, ResizeObserver } = scope;
(() => {
        const field = document.getElementById('marsDustField');
        const about = document.getElementById('about');
        if (field) {
          const count = window.innerWidth < 768 ? 18 : 28;
          for (let i = 0; i < count; i++) {
            const dot = document.createElement('span');
            dot.className = 'mars-v29-dust';
            const rightCluster = Math.random() > 0.45;
            const sx = (rightCluster ? 40 + Math.random() * 12 : 12 + Math.random() * 20).toFixed(2) + '%';
            const sy = (rightCluster ? 60 + Math.random() * 10 : 34 + Math.random() * 12).toFixed(2) + '%';
            const dx = (rightCluster ? 12 + Math.random() * 18 : -10 - Math.random() * 16).toFixed(2) + 'vw';
            const dy = (rightCluster ? 2 + Math.random() * 10 : -4 - Math.random() * 10).toFixed(2) + 'vh';
            dot.style.setProperty('--sx', sx);
            dot.style.setProperty('--sy', sy);
            dot.style.setProperty('--dx', dx);
            dot.style.setProperty('--dy', dy);
            dot.style.setProperty('--dur', (6 + Math.random() * 7).toFixed(2) + 's');
            dot.style.setProperty('--delay', (-Math.random() * 12).toFixed(2) + 's');
            dot.style.setProperty('--size', (1.4 + Math.random() * 2.8).toFixed(2) + 'px');
            dot.style.setProperty('--blur', (Math.random() * 1.3).toFixed(2) + 'px');
            field.appendChild(dot);
          }
        }
        if (about && !about.querySelector('.about-ufo')) {
          const ufo = document.createElement('div');
          ufo.className = 'about-ufo';
          ufo.setAttribute('aria-hidden', 'true');
          ufo.innerHTML = '<span class="ufo-light"></span><span class="ufo-light"></span><span class="ufo-light"></span><span class="ufo-light"></span><span class="ufo-light"></span><span class="ufo-beam"></span>';
          about.appendChild(ufo);
        }
      })();

}
