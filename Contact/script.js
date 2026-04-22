// CONTACT MODULE - Web3 Form + EmailJS
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        submitBtn.classList.add('sending');
        submitBtn.querySelector('span:first-child').textContent = 'Sending...';
        
        try {
            // Simulate Web3 signature (if wallet connected)
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const message = `Contact form from ${data.email}`;
                const signature = await signer.signMessage(message);
                data.signature = signature;
            }
            
            // Here you would send to your backend/EmailJS
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success
            form.reset();
            submitBtn.textContent = 'Message Sent! 🎉';
            setTimeout(() => {
                submitBtn.classList.remove('sending');
                submitBtn.innerHTML = '<span>Send Message</span><span class="icon">→</span>';
            }, 2000);
            
        } catch (error) {
            console.error('Form error:', error);
            submitBtn.textContent = 'Error! Try again.';
            setTimeout(() => {
                submitBtn.classList.remove('sending');
                submitBtn.innerHTML = '<span>Send Message</span><span class="icon">→</span>';
            }, 2000);
        }
    });

    // Animate contact items
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 150);
            }
        });
    });

    contactItems.forEach(item => observer.observe(item));
});