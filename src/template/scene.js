import { disposeScene } from "./scope.js";

export function initializeScene(scope) {
const { requestAnimationFrame, cancelAnimationFrame, setTimeout, clearTimeout, setInterval, clearInterval, IntersectionObserver, MutationObserver, ResizeObserver } = scope;
const THREE = window.THREE;
// Ảnh chân dung gốc được nhúng nguyên vẹn, không dùng máy chủ bên ngoài.
        const PORTRAIT_DATA = '/171367.jpg';
        document.getElementById("fallbackPortrait").src = PORTRAIT_DATA;


        /* =========================================
           ĐIỀU HƯỚNG BẰNG BÀN PHÍM (LAPTOP / PC / MAC)
           ↓: mục tiếp theo  |  ↑: mục trước đó
           Không chặn thao tác khi đang nhập văn bản hay dùng phím tắt hệ thống.
        ========================================= */
        const keyboardSections = ["home", "about", "contact"]
            .map(id => document.getElementById(id))
            .filter(Boolean);
        const reduceKeyboardMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let lastKeyboardNavigateAt = -Infinity;

        function currentKeyboardSectionIndex() {
            // Section cuối có thể ngắn hơn chiều cao màn hình: vẫn nhận diện đúng khi đã chạm đáy.
            const scrollMax = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            if (scrollMax > 0 && window.scrollY >= scrollMax - 3) return keyboardSections.length - 1;
            // Lấy mục đang ở gần 1/4 trên màn hình để không bị lệch khi section ngắn.
            const probe = window.scrollY + Math.min(window.innerHeight * 0.27, 220);
            let current = 0;
            for (let i = 0; i < keyboardSections.length; i++) {
                const top = keyboardSections[i].getBoundingClientRect().top + window.scrollY;
                if (top <= probe + 2) current = i;
            }
            return current;
        }

        scope.listen(document, "keydown", event => {
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
            if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing) return;

            const target = event.target;
            if (target instanceof Element && target.closest(
                'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="dialog"]'
            )) return;

            // Chỉ điều khiển các mục chính; tránh nhảy liên tục khi giữ phím.
            event.preventDefault();
            if (event.repeat || keyboardSections.length < 2) return;
            const now = performance.now();
            if (now - lastKeyboardNavigateAt < 650) return;

            const currentIndex = currentKeyboardSectionIndex();
            const direction = event.key === "ArrowDown" ? 1 : -1;
            const nextIndex = Math.max(0, Math.min(keyboardSections.length - 1, currentIndex + direction));
            if (nextIndex === currentIndex) return;

            const nextSection = keyboardSections[nextIndex];
            const top = nextSection.getBoundingClientRect().top + window.scrollY;
            // Bù thanh menu cố định và giữ tiêu đề section trong vùng đọc được.
            const destination = nextIndex === 0 ? 0 : Math.max(0, top - 44);
            lastKeyboardNavigateAt = now;
            window.scrollTo({
                top: destination,
                behavior: reduceKeyboardMotion.matches ? "instant" : "smooth"
            });
        }, { passive: false });

        /* =========================================
           2. TYPEWRITER EFFECT
        ========================================= */
        const words = ["IT Support Engineer", "HelpDesk Specialist", "Web Developer"];
        let wIdx = 0, cIdx = 0, isDel = false;
        const typeEl = document.getElementById("typewriter");
        setInterval(() => {
            const word = words[wIdx];
            typeEl.textContent = (isDel ? word.slice(0, --cIdx) : word.slice(0, ++cIdx)) + " |";
            if (!isDel && cIdx === word.length) isDel = true;
            else if (isDel && cIdx === 0) { isDel = false; wIdx = (wIdx + 1) % words.length; }
        }, 115);

        /* =========================================
           3. STARFIELD: TINH TẾ, TỰ NHIÊN + SAO BĂNG
        ========================================= */
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        /* =========================================
           4. MÔ PHỎNG 3D DÂY ĐEO UYỂN CHUYỂN & XOAY THẺ THỰC TẾ
        ========================================= */
        if (window.THREE) {
          try {
        (function init3DLanyard() {
            const container = document.getElementById("cardContainer");
            const canvas = document.getElementById("lanyardCanvas");

            const scene = new THREE.Scene();
            let renderer;
            scope.defer(() => disposeScene(scene, renderer));
            // Khung vẽ phủ toàn màn hình, camera được neo vào vị trí cột thẻ trong hero.
            const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
            camera.position.set(0, 0.2, 8.2);

            renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth <= 760 ? 1.45 : 2));
            renderer.setSize(window.innerWidth, window.innerHeight, false);

            // Lớp bắt tương tác chỉ phủ vùng hero phải, không che menu hoặc nút bấm.
            const hitZone = document.createElement("div");
            hitZone.className = "lanyard-hit-zone";
            hitZone.setAttribute("aria-hidden", "true");
            container.appendChild(hitZone);
            scope.defer(() => hitZone.remove());
            renderer.outputEncoding = THREE.sRGBEncoding; // tương thích Three.js r128
            renderer.toneMapping = THREE.NoToneMapping; // không đẩy sáng ảnh gốc
            renderer.physicallyCorrectLights = false;

            // Ánh sáng studio tạo hiệu ứng phản chiếu bóng trên thẻ
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.58);
            scene.add(ambientLight);

            const keyLight = new THREE.DirectionalLight(0xffffff, 0.62);
            keyLight.position.set(3, 5, 6);
            scene.add(keyLight);

            const rimLight = new THREE.DirectionalLight(0x60a5fa, 0.28);
            rimLight.position.set(-4, 2, 4);
            scene.add(rimLight);

            const holoLight = new THREE.PointLight(0xa855f7, 0.35, 12);
            holoLight.position.set(1.5, -1, 3.5);
            scene.add(holoLight);

            // --- TẠO TEXTURE MẶT TRƯỚC THẺ ---
            function createFrontTexture() {
                // HiDPI cho chữ và đường kẻ sắc hơn. Hình PNG nguồn giữ nguyên, không chỉnh màu.
                const c=document.createElement("canvas"); c.width=960;c.height=1440;
                const ctx=c.getContext("2d");ctx.scale(1.5,1.5);
                const bg=ctx.createLinearGradient(0,0,640,960);
                bg.addColorStop(0,"#f7f8f6");bg.addColorStop(.55,"#eef2f4");bg.addColorStop(1,"#e8eff7");
                ctx.fillStyle=bg;ctx.fillRect(0,0,640,960);
                ctx.strokeStyle="rgba(29,63,117,.055)";ctx.lineWidth=1;
                for(let x=0;x<=640;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,960);ctx.stroke();}
                for(let y=0;y<=960;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(640,y);ctx.stroke();}

                // Lỗ đục thật ở thân thẻ tương ứng chính xác với đường viền texture.
                ctx.fillStyle="#0a0d13";ctx.beginPath();ctx.roundRect(270,24,100,18,9);ctx.fill();
                ctx.fillStyle="#1b407b";ctx.beginPath();ctx.roundRect(44,67,128,36,5);ctx.fill();
                ctx.font="800 17px Arial, sans-serif";ctx.fillStyle="#fff";ctx.textAlign="left";ctx.fillText("SUPPORT",60,91);
                ctx.fillStyle="#1d3455";ctx.textAlign="right";ctx.font="800 15px Arial, sans-serif";
                ctx.fillText("IT SUPPORT",595,81);ctx.fillText("HELPDESK ENGINEER",595,101);ctx.textAlign="left";
                ctx.fillStyle="#172b4d";ctx.font="900 71px Arial, sans-serif";ctx.fillText("IT SUPPORT",42,179);
                ctx.fillStyle="#4a78b1";ctx.fillRect(44,190,505,3);

                const px=44,py=206,pw=505,ph=607;
                // Ảnh có góc bo nhẹ, tương phản tự nhiên từ PNG gốc, không thêm bloom/làm trắng.
                ctx.fillStyle="#d1dbe6";ctx.beginPath();ctx.roundRect(px-3,py-3,pw+6,ph+6,8);ctx.fill();
                ctx.fillStyle="#d7dde3";ctx.fillRect(px,py,pw,ph);
                function labels() {
                    ctx.fillStyle="rgba(9,27,56,.83)";ctx.beginPath();ctx.roundRect(58,731,392,57,5);ctx.fill();
                    ctx.fillStyle="#fff";ctx.font="900 25px Arial,sans-serif";ctx.textAlign="left";
                    ctx.fillText("TRẦN ĐỨC MINH",78,769);
                    ctx.save();ctx.translate(586,508);ctx.rotate(Math.PI/2);
                    ctx.fillStyle="#254f8b";ctx.textAlign="center";ctx.font="800 21px Arial,sans-serif";
                    ctx.fillText("IT SUPPORT & DEVELOPMENT",0,0);ctx.restore();
                }
                // Footer kiểu thẻ in thật, gọn gàng hơn và đồng nhất màu navy.
                ctx.fillStyle="#183d7a";ctx.beginPath();ctx.roundRect(32,835,576,94,7);ctx.fill();
                ctx.fillStyle="#fff";ctx.font="900 31px Arial,sans-serif";ctx.fillText("PORTFOLIO",51,885);
                ctx.textAlign="right";ctx.fillStyle="#c9def8";ctx.font="700 15px Arial,sans-serif";
                ctx.fillText("TRMINH IT",589,878);ctx.fillText("IT SUPPORT × WEB DEV",589,899);ctx.textAlign="left";

                const tex=new THREE.CanvasTexture(c);
                tex.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),16);
                tex.encoding=THREE.sRGBEncoding;
                labels();tex.needsUpdate=true;
                const portrait=new Image();
                scope.defer(() => { portrait.onload = null; });
                portrait.onload=()=>{
                    if (!scope.active) return;
                    const iw=portrait.naturalWidth,ih=portrait.naturalHeight;
                    if(!iw||!ih) return;
                    const target=pw/ph, source=iw/ih;
                    let sx=0,sy=0,cw=iw,ch=ih;
                    if(source>target){cw=ih*target;sx=(iw-cw)/2;}
                    else{ch=iw/target;sy=Math.max(0,(ih-ch)*.27);}
                    ctx.save();ctx.beginPath();ctx.roundRect(px,py,pw,ph,6);ctx.clip();
                    ctx.drawImage(portrait,sx,sy,cw,ch,px,py,pw,ph);
                    ctx.restore();
                    labels();tex.needsUpdate=true;
                };
                portrait.src=PORTRAIT_DATA;
                return tex;
            }

            // --- TẠO TEXTURE MẶT SAU THẺ (VIDEO LOOP NGHỆ THUẬT) ---
            let backVideo = null;
            let backCanvas = null;
            let backCtx = null;
            let backVideoReady = false;

            function ensureBackVideoPlayback() {
                if (!backVideo) return;
                const p = backVideo.play();
                if (p && typeof p.catch === "function") p.catch(() => {});
            }

            function createBackTexture() {
                backCanvas = document.createElement("canvas");
                backCanvas.width = 640; backCanvas.height = 960;
                backCtx = backCanvas.getContext("2d");

                backVideo = document.createElement("video");
                scope.defer(() => { backVideo.pause(); backVideo.removeAttribute("src"); backVideo.load(); });
                backVideo.src = '/template/a81b56c468d7.mp4';
                backVideo.loop = true;
                backVideo.muted = true;
                backVideo.playsInline = true;
                backVideo.autoplay = true;
                backVideo.preload = "auto";
                backVideo.crossOrigin = "anonymous";
                scope.listen(backVideo, "loadeddata", () => { backVideoReady = true; ensureBackVideoPlayback(); });
                scope.listen(backVideo, "canplay", ensureBackVideoPlayback);
                scope.listen(backVideo, "ended", () => { backVideo.currentTime = 0; ensureBackVideoPlayback(); });
                ensureBackVideoPlayback();

                const tex = new THREE.CanvasTexture(backCanvas);
                tex.anisotropy = 8;
                tex.encoding = THREE.sRGBEncoding;
                drawBackTexture(0);
                tex.needsUpdate = true;
                return tex;
            }

            function drawRoundedImageCover(ctx, img, x, y, w, h, radius) {
                if (!img || !img.videoWidth || !img.videoHeight) return;
                const iw = img.videoWidth, ih = img.videoHeight;
                const target = w / h;
                const source = iw / ih;
                let sx = 0, sy = 0, sw = iw, sh = ih;
                if (source > target) { sw = ih * target; sx = (iw - sw) / 2; }
                else { sh = iw / target; sy = (ih - sh) / 2; }
                ctx.save();
                ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.clip();
                ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
                ctx.restore();
            }

            function drawBackTexture(now = 0) {
                if (!backCtx || !backCanvas) return;
                const ctx = backCtx;
                const c = backCanvas;
                const t = now * 0.001;

                const bg = ctx.createLinearGradient(0, 0, c.width, c.height);
                bg.addColorStop(0, "#060c19");
                bg.addColorStop(0.45, "#0a1630");
                bg.addColorStop(1, "#071422");
                ctx.fillStyle = bg;
                ctx.fillRect(0, 0, c.width, c.height);

                // Ánh sáng nền mềm để mặt sau nhìn nghệ thuật hơn.
                const orb1 = ctx.createRadialGradient(130, 170, 0, 130, 170, 280);
                orb1.addColorStop(0, "rgba(88,146,255,.28)");
                orb1.addColorStop(1, "rgba(88,146,255,0)");
                ctx.fillStyle = orb1; ctx.fillRect(0, 0, c.width, c.height);
                const orb2 = ctx.createRadialGradient(540, 760, 0, 540, 760, 250);
                orb2.addColorStop(0, "rgba(40,215,255,.18)");
                orb2.addColorStop(1, "rgba(40,215,255,0)");
                ctx.fillStyle = orb2; ctx.fillRect(0, 0, c.width, c.height);

                // Họa tiết đường nét mảnh.
                ctx.strokeStyle = "rgba(163,196,255,.07)";
                ctx.lineWidth = 1;
                for (let x = 42; x <= c.width - 42; x += 30) {
                    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, c.height); ctx.stroke();
                }
                for (let y = 48; y <= c.height; y += 30) {
                    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(c.width, y); ctx.stroke();
                }

                // Lỗ đục ở đầu thẻ.
                ctx.fillStyle = "#040710";
                ctx.beginPath(); ctx.roundRect(270, 24, 100, 18, 9); ctx.fill();

                // Khung viền mặt sau.
                const frameX = 34, frameY = 44, frameW = 572, frameH = 872;
                const frameGrad = ctx.createLinearGradient(frameX, frameY, frameX + frameW, frameY + frameH);
                frameGrad.addColorStop(0, "rgba(12,20,37,.86)");
                frameGrad.addColorStop(1, "rgba(8,16,28,.80)");
                ctx.fillStyle = frameGrad;
                ctx.beginPath(); ctx.roundRect(frameX, frameY, frameW, frameH, 30); ctx.fill();
                ctx.strokeStyle = "rgba(181,214,255,.16)";
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.roundRect(frameX, frameY, frameW, frameH, 30); ctx.stroke();

                // Header.
                ctx.fillStyle = "#f3f7ff";
                ctx.textAlign = "left";
                ctx.font = "800 17px Arial, sans-serif";
                ctx.fillText("MOTION REEL", 64, 94);
                ctx.font = "900 30px Arial, sans-serif";
                ctx.fillText("VIDEO SHOWCASE", 62, 130);
                ctx.fillStyle = "#87b7ff";
                ctx.font = "700 14px Arial, sans-serif";
                ctx.fillText("Looping visual on the back of the card", 64, 156);
                ctx.textAlign = "right";
                ctx.fillStyle = "#dbe9ff";
                ctx.font = "800 16px Arial, sans-serif";
                ctx.fillText("TRMINH IT", 575, 94);
                ctx.font = "700 13px Arial, sans-serif";
                ctx.fillStyle = "#8bbcff";
                ctx.fillText("Cinematic • Creator", 575, 118);
                ctx.textAlign = "left";

                // Khung video.
                const vx = 62, vy = 188, vw = 516, vh = 470;
                const videoPanel = ctx.createLinearGradient(vx, vy, vx, vy + vh);
                videoPanel.addColorStop(0, "rgba(7,12,22,.96)");
                videoPanel.addColorStop(1, "rgba(11,20,34,.98)");
                ctx.fillStyle = videoPanel;
                ctx.beginPath(); ctx.roundRect(vx, vy, vw, vh, 28); ctx.fill();
                ctx.strokeStyle = "rgba(134,181,255,.28)";
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.roundRect(vx, vy, vw, vh, 28); ctx.stroke();

                // Vệt sáng và khung phụ giống màn hình hiển thị.
                ctx.strokeStyle = "rgba(255,255,255,.05)";
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.roundRect(vx + 14, vy + 14, vw - 28, vh - 28, 22); ctx.stroke();

                if (backVideoReady && backVideo && backVideo.readyState >= 2) {
                    drawRoundedImageCover(ctx, backVideo, vx + 18, vy + 18, vw - 36, vh - 36, 20);
                } else {
                    const fallback = ctx.createLinearGradient(vx, vy, vx + vw, vy + vh);
                    fallback.addColorStop(0, "#081223");
                    fallback.addColorStop(1, "#122742");
                    ctx.fillStyle = fallback;
                    ctx.beginPath(); ctx.roundRect(vx + 18, vy + 18, vw - 36, vh - 36, 20); ctx.fill();
                    const pulse = 0.55 + Math.sin(t * 2.3) * 0.12;
                    ctx.strokeStyle = `rgba(132,186,255,${pulse.toFixed(3)})`;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(vx + vw / 2 - 24, vy + vh / 2 - 34);
                    ctx.lineTo(vx + vw / 2 - 24, vy + vh / 2 + 34);
                    ctx.lineTo(vx + vw / 2 + 36, vy + vh / 2);
                    ctx.closePath(); ctx.stroke();
                    ctx.fillStyle = "rgba(216,232,255,.82)";
                    ctx.font = "700 16px Arial, sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillText("Loading video…", vx + vw / 2, vy + vh - 40);
                    ctx.textAlign = "left";
                }

                // Overlay info trên khung video.
                ctx.fillStyle = "rgba(6,10,19,.52)";
                ctx.beginPath(); ctx.roundRect(vx + 30, vy + 28, 118, 34, 17); ctx.fill();
                ctx.fillStyle = "#ffffff";
                ctx.font = "800 15px Arial, sans-serif";
                ctx.fillText("LOOP PLAY", vx + 52, vy + 50);
                ctx.fillStyle = "#6ddcff";
                ctx.beginPath(); ctx.arc(vx + 36, vy + 45, 6, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = "rgba(7,10,18,.55)";
                ctx.beginPath(); ctx.roundRect(vx + vw - 128, vy + 28, 98, 34, 17); ctx.fill();
                ctx.fillStyle = "#dbe9ff";
                ctx.textAlign = "center";
                ctx.fillText("MOTION", vx + vw - 79, vy + 50);
                ctx.textAlign = "left";

                // Dòng mô tả và tem trang trí.
                ctx.fillStyle = "#dbeafe";
                ctx.font = "800 18px Arial, sans-serif";
                ctx.fillText("Visual teaser on the card back", 64, 713);
                ctx.fillStyle = "#86b6ff";
                ctx.font = "700 14px Arial, sans-serif";
                ctx.fillText("Built to match the energy of your uploaded clip.", 64, 741);

                ctx.fillStyle = "rgba(103,161,255,.13)";
                ctx.beginPath(); ctx.roundRect(64, 770, 212, 40, 20); ctx.fill();
                ctx.strokeStyle = "rgba(110,173,255,.28)";
                ctx.stroke();
                ctx.fillStyle = "#ebf4ff";
                ctx.font = "800 14px Arial, sans-serif";
                ctx.fillText("CREATIVE BACK DESIGN", 88, 795);

                // Chữ dọc bên phải.
                ctx.save();
                ctx.translate(590, 536);
                ctx.rotate(Math.PI / 2);
                ctx.fillStyle = "rgba(143,191,255,.92)";
                ctx.font = "900 18px Arial, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("CINEMATIC • EDIT • VISION", 0, 0);
                ctx.restore();
                ctx.textAlign = "left";

                // Footer signature.
                const footerX = 44, footerY = 827, footerW = 552, footerH = 89;
                const footerGrad = ctx.createLinearGradient(footerX, footerY, footerX + footerW, footerY + footerH);
                footerGrad.addColorStop(0, "#16376c");
                footerGrad.addColorStop(1, "#09182d");
                ctx.fillStyle = footerGrad;
                ctx.beginPath(); ctx.roundRect(footerX, footerY, footerW, footerH, 22); ctx.fill();
                ctx.strokeStyle = "rgba(196,220,255,.10)";
                ctx.beginPath(); ctx.roundRect(footerX, footerY, footerW, footerH, 22); ctx.stroke();
                ctx.fillStyle = "#ffffff";
                ctx.font = "900 27px Arial, sans-serif";
                ctx.fillText("TRẦN ĐỨC MINH", 68, 875);
                ctx.textAlign = "right";
                ctx.fillStyle = "#b7d7ff";
                ctx.font = "800 14px Arial, sans-serif";
                ctx.fillText("IT SUPPORT × DEVELOPER", 572, 866);
                ctx.fillStyle = "#7bb8ff";
                ctx.font = "700 12px Arial, sans-serif";
                ctx.fillText("Back card motion display", 572, 888);
                ctx.textAlign = "left";
            }

            // --- TẠO TEXTURE DÂY ĐEO (CÓ CHỮ LẶP LẠI DỌC DÂY) ---
            function createStrapTexture() {
                const c = document.createElement("canvas");
                c.width = 256; c.height = 1024;
                const ctx = c.getContext("2d");

                const bg = ctx.createLinearGradient(0, 0, 256, 0);
                bg.addColorStop(0, "#161b24");
                bg.addColorStop(0.5, "#1d2431");
                bg.addColorStop(1, "#161b24");
                ctx.fillStyle = bg;
                ctx.fillRect(0, 0, 256, 1024);

                // Vân dây nhẹ để giống dây đeo thật hơn
                ctx.fillStyle = "rgba(255,255,255,0.035)";
                for (let y = 0; y < 1024; y += 8) {
                    ctx.fillRect(0, y, 256, 3);
                }
                ctx.fillStyle = "rgba(255,255,255,0.02)";
                for (let x = 0; x < 256; x += 10) {
                    ctx.fillRect(x, 0, 2, 1024);
                }

                // Viền may hai bên
                ctx.fillStyle = "#303a4a";
                ctx.fillRect(12, 0, 4, 1024);
                ctx.fillRect(240, 0, 4, 1024);

                // Chữ chạy dọc ở giữa dây
                ctx.save();
                ctx.translate(128, 512);
                ctx.rotate(Math.PI / 2);
                ctx.fillStyle = "#eef2f7";
                ctx.font = "800 28px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("● TRMINH IT     ● TRMINH IT", 0, 0);
                ctx.restore();

                const tex = new THREE.CanvasTexture(c);
                tex.wrapS = THREE.RepeatWrapping;
                tex.wrapT = THREE.RepeatWrapping;
                tex.anisotropy = 8;
                tex.encoding = THREE.sRGBEncoding;
                return tex;
            }

            // --- DỰNG KHỐI THẺ 3D BO GÓC ---
            const cardW = 1.95, cardH = 2.92, cardD = 0.045;
            const frontTex = createFrontTexture();
            const backTex = createBackTexture();

            const edgeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.6 });
            // Mặt thẻ in mực được hiển thị chính xác màu gốc (không bị cháy sáng).
            // Chỉ khóa kim loại và cạnh thẻ phản ứng với ánh sáng 3D.
            const frontMat = new THREE.MeshBasicMaterial({ map: frontTex, toneMapped: false });
            const backMat = new THREE.MeshBasicMaterial({ map: backTex, side: THREE.DoubleSide, toneMapped: false });

            // Nhóm chứa thẻ + cụm khóa 3D, chuyển động đồng bộ với dây đeo.
            const cardPivot = new THREE.Group();
            scene.add(cardPivot);

            // TẠO THẺ NHỰA CÓ KHE XUYÊN THỰC SỰ, KHÔNG CÒN LÀ HÌNH VẼ GIẢ.
            // Khe này tương ứng CHÍNH XÁC với hình oval ở (270,24,100,18) trên texture 640x960.
            // Khi xoay thẻ, có thể thấy lỗ xuyên và thành nhựa ở bên trong.
            const cardLocalY = -cardH / 2 - 0.18;
            const slotWidth = cardW * (100 / 640);
            const slotHeight = cardH * (18 / 960);
            const slotCenterY = cardH / 2 - cardH * (33 / 960);

            function makeRoundedCardShape(w, h, r) {
                const x = -w / 2, y = -h / 2;
                const shape = new THREE.Shape();
                shape.moveTo(x + r, y);
                shape.lineTo(x + w - r, y);
                shape.quadraticCurveTo(x + w, y, x + w, y + r);
                shape.lineTo(x + w, y + h - r);
                shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                shape.lineTo(x + r, y + h);
                shape.quadraticCurveTo(x, y + h, x, y + h - r);
                shape.lineTo(x, y + r);
                shape.quadraticCurveTo(x, y, x + r, y);
                shape.closePath();
                return shape;
            }

            const cardShape = makeRoundedCardShape(cardW, cardH, 0.078);
            const slot = new THREE.Path();
            const sr = slotHeight / 2;
            const sx = slotWidth / 2 - sr;
            // Vẽ theo chiều ngược với viền ngoài để THREE.ExtrudeGeometry đục lỗ.
            slot.moveTo(-sx, slotCenterY + sr);
            slot.lineTo(sx, slotCenterY + sr);
            slot.absarc(sx, slotCenterY, sr, Math.PI / 2, -Math.PI / 2, true);
            slot.lineTo(-sx, slotCenterY - sr);
            slot.absarc(-sx, slotCenterY, sr, -Math.PI / 2, -Math.PI * 3 / 2, true);
            slot.closePath();
            cardShape.holes.push(slot);

            // Lõi nhựa 3D có chiều dày, cả mép ngoài lẫn thành khe đều có độ dày thật.
            const cardBodyGeo = new THREE.ExtrudeGeometry(cardShape, {
                depth: cardD, bevelEnabled: false, steps: 1, curveSegments: 20
            });
            const cardBody = new THREE.Mesh(cardBodyGeo, edgeMat);
            cardBody.position.set(0, cardLocalY, -cardD / 2);
            cardPivot.add(cardBody);

            // Phủ 2 mặt lên hình thẻ được đục lỗ. UV khớp hoàn toàn với texture cũ.
            function makeFaceGeometry(reverseU) {
                const geo = new THREE.ShapeGeometry(cardShape, 20);
                const pos = geo.attributes.position, uv = geo.attributes.uv;
                for (let i = 0; i < pos.count; i++) {
                    const u = pos.getX(i) / cardW + 0.5;
                    const v = pos.getY(i) / cardH + 0.5;
                    uv.setXY(i, reverseU ? 1 - u : u, v);
                }
                uv.needsUpdate = true;
                return geo;
            }
            const frontFace = new THREE.Mesh(makeFaceGeometry(false), frontMat);
            frontFace.position.set(0, cardLocalY, cardD / 2 + 0.001);
            cardPivot.add(frontFace);

            backMat.side = THREE.DoubleSide;
            const backFace = new THREE.Mesh(makeFaceGeometry(true), backMat);
            backFace.position.set(0, cardLocalY, -cardD / 2 - 0.001);
            cardPivot.add(backFace);

            // Phụ kiện THẺ THẬT: 1 chặn dây, 1 khóa vuông bạc, 1 khoen nhỏ và
            // 1 khoen oval xuyên qua chính khe ngang của thân thẻ.
            // Tọa độ tính từ tâm treo cardPivot (mọi phần chuyển động đồng bộ).
            const silver = new THREE.MeshStandardMaterial({color: 0xe1e5ed, metalness: 0.54, roughness: 0.19});
            const silverLip = new THREE.MeshStandardMaterial({color: 0x9fa9b8, metalness: 0.48, roughness: 0.24});
            const darkMetal = new THREE.MeshStandardMaterial({color: 0x171c27, metalness: 0.22, roughness: 0.38});

            // Bo góc khóa theo đường cong, thay vì BoxGeometry góc sắc.
            function roundedPlate(w,h,r,depth,mat, y,z) {
                const shape = makeRoundedCardShape(w,h,r);
                const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, {
                    depth, bevelEnabled:true, bevelSize:0.005, bevelThickness:0.005,
                    bevelSegments:2, curveSegments:8
                }), mat);
                mesh.position.set(0,y,z-depth/2);
                cardPivot.add(mesh);
                return mesh;
            }
            roundedPlate(0.298,0.036,0.013,0.067,darkMetal,0.125,0);
            roundedPlate(0.318,0.148,0.027,0.074,darkMetal,0.057,0);
            roundedPlate(0.302,0.131,0.022,0.08,silver,0.058,0.007);
            roundedPlate(0.285,0.012,0.005,0.012,silverLip,-0.007,0.008);

            // Khoen nhỏ móc trực tiếp qua đáy khóa. Không để khoảng hở "lơ lửng".
            const upperRing = new THREE.Mesh(new THREE.TorusGeometry(0.041,0.0085,14,60),silver);
            upperRing.position.set(0,-0.046,0.047);
            upperRing.rotation.set(0.46,-0.25,0.04);
            cardPivot.add(upperRing);

            // Khoen oval lớn, nét tròn thật, hai bên lệch độ sâu để cảm giác xuyên khe.
            const slotWorldY = cardLocalY + slotCenterY;
            const ovalCenterY = -0.168;
            const ovalHeight = ovalCenterY - slotWorldY + 0.012;
            const ovalPts = [];
            for (let i=0;i<96;i++) {
                const a = i / 96 * Math.PI * 2;
                ovalPts.push(new THREE.Vector3(
                    0.056 * Math.cos(a),
                    ovalCenterY + ovalHeight * Math.sin(a),
                    0.043 + 0.046*Math.cos(a) + 0.017*Math.sin(a)
                ));
            }
            const ovalCurve = new THREE.CatmullRomCurve3(ovalPts,true,'centripetal');
            const lowerRing = new THREE.Mesh(new THREE.TubeGeometry(ovalCurve,144,0.0095,12,true),silver);
            cardPivot.add(lowerRing);

            // --- DỰNG SỢI DÂY ĐEO 3D UYỂN CHUYỂN & XOẮN THEO THẺ ---
            const strapSegments = 48;
            const strapWidth = 0.285;
            const strapGeo = new THREE.BufferGeometry();
            const numVerts = (strapSegments + 1) * 2;
            const positions = new Float32Array(numVerts * 3);
            const uvs = new Float32Array(numVerts * 2);
            const indices = [];

            for (let i = 0; i <= strapSegments; i++) {
                const v = (i / strapSegments) * 2.2;
                uvs[i * 4] = 0;     uvs[i * 4 + 1] = v;
                uvs[i * 4 + 2] = 1;     uvs[i * 4 + 3] = v;
                if (i < strapSegments) {
                    const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1;
                    indices.push(a, c, b, b, c, d);
                }
            }
            strapGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
            strapGeo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
            strapGeo.setIndex(indices);

            const strapMat = new THREE.MeshStandardMaterial({
                map: createStrapTexture(),
                roughness: 0.65,
                metalness: 0.05,
                side: THREE.DoubleSide
            });
            const strapMesh = new THREE.Mesh(strapGeo, strapMat);
            strapMesh.frustumCulled = false;
            scene.add(strapMesh);

            // --- VẬT LÝ LÒ XO & CON LẮC THỰC TẾ ---
            const anchor = new THREE.Vector3(0, 3.3, 0); // Điểm treo cố định trên trần
            // Mobile: shortened strap keeps metal hook below the social controls.
            const restLength = window.innerWidth <= 760 ? 1.25 : 2.05;

            const state = {
                pos: new THREE.Vector3(0, anchor.y - restLength, 0),
                vel: new THREE.Vector3(0, 0, 0),
                ry: 0,
                targetRy: 0,
                vry: 0,
                rx: 0,
                vrx: 0,
                rz: 0,
                isFlipped: false,
                isDragging: false,
                dragOffset: new THREE.Vector3(),
                dragTarget: new THREE.Vector3(),
                pointerVelocity: new THREE.Vector3(),
                lastPointerMoveAt: 0,
                activePointerId: null
            };

            // V17: ưu tiên cảm biến tự động cho tất cả người truy cập khi trình duyệt cho phép.
            // Một số trình duyệt (đặc biệt iOS) bắt buộc xin quyền sau thao tác của người dùng.
            // KHÔNG có cách hợp lệ để website vượt qua lớp bảo mật này.
            const tiltUI = document.getElementById("tiltControls");
            const tiltToggle = document.getElementById("tiltToggle");
            const tiltToggleLabel = document.getElementById("tiltToggleLabel");
            const tiltMessage = document.getElementById("tiltMessage");
            const sensor = { active:false, valid:false, target:0, smooth:0, lastAt:0 };
            const canTilt = typeof window.DeviceOrientationEvent !== "undefined" &&
                (window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 760);
            const useTiltMotion = canTilt && !prefersReducedMotion;
            const requiresExplicitSensorPermission = !!(canTilt &&
                typeof DeviceOrientationEvent.requestPermission === "function");

            function showTiltStatus(label, msg, enabled=false) {
                if (tiltToggleLabel) tiltToggleLabel.textContent = label;
                if (tiltMessage) tiltMessage.textContent = msg;
                if (tiltToggle) tiltToggle.setAttribute("aria-pressed", String(enabled));
            }
            function showSensorPermissionPrompt(message) {
                if (!useTiltMotion || !tiltUI || !tiltToggle || sensor.valid) return;
                showTiltStatus("Bật cảm biến nghiêng", message || "Chạm để cho phép cảm biến trên điện thoại này", false);
                tiltUI.classList.add("is-supported");
            }
            function onPhoneOrientation(e) {
                if (!sensor.active || typeof e.gamma !== "number" || !Number.isFinite(e.gamma)) return;
                const rawAngle = (screen.orientation && Number.isFinite(screen.orientation.angle))
                    ? screen.orientation.angle : (typeof window.orientation === "number" ? window.orientation : 0);
                const angle = ((rawAngle % 360) + 360) % 360;
                let degrees = e.gamma;
                if ((angle === 90 || angle === 270) && typeof e.beta === "number" && Number.isFinite(e.beta)) {
                    degrees = angle === 90 ? -e.beta : e.beta;
                } else if (angle === 180) degrees = -e.gamma;
                // Vùng chết 2 độ chống rung, biên độ vừa phải và giữ vật lý lò xo 3D cũ.
                sensor.target = Math.abs(degrees) < 2 ? 0 : THREE.MathUtils.clamp(degrees / 35, -1, 1);
                sensor.lastAt = performance.now();
                if (!sensor.valid) {
                    sensor.valid = true;
                    // Khi đã tự nhận được dữ liệu, không hiện nút xin quyền nữa.
                    if (tiltUI) tiltUI.classList.remove("is-supported");
                    showTiltStatus("Cảm biến đang hoạt động", "Thẻ sẽ đung đưa khi nghiêng điện thoại", true);
                }
            }
            async function enablePhoneTilt() {
                if (!useTiltMotion || !window.isSecureContext) return;
                try {
                    // Chỉ hỏi khi hệ điều hành / trình duyệt yêu cầu và người xem chủ động chạm.
                    if (requiresExplicitSensorPermission) {
                        const permission = await DeviceOrientationEvent.requestPermission();
                        if (permission !== "granted") {
                            showSensorPermissionPrompt("Cần cho phép cảm biến để thẻ nghiêng theo máy");
                            return;
                        }
                    }
                    sensor.active = true;
                    sensor.target = 0;
                    scope.listen(window, "deviceorientation", onPhoneOrientation, { passive:true });
                    showTiltStatus("Đang bật cảm biến…", "Nghiêng điện thoại để thử", true);
                    // Trình duyệt đã cấp quyền nhưng không gửi dữ liệu thì để nút thử lại.
                    setTimeout(() => {
                        if (sensor.active && !sensor.valid && requiresExplicitSensorPermission) {
                            showSensorPermissionPrompt("Chưa thấy dữ liệu. Chạm để thử lại cảm biến");
                        }
                    }, 2500);
                } catch (err) {
                    showSensorPermissionPrompt("Trình duyệt chưa cấp quyền cảm biến");
                    console.warn("Device orientation access was not granted:", err);
                }
            }
            if (useTiltMotion) {
                if (window.isSecureContext) {
                    // Nghe thụ động ngay khi mở link: không hiện hộp thoại với thiết bị cho phép sẵn.
                    sensor.active = true;
                    scope.listen(window, "deviceorientation", onPhoneOrientation, { passive:true });
                    if (requiresExplicitSensorPermission) {
                        // Trường hợp đã được cấp quyền trước đó, dữ liệu có thể tới tự động.
                        // Nếu không, chỉ hiện nút xin quyền của chính trình duyệt.
                        setTimeout(() => {
                            if (!sensor.valid && !document.hidden) {
                                showSensorPermissionPrompt("Một chạm để bật cảm biến trên trình duyệt này");
                            }
                        }, 2200);
                    }
                } else if (requiresExplicitSensorPermission) {
                    showSensorPermissionPrompt("Cần đường link HTTPS để dùng cảm biến");
                    if (tiltToggle) tiltToggle.disabled = true;
                }
                if (tiltToggle) scope.listen(tiltToggle, "click", enablePhoneTilt);
            }
            scope.listen(document, "visibilitychange", () => {
                if (document.hidden) sensor.target = 0;
            });

            // Chuyển vị trí pixel toàn màn hình sang tọa độ 3D trên mặt phẳng của thẻ.
            // Toàn bộ tính toán đi theo camera, không dựa vào khung canvas bên phải nữa.
            const sceneRay = new THREE.Raycaster();
            const scenePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            function viewportToScene(x, y) {
                sceneRay.setFromCamera(new THREE.Vector2(
                    x / window.innerWidth * 2 - 1,
                    1 - y / window.innerHeight * 2
                ), camera);
                const point = new THREE.Vector3();
                sceneRay.ray.intersectPlane(scenePlane, point);
                return point;
            }

            let layoutInitialized = false;
            function alignCardWithHero() {
                if (state.isDragging) return; // Không di chuyển điểm neo khi người dùng đang giữ thẻ.
                const rect = container.getBoundingClientRect();
                if (!rect.width || !rect.height || !window.innerWidth || !window.innerHeight) return;
                const previousAnchor = anchor.clone();
                // Mobile dùng hero 75vh; vẫn giữ đúng kích thước thẻ so với bố cục cũ.
                camera.zoom = Math.max(0.65, Math.min(1.1, rect.height / Math.max(window.innerHeight, 1)));
                camera.aspect = window.innerWidth / Math.max(window.innerHeight, 1);
                camera.updateProjectionMatrix();

                const origin = viewportToScene(rect.left + rect.width / 2, rect.top + rect.height / 2);
                anchor.set(origin.x, origin.y + (window.innerWidth <= 760 ? 2.5 : 3.3), 0);
                if (!layoutInitialized) {
                    state.pos.copy(anchor).add(new THREE.Vector3(0, -restLength, 0));
                    state.dragTarget.copy(state.pos);
                    layoutInitialized = true;
                } else {
                    const shift = anchor.clone().sub(previousAnchor);
                    state.pos.add(shift);
                    state.dragTarget.add(shift);
                }
            }
            alignCardWithHero();

            // Giữ nguyên toàn bộ thẻ trong vùng nhìn thấy, ngay cả khi kéo đến sát mép.
            function keepBadgeVisible(target) {
                const padding = 12;
                const topLeft = viewportToScene(padding, padding);
                const bottomRight = viewportToScene(
                    window.innerWidth - padding,
                    window.innerHeight - padding
                );
                // Tính theo 4 góc đã xoay, để cả tấm thẻ không khuất khi nghiêng/lật.
                const rot = new THREE.Euler(state.rx, state.ry, state.rz, "XYZ");
                const halfW = cardW / 2;
                const corners = [
                    new THREE.Vector3(-halfW, -0.18, 0),
                    new THREE.Vector3( halfW, -0.18, 0),
                    new THREE.Vector3(-halfW, -cardH - 0.18, 0),
                    new THREE.Vector3( halfW, -cardH - 0.18, 0)
                ].map(p => p.applyEuler(rot));
                const xMinOffset = Math.min(...corners.map(p => p.x));
                const xMaxOffset = Math.max(...corners.map(p => p.x));
                const yMinOffset = Math.min(...corners.map(p => p.y));
                const yMaxOffset = Math.max(...corners.map(p => p.y));
                const minX = topLeft.x - xMinOffset;
                const maxX = bottomRight.x - xMaxOffset;
                const minY = bottomRight.y - yMinOffset;
                const maxY = topLeft.y - yMaxOffset;
                target.x = minX > maxX ? (minX + maxX) / 2 : THREE.MathUtils.clamp(target.x, minX, maxX);
                target.y = minY > maxY ? (minY + maxY) / 2 : THREE.MathUtils.clamp(target.y, minY, maxY);
                target.z = 0;
                return target;
            }

            // Thẻ tự xoay ~giây thứ 4, quay mặt trước, rồi nghỉ giữa các chu kỳ.
            // Tương tác của khách truy cập luôn được ưu tiên hơn chuyển động tự động.
            let autoStage=0, nextAutoAt=performance.now()+4000, autoBackAt=0;
            function interactWithCard() {
                autoStage=0;
                nextAutoAt=performance.now()+14500;
                if(!state.isFlipped) state.targetRy=0;
            }
            function flipByUser() {
                // Đọc hướng xoay hiện tại trước khi hủy chuyển động tự động.
                const wasShowingBack=Math.abs(state.targetRy)>Math.PI*.48;
                interactWithCard();
                state.isFlipped=!wasShowingBack;
                canvas.setAttribute('aria-pressed', String(state.isFlipped));
                state.targetRy=state.isFlipped ? Math.PI:0;
                const dir=state.isFlipped?1:-1;
                state.vel.x+=dir*.55;
                state.vel.z+=.25;
                state.vrx+=.48;
            }

            // Tính đường cong Bezier + độ xoắn 3D của sợi dây theo góc xoay thẻ
            function updateStrapGeometry() {
                const p0 = anchor.clone();
                const p3 = cardPivot.position.clone().add(new THREE.Vector3(0, 0.147, 0).applyQuaternion(cardPivot.quaternion));

                // Vector hướng lên theo trục dọc của thẻ
                const cardUp = new THREE.Vector3(0, 1, 0).applyQuaternion(cardPivot.quaternion);
                const p1 = p0.clone().add(new THREE.Vector3(0, -0.75, 0));
                const p2 = p3.clone().add(cardUp.clone().multiplyScalar(0.65));

                const posAttr = strapGeo.attributes.position;

                for (let i = 0; i <= strapSegments; i++) {
                    const t = i / strapSegments;
                    const inv = 1 - t;

                    // Điểm trung tâm trên đường cong Cubic Bezier
                    const center = new THREE.Vector3()
                        .addScaledVector(p0, inv * inv * inv)
                        .addScaledVector(p1, 3 * inv * inv * t)
                        .addScaledVector(p2, 3 * inv * t * t)
                        .addScaledVector(p3, t * t * t);

                    // Đạo hàm tiếp tuyến của sợi dây tại t
                    const tangent = new THREE.Vector3()
                        .addScaledVector(p1.clone().sub(p0), 3 * inv * inv)
                        .addScaledVector(p2.clone().sub(p1), 6 * inv * t)
                        .addScaledVector(p3.clone().sub(p2), 3 * t * t)
                        .normalize();

                    // Độ xoắn mượt từ 0° ở đỉnh dây đến đúng góc xoay ry của thẻ ở móc khóa
                    const smoothTwist = t * t * (3 - 2 * t);
                    const twistAngle = state.ry * smoothTwist;

                    // Trục ngang của bản dây xoay quanh tiếp tuyến sợi dây
                    const baseRight = new THREE.Vector3(Math.cos(twistAngle), 0, -Math.sin(twistAngle));
                    const sideDir = baseRight.clone().sub(tangent.clone().multiplyScalar(baseRight.dot(tangent))).normalize();

                    const halfW = strapWidth * 0.5;
                    const leftPt = center.clone().addScaledVector(sideDir, -halfW);
                    const rightPt = center.clone().addScaledVector(sideDir, halfW);

                    posAttr.setXYZ(i * 2, leftPt.x, leftPt.y, leftPt.z);
                    posAttr.setXYZ(i * 2 + 1, rightPt.x, rightPt.y, rightPt.z);
                }
                posAttr.needsUpdate = true;
                strapGeo.computeVertexNormals();
            }

            // --- KÉO THẢ ĐÀN HỒI TRÊN TOÀN MÀN HÌNH ---
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            let downTime = 0;
            let downPos = { x: 0, y: 0 };

            function getNormalizedMouse(e) {
                mouse.set(e.clientX / window.innerWidth * 2 - 1, 1 - e.clientY / window.innerHeight * 2);
            }
            function onPointerDown(e) {
                if (state.isDragging || (e.pointerType === "mouse" && e.button !== 0)) return;
                getNormalizedMouse(e);
                raycaster.setFromCamera(mouse, camera);
                const hits = raycaster.intersectObject(cardPivot, true);
                if (!hits.length) return;

                e.preventDefault();
                state.isDragging = true;
                state.activePointerId = e.pointerId;
                interactWithCard();
                downTime = performance.now();
                downPos = { x: e.clientX, y: e.clientY };
                state.lastPointerMoveAt = downTime;
                state.pointerVelocity.set(0, 0, 0);
                state.vel.set(0, 0, 0);
                dragPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), state.pos);
                const hitPoint = new THREE.Vector3();
                raycaster.ray.intersectPlane(dragPlane, hitPoint);
                state.dragOffset.copy(state.pos).sub(hitPoint);
                state.dragTarget.copy(state.pos);
                container.classList.add("dragging-card");
                document.documentElement.classList.add("lanyard-dragging");
                try { hitZone.setPointerCapture(e.pointerId); } catch (_) {}
            }
            function onPointerMove(e) {
                if (state.isDragging) {
                    if (e.pointerId !== state.activePointerId) return;
                    e.preventDefault();
                    getNormalizedMouse(e);
                    raycaster.setFromCamera(mouse, camera);
                    const hitPoint = new THREE.Vector3();
                    if (raycaster.ray.intersectPlane(dragPlane, hitPoint)) {
                        const next = keepBadgeVisible(hitPoint.add(state.dragOffset));
                        const now = performance.now();
                        const seconds = Math.max((now - state.lastPointerMoveAt) / 1000, 0.008);
                        // Vận tốc tính theo vị trí thật của con trỏ, có giới hạn để không giật văng.
                        state.pointerVelocity.copy(next).sub(state.dragTarget)
                            .multiplyScalar(1 / seconds).clampLength(0, 9);
                        state.dragTarget.copy(next);
                        state.pos.copy(next); // Giữ chuột đứng yên => thẻ đứng nguyên tại đó.
                        state.lastPointerMoveAt = now;
                    }
                } else {
                    getNormalizedMouse(e);
                    raycaster.setFromCamera(mouse, camera);
                    hitZone.style.cursor = raycaster.intersectObject(cardPivot, true).length ? "grab" : "default";
                }
            }
            function finishDrag(e, allowFlip) {
                if (!state.isDragging || (e && e.pointerId !== state.activePointerId)) return;
                state.isDragging = false;
                state.activePointerId = null;
                container.classList.remove("dragging-card");
                document.documentElement.classList.remove("lanyard-dragging");
                if (!container.getBoundingClientRect().height ||
                    container.getBoundingClientRect().bottom < 0 ||
                    container.getBoundingClientRect().top > window.innerHeight) {
                    canvas.style.visibility = "hidden";
                }
                if (e) {
                    try { if (hitZone.hasPointerCapture(e.pointerId)) hitZone.releasePointerCapture(e.pointerId); } catch (_) {}
                }
                // Lực giật về khởi động NGAY KHI THẢ chuột, không chờ bộ lò xo tăng tốc.
                // Quãng kéo càng dài thì vận tốc hồi ban đầu càng lớn, có chặn tốc độ để không giật quá mạnh.
                const releasedRest = new THREE.Vector3(anchor.x + sensor.smooth * 0.30, anchor.y - restLength, 0);
                const homeVector = releasedRest.sub(state.pos);
                const pullDistance = homeVector.length();
                if (pullDistance > 0.003) {
                    const releaseSpeed = Math.min(17.5, pullDistance * 7.1);
                    state.vel.copy(homeVector.multiplyScalar(releaseSpeed / pullDistance));
                    state.vrx += THREE.MathUtils.clamp(state.vel.y * 0.013, -0.18, 0.18);
                } else {
                    state.vel.set(0, 0, 0);
                }
                if (allowFlip && e) {
                    const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
                    const elapsed = performance.now() - downTime;
                    if (dist < 8 && elapsed < 350) flipByUser();
                }
            }
            scope.listen(hitZone, "pointerdown", onPointerDown);
            scope.listen(hitZone, "pointermove", onPointerMove);
            scope.listen(hitZone, "pointerup", e => finishDrag(e, true));
            scope.listen(hitZone, "pointercancel", e => finishDrag(e, false));
            scope.listen(hitZone, "lostpointercapture", e => finishDrag(e, false));
            scope.listen(window, "blur", () => finishDrag(null, false));
            scope.listen(document, "visibilitychange", () => {
                if (document.hidden) finishDrag(null, false);
            });
            canvas.setAttribute("tabindex", "0");
            canvas.setAttribute('role', 'button');
            canvas.setAttribute('aria-pressed', 'false');
            scope.defer(() => document.documentElement.classList.remove('lanyard-dragging'));
            scope.listen(canvas, "keydown", e => {
                if (e.key !== "Enter" && e.key !== " ") return;
                e.preventDefault();
                flipByUser();
            });
            // --- VÒNG LẶP VẬT LÝ & RENDER 60FPS ---
            let lastTime = performance.now();
            let lastBackDrawAt = 0;
            function animate(now) {
                const dt = Math.min((now - lastTime) / 1000, 0.033);
                if (document.hidden) { lastTime = now; requestAnimationFrame(animate); return; }
                lastTime = now;

                if (!prefersReducedMotion && !document.hidden && !state.isDragging) {
                    if (autoStage === 1 && now >= autoBackAt) {
                        state.targetRy = 0; // Tự xoay về mặt trước
                        autoStage = 0;
                        nextAutoAt = now + 14500;
                    } else if (autoStage === 0 && !state.isFlipped && now >= nextAutoAt) {
                        state.targetRy = Math.PI;
                        autoStage = 1;
                        autoBackAt = now + 1600;
                    }
                }

                // 1. Lực lò xo xoay quanh trục Y (xoay lật thẻ + xoắn dây)
                const stiffnessY = 85;
                const dampingY = 9.5;
                const accRy = (state.targetRy - state.ry) * stiffnessY - state.vry * dampingY;
                state.vry += accRy * dt;
                state.ry += state.vry * dt;

                // 2. Lực lò xo nghiêng trục X
                const accRx = (0 - state.rx) * 60 - state.vrx * 8;
                state.vrx += accRx * dt;
                state.rx += state.vrx * dt;

                // Cảm biến được làm mượt, ngắt về vị trí đứng thẳng nếu dữ liệu mất.
                const sensorFresh = sensor.active && sensor.valid && !document.hidden &&
                    now - sensor.lastAt < 1400 && window.innerWidth <= 760;
                const tiltGoal = sensorFresh ? sensor.target : 0;
                sensor.smooth += (tiltGoal - sensor.smooth) * (1 - Math.exp(-6.5 * dt));

                // 3. Dây đeo có lực đàn hồi: kéo tự do, giữ yên, thả ra bật về.
                if (!state.isDragging) {
                    // Dao động nhẹ khi nghỉ; sau khi kéo xa sẽ bị lực đàn hồi hút về gốc.
                    const breeze = Math.sin(now * 0.0014) * 0.035;
                    const restPos = new THREE.Vector3(anchor.x + breeze + sensor.smooth * 0.30, anchor.y - restLength, 0);
                    const springK = 168; // Lò xo mạnh, tăng tốc tỷ lệ với quãng kéo.
                    const airDamp = 13.6; // Về nhanh, nảy rất nhẹ rồi ổn định.
                    // Hai bước nhỏ ổn định hơn khi tốc độ khung hình xuống thấp.
                    const steps = dt > 0.021 ? 3 : 2;
                    const stepDt = dt / steps;
                    for (let i = 0; i < steps; i++) {
                        state.vel.addScaledVector(restPos.clone().sub(state.pos), springK * stepDt);
                        state.vel.multiplyScalar(Math.exp(-airDamp * stepDt));
                        state.pos.addScaledVector(state.vel, stepDt);
                    }
                    // Không khóa cứng chiều dài: chính lực đàn hồi kéo về, không gây giật điểm cuối.
                } else {
                    state.pos.copy(state.dragTarget);
                }

                // Thẻ nghiêng vừa phải theo lực kéo, tự đung đưa khi trở về.
                const offsetX = state.pos.x - anchor.x;
                const tiltTarget = THREE.MathUtils.clamp(offsetX * 0.19 - state.vel.x * 0.035 + sensor.smooth * 0.055, -0.32, 0.32);
                state.rz = THREE.MathUtils.lerp(state.rz, tiltTarget, 1 - Math.exp(-10 * dt));
                if (state.isDragging) {
                    keepBadgeVisible(state.dragTarget); // Cập nhật giới hạn theo góc nghiêng mới.
                    state.pos.copy(state.dragTarget);
                }

                cardPivot.position.copy(state.pos);
                cardPivot.rotation.set(state.rx, state.ry, state.rz);

                // Cập nhật hình dạng sợi dây xoắn theo góc xoay của thẻ
                updateStrapGeometry();

                // Chỉ đẩy khung video mới lên GPU khi mặt sau đang/chuẩn bị hiển thị.
                // Giới hạn 24fps để tránh nóng/giật trên điện thoại.
                if (!document.hidden && now - lastBackDrawAt >= 1000 / 24 &&
                    (Math.cos(state.ry) < 0.5 || !backVideoReady)) {
                    drawBackTexture(now);
                    backTex.needsUpdate = true;
                    lastBackDrawAt = now;
                }

                renderer.render(scene, camera);
                container.classList.add("three-ready");
                requestAnimationFrame(animate);
            }
            requestAnimationFrame(animate);

            ["pointerdown","touchstart","keydown","click"].forEach(evt => {
                scope.listen(window, evt, ensureBackVideoPlayback, { passive:true });
            });
            scope.listen(document, "visibilitychange", () => {
                if (!backVideo) return;
                if (document.hidden) backVideo.pause();
                else ensureBackVideoPlayback();
            });

            function updateViewportLayout() {
                const width = window.innerWidth;
                const height = window.innerHeight;
                if (!width || !height) return;
                renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth <= 760 ? 1.45 : 2));
                renderer.setSize(width, height, false);
                alignCardWithHero();
            }
            scope.listen(window, "resize", updateViewportLayout, { passive: true });
            scope.listen(window, "orientationchange", () => {
                requestAnimationFrame(() => requestAnimationFrame(updateViewportLayout));
            }, { passive: true });

            // Sửa lỗi thẻ ở giữa viewport lúc mới tải file: layout có thể còn đổi khi
            // ảnh, font và kích thước grid hoàn thiện. Căn neo lại sau paint/load.
            const realignAfterPaint = () => requestAnimationFrame(() =>
                requestAnimationFrame(() => { if (!state.isDragging) alignCardWithHero(); }));
            realignAfterPaint();
            if (document.readyState === 'complete') realignAfterPaint();
            else scope.listen(window, 'load', realignAfterPaint, { once: true });
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(realignAfterPaint).catch(() => {});
            }
            if ('ResizeObserver' in window) {
                const layoutObserver = new ResizeObserver(realignAfterPaint);
                layoutObserver.observe(container);
            }
            // Các trình duyệt khác nhau hoàn tất bố cục tải file ở thời điểm khác nhau.
            setTimeout(realignAfterPaint, 240);
            setTimeout(realignAfterPaint, 850);

            // Khi cuộn sang About/Contact, thẻ sẽ đi theo đúng khu vực Home rồi biến mất.
            scope.listen(window, "scroll", () => {
                alignCardWithHero();
            }, { passive: true });
            const observer = new IntersectionObserver(entries => {
                const visible = entries[0]?.isIntersecting || state.isDragging;
                canvas.style.visibility = visible ? "visible" : "hidden";
            }, { threshold: 0.01 });
            observer.observe(container);
        })();
          } catch(error) { console.warn("Không khởi tạo được WebGL; đang hiển thị thẻ dự phòng.", error); window.dispatchEvent(new Event('chien:card-fallback')); }
        } else {
          console.warn("Three.js chưa tải được; đang hiển thị thẻ dự phòng.");
          window.dispatchEvent(new Event('chien:card-fallback'));
        }

}
