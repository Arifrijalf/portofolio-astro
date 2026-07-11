// Note: main.js in original project relied on 'lucide' global variable. 
// In Astro, I will import lucide where needed if possible, 
// or I can keep the global script inclusion in BaseLayout if that's easier.
// For now, I'll copy the logic as is.

const toggleHireModal = () => {
    const modal = document.getElementById('hire-modal');
    if (!modal) return;
    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');
    // Using Lucide global if available or simply relying on the UI framework
    if (typeof lucide !== 'undefined') lucide.createIcons();
};

const toggleMobileMenu = () => {
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
};

const closeMobileMenu = () => {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('mobile-menu-icon');
    if (!menu || !icon) return;
    menu.classList.remove('is-open');
    icon.textContent = 'menu';
};

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide icons on page load
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Preload all images in background
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        const preload = new Image();
        preload.src = img.src;
    });

    // Hero slideshow — preload all assets first, then play smoothly
    const slideshow = document.getElementById('hero-slideshow');
    if (slideshow) {
        const slides = slideshow.querySelectorAll('.slide');
        let current = 0;
        let timer = null;
        let loopCount = 0;
        const VIDEO_LOOPS = 2;

        // Hide slideshow until all assets loaded
        slideshow.style.opacity = '0';

        function preloadAsset(slide) {
            return new Promise(resolve => {
                if (slide.tagName === 'VIDEO') {
                    slide.preload = 'auto';
                    slide.load();
                    if (slide.readyState >= 2) { resolve(); return; }
                    const onReady = () => { resolve(); slide.removeEventListener('loadeddata', onReady); };
                    slide.addEventListener('loadeddata', onReady);
                } else if (slide.tagName === 'IMG') {
                    if (slide.complete) { resolve(); return; }
                    slide.onload = () => resolve();
                    slide.onerror = () => resolve();
                } else {
                    resolve();
                }
            });
        }

        async function preloadAll() {
            const promises = Array.from(slides).map(s => preloadAsset(s));
            await Promise.all(promises);
        }

        preloadAll().then(() => {
            slideshow.style.opacity = '1';
            slideshow.style.transition = 'opacity 0.5s ease';

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
                    next.play();
                }

                scheduleNext();
            }

            function onVideoEnded() {
                loopCount++;
                if (loopCount >= VIDEO_LOOPS) {
                    goToNext();
                } else {
                    slides[current].currentTime = 0;
                    slides[current].play();
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

            // Start slideshow
            if (slides[current].tagName === 'VIDEO') {
                slides[current].play();
            }
            scheduleNext();
        });
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Mobile Hire Me button
    const mobileHireBtns = document.querySelectorAll('.mobile-hire-btn');
    mobileHireBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeMobileMenu();
            toggleHireModal();
        });
    });

    // Desktop Hire Me buttons
    document.querySelectorAll('.hire-btn').forEach(btn => {
        btn.addEventListener('click', toggleHireModal);
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('mobile-menu');
        const btn = document.getElementById('mobile-menu-btn');
        if (menu && !menu.classList.contains('is-open')) return;
        if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Modal: close via close button or clicking backdrop
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
            if (e.target === hireModal || e.target.classList.contains('backdrop-blur-sm')) {
                toggleHireModal();
            }
        });
    }

    // Nav: transparent on top, glass on scroll
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

    // Magnetic button effect (desktop only)
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const strength = 0.35;
            btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // Smooth scroll for all anchor links (fixes iOS/Android Safari)
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

    // Download CV button — check if CV file exists
    const cvBtn = document.getElementById('download-cv-btn');
    if (cvBtn) {
        const CV_PATH = '/ArifRijalFadhilah_CV.pdf';
        fetch(CV_PATH, { method: 'HEAD' })
            .then(res => {
                if (res.ok) {
                    cvBtn.href = CV_PATH;
                    cvBtn.setAttribute('download', '');
                } else {
                    cvBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        alert('Maaf, CV belum di-update');
                    });
                }
            })
            .catch(() => {
                cvBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    alert('Maaf, CV belum di-update');
                });
            });
    }

    // Nav active state on scroll
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    function updateNav() {
        let activeId = "home";
        const scrollY = window.scrollY || window.pageYOffset;

        sections.forEach((section) => {
            const offsetTop = section.offsetTop - 150;
            if (scrollY >= offsetTop) {
                activeId = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            const isMatch = link.getAttribute("href") === `#${activeId}`;
            link.classList.remove("text-primary", "font-bold", "border-[#106EBE]");
            link.classList.add("text-on-surface-variant", "border-transparent");
            if (isMatch) {
                link.classList.remove("text-on-surface-variant", "border-transparent");
                link.classList.add("text-primary", "font-bold", "border-[#106EBE]");
            }
        });

        // Update mobile nav active state
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            const isMatch = link.getAttribute("href") === `#${activeId}`;
            link.classList.remove("text-primary", "font-bold", "bg-surface-container-low/50");
            link.classList.add("text-on-surface-variant");
            if (isMatch) {
                link.classList.remove("text-on-surface-variant");
                link.classList.add("text-primary", "font-bold", "bg-surface-container-low/50");
            }
        });
    }

    let ticking = false;
    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateNav();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init('WTPeowefUYZc_D5SZ');
    }

    updateNav();

    // Contact form submission: Formspree primary, EmailJS fallback
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameVal = document.getElementById('name').value.trim();
            const messageVal = document.getElementById('message').value.trim();

            // Client-side minlength validation
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

            // Disable button + show loading
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-60', 'pointer-events-none');
            btnText.textContent = 'Transmitting...';
            formStatus.innerHTML = '';
            formStatus.className = '';

            // Try Formspree first
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
            } catch (err) {
                // Formspree failed, will try EmailJS
            }

            // Fallback to EmailJS if Formspree failed
            if (!sent && typeof emailjs !== 'undefined') {
                try {
                    const now = new Date();
                    const timeStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                    await emailjs.send('service_f3wq55k', 'template_r4wrp6p', {
                        name: nameVal,
                        message: messageVal,
                        time: timeStr
                    });
                    sent = true;
                } catch (err) {
                    // EmailJS also failed
                }
            }

            if (sent) {
                formStatus.innerHTML = '&#10003; Message transmitted successfully. I will respond shortly.';
                formStatus.className = 'form-status success';
                contactForm.reset();
            } else {
                formStatus.innerHTML = 'Transmission failed. Please try again or contact me directly via email.';
                formStatus.className = 'form-status error';
            }

            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-60', 'pointer-events-none');
            btnText.textContent = originalText;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    }
});