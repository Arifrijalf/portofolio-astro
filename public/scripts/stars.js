(function() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'stars-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let w, h, stars = [], shootingStars = [];
    let lastTime = 0;
    const FPS = 24;
    const interval = 1000 / FPS;
    let rafId = null;
    let isVisible = true;

    let staticCanvas, staticCtx;

    function resize() {
        requestAnimationFrame(() => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            drawStaticStars();
        });
    }

    function drawStaticStars() {
        staticCanvas = document.createElement('canvas');
        staticCanvas.width = w;
        staticCanvas.height = h;
        staticCtx = staticCanvas.getContext('2d');

        stars = [];
        for (let i = 0; i < 60; i++) {
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.2 + 0.2,
                opacity: Math.random() * 0.5 + 0.3
            });
        }

        staticCtx.fillStyle = 'rgba(162, 201, 255, 0.5)';
        for (const s of stars) {
            staticCtx.beginPath();
            staticCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            staticCtx.fill();
        }
    }

    window.addEventListener('resize', resize);
    resize();

    function addShootingStar() {
        const x = Math.random() * w;
        const y = 0;
        const angle = Math.PI / 4 + Math.random() * 0.2;
        const speed = Math.random() * 8 + 5;

        shootingStars.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1.0,
            decay: Math.random() * 0.015 + 0.01
        });
    }

    function draw(timestamp) {
        if (!isVisible || document.hidden) {
            rafId = requestAnimationFrame(draw);
            return;
        }

        if (timestamp - lastTime < interval) {
            rafId = requestAnimationFrame(draw);
            return;
        }
        lastTime = timestamp;

        if (shootingStars.length === 0 && Math.random() > 0.02) {
            rafId = requestAnimationFrame(draw);
            return;
        }

        ctx.clearRect(0, 0, w, h);

        if (staticCanvas) {
            ctx.drawImage(staticCanvas, 0, 0);
        }

        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const s = shootingStars[i];
            s.x += s.vx;
            s.y += s.vy;
            s.life -= s.decay;

            if (s.life <= 0) {
                shootingStars.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x - s.vx * 3, s.y - s.vy * 3);
            ctx.strokeStyle = `rgba(255, 255, 255, ${s.life})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        if (Math.random() < 0.03) {
            addShootingStar();
        }

        rafId = requestAnimationFrame(draw);
    }

    const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
    }, { threshold: 0 });
    observer.observe(canvas);

    rafId = requestAnimationFrame(draw);
})();
