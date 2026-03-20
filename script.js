// ============================================
// Scroll-triggered fade-in animations
// ============================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Staggered delay for sibling elements
            const siblings = entry.target.parentElement.querySelectorAll('.fade-in-section');
            let delay = 0;
            siblings.forEach((el, index) => {
                if (el === entry.target) delay = index * 80;
            });
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
        }
    });
}, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
});

// ============================================
// Stat counter animation
// ============================================
function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1600;
    const startTime = performance.now();

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = easeOutQuart(progress) * target;

        el.textContent = value.toFixed(decimals) + suffix;

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = target.toFixed(decimals) + suffix;
        }
    }

    requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-count').forEach(animateCounter);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// ============================================
// Process timeline draw
// ============================================
const processObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Small delay so the step's fade-in lands first
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, 150);
            processObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3
});

// ============================================
// DOMContentLoaded
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Fade-in observer
    document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));

    // Stats counter observer
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) statsObserver.observe(statsBar);

    // Timeline draw observer
    document.querySelectorAll('.process-step').forEach(el => processObserver.observe(el));

    // ---- Navbar scroll effect ----
    const navbar = document.getElementById('navbar');

    const updateNavbar = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // ---- Mobile menu ----
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden');

            const icon = mobileMenuBtn.querySelector('[data-lucide]');
            if (icon) {
                icon.setAttribute('data-lucide', isOpen ? 'menu' : 'x');
                lucide.createIcons();
            }
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('[data-lucide]');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    // ---- Smooth scrolling ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
});

// ============================================
// Form submission handler
// ============================================
function handleFormSubmit(form) {
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = 'Sending...';

    setTimeout(() => {
        btn.textContent = 'Sent!';
        btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
        form.reset();

        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = originalText;
            btn.style.background = '';
        }, 3000);
    }, 800);
}
