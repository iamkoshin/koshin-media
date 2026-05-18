document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // TYPED TEXT EFFECT (Hero Section)
    // ==========================================
    const heroHeading = document.getElementById('heroHeading');
    const heroSubtitle = document.getElementById('heroSubtitle');
    const heroBtns = document.getElementById('heroBtns');
    const heroBadge = document.getElementById('heroBadge');

    const textParts = [
        { text: 'Stop Just Uploading. Start ', highlight: false },
        { text: 'Captivating', highlight: true },
        { text: '.', highlight: false }
    ];

    function typeText() {
        const speed = 45;
        const cursor = document.createElement('span');
        cursor.classList.add('cursor');
        heroHeading.appendChild(cursor);

        const spans = textParts.map(part => {
            const span = document.createElement('span');
            if (part.highlight) span.classList.add('highlight');
            heroHeading.insertBefore(span, cursor);
            return { span, text: part.text };
        });

        let partIndex = 0, localCharIndex = 0;

        function typeNext() {
            if (partIndex >= spans.length) {
                setTimeout(() => {
                    heroSubtitle.classList.add('visible');
                    setTimeout(() => heroBtns.classList.add('visible'), 300);
                    setTimeout(() => cursor.remove(), 2000);
                }, 400);
                return;
            }
            spans[partIndex].span.textContent = spans[partIndex].text.slice(0, localCharIndex + 1);
            localCharIndex++;
            if (localCharIndex >= spans[partIndex].text.length) { partIndex++; localCharIndex = 0; }
            setTimeout(typeNext, speed);
        }

        // Show badge first, then start typing
        if (heroBadge) {
            setTimeout(() => heroBadge.classList.add('visible'), 200);
        }
        setTimeout(typeNext, 800);
    }

    if (heroHeading) typeText();

    // ==========================================
    // PARTICLE BACKGROUND (Hero Section)
    // ==========================================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            const hero = canvas.parentElement;
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.fadeDir = Math.random() > 0.5 ? 1 : -1;
                this.fadeSpd = Math.random() * 0.005 + 0.002;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity += this.fadeDir * this.fadeSpd;
                if (this.opacity >= 0.6) this.fadeDir = -1;
                if (this.opacity <= 0.05) this.fadeDir = 1;
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(244, 117, 39, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 6000), 120);
            for (let i = 0; i < count; i++) particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(244, 117, 39, ${0.05 * (1 - dist / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }

        resizeCanvas(); initParticles(); animate();
        window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
    }

    // ==========================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll(
        '.section-header, .service-card, .portfolio-item, .about-text, .about-image, .about-stats, ' +
        '.contact-form, .contact-info, .testimonial-slider, .partners, ' +
        '.process-step, .faq-item, .footer-brand, .footer-links, .footer-socials'
    );

    revealElements.forEach(el => {
        el.classList.add('scroll-reveal');
        const parent = el.parentElement;
        const siblings = Array.from(parent.children).filter(c => c.classList.contains('scroll-reveal'));
        const idx = siblings.indexOf(el);
        if (idx > 0) el.style.transitionDelay = `${idx * 0.1}s`;
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // COUNTER ANIMATION (Stats Section)
    // ==========================================
    const statItems = document.querySelectorAll('.stat-item[data-count]');
    let statsAnimated = false;

    function animateCounters() {
        if (statsAnimated) return;
        statsAnimated = true;
        statItems.forEach(item => {
            const target = parseInt(item.getAttribute('data-count'));
            const suffix = item.getAttribute('data-suffix') || '';
            const h3 = item.querySelector('h3');
            const duration = 2000;
            const startTime = performance.now();
            item.classList.add('counting');

            function update(currentTime) {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                h3.textContent = Math.floor(eased * target) + suffix;
                if (progress < 1) requestAnimationFrame(update);
                else { h3.textContent = target + suffix; setTimeout(() => item.classList.remove('counting'), 500); }
            }
            requestAnimationFrame(update);
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { animateCounters(); statsObserver.unobserve(entry.target); }
        });
    }, { threshold: 0.5 });
    statItems.forEach(item => statsObserver.observe(item));

    // ==========================================
    // PORTFOLIO FILTERS
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item[data-category]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ==========================================
    // LIGHTBOX MODAL
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightboxContent');
    const lightboxClose = document.getElementById('lightboxClose');

    function openLightbox(videoSrc, isVertical) {
        lightboxContent.innerHTML = `<iframe src="${videoSrc}" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen></iframe>`;
        lightboxContent.className = 'lightbox-content' + (isVertical ? ' vertical' : '');
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightboxContent.innerHTML = '';
        document.body.style.overflow = '';
    }

    // Portfolio item clicks
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const videoSrc = item.getAttribute('data-video');
            const isVertical = item.hasAttribute('data-aspect');
            if (videoSrc) openLightbox(videoSrc, isVertical);
        });
    });

    // Showreel button
    const showreelBtn = document.getElementById('showreelBtn');
    if (showreelBtn) {
        showreelBtn.addEventListener('click', () => {
            openLightbox('https://www.youtube.com/embed/uBwIYzIrnXY?rel=0&autoplay=1', false);
        });
    }

    // Close lightbox
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

    // ==========================================
    // FAQ ACCORDION
    // ==========================================
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const wasActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!wasActive) item.classList.add('active');
        });
    });

    // ==========================================
    // BACK TO TOP
    // ==========================================
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // SMOOTH SCROLLING
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const el = document.querySelector(targetId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ==========================================
    // FORM SUBMISSION (Web3Forms)
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formResult = document.getElementById('formResult');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;
            formResult.style.display = 'none';

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: new FormData(contactForm)
                });
                const data = await response.json();
                if (data.success) {
                    formResult.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
                    formResult.className = 'form-result success';
                    formResult.style.display = 'block';
                    contactForm.reset();
                } else {
                    formResult.textContent = '❌ Something went wrong. Please try again.';
                    formResult.className = 'form-result error';
                    formResult.style.display = 'block';
                }
            } catch (error) {
                formResult.textContent = '❌ Network error. Please check your connection.';
                formResult.className = 'form-result error';
                formResult.style.display = 'block';
            }
            btn.textContent = originalText;
            btn.disabled = false;
        });
    }

    // ==========================================
    // MOBILE MENU
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        document.querySelectorAll('.nav-links a').forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(13, 13, 13, 0.95)';
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
        } else {
            navbar.style.background = 'rgba(13, 13, 13, 0.9)';
            navbar.style.padding = '20px 0';
            navbar.style.boxShadow = 'none';
        }
    });
});
