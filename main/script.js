/* Animations: background canvas, monitor chart, globe, counters */

document.addEventListener('DOMContentLoaded', () => {

  /*  1. BACKGROUND PARTICLE CANVAS  */
  const bgCanvas = document.getElementById('bgCanvas');
  const bgCtx = bgCanvas.getContext('2d');
  let W, H, particles = [], lines = [];

  function resizeBg() {
    W = bgCanvas.width = window.innerWidth;
    H = bgCanvas.height = window.innerHeight;
  }
  resizeBg();
  window.addEventListener('resize', resizeBg);

  /* Particles */
  for (let i = 0; i < 90; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.2
    });
  }

  function drawBg() {
    W = bgCanvas.width = window.innerWidth;
    H = bgCanvas.height = window.innerHeight;

    /* deep gradient background */
    const grad = bgCtx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.8);
    grad.addColorStop(0, '#050f24');
    grad.addColorStop(0.5, '#020b18');
    grad.addColorStop(1, '#01060f');
    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0, 0, W, H);

    /* grid lines */
    bgCtx.strokeStyle = 'rgba(0,100,200,0.06)';
    bgCtx.lineWidth = 1;
    const gs = 60;
    for (let x = 0; x < W; x += gs) {
      bgCtx.beginPath(); bgCtx.moveTo(x, 0); bgCtx.lineTo(x, H); bgCtx.stroke();
    }
    for (let y = 0; y < H; y += gs) {
      bgCtx.beginPath(); bgCtx.moveTo(0, y); bgCtx.lineTo(W, y); bgCtx.stroke();
    }

    /* blue accent glow top-center */
    const glow = bgCtx.createRadialGradient(W * 0.42, H * 0.45, 0, W * 0.42, H * 0.45, 260);
    glow.addColorStop(0, 'rgba(0,80,255,0.18)');
    glow.addColorStop(1, 'transparent');
    bgCtx.fillStyle = glow;
    bgCtx.fillRect(0, 0, W, H);

    /* right glow */
    const glow2 = bgCtx.createRadialGradient(W * 0.85, H * 0.6, 0, W * 0.85, H * 0.6, 200);
    glow2.addColorStop(0, 'rgba(0,50,180,0.12)');
    glow2.addColorStop(1, 'transparent');
    bgCtx.fillStyle = glow2;
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

    /* connect nearby particles */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          bgCtx.strokeStyle = `rgba(0,150,255,${0.12 * (1 - d / 100)})`;
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


  /*  2. PROTECTION BARS ANIMATION  */
  setTimeout(() => {
    document.querySelectorAll('.prot-bar').forEach(bar => {
      const val = bar.dataset.value;
      bar.style.width = val + '%';
    });
  }, 400);


  /*  3. REAL-TIME MONITOR CHART  */
  const monCanvas = document.getElementById('monitorChart');
  const monCtx = monCanvas.getContext('2d');
  const monW = 220, monH = 70;
  monCanvas.width = monW;
  monCanvas.height = monH;

  let monPoints = [];
  for (let i = 0; i < 40; i++) monPoints.push(Math.random() * 40 + 15);

  function drawMonitor() {
    monCtx.clearRect(0, 0, monW, monH);
    monCtx.fillStyle = 'rgba(0,10,30,0.5)';
    monCtx.fillRect(0, 0, monW, monH);

    /* grid */
    monCtx.strokeStyle = 'rgba(0,229,255,0.08)';
    monCtx.lineWidth = 0.5;
    for (let y = 0; y <= monH; y += 14) {
      monCtx.beginPath(); monCtx.moveTo(0, y); monCtx.lineTo(monW, y); monCtx.stroke();
    }

    /* area fill */
    const stepX = monW / (monPoints.length - 1);
    const grad = monCtx.createLinearGradient(0, 0, 0, monH);
    grad.addColorStop(0, 'rgba(0,229,255,0.3)');
    grad.addColorStop(1, 'rgba(0,229,255,0)');

    monCtx.beginPath();
    monCtx.moveTo(0, monH - monPoints[0]);
    monPoints.forEach((v, i) => monCtx.lineTo(i * stepX, monH - v));
    monCtx.lineTo(monW, monH);
    monCtx.lineTo(0, monH);
    monCtx.closePath();
    monCtx.fillStyle = grad;
    monCtx.fill();

    /* line */
    monCtx.beginPath();
    monCtx.strokeStyle = '#00e5ff';
    monCtx.lineWidth = 1.5;
    monCtx.shadowBlur = 6;
    monCtx.shadowColor = '#00e5ff';
    monCtx.moveTo(0, monH - monPoints[0]);
    monPoints.forEach((v, i) => monCtx.lineTo(i * stepX, monH - v));
    monCtx.stroke();
    monCtx.shadowBlur = 0;

    /* purple highlight line */
    monCtx.beginPath();
    monCtx.strokeStyle = 'rgba(140,60,255,0.5)';
    monCtx.lineWidth = 1;
    monCtx.setLineDash([3, 5]);
    monCtx.moveTo(0, monH - monPoints[0] + 10);
    monPoints.forEach((v, i) => monCtx.lineTo(i * stepX, monH - v + 8));
    monCtx.stroke();
    monCtx.setLineDash([]);
  }

  setInterval(() => {
    monPoints.shift();
    monPoints.push(Math.random() * 40 + 15);
    drawMonitor();
  }, 120);
  drawMonitor();


  /*  4. SESSIONS COUNTER ANIMATION  */
  const sessEl = document.getElementById('sessions-count');
  let currentSess = 2000;
  const targetSess = 2847;
  function animSessions() {
    if (currentSess < targetSess) {
      currentSess = Math.min(currentSess + 18, targetSess);
      sessEl.textContent = currentSess.toLocaleString();
      requestAnimationFrame(animSessions);
    }
  }
  setTimeout(animSessions, 600);

  /* live pulse after reaching target */
  setInterval(() => {
    const delta = Math.floor(Math.random() * 5 - 2);
    const base = parseInt(sessEl.textContent.replace(/,/g, '')) + delta;
    sessEl.textContent = Math.max(2800, base).toLocaleString();
  }, 3000);


  /*  5. GLOBE CANVAS  */
  const globeCanvas = document.getElementById('globeCanvas');
  const gCtx = globeCanvas.getContext('2d');
  let globeAngle = 0;
  let globeW, globeH;

  function resizeGlobe() {
    const cont = document.getElementById('globe-container');
    globeW = globeCanvas.width = cont.clientWidth;
    globeH = globeCanvas.height = cont.clientHeight;
  }
  resizeGlobe();
  window.addEventListener('resize', resizeGlobe);

  /* generate random dots on globe surface */
  const globeDots = [];
  for (let i = 0; i < 180; i++) {
    const lat = (Math.random() - 0.5) * Math.PI;
    const lon = Math.random() * Math.PI * 2;
    globeDots.push({
      lat, lon,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.6 + 0.2
    });
  }

  /* connections between dots */
  const globeConns = [];
  for (let i = 0; i < 24; i++) {
    globeConns.push({
      a: Math.floor(Math.random() * globeDots.length),
      b: Math.floor(Math.random() * globeDots.length)
    });
  }

  function projectDot(lat, lon, cx, cy, R) {
    const x = R * Math.cos(lat) * Math.cos(lon + globeAngle);
    const y = R * Math.cos(lat) * Math.sin(lon + globeAngle);
    const z = R * Math.sin(lat);
    return { sx: cx + x, sy: cy - z, visible: y > -R * 0.1 };
  }

  function drawGlobe() {
    gCtx.clearRect(0, 0, globeW, globeH);

    const cx = globeW / 2;
    const cy = globeH / 2;
    const R = Math.min(globeW, globeH) * 0.42;

    /* outer glow */
    const radGrad = gCtx.createRadialGradient(cx, cy, R * 0.5, cx, cy, R * 1.1);
    radGrad.addColorStop(0, 'rgba(0,60,180,0.0)');
    radGrad.addColorStop(0.85, 'rgba(0,40,140,0.25)');
    radGrad.addColorStop(1, 'transparent');
    gCtx.fillStyle = radGrad;
    gCtx.beginPath();
    gCtx.arc(cx, cy, R * 1.1, 0, Math.PI * 2);
    gCtx.fill();

    /* globe circle */
    const sGrad = gCtx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 0, cx, cy, R);
    sGrad.addColorStop(0, 'rgba(0,60,180,0.18)');
    sGrad.addColorStop(1, 'rgba(0,20,80,0.08)');
    gCtx.beginPath();
    gCtx.arc(cx, cy, R, 0, Math.PI * 2);
    gCtx.fillStyle = sGrad;
    gCtx.fill();
    gCtx.strokeStyle = 'rgba(0,229,255,0.2)';
    gCtx.lineWidth = 1;
    gCtx.stroke();

    /* latitude lines */
    for (let lat = -60; lat <= 60; lat += 30) {
      const latR = lat * Math.PI / 180;
      const yr = cy - R * Math.sin(latR);
      const xr = R * Math.cos(latR);
      gCtx.beginPath();
      gCtx.ellipse(cx, yr, xr, xr * 0.15, 0, 0, Math.PI * 2);
      gCtx.strokeStyle = 'rgba(0,100,200,0.15)';
      gCtx.lineWidth = 0.5;
      gCtx.stroke();
    }

    /* connections */
    globeConns.forEach(conn => {
      const a = globeDots[conn.a];
      const b = globeDots[conn.b];
      const pa = projectDot(a.lat, a.lon, cx, cy, R);
      const pb = projectDot(b.lat, b.lon, cx, cy, R);
      if (pa.visible && pb.visible) {
        gCtx.beginPath();
        gCtx.moveTo(pa.sx, pa.sy);
        gCtx.lineTo(pb.sx, pb.sy);
        gCtx.strokeStyle = 'rgba(0,229,255,0.15)';
        gCtx.lineWidth = 0.5;
        gCtx.stroke();
      }
    });

    /* dots */
    globeDots.forEach(d => {
      const p = projectDot(d.lat, d.lon, cx, cy, R);
      if (!p.visible) return;
      gCtx.beginPath();
      gCtx.arc(p.sx, p.sy, d.size, 0, Math.PI * 2);
      gCtx.fillStyle = `rgba(0,229,255,${d.alpha})`;
      gCtx.fill();
    });

    globeAngle += 0.004;
    requestAnimationFrame(drawGlobe);
  }
  drawGlobe();


  /*  6. FIREWALL CELL RANDOM BLINK  */
  function randomFirewallBlink() {
    const cells = document.querySelectorAll('.fw-cell');
    const pick = cells[Math.floor(Math.random() * cells.length)];
    if (pick) {
      pick.classList.toggle('fw-active');
      setTimeout(randomFirewallBlink, 200 + Math.random() * 400);
    }
  }
  randomFirewallBlink();


  /*  7. ENTRANCE ANIMATIONS  */
  const animItems = [
    '#widget-protection',
    '#widget-monitor',
    '#widget-sessions',
    '#widget-connect',
    '#widget-firewall',
    '#globe-container',
    '#hero-photo',
    '#name-card',
    '.cta-buttons',
    '#competencies',
  ];

  animItems.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 150 + i * 90);
  });


  /*  8. TYPING EFFECT on tagline  */
  const tagEl = document.querySelector('.title-tagline');
  if (tagEl) {
    const original = tagEl.innerHTML;
    tagEl.innerHTML = '';
    setTimeout(() => {
      tagEl.innerHTML = original;
    }, 900);
  }


  /*  9. HAMBURGER MENU  */
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