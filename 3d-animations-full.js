// Complete 3D Animations for MindWell Mental Health Tracker
// Using Three.js for WebGL 3D graphics across all sections

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

// Hero Section Scene - Brain and Neural Networks
class HeroScene extends Base3DScene {
    constructor(canvasId, colors) {
        super(canvasId, colors);
        this.brain = null;
        this.particles = null;
        this.floatingShapes = [];
        this.createContent();
    }

    createContent() {
        this.createBrain();
        this.createParticleSystem();
        this.createFloatingShapes();
    }

    createBrain() {
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

        // Brain hemispheres
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

        // Neural connections
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
        const particleCount = 150;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

            const colorChoice = Math.random();
            if (colorChoice < 0.33) {
                colors[i * 3] = 0.39; colors[i * 3 + 1] = 0.4; colors[i * 3 + 2] = 0.95;
            } else if (colorChoice < 0.66) {
                colors[i * 3] = 0.06; colors[i * 3 + 1] = 0.72; colors[i * 3 + 2] = 0.51;
            } else {
                colors[i * 3] = 0.96; colors[i * 3 + 1] = 0.62; colors[i * 3 + 2] = 0.04;
            }
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

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
        const shapes = [
            new THREE.BoxGeometry(0.3, 0.3, 0.3),
            new THREE.SphereGeometry(0.2, 8, 8),
            new THREE.ConeGeometry(0.15, 0.4, 8)
        ];

        const materials = [
            new THREE.MeshPhongMaterial({ color: this.colors.primary, transparent: true, opacity: 0.7 }),
            new THREE.MeshPhongMaterial({ color: this.colors.secondary, transparent: true, opacity: 0.7 }),
            new THREE.MeshPhongMaterial({ color: this.colors.accent, transparent: true, opacity: 0.7 })
        ];

        for (let i = 0; i < 15; i++) {
            const geometry = shapes[Math.floor(Math.random() * shapes.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.x = (Math.random() - 0.5) * 15;
            mesh.position.y = (Math.random() - 0.5) * 8;
            mesh.position.z = (Math.random() - 0.5) * 8;

            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.01 + 0.005
            };

            this.floatingShapes.push(mesh);
            this.scene.add(mesh);
        }
    }

    animate() {
        const time = Date.now() * 0.001;

        // Animate brain
        if (this.brain) {
            this.brain.rotation.y = time * 0.2;
            this.brain.rotation.x = Math.sin(time * 0.3) * 0.1;
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
            shape.rotation.x += userData.rotationSpeed.x;
            shape.rotation.y += userData.rotationSpeed.y;
            shape.rotation.z += userData.rotationSpeed.z;
            shape.position.y += Math.sin(time * userData.floatSpeed + index) * 0.005;
        });

        this.camera.position.x = Math.sin(time * 0.1) * 0.5;
        this.camera.position.y = Math.cos(time * 0.15) * 0.3;
        this.camera.lookAt(0, 0, 0);

        super.animate();
    }
}

// Features Section Scene - Molecular Structures
class FeaturesScene extends Base3DScene {
    constructor(canvasId, colors) {
        super(canvasId, colors);
        this.molecules = [];
        this.createContent();
    }

    createContent() {
        this.createMolecularStructures();
        this.createOrbitingElements();
    }

    createMolecularStructures() {
        // Create DNA-like helical structures representing growth and healing
        for (let i = 0; i < 3; i++) {
            const helixGroup = new THREE.Group();
            
            // Create helix points
            const helixGeometry = new THREE.BufferGeometry();
            const helixPoints = [];
            const helixColors = [];
            
            for (let j = 0; j < 100; j++) {
                const angle = (j / 100) * Math.PI * 4;
                const x = Math.cos(angle) * 0.5;
                const y = (j / 100) * 4 - 2;
                const z = Math.sin(angle) * 0.5;
                
                helixPoints.push(x, y, z);
                
                // Alternate colors along helix
                if (j % 2 === 0) {
                    helixColors.push(0.39, 0.4, 0.95); // Primary
                } else {
                    helixColors.push(0.06, 0.72, 0.51); // Secondary
                }
            }
            
            helixGeometry.setAttribute('position', new THREE.Float32BufferAttribute(helixPoints, 3));
            helixGeometry.setAttribute('color', new THREE.Float32BufferAttribute(helixColors, 3));
            
            const helixMaterial = new THREE.PointsMaterial({
                size: 0.1,
                vertexColors: true,
                transparent: true,
                opacity: 0.8
            });
            
            const helix = new THREE.Points(helixGeometry, helixMaterial);
            helix.position.x = (i - 1) * 4;
            helix.position.z = -2;
            
            helix.userData = {
                rotationSpeed: 0.01 + i * 0.005,
                originalX: helix.position.x
            };
            
            helixGroup.add(helix);
            this.molecules.push(helix);
            this.scene.add(helix);
        }
    }

