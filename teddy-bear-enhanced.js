class EnhancedTeddyBear {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.teddy = null;
        this.controls = null;
        this.clock = new THREE.Clock();
        
        // Teddy bear parts
        this.body = null;
        this.head = null;
        this.eyes = [];
        this.eyelids = [];
        this.mouth = null;
        this.arms = [];
        this.legs = [];
        this.ears = [];
        this.bowTie = null;
        
        // Animation states
        this.isBlinking = false;
        this.isTalking = false;
        this.isWaving = false;
        this.isIdle = true;
        this.currentExpression = 'neutral';
        
        // Speech recognition
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        
        // Animation variables
        this.blinkTimer = 0;
        this.idleTimer = 0;
        this.mouthAnimationTimer = 0;
        
        this.init();
        this.setupSpeech();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f8ff);
        this.scene.fog = new THREE.Fog(0xf0f8ff, 5, 15);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 2, 5);

        // Renderer setup
        const canvas = document.getElementById('teddyCanvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 10;

        // Lighting
        this.setupLighting();

        // Create teddy bear
        this.createTeddyBear();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
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

        // Warm point light
        const pointLight = new THREE.PointLight(0xffd700, 0.6, 8);
        pointLight.position.set(-3, 3, 3);
        this.scene.add(pointLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.3);
        fillLight.position.set(-5, 2, -5);
        this.scene.add(fillLight);
    }

    createFurMaterial() {
        // Create a more realistic fur material
        const furMaterial = new THREE.MeshLambertMaterial({
            color: 0x8B4513,
            transparent: true,
            opacity: 0.95
        });

        // Add some variation to the fur color
        const furVariation = new THREE.MeshLambertMaterial({
            color: 0xA0522D,
            transparent: true,
            opacity: 0.9
        });

        return { main: furMaterial, variation: furVariation };
    }

    createTeddyBear() {
        // Create teddy bear group
        this.teddy = new THREE.Group();

        const materials = this.createFurMaterial();

        // Body with slight variation
        this.body = new THREE.Mesh(
            new THREE.SphereGeometry(1.2, 32, 32),
            materials.main
        );
        this.body.position.y = 0.5;
        this.body.castShadow = true;
        this.body.receiveShadow = true;
        this.teddy.add(this.body);

        // Head
        this.head = new THREE.Mesh(
            new THREE.SphereGeometry(0.8, 32, 32),
            materials.main
        );
        this.head.position.y = 2;
        this.head.castShadow = true;
        this.teddy.add(this.head);

        // Ears
        const earGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        for (let i = 0; i < 2; i++) {
            const ear = new THREE.Mesh(earGeometry, materials.variation);
            ear.position.set(i === 0 ? -0.4 : 0.4, 2.6, 0.3);
            ear.scale.y = 0.8;
            this.ears.push(ear);
            this.teddy.add(ear);
        }

        // Eyes with more detail
        const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        
        for (let i = 0; i < 2; i++) {
            const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            eye.position.set(i === 0 ? -0.25 : 0.25, 2.1, 0.6);
            this.eyes.push(eye);
            this.teddy.add(eye);

            // Eye highlights
            const highlight = new THREE.Mesh(
                new THREE.SphereGeometry(0.02, 8, 8),
                new THREE.MeshLambertMaterial({ color: 0xffffff })
            );
            highlight.position.set(i === 0 ? -0.23 : 0.27, 2.12, 0.65);
            this.teddy.add(highlight);
        }

        // Eyelids for blinking
        const eyelidMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const eyelidGeometry = new THREE.SphereGeometry(0.09, 16, 16);
        
        for (let i = 0; i < 2; i++) {
            const eyelid = new THREE.Mesh(eyelidGeometry, eyelidMaterial);
            eyelid.position.set(i === 0 ? -0.25 : 0.25, 2.1, 0.6);
            eyelid.scale.y = 0.1;
            eyelid.visible = false;
            this.eyelids.push(eyelid);
            this.teddy.add(eyelid);
        }

        // Nose
        const nose = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 16, 16),
            new THREE.MeshLambertMaterial({ color: 0x000000 })
        );
        nose.position.set(0, 1.9, 0.7);
        this.teddy.add(nose);

        // Mouth with better shape
        this.mouth = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 16, 16),
            new THREE.MeshLambertMaterial({ color: 0x8B4513 })
        );
        this.mouth.position.set(0, 1.7, 0.6);
        this.mouth.scale.y = 0.3;
        this.teddy.add(this.mouth);

        // Arms with joints
        const armGeometry = new THREE.CylinderGeometry(0.2, 0.15, 1.2, 16);
        for (let i = 0; i < 2; i++) {
            const arm = new THREE.Mesh(armGeometry, materials.main);
            arm.position.set(i === 0 ? -1.5 : 1.5, 0.8, 0);
            arm.rotation.z = i === 0 ? -0.3 : 0.3;
            arm.castShadow = true;
            this.arms.push(arm);
            this.teddy.add(arm);

            // Arm joints
            const joint = new THREE.Mesh(
                new THREE.SphereGeometry(0.22, 16, 16),
                materials.variation
            );
            joint.position.set(i === 0 ? -1.5 : 1.5, 0.8, 0);
            this.teddy.add(joint);
        }

        // Legs with feet
        const legGeometry = new THREE.CylinderGeometry(0.25, 0.2, 1, 16);
        for (let i = 0; i < 2; i++) {
            const leg = new THREE.Mesh(legGeometry, materials.main);
            leg.position.set(i === 0 ? -0.4 : 0.4, -0.5, 0);
            leg.castShadow = true;
            this.legs.push(leg);
            this.teddy.add(leg);

            // Feet
            const foot = new THREE.Mesh(
                new THREE.SphereGeometry(0.3, 16, 16),
                materials.variation
            );
            foot.position.set(i === 0 ? -0.4 : 0.4, -1, 0.1);
            foot.scale.y = 0.6;
            foot.castShadow = true;
            this.teddy.add(foot);
        }

        // Enhanced bow tie
        this.createEnhancedBowTie();

        // Add teddy to scene
        this.scene.add(this.teddy);
    }

    createEnhancedBowTie() {
        const bowMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xff6b6b,
            shininess: 100
        });
        
        // Bow center with gem
        const bowCenter = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 0.05),
            bowMaterial
        );
        bowCenter.position.set(0, 1.5, 0.8);
        this.teddy.add(bowCenter);

        // Gem in center
        const gem = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.03),
            new THREE.MeshLambertMaterial({ 
                color: 0xffffff,
                shininess: 200
            })
        );
        gem.position.set(0, 1.5, 0.85);
        this.teddy.add(gem);

        // Bow loops with more detail
        const bowLoopGeometry = new THREE.TorusGeometry(0.15, 0.05, 8, 16);
        for (let i = 0; i < 2; i++) {
            const bowLoop = new THREE.Mesh(bowLoopGeometry, bowMaterial);
            bowLoop.position.set(i === 0 ? -0.15 : 0.15, 1.5, 0.8);
            bowLoop.rotation.y = Math.PI / 2;
            this.teddy.add(bowLoop);
        }

        // Bow tails with texture
        const bowTailGeometry = new THREE.BoxGeometry(0.05, 0.3, 0.02);
        for (let i = 0; i < 2; i++) {
            const bowTail = new THREE.Mesh(bowTailGeometry, bowMaterial);
            bowTail.position.set(i === 0 ? -0.25 : 0.25, 1.35, 0.8);
            this.teddy.add(bowTail);
        }
    }

    updateAnimations(delta) {
        // Update timers
        this.blinkTimer += delta;
        this.idleTimer += delta;
        this.mouthAnimationTimer += delta;

        // Blinking animation
        if (!this.isBlinking && !this.isTalking && this.blinkTimer > 3 + Math.random() * 2) {
            this.blink();
            this.blinkTimer = 0;
        }

        // Idle animations
        if (this.isIdle && this.idleTimer > 5) {
            this.performIdleAnimation();
            this.idleTimer = 0;
        }

        // Mouth animation during speech
        if (this.isTalking && this.mouthAnimationTimer > 0.1) {
            this.animateMouth();
            this.mouthAnimationTimer = 0;
        }
    }

    blink() {
        this.isBlinking = true;
        
        // Hide eyes and show eyelids
        this.eyes.forEach(eye => eye.visible = false);
        this.eyelids.forEach(eyelid => eyelid.visible = true);

        setTimeout(() => {
            // Show eyes and hide eyelids
            this.eyes.forEach(eye => eye.visible = true);
            this.eyelids.forEach(eyelid => eyelid.visible = false);
            this.isBlinking = false;
        }, 150);
    }

    performIdleAnimation() {
        // Gentle head movement
        const headTilt = Math.sin(Date.now() * 0.001) * 0.1;
        this.head.rotation.z = headTilt;

        // Slight ear movement
        this.ears.forEach((ear, index) => {
            ear.rotation.z = Math.sin(Date.now() * 0.002 + index) * 0.05;
        });
    }

    animateMouth() {
        if (this.isTalking) {
            this.mouth.scale.y = 0.3 + Math.random() * 0.4;
            this.mouth.scale.x = 1 + Math.random() * 0.2;
        }
    }

    setExpression(expression) {
        this.currentExpression = expression;
        
        switch (expression) {
            case 'happy':
                this.mouth.scale.y = 0.5;
                this.mouth.scale.x = 1.2;
                this.head.rotation.z = 0.1;
                break;
            case 'sad':
                this.mouth.scale.y = 0.2;
                this.mouth.scale.x = 0.8;
                this.mouth.rotation.z = Math.PI;
                this.head.rotation.z = -0.1;
                break;
            case 'surprised':
                this.mouth.scale.y = 0.8;
                this.mouth.scale.x = 0.6;
                this.head.rotation.z = 0;
                break;
            case 'talking':
                this.mouth.scale.y = 0.4;
                this.mouth.scale.x = 1.1;
                break;
            default: // neutral
                this.mouth.scale.y = 0.3;
                this.mouth.scale.x = 1;
                this.mouth.rotation.z = 0;
                this.head.rotation.z = 0;
                break;
        }
    }

    wave() {
        if (this.isWaving) return;
        
        this.isWaving = true;
        const rightArm = this.arms[1];
        const originalRotation = rightArm.rotation.z;
        
        let waveCount = 0;
        const waveInterval = setInterval(() => {
            rightArm.rotation.z = originalRotation + Math.sin(waveCount * 2) * 0.5;
            waveCount++;
            
            if (waveCount > 6) {
                clearInterval(waveInterval);
                rightArm.rotation.z = originalRotation;
                this.isWaving = false;
            }
        }, 200);
    }

    setupSpeech() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateUI();
                this.setExpression('surprised');
            };

            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                document.getElementById('transcript').textContent = finalTranscript || interimTranscript;

                if (finalTranscript) {
                    this.processSpeech(finalTranscript);
                }
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                this.updateUI();
                this.setExpression('neutral');
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateUI();
                this.setExpression('neutral');
            };
        } else {
            console.error('Speech recognition not supported');
            document.getElementById('statusText').textContent = 'Speech recognition not supported in this browser';
        }
    }

    processSpeech(text) {
        const lowerText = text.toLowerCase();
        let response = '';
        let expression = 'neutral';

        // Enhanced response logic
        if (lowerText.includes('hello') || lowerText.includes('hi')) {
            response = 'Hello there! I\'m so happy to meet you! How are you doing today?';
            expression = 'happy';
        } else if (lowerText.includes('how are you')) {
            response = 'I\'m doing wonderfully! Thank you for asking! I love making new friends!';
            expression = 'happy';
        } else if (lowerText.includes('bye') || lowerText.includes('goodbye')) {
            response = 'Goodbye! Come back and visit me soon! I\'ll miss you!';
            expression = 'sad';
        } else if (lowerText.includes('wave') || lowerText.includes('hello')) {
            response = 'Hello! *waves enthusiastically* Nice to see you!';
            expression = 'happy';
            this.wave();
        } else if (lowerText.includes('joke') || lowerText.includes('funny')) {
            response = 'Why did the teddy bear go to the doctor? Because he had a stuffy nose! *giggles*';
            expression = 'happy';
        } else if (lowerText.includes('name')) {
            response = 'My name is Teddy! I\'m your friendly AI companion! What\'s your name?';
            expression = 'happy';
        } else if (lowerText.includes('weather')) {
            response = 'I can\'t check the weather outside, but I hope it\'s a beautiful day for you!';
            expression = 'happy';
        } else if (lowerText.includes('love') || lowerText.includes('like')) {
            response = 'Aww, that\'s so sweet! I love making friends and having conversations!';
            expression = 'happy';
        } else if (lowerText.includes('sad') || lowerText.includes('unhappy')) {
            response = 'Oh no! I\'m sorry you\'re feeling sad. Would you like a hug? *opens arms*';
            expression = 'sad';
        } else {
            response = 'That\'s really interesting! Tell me more about that! I love learning new things!';
            expression = 'surprised';
        }

        this.speak(response, expression);
    }

    speak(text, expression = 'talking') {
        this.synthesis.cancel();
        this.setExpression(expression);
        this.isTalking = true;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;

        utterance.onstart = () => {
            this.isTalking = true;
        };

        utterance.onend = () => {
            this.isTalking = false;
            this.setExpression('neutral');
        };

        utterance.onerror = () => {
            this.isTalking = false;
            this.setExpression('neutral');
        };

        this.synthesis.speak(utterance);
    }

    setupEventListeners() {
        const startBtn = document.getElementById('startListening');
        const stopBtn = document.getElementById('stopListening');

        startBtn.addEventListener('click', () => {
            if (this.recognition) {
                this.recognition.start();
            }
        });

        stopBtn.addEventListener('click', () => {
            if (this.recognition) {
                this.recognition.stop();
            }
        });

        this.renderer.domElement.addEventListener('click', (event) => {
            this.wave();
        });
    }

    updateUI() {
        const startBtn = document.getElementById('startListening');
        const stopBtn = document.getElementById('stopListening');
        const statusText = document.getElementById('statusText');

        if (this.isListening) {
            startBtn.disabled = true;
            stopBtn.disabled = false;
            statusText.textContent = 'Listening... Speak now!';
            startBtn.classList.add('listening');
        } else {
            startBtn.disabled = false;
            stopBtn.disabled = true;
            statusText.textContent = 'Click "Start Listening" to talk to your teddy bear!';
            startBtn.classList.remove('listening');
        }
    }

    onWindowResize() {
        const canvas = document.getElementById('teddyCanvas');
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();

        // Update animations
        this.updateAnimations(delta);

        // Gentle floating animation
        if (this.teddy) {
            this.teddy.position.y = Math.sin(Date.now() * 0.001) * 0.1;
            this.teddy.rotation.y += 0.003;
        }

        // Update controls
        this.controls.update();

        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the enhanced teddy bear when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedTeddyBear();
});