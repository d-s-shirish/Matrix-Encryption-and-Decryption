class TeddyBear {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.teddy = null;
        this.controls = null;
        this.animationMixer = null;
        this.clock = new THREE.Clock();
        
        // Teddy bear parts
        this.body = null;
        this.head = null;
        this.eyes = [];
        this.mouth = null;
        this.arms = [];
        this.legs = [];
        this.bowTie = null;
        
        // Animation states
        this.isBlinking = false;
        this.isTalking = false;
        this.isWaving = false;
        this.currentExpression = 'neutral';
        
        // Speech recognition
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        
        this.init();
        this.setupSpeech();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f8ff);

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
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point light for warm glow
        const pointLight = new THREE.PointLight(0xffd700, 0.5, 10);
        pointLight.position.set(-3, 3, 3);
        this.scene.add(pointLight);
    }

    createTeddyBear() {
        // Create teddy bear group
        this.teddy = new THREE.Group();

        // Create fur material with soft texture
        const furMaterial = new THREE.MeshLambertMaterial({
            color: 0x8B4513,
            transparent: true,
            opacity: 0.9
        });

        // Body
        this.body = new THREE.Mesh(
            new THREE.SphereGeometry(1.2, 32, 32),
            furMaterial
        );
        this.body.position.y = 0.5;
        this.body.castShadow = true;
        this.body.receiveShadow = true;
        this.teddy.add(this.body);

        // Head
        this.head = new THREE.Mesh(
            new THREE.SphereGeometry(0.8, 32, 32),
            furMaterial
        );
        this.head.position.y = 2;
        this.head.castShadow = true;
        this.teddy.add(this.head);

        // Eyes
        const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        
        for (let i = 0; i < 2; i++) {
            const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            eye.position.set(i === 0 ? -0.25 : 0.25, 2.1, 0.6);
            this.eyes.push(eye);
            this.teddy.add(eye);
        }

        // Eyelids for blinking
        const eyelidMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const eyelidGeometry = new THREE.SphereGeometry(0.09, 16, 16);
        
        for (let i = 0; i < 2; i++) {
            const eyelid = new THREE.Mesh(eyelidGeometry, eyelidMaterial);
            eyelid.position.set(i === 0 ? -0.25 : 0.25, 2.1, 0.6);
            eyelid.scale.y = 0.1;
            eyelid.visible = false;
            this.teddy.add(eyelid);
        }

        // Nose
        const nose = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 16, 16),
            new THREE.MeshLambertMaterial({ color: 0x000000 })
        );
        nose.position.set(0, 1.9, 0.7);
        this.teddy.add(nose);

        // Mouth
        this.mouth = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 16, 16),
            new THREE.MeshLambertMaterial({ color: 0x8B4513 })
        );
        this.mouth.position.set(0, 1.7, 0.6);
        this.mouth.scale.y = 0.3;
        this.teddy.add(this.mouth);

        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.2, 0.15, 1.2, 16);
        for (let i = 0; i < 2; i++) {
            const arm = new THREE.Mesh(armGeometry, furMaterial);
            arm.position.set(i === 0 ? -1.5 : 1.5, 0.8, 0);
            arm.rotation.z = i === 0 ? -0.3 : 0.3;
            arm.castShadow = true;
            this.arms.push(arm);
            this.teddy.add(arm);
        }

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.25, 0.2, 1, 16);
        for (let i = 0; i < 2; i++) {
            const leg = new THREE.Mesh(legGeometry, furMaterial);
            leg.position.set(i === 0 ? -0.4 : 0.4, -0.5, 0);
            leg.castShadow = true;
            this.legs.push(leg);
            this.teddy.add(leg);
        }

        // Bow tie
        this.createBowTie();

        // Add teddy to scene
        this.scene.add(this.teddy);

        // Start blinking animation
        this.startBlinking();
    }

    createBowTie() {
        const bowMaterial = new THREE.MeshLambertMaterial({ color: 0xff6b6b });
        
        // Bow center
        const bowCenter = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 0.05),
            bowMaterial
        );
        bowCenter.position.set(0, 1.5, 0.8);
        this.teddy.add(bowCenter);

        // Bow loops
        const bowLoopGeometry = new THREE.TorusGeometry(0.15, 0.05, 8, 16);
        for (let i = 0; i < 2; i++) {
            const bowLoop = new THREE.Mesh(bowLoopGeometry, bowMaterial);
            bowLoop.position.set(i === 0 ? -0.15 : 0.15, 1.5, 0.8);
            bowLoop.rotation.y = Math.PI / 2;
            this.teddy.add(bowLoop);
        }

        // Bow tails
        const bowTailGeometry = new THREE.BoxGeometry(0.05, 0.3, 0.02);
        for (let i = 0; i < 2; i++) {
            const bowTail = new THREE.Mesh(bowTailGeometry, bowMaterial);
            bowTail.position.set(i === 0 ? -0.25 : 0.25, 1.35, 0.8);
            this.teddy.add(bowTail);
        }
    }

    startBlinking() {
        setInterval(() => {
            if (!this.isBlinking && !this.isTalking) {
                this.blink();
            }
        }, 3000 + Math.random() * 2000);
    }

    blink() {
        this.isBlinking = true;
        
        // Hide eyes and show eyelids
        this.eyes.forEach(eye => eye.visible = false);
        this.teddy.children.forEach(child => {
            if (child.geometry && child.geometry.type === 'SphereGeometry' && 
                child.position.y === 2.1 && child.material.color.getHex() === 0x8B4513) {
                child.visible = true;
            }
        });

        setTimeout(() => {
            // Show eyes and hide eyelids
            this.eyes.forEach(eye => eye.visible = true);
            this.teddy.children.forEach(child => {
                if (child.geometry && child.geometry.type === 'SphereGeometry' && 
                    child.position.y === 2.1 && child.material.color.getHex() === 0x8B4513) {
                    child.visible = false;
                }
            });
            this.isBlinking = false;
        }, 150);
    }

    setExpression(expression) {
        this.currentExpression = expression;
        
        switch (expression) {
            case 'happy':
                this.mouth.scale.y = 0.5;
                this.mouth.scale.x = 1.2;
                break;
            case 'sad':
                this.mouth.scale.y = 0.2;
                this.mouth.scale.x = 0.8;
                this.mouth.rotation.z = Math.PI;
                break;
            case 'surprised':
                this.mouth.scale.y = 0.8;
                this.mouth.scale.x = 0.6;
                break;
            case 'talking':
                this.mouth.scale.y = 0.4;
                this.mouth.scale.x = 1.1;
                break;
            default: // neutral
                this.mouth.scale.y = 0.3;
                this.mouth.scale.x = 1;
                this.mouth.rotation.z = 0;
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
        // Check for speech recognition support
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

        // Simple response logic - in a real app, you'd use an AI service
        if (lowerText.includes('hello') || lowerText.includes('hi')) {
            response = 'Hello there! I\'m so happy to meet you!';
            expression = 'happy';
        } else if (lowerText.includes('how are you')) {
            response = 'I\'m doing wonderfully! Thank you for asking!';
            expression = 'happy';
        } else if (lowerText.includes('bye') || lowerText.includes('goodbye')) {
            response = 'Goodbye! Come back and visit me soon!';
            expression = 'sad';
        } else if (lowerText.includes('wave') || lowerText.includes('hello')) {
            response = 'Hello! *waves enthusiastically*';
            expression = 'happy';
            this.wave();
        } else if (lowerText.includes('joke') || lowerText.includes('funny')) {
            response = 'Why did the teddy bear go to the doctor? Because he had a stuffy nose!';
            expression = 'happy';
        } else if (lowerText.includes('name')) {
            response = 'My name is Teddy! I\'m your friendly AI companion!';
            expression = 'happy';
        } else {
            response = 'That\'s interesting! Tell me more about that!';
            expression = 'surprised';
        }

        this.speak(response, expression);
    }

    speak(text, expression = 'talking') {
        // Stop any current speech
        this.synthesis.cancel();

        // Set expression for talking
        this.setExpression(expression);
        this.isTalking = true;

        // Create speech utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;

        // Animate mouth during speech
        let mouthAnimation;
        utterance.onstart = () => {
            mouthAnimation = setInterval(() => {
                if (this.isTalking) {
                    this.mouth.scale.y = 0.3 + Math.random() * 0.3;
                }
            }, 100);
        };

        utterance.onend = () => {
            this.isTalking = false;
            this.setExpression('neutral');
            if (mouthAnimation) {
                clearInterval(mouthAnimation);
            }
        };

        utterance.onerror = () => {
            this.isTalking = false;
            this.setExpression('neutral');
            if (mouthAnimation) {
                clearInterval(mouthAnimation);
            }
        };

        // Speak the text
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

        // Add some interactive animations
        this.renderer.domElement.addEventListener('click', (event) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            // Simple click interaction
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

        // Gentle floating animation
        if (this.teddy) {
            this.teddy.position.y = Math.sin(Date.now() * 0.001) * 0.1;
            this.teddy.rotation.y += 0.005;
        }

        // Update controls
        this.controls.update();

        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the teddy bear when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TeddyBear();
});