    createOrbitingElements() {
        // Create orbiting wellness symbols
        const orbitRadius = 3;
        const orbitCount = 6;
        
        for (let i = 0; i < orbitCount; i++) {
            const angle = (i / orbitCount) * Math.PI * 2;
            
            // Create heart-shaped geometry for wellness
            const heartShape = new THREE.Shape();
            heartShape.moveTo(0, 0);
            heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
            heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0, 1);
            heartShape.bezierCurveTo(0, 0.6, 0.6, 0.3, 0.6, 0);
            heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);
            
            const heartGeometry = new THREE.ExtrudeGeometry(heartShape, {
                depth: 0.1,
                bevelEnabled: false
            });
            
            const heartMaterial = new THREE.MeshPhongMaterial({
                color: this.colors.accent,
                transparent: true,
                opacity: 0.6
            });
            
            const heart = new THREE.Mesh(heartGeometry, heartMaterial);
            heart.scale.set(0.3, 0.3, 0.3);
            
            heart.position.x = Math.cos(angle) * orbitRadius;
            heart.position.z = Math.sin(angle) * orbitRadius;
            heart.position.y = Math.sin(angle * 2) * 0.5;
            
            heart.userData = {
                orbitAngle: angle,
                orbitRadius: orbitRadius,
                orbitSpeed: 0.02
            };
            
            this.molecules.push(heart);
            this.scene.add(heart);
        }
    }

    animate() {
        const time = Date.now() * 0.001;
        
        this.molecules.forEach((molecule, index) => {
            if (molecule.userData.rotationSpeed !== undefined) {
                // Helix rotation
                molecule.rotation.y += molecule.userData.rotationSpeed;
                molecule.position.y = Math.sin(time + index) * 0.5;
            } else if (molecule.userData.orbitAngle !== undefined) {
                // Orbiting hearts
                const userData = molecule.userData;
                userData.orbitAngle += userData.orbitSpeed;
                
                molecule.position.x = Math.cos(userData.orbitAngle) * userData.orbitRadius;
                molecule.position.z = Math.sin(userData.orbitAngle) * userData.orbitRadius;
                molecule.position.y = Math.sin(userData.orbitAngle * 2) * 0.5;
                
                molecule.rotation.z = userData.orbitAngle;
            }
        });
        
        super.animate();
    }
}

// Wisdom Section Scene - Zen Garden with Floating Wisdom
class WisdomScene extends Base3DScene {
    constructor(canvasId, colors) {
        super(canvasId, colors);
        this.wisdomElements = [];
        this.createContent();
    }

    createContent() {
        this.createZenGarden();
        this.createFloatingWisdom();
    }

