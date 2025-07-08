// Three.js Background Animation
let scene, camera, renderer, stars, starGeo;

function init() {
    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1;
    camera.rotation.x = Math.PI / 6;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create stars
    starGeo = new THREE.Geometry();
    
    for (let i = 0; i < 6000; i++) {
        let star = new THREE.Vector3(
            Math.random() * 600 - 300,
            Math.random() * 600 - 300,
            Math.random() * 600 - 300
        );
        star.velocity = 0;
        star.acceleration = 0.02;
        starGeo.vertices.push(star);
    }
    
    // Star material
    let sprite = new THREE.TextureLoader().load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    let starMaterial = new THREE.PointsMaterial({
        color: 0x64ffda,
        size: 0.7,
        map: sprite,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    // Create star system
    stars = new THREE.Points(starGeo, starMaterial);
    scene.add(stars);
    
    // Add floating geometric shapes
    createFloatingShapes();
    
    // Start animation
    animate();
}

function createFloatingShapes() {
    // Create floating cubes
    for (let i = 0; i < 10; i++) {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x64ffda,
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });
        const cube = new THREE.Mesh(geometry, material);
        
        cube.position.x = Math.random() * 200 - 100;
        cube.position.y = Math.random() * 200 - 100;
        cube.position.z = Math.random() * 100 - 50;
        
        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;
        
        scene.add(cube);
    }
    
    // Create floating spheres
    for (let i = 0; i < 5; i++) {
        const geometry = new THREE.SphereGeometry(0.3, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x4fc3f7,
            transparent: true,
            opacity: 0.15,
            wireframe: true
        });
        const sphere = new THREE.Mesh(geometry, material);
        
        sphere.position.x = Math.random() * 200 - 100;
        sphere.position.y = Math.random() * 200 - 100;
        sphere.position.z = Math.random() * 100 - 50;
        
        scene.add(sphere);
    }
}

function animate() {
    // Move stars
    starGeo.vertices.forEach(function(star) {
        star.velocity += star.acceleration;
        star.y -= star.velocity;
        
        if (star.y < -200) {
            star.y = 200;
            star.velocity = 0;
        }
    });
    
    starGeo.verticesNeedUpdate = true;
    
    // Rotate floating shapes
    scene.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.rotation.x += 0.01;
            child.rotation.y += 0.02;
        }
    });
    
    // Camera movement based on mouse
    if (typeof mouseX !== 'undefined') {
        camera.position.x += (mouseX - camera.position.x) * 0.001;
        camera.position.y += (-mouseY - camera.position.y) * 0.001;
    }
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Mouse tracking
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX - window.innerWidth / 2;
    mouseY = e.clientY - window.innerHeight / 2;
});

// Window resize handler
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize Three.js when page loads
window.addEventListener('load', init);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply scroll animations to sections
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation
document.addEventListener('DOMContentLoaded', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 500);
    }
});

// Particle cursor effect
class ParticleCursor {
    constructor() {
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        
        document.body.appendChild(this.canvas);
        
        this.resize();
        this.bindEvents();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Create new particle
            this.particles.push({
                x: this.mouse.x,
                y: this.mouse.y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1,
                decay: 0.02
            });
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = '#64ffda';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle cursor
document.addEventListener('DOMContentLoaded', function() {
    new ParticleCursor();
});

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const message = form.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for your message! I will get back to you soon.');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        navbar.style.boxShadow = 'none';
    }
});

// Skill animation on scroll
function animateSkills() {
    const skillSpans = document.querySelectorAll('.skills-list span');
    
    skillSpans.forEach((span, index) => {
        span.style.animationDelay = `${index * 0.1}s`;
        span.style.animation = 'fadeInUp 0.6s ease forwards';
    });
}

// Add CSS for skill animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .skills-list span {
        opacity: 0;
        transform: translateY(20px);
    }
`;
document.head.appendChild(style);

// Observe skills section
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillsObserver.observe(skillsSection);
}
