import { createScope } from './scope.js';

// The template's starfield and glass lens are shared by every route.
export function initializeBackground() {
  const scope = createScope();
  const { requestAnimationFrame } = scope;
  scope.requestAnimationFrame(() => {
        const starCanvas = document.getElementById("starfield");
        const sCtx = starCanvas.getContext("2d", { alpha:true });
        if (!sCtx) return;
        let sw = window.innerWidth, sh = window.innerHeight;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const random = (min,max) => min + Math.random()*(max-min);
        let stars = [];
        function makeDust(initial=true) {
            // 0: rất xa, 1: gần. Độ sáng, kích thước và tốc độ đều tùy khoảng cách.
            const depth = Math.pow(Math.random(),1.8);
            return {
                x:Math.random()*sw, y:initial ? Math.random()*sh : sh+random(3,24),
                depth, radius:.25+depth*2.25+Math.random()*.35,
                speed:2.4+depth*32+random(0,7),
                horizontal:random(-2.3,2.3),
                alpha:.22+depth*.63,
                phase:random(0,Math.PI*2), twinkle:random(.25,1.25),
                color:Math.random()>.87 ? "192,217,255":"245,248,255"
            };
        }
        function resizeSky() {
            sw=window.innerWidth; sh=window.innerHeight;
            const dpr=Math.min(window.devicePixelRatio||1,window.innerWidth<=760?1.5:2);
            starCanvas.width=Math.round(sw*dpr); starCanvas.height=Math.round(sh*dpr);
            sCtx.setTransform(dpr,0,0,dpr,0,0);
            const target=sw<=760
                ? Math.min(145,Math.max(65,Math.floor(sw*sh/6900)))
                : Math.min(315,Math.max(125,Math.floor(sw*sh/5100)));
            stars=Array.from({length:target},()=>makeDust());
        }
        resizeSky();

        /* Kính lúp live: phóng nhẹ lớp sao thực ngay phía sau thanh nav,
           kết hợp blur/saturation trên nền trang để tạo cảm giác khúc xạ. */
        const navGlass = document.querySelector('header nav');
        const navLens = document.getElementById('navMagnifier');
        const navLensContext = navLens ? navLens.getContext('2d', { alpha: true }) : null;
        let lastLensPaint = -Infinity;
        function updateNavLens(now) {
            if (!navGlass || !navLensContext || window.innerWidth <= 760 || now - lastLensPaint < 34) return;
            lastLensPaint = now;
            const r = navGlass.getBoundingClientRect();
            const w = Math.max(1, r.width), h = Math.max(1, r.height);
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const pxWidth = Math.round(w * dpr), pxHeight = Math.round(h * dpr);
            if (navLens.width !== pxWidth || navLens.height !== pxHeight) {
                navLens.width = pxWidth; navLens.height = pxHeight;
            }
            navLensContext.setTransform(dpr,0,0,dpr,0,0);
            navLensContext.clearRect(0,0,w,h);
            const zoom = 1.24;
            const readW = w / zoom, readH = h / zoom;
            const x = Math.min(Math.max(0, r.left + (w - readW)/2), Math.max(0, sw-readW));
            const y = Math.min(Math.max(0, r.top + (h - readH)/2), Math.max(0, sh-readH));
            const skyRatio = starCanvas.width / Math.max(1, sw);
            navLensContext.drawImage(starCanvas,
                x * skyRatio, y * skyRatio, readW * skyRatio, readH * skyRatio,
                0, 0, w, h);
        }
        if (navGlass) {
            scope.listen(navGlass, 'pointermove', event => {
                const rect = navGlass.getBoundingClientRect();
                navGlass.style.setProperty('--lens-x', `${event.clientX - rect.left}px`);
            }, {passive:true});
        }

        const meteors=[];
        let meteorCooldown=1.35;
        function spawnMeteor() {
            const a=Math.PI*random(.16,.29), speed=Math.min(sw,sh)*random(1.28,2.06);
            meteors.push({
                x:random(sw*.08,sw*.93), y:random(-sh*.1,sh*.5),
                vx:Math.cos(a)*speed, vy:Math.sin(a)*speed,
                width:random(1.15,2.1), length:random(90,220), life:0,maxLife:random(.48,.81)
            });
        }
        let lastSkyTime=performance.now();
        function renderStars(now) {
            const dt=Math.min((now-lastSkyTime)/1000,.045); lastSkyTime=now;
            sCtx.clearRect(0,0,sw,sh);
            const base=sCtx.createRadialGradient(sw*.17,sh*.53,0,sw*.17,sh*.53,Math.max(sw,sh)*.62);
            base.addColorStop(0,"rgba(25,64,130,.17)"); base.addColorStop(.4,"rgba(13,35,81,.065)");base.addColorStop(1,"rgba(0,0,0,0)");
            sCtx.fillStyle=base; sCtx.fillRect(0,0,sw,sh);
            stars.forEach((star,i)=>{
                const move=prefersReducedMotion ? 0 : dt;
                star.y -= star.speed*move;   // Tất cả lớp bụi sao đều BAY LÊN
                star.x += star.horizontal*move;
                if(star.y < -star.radius-8 || star.x< -15 || star.x > sw+15) stars[i]=makeDust(false);
                const sparkle=.84+.16*Math.sin(now*.0008*star.twinkle+star.phase);
                const opacity=star.alpha*sparkle;
                if(star.depth>.82) {
                    // Halo chỉ xuất hiện quanh vài hạt gần, không làm toàn cảnh chói.
                    sCtx.fillStyle=`rgba(160,204,255,${opacity*.11})`;
                    sCtx.beginPath();sCtx.arc(star.x,star.y,star.radius*3,0,Math.PI*2);sCtx.fill();
                }
                sCtx.fillStyle=`rgba(${star.color},${opacity})`;
                sCtx.beginPath();sCtx.arc(star.x,star.y,star.radius,0,Math.PI*2);sCtx.fill();
            });
            if(!prefersReducedMotion) {
                meteorCooldown-=dt;
                if(meteorCooldown<=0 && meteors.length<2) {
                    spawnMeteor(); meteorCooldown=random(1.35,3.65);
                }
                for(let i=meteors.length-1;i>=0;i--) {
                    const m=meteors[i];m.life+=dt;m.x+=m.vx*dt;m.y+=m.vy*dt;
                    const fade=Math.sin(Math.PI*Math.min(1,m.life/m.maxLife));
                    const v=Math.hypot(m.vx,m.vy);
                    const tailX=m.x-m.vx/v*m.length,tailY=m.y-m.vy/v*m.length;
                    const grad=sCtx.createLinearGradient(m.x,m.y,tailX,tailY);
                    grad.addColorStop(0,`rgba(245,249,255,${fade*.95})`);
                    grad.addColorStop(.24,`rgba(143,195,255,${fade*.68})`);
                    grad.addColorStop(1,"rgba(75,113,191,0)");
                    sCtx.strokeStyle=grad;sCtx.lineWidth=m.width;sCtx.lineCap="round";
                    sCtx.beginPath();sCtx.moveTo(m.x,m.y);sCtx.lineTo(tailX,tailY);sCtx.stroke();
                    sCtx.fillStyle=`rgba(255,255,255,${fade*.7})`;
                    sCtx.beginPath();sCtx.arc(m.x,m.y,1.7,0,Math.PI*2);sCtx.fill();
                    if(m.life>=m.maxLife||m.x>sw+240||m.y>sh+240) meteors.splice(i,1);
                }
            }
            updateNavLens(now);
            requestAnimationFrame(renderStars);
        }
        requestAnimationFrame(renderStars);
        scope.listen(window, "resize",resizeSky,{passive:true});


  });
  return () => scope.dispose();
}
