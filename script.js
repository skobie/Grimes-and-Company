/* ============================================================
   GRIMES & COMPANY — Interactive Behaviors
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Header Scroll Effect ───────────────────────────────
    const header = document.getElementById('header');
    let lastScroll = 0;

    function handleScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 60) {
            header.classList.add('header--scrolled');
            header.classList.remove('header--transparent');
        } else {
            header.classList.remove('header--scrolled');
            header.classList.add('header--transparent');
        }

        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run on load


    // ─── Mobile Navigation ──────────────────────────────────
    const hamburger = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileOverlay = document.getElementById('mobile-overlay');

    function toggleMobileNav() {
        hamburger.classList.toggle('hamburger--active');
        mobileNav.classList.toggle('mobile-nav--open');
        mobileOverlay.classList.toggle('mobile-nav__overlay--visible');
        document.body.style.overflow = mobileNav.classList.contains('mobile-nav--open') ? 'hidden' : '';
    }

    function closeMobileNav() {
        hamburger.classList.remove('hamburger--active');
        mobileNav.classList.remove('mobile-nav--open');
        mobileOverlay.classList.remove('mobile-nav__overlay--visible');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMobileNav);
    mobileOverlay.addEventListener('click', closeMobileNav);

    // Close mobile nav on link click
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });


    // ─── Smooth Scrolling ───────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ─── Active Nav Link Highlighting ───────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    function highlightNav() {
        const scrollY = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('nav__link--active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('nav__link--active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });


    // ─── Scroll Reveal Animations ───────────────────────────
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // ─── Testimonial Carousel ───────────────────────────────
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonials__dot');
    let currentSlide = 0;
    let autoPlayInterval;

    function showSlide(index) {
        testimonials.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = index;
        testimonials[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % testimonials.length);
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopAutoPlay();
            showSlide(parseInt(dot.dataset.index));
            startAutoPlay();
        });
    });

    // Swipe support for mobile
    let touchStartX = 0;
    const carousel = document.getElementById('testimonial-carousel');

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoPlay();
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                showSlide((currentSlide + 1) % testimonials.length);
            } else {
                showSlide((currentSlide - 1 + testimonials.length) % testimonials.length);
            }
        }
        startAutoPlay();
    }, { passive: true });

    startAutoPlay();


    // ─── Animated Counter for Stats ─────────────────────────
    const stats = document.querySelectorAll('.about__stat-number');
    let statsAnimated = false;

    function animateCounters() {
        if (statsAnimated) return;

        const aboutSection = document.getElementById('about');
        const rect = aboutSection.getBoundingClientRect();

        if (rect.top < window.innerHeight && rect.bottom > 0) {
            statsAnimated = true;

            stats.forEach(stat => {
                const text = stat.textContent;
                const number = parseFloat(text);
                const suffix = text.replace(/[\d.]/g, '');
                const isDecimal = text.includes('.');
                const duration = 2000;
                const start = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out cubic
                    const easedProgress = 1 - Math.pow(1 - progress, 3);
                    const current = number * easedProgress;

                    if (isDecimal) {
                        stat.textContent = current.toFixed(1) + suffix;
                    } else {
                        stat.textContent = Math.floor(current) + suffix;
                    }

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = text;
                    }
                }

                requestAnimationFrame(updateCounter);
            });
        }
    }

    window.addEventListener('scroll', animateCounters, { passive: true });


    // ─── Parallax effect on hero background ─────────────────
    const heroBg = document.querySelector('.hero__bg img');

    function handleParallax() {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrollY * 0.3}px) scale(1.1)`;
        }
    }

    window.addEventListener('scroll', handleParallax, { passive: true });

});
