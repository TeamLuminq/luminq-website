// ===========================
// LUMINQ v3 — Site JavaScript
// ===========================

document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation scroll effect ---
    const nav = document.getElementById('nav');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- Mobile hamburger menu ---
    const hamburger = document.getElementById('navHamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // --- Scroll-triggered fade-in animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class to animatable elements
    const animatable = document.querySelectorAll(
        '.stat-card, .stat-card--large, .problem-card, .service-card, .process-step, ' +
        '.ladder-card, .value-card, .faq-item, ' +
        '.solution__multiplier, .section__header, .hero__content, ' +
        '.contact__content, .contact__form-wrapper, ' +
        '.team__photo-wrapper, .team__bio, .team__highlight, .team__credentials'
    );

    animatable.forEach((el, index) => {
        el.classList.add('fade-in');
        // Stagger siblings slightly
        el.style.transitionDelay = `${(index % 6) * 0.08}s`;
        observer.observe(el);
    });

    // --- Contact form handling ---
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Basic validation
            if (!data.name || !data.email) {
                return;
            }

            // Show sending state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Submit to Google Form via hidden iframe (avoids CORS issues)
            const googleFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSePOj3-vSP6RaR1lo5oMjO3dNfCFt3zCZptY0kbAjDwFREeew/formResponse';
            const iframeName = 'google-form-iframe';

            // Create hidden iframe if it doesn't exist
            let iframe = document.getElementById(iframeName);
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = iframeName;
                iframe.name = iframeName;
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
            }

            // Create a temporary hidden form that posts to Google
            const tempForm = document.createElement('form');
            tempForm.method = 'POST';
            tempForm.action = googleFormURL;
            tempForm.target = iframeName;
            tempForm.style.display = 'none';

            // Map website fields to Google Form entry IDs
            const fields = {
                'entry.39369296': data.name,
                'entry.154837294': data.email,
                'entry.1796602636': data.linkedin || '',
                'entry.333599739': data.message || ''
            };

            Object.entries(fields).forEach(([name, value]) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                input.value = value;
                tempForm.appendChild(input);
            });

            document.body.appendChild(tempForm);
            tempForm.submit();
            document.body.removeChild(tempForm);

            // Show success state after a short delay to allow submission
            setTimeout(() => {
                submitBtn.textContent = 'Sent! We\'ll be in touch.';
                submitBtn.style.background = 'linear-gradient(135deg, #5dcadb 0%, #34d399 100%)';

                // Reset after delay
                setTimeout(() => {
                    form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 4000);
            }, 1000);
        });
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
