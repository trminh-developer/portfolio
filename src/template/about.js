
export function initializeAbout(scope) {
const { requestAnimationFrame, cancelAnimationFrame, setTimeout, clearTimeout, setInterval, clearInterval, IntersectionObserver, MutationObserver, ResizeObserver } = scope;
// Tiêu đề ABOUT ME xuất hiện rõ dần theo tiến độ cuộn tới section.
    (() => {
        const heading = document.getElementById('about-heading-reveal');
        if (!heading) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (reduced.matches) return; // Vẫn hiển thị rõ khi người dùng muốn giảm chuyển động.
        heading.classList.add('about-reveal-ready');
        let rafId = 0;
        function updateAboutHeading() {
            rafId = 0;
            const top = heading.getBoundingClientRect().top;
            const start = window.innerHeight * .93;
            const end = window.innerHeight * .33;
            const linear = Math.min(1, Math.max(0, (start - top) / Math.max(1, start - end)));
            const fade = linear * linear * (3 - 2 * linear);
            heading.style.opacity = fade.toFixed(3);
            heading.style.transform = `translate3d(0, ${((1 - fade) * 48).toFixed(2)}px, 0)`;
            heading.style.filter = `blur(${((1 - fade) * 7).toFixed(2)}px)`;
        }
        function scheduleUpdate() {
            if (!rafId) rafId = requestAnimationFrame(updateAboutHeading);
        }
        scope.listen(window, 'scroll', scheduleUpdate, { passive: true });
        scope.listen(window, 'resize', scheduleUpdate, { passive: true });
        scope.listen(window, 'pageshow', scheduleUpdate, { passive: true });
        requestAnimationFrame(updateAboutHeading);
    })();

    (() => {
        const stage = document.getElementById('about-person-stage');
        if (!stage) return;
        const photo = stage.querySelector('.about-person-base');
        if (!photo) return;
        const silhouette = document.createElement('canvas');
        silhouette.width = 186;
        silhouette.height = 304;
        const ctx = silhouette.getContext('2d', { willReadFrequently: true });
        let alphaMap = null;
        const prep = () => {
            try {
                ctx.clearRect(0, 0, silhouette.width, silhouette.height);
                const scale = parseFloat(getComputedStyle(stage).getPropertyValue('--portrait-scale')) || 1;
                ctx.drawImage(photo, (1 - scale) * silhouette.width / 2,
                    (1 - scale) * silhouette.height, silhouette.width * scale, silhouette.height * scale);
                alphaMap = ctx.getImageData(0, 0, silhouette.width, silhouette.height).data;
            } catch (e) { alphaMap = null; }
        };
        if (photo.complete && photo.naturalWidth) prep();
        else scope.listen(photo, 'load', prep, { once: true });
        let lastTouchTimer = null;
        let frame = 0;
        let latestPoint = null;
        function insidePerson(x, y, width, height) {
            if (!alphaMap) return true;
            const px = Math.min(silhouette.width - 1, Math.max(0, Math.floor(x / width * silhouette.width)));
            const py = Math.min(silhouette.height - 1, Math.max(0, Math.floor(y / height * silhouette.height)));
            // Tránh phát sáng ở vùng nền trong suốt và mép tóc/áo.
            return alphaMap[(py * silhouette.width + px) * 4 + 3] >= 60;
        }
        function revealAt(clientX, clientY) {
            const rect = stage.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const x = clientX - rect.left, y = clientY - rect.top;
            if (x < 0 || y < 0 || x > rect.width || y > rect.height || !insidePerson(x, y, rect.width, rect.height)) {
                stage.classList.remove('is-revealing');
                return;
            }
            const radius = Math.min(152, Math.max(92, rect.width * .32));
            const scale = parseFloat(getComputedStyle(stage).getPropertyValue('--portrait-scale')) || 1;
            // The portrait is scaled to trim its transparent margins. Convert
            // pointer coordinates back into the image's mask coordinate space.
            const maskX = rect.width / 2 + (x - rect.width / 2) / scale;
            const maskY = rect.height + (y - rect.height) / scale;
            stage.style.setProperty('--reveal-x', `${maskX.toFixed(1)}px`);
            stage.style.setProperty('--reveal-y', `${maskY.toFixed(1)}px`);
            stage.style.setProperty('--reveal-radius', `${(radius / scale).toFixed(1)}px`);
            stage.classList.add('is-revealing');
        }
        function scheduleReveal(event) {
            latestPoint = [event.clientX, event.clientY];
            if (!frame) frame = requestAnimationFrame(() => {
                frame = 0;
                if (latestPoint) revealAt(latestPoint[0], latestPoint[1]);
            });
        }
        scope.listen(stage, 'pointermove', e => {
            if (e.pointerType === 'touch' && e.buttons === 0) return;
            if (lastTouchTimer) { clearTimeout(lastTouchTimer); lastTouchTimer = null; }
            scheduleReveal(e);
        }, { passive: true });
        scope.listen(stage, 'pointerdown', e => {
            if (e.pointerType !== 'touch') return;
            scheduleReveal(e);
        }, { passive: true });
        scope.listen(stage, 'pointerup', e => {
            if (e.pointerType !== 'touch') return;
            clearTimeout(lastTouchTimer);
            lastTouchTimer = setTimeout(() => stage.classList.remove('is-revealing'), 1600);
        }, { passive: true });
        scope.listen(stage, 'pointerleave', e => {
            if (e.pointerType === 'touch') return;
            latestPoint = null;
            stage.classList.remove('is-revealing');
        });
        scope.listen(stage, 'pointercancel', () => stage.classList.remove('is-revealing'));
        scope.listen(stage, 'blur', () => stage.classList.remove('is-revealing'));
        scope.listen(stage, 'keydown', e => {
            if (!['Enter', ' '].includes(e.key)) return;
            e.preventDefault();
            if (stage.classList.contains('is-revealing')) stage.classList.remove('is-revealing');
            else {
                const r = stage.getBoundingClientRect();
                // Tâm ngực để bàn phím cũng có thể dùng tính năng.
                revealAt(r.left + r.width * .52, r.top + r.height * .55);
            }
        });
    })();

}
