// ==================== THREE.JS 3D BACKGROUND ====================
let scene, camera, renderer, boxes = [];

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create floating boxes
    for (let i = 0; i < 20; i++) {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xffffff,
            wireframe: false,
            emissive: 0x111122
        });
        const box = new THREE.Mesh(geometry, material);
        
        box.position.x = (Math.random() - 0.5) * 20;
        box.position.y = (Math.random() - 0.5) * 20;
        box.position.z = (Math.random() - 0.5) * 20;
        
        box.rotation.x = Math.random() * Math.PI;
        box.rotation.y = Math.random() * Math.PI;
        
        box.velocity = {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        };
        
        scene.add(box);
        boxes.push(box);
    }
    
    // Lighting
    const light1 = new THREE.PointLight(0x0052cc, 1, 100);
    light1.position.set(10, 10, 10);
    scene.add(light1);
    
    const light2 = new THREE.PointLight(0xff6b35, 1, 100);
    light2.position.set(-10, -10, 10);
    scene.add(light2);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    // Animation loop
    animate();
    
    // Handle resize
    window.addEventListener('resize', onWindowResize);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Animate boxes
    boxes.forEach((box, index) => {
        box.rotation.x += box.velocity.x;
        box.rotation.y += box.velocity.y;
        box.position.x += box.velocity.x;
        box.position.y += box.velocity.y;
        
        // Bounce off edges
        if (Math.abs(box.position.x) > 10) box.velocity.x *= -1;
        if (Math.abs(box.position.y) > 10) box.velocity.y *= -1;
    });
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ==================== GSAP SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Service cards stagger animation
    gsap.to('.service-card', {
        scrollTrigger: {
            trigger: '.services',
            start: 'top center',
            toggleActions: 'play none none reverse'
        },
        duration: 0.6,
        y: 0,
        opacity: 1,
        stagger: 0.15,
        ease: 'power2.out',
        clearProps: 'transform'
    });
    
    // About section parallax
    gsap.to('.about-image', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top center',
            scrub: 1
        },
        y: -100,
        duration: 2
    });
    
    // Stats counter animation
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        
        gsap.to(stat, {
            scrollTrigger: {
                trigger: '.stats',
                start: 'top center'
            },
            duration: 2,
            textContent: target,
            snap: { textContent: 1 },
            ease: 'power1.inOut'
        });
    });
    
    // Contact form fade in
    gsap.to('.contact-form, .contact-info', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top center'
        },
        duration: 0.8,
        y: 0,
        opacity: 1,
        stagger: 0.2,
        ease: 'power2.out'
    });
}

// ==================== INTERACTIVE FEATURES ====================
function initInteractivity() {
    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
    
    // Smooth scroll links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Thank you! We\'ll get back to you soon.');
            contactForm.reset();
        });
    }
    
    // CTA button click
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Contact us for custom logistics solutions!');
        });
    });
    
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
    
    // Service card hover effect
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, { duration: 0.3, scale: 1.05 });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, { duration: 0.3, scale: 1 });
        });
    });
}

// ==================== NOTIFICATIONS ====================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #0052cc, #ff6b35);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        gsap.to(notification, {
            duration: 0.3,
            opacity: 0,
            y: -20,
            onComplete: () => notification.remove()
        });
    }, 3000);
}

// ==================== PARALLAX EFFECT ====================
function initParallax() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                
                document.querySelectorAll('[data-parallax]').forEach(el => {
                    const speed = el.dataset.parallax || 0.5;
                    el.style.transform = `translateY(${scrollTop * speed}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Add initial opacity to elements
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
    });
    
    document.querySelectorAll('.contact-form, .contact-info').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
    });
    
    // Initialize all features
    initThreeJS();
    initScrollAnimations();
    initInteractivity();
    initParallax();
    
    // Add animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
});

// ==================== PERFORMANCE OPTIMIZATION ====================
// Reduce 3D box count on mobile
if (window.innerWidth < 768) {
    // Will be handled before initialization
}

// Lazy load images
const images = document.querySelectorAll('img[data-src]');
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}
