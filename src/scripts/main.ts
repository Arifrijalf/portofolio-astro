import { createIcons } from 'lucide';

function toggleHireModal() {
    const modal = document.getElementById('hire-modal');
    if (!modal) return;
    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('mobile-menu-icon');
    if (!menu || !icon) return;
    const isOpen = menu.classList.contains('is-open');
    if (isOpen) {
        menu.classList.remove('is-open');
        icon.textContent = 'menu';
    } else {
        menu.classList.add('is-open');
        icon.textContent = 'close';
    }
}

function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('mobile-menu-icon');
    if (!menu || !icon) return;
    menu.classList.remove('is-open');
    icon.textContent = 'menu';
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        createIcons();
    } catch {}

    const slideshow = document.getElementById('hero-slideshow');
    if (slideshow) {
        const slides = slideshow.querySelectorAll('.slide');
        let current = 0;
        let timer = null;
        let loopCount = 0;
        const VIDEO_LOOPS = 2;

        function preloadVideo(slide) {
            if (slide.tagName !== 'VIDEO') return Promise.resolve();
            return new Promise(resolve => {
                const timeout = setTimeout(() => resolve(), 5000);
                slide.preload = 'metadata';
                slide.load();
                if (slide.readyState >= 2) { clearTimeout(timeout); resolve(); return; }
                const onReady = () => { clearTimeout(timeout); resolve(); slide.removeEventListener('loadeddata', onReady); };
                slide.addEventListener('loadeddata', onReady);
                slide.addEventListener('error', () => { clearTimeout(timeout); resolve(); });
            });
        }

        const videoSlides = Array.from(slides).filter(s => s.tagName === 'VIDEO');
        Promise.all(videoSlides.map(preloadVideo)).then(() => {

            function goToNext() {
                clearTimeout(timer);
                const prev = slides[current];

                if (prev.tagName === 'VIDEO') {
                    prev.pause();
                    prev.currentTime = 0;
                    prev.removeEventListener('ended', onVideoEnded);
                }
                prev.classList.remove('active');

                current = (current + 1) % slides.length;
                loopCount = 0;

                const next = slides[current];
                next.classList.add('active');

if (next.tagName === 'VIDEO') {
    next.currentTime = 0;
    next.play().catch(e => void e);
}

                scheduleNext();
            }

            function onVideoEnded() {
                loopCount++;
                if (loopCount >= VIDEO_LOOPS) {
                    goToNext();
                } else {
                    slides[current].currentTime = 0;
slides[current].play().catch(e => void e);
                }
            }

            function scheduleNext() {
                clearTimeout(timer);
                const slide = slides[current];
                if (slide.tagName === 'VIDEO') {
                    slide.addEventListener('ended', onVideoEnded);
                } else {
                    timer = setTimeout(goToNext, 4000);
                }
            }

            if (slides[current].tagName === 'VIDEO') {
                slides[current].play().catch(e => void e);
            }
            scheduleNext();
        });
    }

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    document.querySelectorAll('.mobile-hire-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            closeMobileMenu();
            toggleHireModal();
        });
    });

    document.querySelectorAll('.hire-btn').forEach(btn => {
        btn.addEventListener('click', toggleHireModal);
    });

    document.addEventListener('click', (e) => {
        const menu = document.getElementById('mobile-menu');
        const btn = document.getElementById('mobile-menu-btn');
        if (menu && !menu.classList.contains('is-open')) return;
        if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
            closeMobileMenu();
        }
    });

    const hireModal = document.getElementById('hire-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleHireModal();
        });
    }

    if (hireModal) {
        hireModal.addEventListener('click', (e) => {
            if (e.target === hireModal) {
                toggleHireModal();
            }
        });
    }

    const mainNav = document.getElementById('main-nav');
    function updateNavBg() {
        if (!mainNav) return;
        if (window.scrollY > 50) {
            mainNav.classList.add('is-scrolled');
        } else {
            mainNav.classList.remove('is-scrolled');
        }
    }
    updateNavBg();
    window.addEventListener('scroll', updateNavBg, { passive: true });

    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        let rafId = null;
        btn.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const strength = 0.35;
                btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
                rafId = null;
            });
        });
        btn.addEventListener('mouseleave', () => {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            btn.style.transform = 'translate(0, 0)';
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const cvBtn = document.getElementById('download-cv-btn');
    if (cvBtn) {
        const CV_PATH = '/ArifRijalFadhilah_CV.pdf';

        fetch(CV_PATH, { method: 'HEAD' })
            .then(res => {
                const type = res.headers.get('content-type') || '';
                if (res.ok && type.includes('pdf')) {
                    cvBtn.addEventListener('click', () => {
                        window.open(CV_PATH, '_blank');
                    });
                } else {
                    cvBtn.addEventListener('click', () => {
                        alert('Maaf, CV belum di-update');
                    });
                }
            })
            .catch(() => {
                cvBtn.addEventListener('click', () => {
                    alert('Maaf, CV belum di-update');
                });
            });
    }

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateNav() {
        let activeId = 'home';
        const scrollY = window.scrollY || window.pageYOffset;

        sections.forEach((section) => {
            const offsetTop = section.offsetTop - 150;
            if (scrollY >= offsetTop) {
                activeId = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            const isMatch = link.getAttribute('href') === `#${activeId}`;
            link.classList.remove('text-primary', 'font-bold', 'border-[#106EBE]');
            link.classList.add('text-on-surface-variant', 'border-transparent');
            if (isMatch) {
                link.classList.remove('text-on-surface-variant', 'border-transparent');
                link.classList.add('text-primary', 'font-bold', 'border-[#106EBE]');
            }
        });

        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            const isMatch = link.getAttribute('href') === `#${activeId}`;
            link.classList.remove('text-primary', 'font-bold', 'bg-surface-container-low/50');
            link.classList.add('text-on-surface-variant');
            if (isMatch) {
                link.classList.remove('text-on-surface-variant');
                link.classList.add('text-primary', 'font-bold', 'bg-surface-container-low/50');
            }
        });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateNav();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    updateNav();

    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameVal = document.getElementById('name').value.trim();
            const messageVal = document.getElementById('message').value.trim();

            if (nameVal.length < 3) {
                formStatus.innerHTML = 'Name must be at least 3 characters.';
                formStatus.className = 'form-status error';
                return;
            }
            if (messageVal.length < 20) {
                formStatus.innerHTML = 'Message must be at least 20 characters. (' + messageVal.length + '/20)';
                formStatus.className = 'form-status error';
                return;
            }

            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;

            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-60', 'pointer-events-none');
            btnText.textContent = 'Transmitting...';
            formStatus.innerHTML = '';
            formStatus.className = '';

            let sent = false;
            try {
                const data = new FormData(contactForm);
                const response = await fetch('https://formspree.io/f/mqevrdnv', {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    sent = true;
                }
            } catch (err) {}

            if (sent) {
                formStatus.innerHTML = '&#10003; Message transmitted successfully. I will respond shortly.';
                formStatus.className = 'form-status success';
                contactForm.reset();
            } else {
                formStatus.innerHTML = 'Transmission failed. Please try again or contact me directly via email.';
                formStatus.className = 'form-status error';
            }

            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-60', 'pointer-events-none');
            btnText.textContent = originalText;
        });
    }
});
