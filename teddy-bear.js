class TeddyBear {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.teddy = null;
        this.animations = {};
        this.currentAnimation = null;
        this.isListening = false;
        this.isSpeaking = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        
        this.init();
        this.setupEventListeners();
        this.createTeddyBear();
        this.setupAnimations();
        this.animate();
    }

    init() {
        // Initialize Three.js scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f8ff);

        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 5);

        // Setup renderer
        const canvas = document.getElementById('teddy-canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        canvas.appendChild(this.renderer.domElement);

        // Add lighting
        this.setupLighting();

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
        pointLight.position.set(-2, 2, 2);
        this.scene.add(pointLight);
    }

    createTeddyBear() {
        // Create teddy bear group
        this.teddy = new THREE.Group();

        // Create body (main sphere)
        const bodyGeometry = new THREE.SphereGeometry(1.2, 32, 32);
        const bodyMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x8B4513,
            roughness: 0.8
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        this.teddy.add(body);

        // Create head
        const headGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const headMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x8B4513,
            roughness: 0.8
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0, 1.5, 0);
        head.castShadow = true;
        this.teddy.add(head);

        // Create ears
        const earGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const earMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x8B4513,
            roughness: 0.8
        });
        
        const leftEar = new THREE.Mesh(earGeometry, earMaterial);
        leftEar.position.set(-0.6, 2.2, 0);
        this.teddy.add(leftEar);
        
        const rightEar = new THREE.Mesh(earGeometry, earMaterial);
        rightEar.position.set(0.6, 2.2, 0);
        this.teddy.add(rightEar);

        // Create eyes
        const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.3, 1.7, 0.6);
        this.teddy.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.3, 1.7, 0.6);
        this.teddy.add(rightEye);

        // Create nose
        const noseGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const noseMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(0, 1.4, 0.7);
        this.teddy.add(nose);

        // Create mouth
        const mouthGeometry = new THREE.TorusGeometry(0.2, 0.05, 8, 16);
        const mouthMaterial = new THREE.MeshLambertMaterial({ color: 0x8B0000 });
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(0, 1.1, 0.6);
        mouth.rotation.x = Math.PI / 2;
        this.teddy.add(mouth);

        // Create arms
        const armGeometry = new THREE.CylinderGeometry(0.2, 0.25, 1.2, 16);
        const armMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x8B4513,
            roughness: 0.8
        });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-1.2, 0.5, 0);
        leftArm.rotation.z = Math.PI / 4;
        leftArm.castShadow = true;
        this.teddy.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(1.2, 0.5, 0);
        rightArm.rotation.z = -Math.PI / 4;
        rightArm.castShadow = true;
        this.teddy.add(rightArm);

        // Create legs
        const legGeometry = new THREE.CylinderGeometry(0.25, 0.3, 0.8, 16);
        const legMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x8B4513,
            roughness: 0.8
        });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.4, -1.2, 0);
        leftLeg.castShadow = true;
        this.teddy.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.4, -1.2, 0);
        rightLeg.castShadow = true;
        this.teddy.add(rightLeg);

        // Create bow tie
        const bowGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.1);
        const bowMaterial = new THREE.MeshLambertMaterial({ color: 0xFF69B4 });
        const bow = new THREE.Mesh(bowGeometry, bowMaterial);
        bow.position.set(0, 0.8, 0.8);
        this.teddy.add(bow);

        // Add teddy to scene
        this.scene.add(this.teddy);

        // Store references for animations
        this.teddyParts = {
            head,
            leftEye,
            rightEye,
            mouth,
            leftArm,
            rightArm,
            leftLeg,
            rightLeg,
            bow
        };
    }

    setupAnimations() {
        // Blinking animation
        this.animations.blink = () => {
            const blinkDuration = 150;
            const originalScale = this.teddyParts.leftEye.scale.y;
            
            // Close eyes
            this.teddyParts.leftEye.scale.y = 0.1;
            this.teddyParts.rightEye.scale.y = 0.1;
            
            setTimeout(() => {
                // Open eyes
                this.teddyParts.leftEye.scale.y = originalScale;
                this.teddyParts.rightEye.scale.y = originalScale;
            }, blinkDuration);
        };

        // Talking animation
        this.animations.talk = () => {
            const mouth = this.teddyParts.mouth;
            const originalScale = mouth.scale.x;
            
            // Scale mouth to simulate talking
            mouth.scale.x = originalScale * 1.3;
            mouth.scale.y = originalScale * 1.3;
            
            setTimeout(() => {
                mouth.scale.x = originalScale;
                mouth.scale.y = originalScale;
            }, 200);
        };

        // Wave animation
        this.animations.wave = () => {
            const arm = this.teddyParts.rightArm;
            const originalRotation = arm.rotation.z;
            
            // Wave motion
            const wave = () => {
                arm.rotation.z = originalRotation + Math.sin(Date.now() * 0.01) * 0.3;
                if (this.currentAnimation === 'wave') {
                    requestAnimationFrame(wave);
                } else {
                    arm.rotation.z = originalRotation;
                }
            };
            wave();
        };

        // Excited bounce animation
        this.animations.excited = () => {
            const body = this.teddy;
            const originalY = body.position.y;
            
            const bounce = () => {
                body.position.y = originalY + Math.sin(Date.now() * 0.02) * 0.2;
                body.rotation.z = Math.sin(Date.now() * 0.01) * 0.1;
                if (this.currentAnimation === 'excited') {
                    requestAnimationFrame(bounce);
                } else {
                    body.position.y = originalY;
                    body.rotation.z = 0;
                }
            };
            bounce();
        };

        // Listening animation
        this.animations.listen = () => {
            const head = this.teddyParts.head;
            const originalRotation = head.rotation.y;
            
            const listen = () => {
                head.rotation.y = originalRotation + Math.sin(Date.now() * 0.005) * 0.1;
                if (this.currentAnimation === 'listen') {
                    requestAnimationFrame(listen);
                } else {
                    head.rotation.y = originalRotation;
                }
            };
            listen();
        };

        // Start blinking periodically
        setInterval(() => {
            if (!this.isSpeaking && !this.isListening) {
                this.animations.blink();
            }
        }, 3000 + Math.random() * 2000);
    }

    playAnimation(animationName) {
        this.currentAnimation = animationName;
        if (this.animations[animationName]) {
            this.animations[animationName]();
        }
    }

    stopAnimation() {
        this.currentAnimation = null;
    }

    setupEventListeners() {
        // Speech recognition setup
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateUI();
                this.playAnimation('listen');
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.handleUserInput(transcript);
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateUI();
                this.stopAnimation();
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                this.updateUI();
                this.stopAnimation();
            };
        }

        // Button event listeners
        document.getElementById('startListening').addEventListener('click', () => {
            this.startListening();
        });

        document.getElementById('stopListening').addEventListener('click', () => {
            this.stopListening();
        });

        document.getElementById('sendMessage').addEventListener('click', () => {
            const input = document.getElementById('textInput');
            const message = input.value.trim();
            if (message) {
                this.handleUserInput(message);
                input.value = '';
            }
        });

        document.getElementById('textInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('sendMessage').click();
            }
        });
    }

    startListening() {
        if (this.recognition) {
            this.recognition.start();
        } else {
            this.addMessage('Speech recognition not supported in this browser', 'teddy');
        }
    }

    stopListening() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    updateUI() {
        const startBtn = document.getElementById('startListening');
        const stopBtn = document.getElementById('stopListening');
        const status = document.getElementById('status');
        const listeningIndicator = document.getElementById('listening-indicator');

        if (this.isListening) {
            startBtn.disabled = true;
            stopBtn.disabled = false;
            status.textContent = 'Listening...';
            listeningIndicator.classList.remove('hidden');
        } else {
            startBtn.disabled = false;
            stopBtn.disabled = true;
            status.textContent = 'Ready to chat!';
            listeningIndicator.classList.add('hidden');
        }
    }

    handleUserInput(input) {
        this.addMessage(input, 'user');
        
        // Generate AI response
        const response = this.generateResponse(input);
        
        // Speak the response
        this.speak(response);
        
        // Add response to conversation
        this.addMessage(response, 'teddy');
    }

    generateResponse(input) {
        const responses = {
            greeting: [
                "Hello there! I'm so happy to see you! 🧸",
                "Hi friend! How are you doing today?",
                "Greetings! I'm your teddy bear companion!",
                "Hello! I've been waiting to chat with you!",
                "Hi there! *waves paw* Nice to meet you!"
            ],
            feeling: [
                "I'm feeling wonderful, thank you for asking! How about you?",
                "I'm as happy as a teddy bear can be! 🎉",
                "I'm doing great! Being your friend makes me so happy!",
                "I'm feeling cozy and warm, just like a good teddy bear should!",
                "I'm feeling fantastic! *hugs you* How are you feeling?"
            ],
            weather: [
                "I love all kinds of weather! Rainy days are perfect for cuddles!",
                "The weather doesn't matter when you have a friend to talk to!",
                "I'm a teddy bear, so I'm always warm and cozy inside!",
                "Whatever the weather, I'm here to brighten your day!",
                "I love sunny days for picnics and rainy days for hot chocolate! ☀️☔"
            ],
            joke: [
                "Why did the teddy bear say no to dessert? Because she was stuffed! 😄",
                "What do you call a teddy bear with no teeth? A gummy bear!",
                "Why don't teddy bears wear shoes? Because they have bear feet! 🐻",
                "What's a teddy bear's favorite drink? Hot chocolate, of course!",
                "Why did the teddy bear go to the doctor? Because she had a stuffy nose! 🤧"
            ],
            dance: [
                "*dances around happily* 🕺💃",
                "*does a little teddy bear jig* 🎵",
                "*spins in circles with joy* ✨",
                "*bounces up and down excitedly* 🎉",
                "*wags tail and dances* 🐾"
            ],
            hug: [
                "*gives you a big warm hug* 🤗",
                "*wraps arms around you* You're the best friend ever!",
                "*squeezes you gently* I love hugs!",
                "*hugs you tight* You make me so happy!",
                "*opens arms wide* Come here for a teddy bear hug! 🧸"
            ],
            default: [
                "That's very interesting! Tell me more!",
                "I love hearing from you! What else is on your mind?",
                "You're such a great friend to talk to!",
                "I'm listening! Please continue!",
                "That sounds wonderful! I'm so glad you shared that with me!",
                "*tilts head curiously* Tell me more about that!",
                "I'm all ears! *perks up ears* What else?",
                "That's fascinating! I'd love to hear more!"
            ]
        };

        const lowerInput = input.toLowerCase();
        
        if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
            return this.getRandomResponse(responses.greeting);
        } else if (lowerInput.includes('how are you') || lowerInput.includes('feeling')) {
            return this.getRandomResponse(responses.feeling);
        } else if (lowerInput.includes('weather')) {
            return this.getRandomResponse(responses.weather);
        } else if (lowerInput.includes('joke') || lowerInput.includes('funny')) {
            this.playAnimation('excited');
            setTimeout(() => this.stopAnimation(), 2000);
            return this.getRandomResponse(responses.joke);
        } else if (lowerInput.includes('dance') || lowerInput.includes('dancing')) {
            this.playAnimation('excited'); // Use excited animation for dance
            setTimeout(() => this.stopAnimation(), 3000);
            return this.getRandomResponse(responses.dance);
        } else if (lowerInput.includes('hug') || lowerInput.includes('hugs')) {
            this.playAnimation('wave'); // Use wave animation for hug
            setTimeout(() => this.stopAnimation(), 2000);
            return this.getRandomResponse(responses.hug);
        } else {
            return this.getRandomResponse(responses.default);
        }
    }

    getRandomResponse(responseArray) {
        return responseArray[Math.floor(Math.random() * responseArray.length)];
    }

    speak(text) {
        if (this.synthesis) {
            // Stop any current speech
            this.synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            utterance.volume = 0.8;
            
            // Set voice to a friendly female voice if available
            const voices = this.synthesis.getVoices();
            const friendlyVoice = voices.find(voice => 
                voice.name.includes('Female') || 
                voice.name.includes('Samantha') || 
                voice.name.includes('Victoria')
            );
            if (friendlyVoice) {
                utterance.voice = friendlyVoice;
            }
            
            utterance.onstart = () => {
                this.isSpeaking = true;
                this.playAnimation('talk');
            };
            
            utterance.onend = () => {
                this.isSpeaking = false;
                this.stopAnimation();
            };
            
            this.synthesis.speak(utterance);
        }
    }

    addMessage(text, sender) {
        const conversation = document.getElementById('conversation');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        conversation.appendChild(messageDiv);
        conversation.scrollTop = conversation.scrollHeight;
    }

    onWindowResize() {
        const canvas = document.getElementById('teddy-canvas');
        this.camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Gentle floating animation for teddy bear
        if (this.teddy) {
            this.teddy.position.y = Math.sin(Date.now() * 0.001) * 0.1;
            this.teddy.rotation.y = Math.sin(Date.now() * 0.0005) * 0.1;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the teddy bear when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TeddyBear();
});