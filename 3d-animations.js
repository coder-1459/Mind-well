// 3D Animations for MindWell Mental Health Tracker
// Using Three.js for WebGL 3D graphics

class MindWell3DManager {
    constructor() {
        this.scenes = {};
        this.animationId = null;
        
        // Colors matching the website theme
        this.colors = {
            primary: 0x6366f1,
            secondary: 0x10b981,
            accent: 0xf59e0b,
            background: 0xffffff,
            light: 0xe0f2fe
        };
        
        this.init();
    }

    init() {
        this.initializeScenes();
        this.animate();
    }

    initializeScenes() {
        // Hero Section Scene
        if (document.getElementById('hero-3d-canvas')) {
            this.scenes.hero = new HeroScene('hero-3d-canvas', this.colors);
        }
        
        // Features Section Scene
        if (document.getElementById('features-3d-canvas')) {
            this.scenes.features = new FeaturesScene('features-3d-canvas', this.colors);
        }
        
        // Wisdom Section Scene
        if (document.getElementById('wisdom-3d-canvas')) {
            this.scenes.wisdom = new WisdomScene('wisdom-3d-canvas', this.colors);
        }
        
        // Stats Section Scene
        if (document.getElementById('stats-3d-canvas')) {
            this.scenes.stats = new StatsScene('stats-3d-canvas', this.colors);
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Animate all active scenes
        Object.values(this.scenes).forEach(scene => {
            if (scene && scene.animate) {
                scene.animate();
            }
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        Object.values(this.scenes).forEach(scene => {
            if (scene && scene.destroy) {
                scene.destroy();
            }
        });
    }
}

// Base 3D Scene Class
class Base3DScene {
    constructor(canvasId, colors) {
        this.canvasId = canvasId;
        this.colors = colors;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.objects = [];
        
        this.setupScene();
        this.handleResize();
    }

    setupScene() {
        const canvas = document.getElementById(this.canvasId);
        if (!canvas) return;

        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        
        this.setupLighting();
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }

    handleResize() {
        window.addEventListener('resize', () => {
            const canvas = document.getElementById(this.canvasId);
            if (!canvas) return;

            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }

    animate() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    destroy() {
        this.scene?.clear();
        this.renderer?.dispose();
    }
}

// Hero Section Scene
class HeroScene extends Base3DScene {

    init() {
        this.setupScene();
        this.createBrain();
        this.createParticleSystem();
        this.createFloatingShapes();
        this.setupLighting();
        this.handleResize();
        this.animate();
    }

    setupScene() {
        const canvas = document.getElementById('hero-3d-canvas');
        if (!canvas) return;

        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0); // Transparent background
    }

    createBrain() {
        // Create a stylized brain using wireframe geometry
        const brainGroup = new THREE.Group();
        
        // Main brain sphere
        const brainGeometry = new THREE.SphereGeometry(1.2, 32, 32);
        const brainMaterial = new THREE.MeshPhongMaterial({
            color: this.colors.primary,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        const brainMesh = new THREE.Mesh(brainGeometry, brainMaterial);
        brainGroup.add(brainMesh);

        // Brain hemispheres detail
        const leftHemisphere = new THREE.SphereGeometry(0.8, 16, 16, 0, Math.PI);
        const rightHemisphere = new THREE.SphereGeometry(0.8, 16, 16, Math.PI, Math.PI);
        
        const hemisphereMaterial = new THREE.MeshPhongMaterial({
            color: this.colors.secondary,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        
        const leftMesh = new THREE.Mesh(leftHemisphere, hemisphereMaterial);
        const rightMesh = new THREE.Mesh(rightHemisphere, hemisphereMaterial);
        
        leftMesh.position.x = -0.2;
        rightMesh.position.x = 0.2;
        
        brainGroup.add(leftMesh);
        brainGroup.add(rightMesh);

        // Neural connections (lines)
        this.createNeuralConnections(brainGroup);
        
        brainGroup.position.x = 2;
        brainGroup.position.y = 0;
        
        this.brain = brainGroup;
        this.scene.add(brainGroup);
    }

    createNeuralConnections(brainGroup) {
        const connectionMaterial = new THREE.LineBasicMaterial({
            color: this.colors.accent,
            transparent: true,
            opacity: 0.6
        });

        // Create random neural pathways
        for (let i = 0; i < 20; i++) {
            const points = [];
            const startPoint = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            );
            const endPoint = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            );
            
            points.push(startPoint);
            points.push(endPoint);
            
            const connectionGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const connectionLine = new THREE.Line(connectionGeometry, connectionMaterial);
            
            brainGroup.add(connectionLine);
        }
    }

    createParticleSystem() {
        // Create floating particles representing thoughts/wellness
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            // Position
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

            // Color (mix of theme colors)
            const colorChoice = Math.random();
            if (colorChoice < 0.33) {
                colors[i * 3] = 0.39; // Primary color R
                colors[i * 3 + 1] = 0.4; // Primary color G
                colors[i * 3 + 2] = 0.95; // Primary color B
            } else if (colorChoice < 0.66) {
                colors[i * 3] = 0.06; // Secondary color R
                colors[i * 3 + 1] = 0.72; // Secondary color G
                colors[i * 3 + 2] = 0.51; // Secondary color B
            } else {
                colors[i * 3] = 0.96; // Accent color R
                colors[i * 3 + 1] = 0.62; // Accent color G
                colors[i * 3 + 2] = 0.04; // Accent color B
            }

            // Size
            sizes[i] = Math.random() * 3 + 1;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
    }

    createFloatingShapes() {
        // Create calming geometric shapes
        const shapes = [
            new THREE.BoxGeometry(0.3, 0.3, 0.3),
            new THREE.SphereGeometry(0.2, 8, 8),
            new THREE.ConeGeometry(0.15, 0.4, 8),
            new THREE.OctahedronGeometry(0.25)
        ];

        const materials = [
            new THREE.MeshPhongMaterial({ 
                color: this.colors.primary, 
                transparent: true, 
                opacity: 0.7 
            }),
            new THREE.MeshPhongMaterial({ 
                color: this.colors.secondary, 
                transparent: true, 
                opacity: 0.7 
            }),
            new THREE.MeshPhongMaterial({ 
                color: this.colors.accent, 
                transparent: true, 
                opacity: 0.7 
            })
        ];

        for (let i = 0; i < 15; i++) {
            const geometry = shapes[Math.floor(Math.random() * shapes.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.x = (Math.random() - 0.5) * 15;
            mesh.position.y = (Math.random() - 0.5) * 8;
            mesh.position.z = (Math.random() - 0.5) * 8;

            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;

            // Add custom properties for animation
            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.01 + 0.005,
                floatAmount: Math.random() * 0.5 + 0.2
            };

            this.floatingShapes.push(mesh);
            this.scene.add(mesh);
        }
    }

    setupLighting() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Directional light for depth
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        // Point light for dynamic lighting
        const pointLight = new THREE.PointLight(this.colors.primary, 1, 10);
        pointLight.position.set(0, 0, 3);
        this.scene.add(pointLight);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // Animate brain
        if (this.brain) {
            this.brain.rotation.y = time * 0.2;
            this.brain.rotation.x = Math.sin(time * 0.3) * 0.1;
            
            // Pulsing effect
            const scale = 1 + Math.sin(time * 2) * 0.1;
            this.brain.scale.set(scale, scale, scale);
        }

        // Animate particles
        if (this.particles) {
            this.particles.rotation.y = time * 0.05;
            
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(time + positions[i]) * 0.001;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }

        // Animate floating shapes
        this.floatingShapes.forEach((shape, index) => {
            const userData = shape.userData;
            
            // Rotation
            shape.rotation.x += userData.rotationSpeed.x;
            shape.rotation.y += userData.rotationSpeed.y;
            shape.rotation.z += userData.rotationSpeed.z;
            
            // Floating motion
            shape.position.y += Math.sin(time * userData.floatSpeed + index) * 0.005;
        });

        // Camera gentle movement
        this.camera.position.x = Math.sin(time * 0.1) * 0.5;
        this.camera.position.y = Math.cos(time * 0.15) * 0.3;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        window.addEventListener('resize', () => {
            const canvas = document.getElementById('hero-3d-canvas');
            if (!canvas) return;

            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Clean up Three.js objects
        this.scene?.clear();
        this.renderer?.dispose();
    }
}

// Enhanced CSS 3D animations for cards and elements
class Enhanced3DEffects {
    constructor() {
        this.init();
    }

    init() {
        this.enhanceFeatureCards();
        this.addInteractiveElements();
        this.setupScrollAnimations();
    }

    enhanceFeatureCards() {
        const featureCards = document.querySelectorAll('.feature-card');
        
        featureCards.forEach((card, index) => {
            // Add subtle initial rotation
            card.style.transform = `rotateY(${index % 2 === 0 ? '-2deg' : '2deg'}) rotateX(1deg)`;
            
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                card.style.transform = 'translateY(-15px) rotateY(8deg) rotateX(-5deg) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `rotateY(${index % 2 === 0 ? '-2deg' : '2deg'}) rotateX(1deg)`;
            });

            // Add mouse tracking effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * 10;
                const rotateY = (x - centerX) / centerX * 10;
                
                card.style.transform = `translateY(-15px) rotateY(${rotateY}deg) rotateX(${-rotateX}deg) scale(1.02)`;
            });
        });
    }

    addInteractiveElements() {
        // Add glowing orb cursor effect for mental health theme
        const cursor = document.createElement('div');
        cursor.className = 'mindwell-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            opacity: 0;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
            cursor.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.8s ease forwards';
                }
            });
        }, observerOptions);

        // Observe various elements
        document.querySelectorAll('.stat-card, .tip-card, .stat-box').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            observer.observe(el);
        });

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInUp {
                to {
                    opacity: 1;
                    transform: translateY(0) rotateX(0);
                }
            }
            
            .mindwell-cursor {
                box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize 3D on pages with the hero canvas
    if (document.getElementById('hero-3d-canvas')) {
        new MindWell3D();
    }
    
    // Initialize enhanced effects on all pages
    new Enhanced3DEffects();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.mindWell3D) {
        window.mindWell3D.destroy();
    }
});
