// EXPERIENCE MODULE - 3D TIMELINE
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 200);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });

    // Parallax effect for timeline
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const timeline = document.querySelector('.timeline');
        const rate = scrolled * -0.5;
        timeline.style.transform = `translateY(${rate}px)`;
    });
});