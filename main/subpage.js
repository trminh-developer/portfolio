/* ============================================================
   CYBER DEFENDER – Subpage Shared JavaScript
   Background canvas + skill bars + entrance animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. BACKGROUND PARTICLE CANVAS ── */
  const bgCanvas = document.getElementById('bgCanvas');
  if (!bgCanvas) return;
  const bgCtx = bgCanvas.getContext('2d');

  const particles = [];
  for (let i = 0; i < 70; i++) {
    particles.push({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      r:     Math.random() * 1.4 + 0.3,
      vx:    (Math.random() - 0.5) * 0.28,
      vy:    (Math.random() - 0.5) * 0.28,
      alpha: Math.random() * 0.5 + 0.15
    });
  }

  function drawBg() {
    const W = bgCanvas.width  = window.innerWidth;
    const H = bgCanvas.height = document.documentElement.scrollHeight;

    /* deep gradient */
    const grad = bgCtx.createRadialGradient(W * 0.5, 300, 0, W * 0.5, 300, Math.max(W, H) * 0.8);
    grad.addColorStop(0,   '#050f24');
    grad.addColorStop(0.5, '#020b18');
    grad.addColorStop(1,   '#01060f');
    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0, 0, W, H);

    /* grid */
    bgCtx.strokeStyle = 'rgba(0,100,200,0.055)';
    bgCtx.lineWidth = 1;
    const gs = 60;
    for (let x = 0; x < W; x += gs) { bgCtx.beginPath(); bgCtx.moveTo(x, 0); bgCtx.lineTo(x, H); bgCtx.stroke(); }
    for (let y = 0; y < H; y += gs) { bgCtx.beginPath(); bgCtx.moveTo(0, y); bgCtx.lineTo(W, y); bgCtx.stroke(); }

    /* glow */
    const glow = bgCtx.createRadialGradient(W * 0.5, 280, 0, W * 0.5, 280, 320);
    glow.addColorStop(0, 'rgba(0,80,255,0.14)');
    glow.addColorStop(1, 'transparent');
    bgCtx.fillStyle = glow;
    bgCtx.fillRect(0, 0, W, H);

    /* particles */
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      bgCtx.beginPath();
      bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      bgCtx.fillStyle = `rgba(0,200,255,${p.alpha})`;
      bgCtx.fill();
    });

    /* connections */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          bgCtx.strokeStyle = `rgba(0,150,255,${0.1 * (1 - d / 110)})`;
          bgCtx.lineWidth = 0.5;
          bgCtx.beginPath();
          bgCtx.moveTo(particles[i].x, particles[i].y);
          bgCtx.lineTo(particles[j].x, particles[j].y);
          bgCtx.stroke();
        }
      }
    }

    requestAnimationFrame(drawBg);
  }
  drawBg();


  /* ── 2. SKILL BAR ANIMATION ── */
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (bars.length > 0) {
    // Use IntersectionObserver so bars animate when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const val = bar.dataset.value || '0';
          setTimeout(() => { bar.style.width = val + '%'; }, 200);
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => observer.observe(bar));
  }


  /* ── 3. NAVBAR SCROLL SHADOW ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
        navbar.style.background = 'rgba(2,8,20,0.97)';
      } else {
        navbar.style.boxShadow = '';
        navbar.style.background = '';
      }
    });
  }


  /* ── 4. ENTRANCE FADE-UP for cards not using CSS animation ── */
  const fadeEls = document.querySelectorAll('.fade-up');
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => {
    el.style.animationPlayState = 'paused';
    fadeObs.observe(el);
  });


  /* ── 5. HAMBURGER MENU ── */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  function openDrawer() {
    hamburgerBtn.classList.add('nav-open');
    mobileDrawer.classList.add('nav-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    hamburgerBtn.classList.remove('nav-open');
    mobileDrawer.classList.remove('nav-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburgerBtn.classList.contains('nav-open') ? closeDrawer() : openDrawer();
    });

    /* Close when a drawer link is clicked */
    mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        closeDrawer();
      }
    });

    /* Auto-close if window resizes to desktop */
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeDrawer();
    });
  }

});
