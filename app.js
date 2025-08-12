class TeddyBearApp {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.teddyBear = null;
        this.speechManager = null;
        this.controls = null;
        this.clock = new THREE.Clock();
        
        // Performance monitoring
        this.frameCount = 0;
        this.lastFPSUpdate = 0;
        this.fps = 0;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLighting();
        this.setupEnvironment();
        this.createTeddyBear();
        this.setupSpeechManager();
        this.setupControls();
        this.setupPerformanceOptimizations();
        
        // Start the conversation
        setTimeout(() => {
            this.speechManager.startConversation();
        }, 2000);
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue background
        
        // Add fog for depth
        this.scene.fog = new THREE.Fog(0x87CEEB, 10, 50);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75, // FOV
            window.innerWidth / window.innerHeight, // Aspect ratio
            0.1, // Near plane
            1000 // Far plane
        );
        
        this.camera.position.set(0, 2, 8);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        // Append to canvas container
        const canvasContainer = document.getElementById('canvas-container');
        canvasContainer.appendChild(this.renderer.domElement);
    }

    setupLighting() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Main directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);

        // Soft fill light
        const fillLight = new THREE.DirectionalLight(0xffd0a6, 0.3);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);

        // Warm rim light
        const rimLight = new THREE.DirectionalLight(0xffaa88, 0.2);
        rimLight.position.set(0, 5, -10);
        this.scene.add(rimLight);
    }

    setupEnvironment() {
        // Create a simple ground plane
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x90EE90,
            transparent: true,
            opacity: 0.8
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -3;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Add some floating particles for ambiance
        this.createParticles();
        
        // Add background elements
        this.createBackgroundElements();
    }

    createParticles() {
        const particleCount = 50;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 30;     // x
            positions[i + 1] = Math.random() * 20 + 5;     // y
            positions[i + 2] = (Math.random() - 0.5) * 30; // z
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(particles, particleMaterial);
        this.scene.add(this.particles);
    }

    createBackgroundElements() {
        // Add some clouds
        for (let i = 0; i < 5; i++) {
            const cloudGeometry = new THREE.SphereGeometry(2, 8, 8);
            const cloudMaterial = new THREE.MeshLambertMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.7
            });
            
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloud.position.set(
                (Math.random() - 0.5) * 40,
                Math.random() * 10 + 15,
                (Math.random() - 0.5) * 40
            );
            cloud.scale.set(
                1 + Math.random(),
                0.5 + Math.random() * 0.5,
                1 + Math.random()
            );
            this.scene.add(cloud);
        }
    }

    createTeddyBear() {
        this.teddyBear = new TeddyBear(this.scene);
        
        // Enable shadows for teddy bear
        this.teddyBear.group.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }

    setupSpeechManager() {
        this.speechManager = new SpeechManager(this.teddyBear);
        
        // Set up status update callback
        this.speechManager.onStatusUpdate = (message) => {
            this.updateStatusDisplay(message);
        };
    }

    setupControls() {
        // Simple mouse interaction for camera
        this.mouse = new THREE.Vector2();
        this.targetCameraPosition = new THREE.Vector3().copy(this.camera.position);
        
        // Auto-rotation
        this.autoRotate = true;
        this.rotationSpeed = 0.5;
    }

    setupPerformanceOptimizations() {
        // Level of detail (LOD) - reduce quality when far away
        this.setupLOD();
        
        // Frustum culling is automatic in Three.js
        // Object pooling for particles if needed
        
        // Adaptive quality based on performance
        this.targetFPS = 60;
        this.qualityLevel = 1.0; // 1.0 = full quality, 0.5 = half quality
    }

    setupLOD() {
        // For future optimization if needed
        // Could implement different quality models based on distance
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // Mouse movement for camera interaction
        document.addEventListener('mousemove', (event) => this.onMouseMove(event), false);
        
        // UI event listeners
        this.setupUIEventListeners();
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
    }

    setupUIEventListeners() {
        // Speech control buttons
        document.getElementById('startListening').addEventListener('click', () => {
            if (this.speechManager.startListening()) {
                document.getElementById('startListening').classList.add('active');
                document.getElementById('startListening').classList.add('listening');
            }
        });

        document.getElementById('stopListening').addEventListener('click', () => {
            this.speechManager.stopListening();
            document.getElementById('startListening').classList.remove('active');
            document.getElementById('startListening').classList.remove('listening');
        });

        // Text-to-speech
        document.getElementById('speak').addEventListener('click', () => {
            const text = document.getElementById('speech-input').value.trim();
            if (text) {
                this.speechManager.speak(text);
                document.getElementById('speech-input').value = '';
            }
        });

        // Enter key for speech input
        document.getElementById('speech-input').addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const text = event.target.value.trim();
                if (text) {
                    this.speechManager.speak(text);
                    event.target.value = '';
                }
            }
        });

        // Animation control buttons
        document.getElementById('wave').addEventListener('click', () => {
            this.teddyBear.wave();
        });

        document.getElementById('dance').addEventListener('click', () => {
            this.teddyBear.dance();
        });

        document.getElementById('blink').addEventListener('click', () => {
            this.teddyBear.blink();
        });

        // Check browser support and show warnings
        this.checkBrowserSupport();
    }

    setupPerformanceMonitoring() {
        // Monitor FPS and adjust quality if needed
        setInterval(() => {
            this.monitorPerformance();
        }, 1000);
    }

    checkBrowserSupport() {
        const support = SpeechManager.checkSupport();
        
        if (!support.recognition) {
            this.updateStatusDisplay('⚠️ Speech recognition not supported in this browser. Try Chrome or Edge.');
        }
        
        if (!support.synthesis) {
            this.updateStatusDisplay('⚠️ Speech synthesis not supported in this browser.');
        }
        
        if (support.recognition && support.synthesis) {
            this.updateStatusDisplay('✅ All features supported! Ready to chat!');
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event) {
        // Normalize mouse coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Make teddy bear look towards mouse
        const mouseWorldPosition = new THREE.Vector3(
            this.mouse.x * 5,
            this.mouse.y * 3 + 2,
            3
        );
        
        // Smooth look-at
        if (this.teddyBear) {
            this.teddyBear.lookAt(mouseWorldPosition);
        }
        
        // Subtle camera movement
        this.targetCameraPosition.x = this.mouse.x * 2;
        this.targetCameraPosition.y = 2 + this.mouse.y * 1;
    }

    updateStatusDisplay(message) {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    monitorPerformance() {
        this.fps = this.frameCount;
        this.frameCount = 0;
        
        // Adjust quality based on performance
        if (this.fps < this.targetFPS * 0.8) {
            this.qualityLevel = Math.max(0.5, this.qualityLevel - 0.1);
            this.adjustQuality();
        } else if (this.fps > this.targetFPS * 0.95) {
            this.qualityLevel = Math.min(1.0, this.qualityLevel + 0.05);
            this.adjustQuality();
        }
    }

    adjustQuality() {
        // Adjust renderer pixel ratio based on performance
        const pixelRatio = Math.min(window.devicePixelRatio * this.qualityLevel, 2);
        this.renderer.setPixelRatio(pixelRatio);
        
        // Could also adjust shadow quality, particle count, etc.
        if (this.qualityLevel < 0.8) {
            this.renderer.shadowMap.enabled = false;
        } else {
            this.renderer.shadowMap.enabled = true;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        this.frameCount++;
        
        // Update teddy bear
        if (this.teddyBear) {
            this.teddyBear.update(deltaTime);
        }
        
        // Smooth camera movement
        this.camera.position.lerp(this.targetCameraPosition, 0.02);
        
        // Auto-rotate scene if enabled
        if (this.autoRotate && this.teddyBear) {
            this.teddyBear.group.rotation.y += deltaTime * this.rotationSpeed * 0.1;
        }
        
        // Animate particles
        if (this.particles) {
            this.particles.rotation.y += deltaTime * 0.1;
            
            // Gently move particles up and down
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.01;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }
        
        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }

    // Public methods for external control
    enableAutoRotation(enable = true) {
        this.autoRotate = enable;
    }

    setRotationSpeed(speed) {
        this.rotationSpeed = speed;
    }

    resetCamera() {
        this.targetCameraPosition.set(0, 2, 8);
        this.camera.lookAt(0, 0, 0);
    }

    // Cleanup method
    dispose() {
        if (this.speechManager) {
            this.speechManager.stopAllSpeech();
        }
        
        // Clean up Three.js resources
        this.scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        this.renderer.dispose();
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧸 Initializing AI Teddy Bear...');
    
    // Create the app
    const app = new TeddyBearApp();
    
    // Make it globally accessible for debugging
    window.teddyBearApp = app;
    
    console.log('✅ AI Teddy Bear is ready!');
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.teddyBearApp) {
        window.teddyBearApp.dispose();
    }
});