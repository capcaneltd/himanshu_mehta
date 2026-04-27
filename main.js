/**
 * Dr. Himanshu Mehta — Cinematic Web Experience
 * Heavy animation, scroll-driven color, continuous motion
 */

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);
    createParticles();
    createMosaic();
    initLenis();
    runHeroEntrance();
    initScrollAnimations();
});

/* ============================
   CREATE MOSAIC TILES (4 cols x 5 rows = 20 tiles)
   ============================ */
function createMosaic() {
    const container = document.getElementById('heroMosaic');
    if (!container) return;

    const src = container.dataset.src;
    const cols = 4;
    const rows = 5;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const tile = document.createElement('div');
            tile.className = 'mosaic-tile';
            tile.style.backgroundImage = `url(${src})`;
            tile.style.backgroundPosition = `${(col / (cols - 1)) * 100}% ${(row / (rows - 1)) * 100}%`;
            container.appendChild(tile);
        }
    }
}

/* ============================
   HERO ENTRANCE — MOSAIC ASSEMBLY
   ============================ */
function runHeroEntrance() {
    const tiles = document.querySelectorAll('.mosaic-tile');
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Mandala fades in first
    tl.to('.hero-mandala', {
        opacity: 0.4,
        duration: 1.5,
        ease: 'power1.out'
    })

    // Tiles fly in from random positions and assemble
    .fromTo(tiles, {
        opacity: 0,
        scale: 0.3,
        x: () => gsap.utils.random(-300, 300),
        y: () => gsap.utils.random(-300, 300),
        rotation: () => gsap.utils.random(-45, 45),
    }, {
        opacity: 0.35,  // Stay dimmed as background
        scale: 1,
        x: 0,
        y: 0,
        rotation: 0,
        duration: 1.8,
        stagger: {
            each: 0.06,
            from: 'random',  // Random order for organic feel
        },
        ease: 'expo.out',
    }, '-=1')

    // Tag line
    .to('.hero-tag', {
        opacity: 1,
        duration: 1
    }, '-=0.6')
    // Title lines slide up from masks
    .to('.hero-title .line-inner', {
        y: '0%',
        duration: 1.4,
        stagger: 0.15,
        ease: 'expo.out'
    }, '-=0.8')
    // Bio text
    .to('.hero-bio', {
        opacity: 1,
        y: 0,
        duration: 1.2,
    }, '-=0.5')
    // Buttons
    .to('.hero-buttons', {
        opacity: 1,
        y: 0,
        duration: 1,
    }, '-=0.7')
    // Scroll cue
    .to('.scroll-cue', {
        opacity: 1,
        duration: 1,
    }, '-=0.4')
    // Particles fade in
    .to('.particle', {
        opacity: 0.6,
        stagger: { each: 0.02, from: 'random' },
        duration: 1,
    }, '-=1');
}

/* ============================
   SMOOTH SCROLL
   ============================ */
function initLenis() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
}

/* ============================
   GOLDEN PARTICLES
   ============================ */
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.width = (Math.random() * 3 + 1) + 'px';
        p.style.height = p.style.width;
        container.appendChild(p);

        // Continuous floating motion
        gsap.to(p, {
            y: `random(-80, 80)`,
            x: `random(-40, 40)`,
            duration: `random(4, 8)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 3
        });
    }
}

/* ============================
   SCROLL-DRIVEN ANIMATIONS
   ============================ */
function initScrollAnimations() {

    // ——— HERO: Scroll-to-Color on all mosaic tiles ———
    gsap.to('.mosaic-tile', {
        opacity: 0.55,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '60% top',
            scrub: 1.5
        }
    });



    // Mandala scales up as you scroll
    gsap.to('.hero-mandala', {
        scale: 1.3,
        opacity: 0,
        scrollTrigger: {
            trigger: '.hero',
            start: '30% top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Scroll cue fades out
    gsap.to('.scroll-cue', {
        opacity: 0,
        scrollTrigger: {
            trigger: '.hero',
            start: '10% top',
            end: '30% top',
            scrub: true
        }
    });

    // Hero text parallax (moves faster for depth)
    gsap.to('.hero-text-top', {
        yPercent: -30,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // ——— WISDOM: Scroll-to-Color + Parallax ———
    gsap.to('.wisdom-bg-image img', {
        filter: 'brightness(0.5)',
        scale: 1,
        scrollTrigger: {
            trigger: '.wisdom',
            start: 'top bottom',
            end: 'center center',
            scrub: 1.5
        }
    });

    // Wisdom title lines reveal
    gsap.to('.w-line-inner', {
        y: '0%',
        duration: 1.5,
        stagger: 0.2,
        ease: 'expo.out',
        scrollTrigger: {
            trigger: '.wisdom-title',
            start: 'top 75%',
        }
    });

    // Wisdom body fade up
    gsap.to('.wisdom-body', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'expo.out',
        scrollTrigger: {
            trigger: '.wisdom-body',
            start: 'top 85%',
        }
    });

    // ——— BOOKS: Stagger Reveal ———
    gsap.from('.book-card', {
        y: 100,
        opacity: 0,
        scale: 0.9,
        stagger: 0.15,
        duration: 1.5,
        ease: 'back.out(1.2)',
        scrollTrigger: {
            trigger: '.books',
            start: 'top 70%',
        }
    });

    // ——— LIFESTYLE: Cinematic Scale-In ———
    gsap.from('.lifestyle-cell', {
        scale: 1.3,
        opacity: 0,
        stagger: 0.15,
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.lifestyle',
            start: 'top 80%',
        }
    });

    // Continuous parallax on lifestyle images
    document.querySelectorAll('.lifestyle-cell img').forEach((img, i) => {
        gsap.to(img, {
            yPercent: (i % 2 === 0) ? -10 : 10,
            scrollTrigger: {
                trigger: '.lifestyle',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    // ——— YOGA: Title + Text Reveals ———
    gsap.to('.y-line-inner', {
        y: '0%',
        duration: 1.5,
        stagger: 0.2,
        ease: 'expo.out',
        scrollTrigger: {
            trigger: '.yoga-title',
            start: 'top 75%',
        }
    });

    gsap.to('.yoga-text p', {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.yoga-text',
            start: 'top 80%',
        }
    });

    gsap.to('.signature', {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: 'expo.out',
        scrollTrigger: {
            trigger: '.signature',
            start: 'top 90%',
        }
    });

    // ——— FOOTER: Title Reveal ———
    gsap.from('.footer-brand h2', {
        y: 60,
        opacity: 0,
        duration: 2,
        ease: 'expo.out',
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 85%',
        }
    });

    gsap.from('.footer-col', {
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.footer-grid',
            start: 'top 85%',
        }
    });
}