    createZenGarden() {
        // Create concentric rings representing peace and mindfulness
        for (let ring = 0; ring < 5; ring++) {
            const ringGeometry = new THREE.RingGeometry(ring * 0.5 + 0.5, ring * 0.5 + 0.6, 32);
            const ringMaterial = new THREE.MeshPhongMaterial({
                color: ring % 2 === 0 ? this.colors.primary : this.colors.secondary,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            
            const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
            ringMesh.rotation.x = -Math.PI / 2;
            ringMesh.position.y = -1;
            
            ringMesh.userData = {
                rotationSpeed: (ring + 1) * 0.005,
                originalOpacity: 0.3
            };
            
            this.wisdomElements.push(ringMesh);
            this.scene.add(ringMesh);
        }
    }

    createFloatingWisdom() {
        // Create floating lotus-like shapes
        const lotusCount = 8;
        
        for (let i = 0; i < lotusCount; i++) {
            const petals = [];
            const petalCount = 6;
            
            for (let j = 0; j < petalCount; j++) {
                const petalGeometry = new THREE.SphereGeometry(0.2, 8, 8, 0, Math.PI);
                const petalMaterial = new THREE.MeshPhongMaterial({
                    color: this.colors.light,
                    transparent: true,
                    opacity: 0.7
                });
                
                const petal = new THREE.Mesh(petalGeometry, petalMaterial);
                const angle = (j / petalCount) * Math.PI * 2;
                petal.position.x = Math.cos(angle) * 0.3;
                petal.position.z = Math.sin(angle) * 0.3;
                petal.rotation.y = angle;
                
                petals.push(petal);
            }
            
            const lotusGroup = new THREE.Group();
            petals.forEach(petal => lotusGroup.add(petal));
            
            lotusGroup.position.x = (Math.random() - 0.5) * 8;
            lotusGroup.position.y = Math.random() * 3 + 1;
            lotusGroup.position.z = (Math.random() - 0.5) * 8;
            
            lotusGroup.userData = {
                floatSpeed: Math.random() * 0.02 + 0.01,
                floatAmount: Math.random() * 0.5 + 0.3,
                rotationSpeed: Math.random() * 0.01 + 0.005
            };
            
            this.wisdomElements.push(lotusGroup);
            this.scene.add(lotusGroup);
        }
    }

    animate() {
        const time = Date.now() * 0.001;
        
        this.wisdomElements.forEach((element, index) => {
            const userData = element.userData;
            
            if (userData.rotationSpeed !== undefined) {
                element.rotation.y += userData.rotationSpeed;
            }
            
            if (userData.floatSpeed !== undefined) {
                element.position.y += Math.sin(time * userData.floatSpeed + index) * 0.005;
                element.rotation.z = Math.sin(time * userData.floatSpeed + index) * 0.1;
            }
            
            if (userData.originalOpacity !== undefined) {
                element.material.opacity = userData.originalOpacity + Math.sin(time + index) * 0.1;
            }
        });
        
        super.animate();
    }
}

// Stats Section Scene - Data Visualization
class StatsScene extends Base3DScene {
    constructor(canvasId, colors) {
        super(canvasId, colors);
        this.dataElements = [];
        this.createContent();
    }

    createContent() {
        this.createDataVisualization();
        this.createProgressBars();
    }

    createDataVisualization() {
        // Create 3D bar charts representing progress
        const barCount = 12;
        
        for (let i = 0; i < barCount; i++) {
            const height = Math.random() * 2 + 0.5;
            const barGeometry = new THREE.BoxGeometry(0.2, height, 0.2);
            const barMaterial = new THREE.MeshPhongMaterial({
                color: i % 3 === 0 ? this.colors.primary : 
                      i % 3 === 1 ? this.colors.secondary : this.colors.accent,
                transparent: true,
                opacity: 0.8
            });
            
            const bar = new THREE.Mesh(barGeometry, barMaterial);
            
            const angle = (i / barCount) * Math.PI * 2;
            bar.position.x = Math.cos(angle) * 2;
            bar.position.z = Math.sin(angle) * 2;
            bar.position.y = height / 2 - 1;
            
            bar.userData = {
                originalHeight: height,
                growthSpeed: Math.random() * 0.02 + 0.01,
                angle: angle
            };
            
            this.dataElements.push(bar);
            this.scene.add(bar);
        }
    }

    createProgressBars() {
        // Create floating progress indicators
        for (let i = 0; i < 4; i++) {
            const progressGroup = new THREE.Group();
            
            // Background bar
            const bgGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.1);
            const bgMaterial = new THREE.MeshPhongMaterial({
                color: 0x333333,
                transparent: true,
                opacity: 0.3
            });
            const bgBar = new THREE.Mesh(bgGeometry, bgMaterial);
            progressGroup.add(bgBar);
            
            // Progress bar
            const progress = Math.random() * 0.8 + 0.2;
            const progressGeometry = new THREE.BoxGeometry(1.5 * progress, 0.12, 0.12);
            const progressMaterial = new THREE.MeshPhongMaterial({
                color: this.colors.secondary,
                transparent: true,
                opacity: 0.9
            });
            const progressBar = new THREE.Mesh(progressGeometry, progressMaterial);
            progressBar.position.x = -1.5 * (1 - progress) / 2;
            progressGroup.add(progressBar);
            
            progressGroup.position.x = (i - 1.5) * 2;
            progressGroup.position.y = 2;
            progressGroup.position.z = -1;
            
            progressGroup.userData = {
                floatSpeed: Math.random() * 0.015 + 0.005,
                progress: progress
            };
            
            this.dataElements.push(progressGroup);
            this.scene.add(progressGroup);
        }
    }

    animate() {
        const time = Date.now() * 0.001;
        
        this.dataElements.forEach((element, index) => {
            const userData = element.userData;
            
            if (userData.originalHeight !== undefined) {
                // Animate bars
                const newHeight = userData.originalHeight + Math.sin(time * userData.growthSpeed + index) * 0.3;
                element.scale.y = Math.max(0.1, newHeight / userData.originalHeight);
                element.rotation.y += 0.01;
            } else if (userData.floatSpeed !== undefined) {
                // Animate progress bars
                element.position.y += Math.sin(time * userData.floatSpeed + index) * 0.01;
                element.rotation.z = Math.sin(time * userData.floatSpeed + index) * 0.05;
            }
        });
        
        super.animate();
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
            card.style.transform = `rotateY(${index % 2 === 0 ? '-2deg' : '2deg'}) rotateX(1deg)`;
            
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                card.style.transform = 'translateY(-15px) rotateY(8deg) rotateX(-5deg) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `rotateY(${index % 2 === 0 ? '-2deg' : '2deg'}) rotateX(1deg)`;
            });

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

        document.querySelectorAll('.stat-card, .tip-card, .stat-box, .feature-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            observer.observe(el);
        });

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
            
            /* Additional 3D enhancements */
            .tip-card:hover {
                transform: translateY(-12px) rotateZ(3deg) scale(1.05) !important;
            }
            
            .stat-box:hover {
                transform: translateY(-15px) scale(1.08) rotateX(8deg) !important;
                box-shadow: 0 25px 50px rgba(99, 102, 241, 0.2) !important;
            }
            
            .hero-stats .stat-card:hover {
                transform: translateY(-20px) rotateX(10deg) rotateY(5deg) scale(1.05) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D scenes
    window.mindWell3DManager = new MindWell3DManager();
    
    // Initialize enhanced effects
    new Enhanced3DEffects();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.mindWell3DManager) {
        window.mindWell3DManager.destroy();
    }
});
