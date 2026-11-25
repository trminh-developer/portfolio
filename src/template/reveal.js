
export function initializeReveal(scope) {
const { requestAnimationFrame, cancelAnimationFrame, setTimeout, clearTimeout, setInterval, clearInterval, IntersectionObserver, MutationObserver, ResizeObserver } = scope;
/* Khi cuộn đến các section, chữ/hình hiện rõ dần theo nhịp đọc. */
    (() => {
        const targets = [
            ['#about .about-intro', 0],
            ['#about .about-portrait', 130],
            ['#about .about-details', 220],
            ['#contact .contact-titlebar', 0],
            ['#contact .contact-column', 90],
            ['#contact .comment-board', 160],
        ];
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        const elements = targets.map(([selector, delay]) => {
            const element = document.querySelector(selector);
            if (!element) return null;
            element.style.setProperty('--reveal-delay', `${delay}ms`);
            return element;
        }).filter(Boolean);
        if (reduced.matches || !('IntersectionObserver' in window)) return;
        // Giữ nội dung có sẵn cho người không chạy JS; thêm class ngay trước khi quan sát.
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -7% 0px', threshold: 0.09 });
        elements.forEach(element => {
            element.classList.add('scroll-reveal');
            observer.observe(element);
        });
    })();

}
