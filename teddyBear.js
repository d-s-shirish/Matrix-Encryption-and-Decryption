class TeddyBear {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.mixer = null;
        this.animations = {};
        this.blinkTimer = 0;
        this.mouthOpenAmount = 0;
        this.expressionState = 'neutral'; // neutral, happy, surprised, speaking
        
        this.init();
        this.setupAnimations();
        this.startBlinkLoop();
    }

    init() {
        this.createHead();
        this.createBody();
        this.createArms();
        this.createLegs();
        this.createBowTie();
        this.createFacialFeatures();
        
        // Position the teddy bear
        this.group.position.set(0, -1, 0);
        this.group.scale.set(1.2, 1.2, 1.2);
        this.scene.add(this.group);
    }

    createFurMaterial(color = 0x8B4513) {
        const furTexture = this.createFurTexture();
        const normalTexture = this.createNormalTexture();
        
        return new THREE.MeshStandardMaterial({
            color: color,
            map: furTexture,
            normalMap: normalTexture,
            roughness: 0.8,
            metalness: 0.1,
            normalScale: new THREE.Vector2(0.5, 0.5)
        });
    }

    createFurTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Create base fur color
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(0, 0, 256, 256);
        
        // Add fur texture details
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const size = Math.random() * 3 + 1;
            
            ctx.fillStyle = `rgba(${139 + Math.random() * 40}, ${69 + Math.random() * 30}, ${19 + Math.random() * 20}, ${0.3 + Math.random() * 0.4})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
        return texture;
    }

    createNormalTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Create normal map for fur bumps
        ctx.fillStyle = '#8080ff';
        ctx.fillRect(0, 0, 256, 256);
        
        for (let i = 0; i < 500; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const size = Math.random() * 4 + 2;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, '#ff8080');
            gradient.addColorStop(1, '#8080ff');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        return new THREE.CanvasTexture(canvas);
    }

    createHead() {
        // Main head
        const headGeometry = new THREE.SphereGeometry(1, 32, 32);
        const headMaterial = this.createFurMaterial();
        this.head = new THREE.Mesh(headGeometry, headMaterial);
        this.head.position.set(0, 2, 0);
        this.head.scale.set(1, 0.9, 0.8);
        this.group.add(this.head);

        // Snout
        const snoutGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const snoutMaterial = this.createFurMaterial(0xF4A460);
        this.snout = new THREE.Mesh(snoutGeometry, snoutMaterial);
        this.snout.position.set(0, 1.7, 0.6);
        this.snout.scale.set(1, 0.7, 0.8);
        this.group.add(this.snout);

        // Ears
        this.createEars();
    }

    createEars() {
        const earGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const earMaterial = this.createFurMaterial();
        
        this.leftEar = new THREE.Mesh(earGeometry, earMaterial);
        this.leftEar.position.set(-0.7, 2.6, -0.2);
        this.leftEar.scale.set(1, 1, 0.3);
        this.group.add(this.leftEar);

        this.rightEar = new THREE.Mesh(earGeometry, earMaterial);
        this.rightEar.position.set(0.7, 2.6, -0.2);
        this.rightEar.scale.set(1, 1, 0.3);
        this.group.add(this.rightEar);

        // Inner ears
        const innerEarGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const innerEarMaterial = new THREE.MeshStandardMaterial({ color: 0xFF69B4 });
        
        const leftInnerEar = new THREE.Mesh(innerEarGeometry, innerEarMaterial);
        leftInnerEar.position.set(-0.7, 2.6, 0);
        this.group.add(leftInnerEar);

        const rightInnerEar = new THREE.Mesh(innerEarGeometry, innerEarMaterial);
        rightInnerEar.position.set(0.7, 2.6, 0);
        this.group.add(rightInnerEar);
    }

    createFacialFeatures() {
        // Eyes
        this.createEyes();
        
        // Nose
        const noseGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const noseMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        this.nose = new THREE.Mesh(noseGeometry, noseMaterial);
        this.nose.position.set(0, 1.9, 0.9);
        this.group.add(this.nose);

        // Mouth
        this.createMouth();
    }

    createEyes() {
        // Eye whites
        const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
        
        this.leftEyeWhite = new THREE.Mesh(eyeGeometry, eyeMaterial);
        this.leftEyeWhite.position.set(-0.3, 2.1, 0.7);
        this.group.add(this.leftEyeWhite);

        this.rightEyeWhite = new THREE.Mesh(eyeGeometry, eyeMaterial);
        this.rightEyeWhite.position.set(0.3, 2.1, 0.7);
        this.group.add(this.rightEyeWhite);

        // Pupils
        const pupilGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        
        this.leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        this.leftPupil.position.set(-0.3, 2.1, 0.8);
        this.group.add(this.leftPupil);

        this.rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        this.rightPupil.position.set(0.3, 2.1, 0.8);
        this.group.add(this.rightPupil);

        // Eyelids for blinking
        this.createEyelids();
    }

    createEyelids() {
        const eyelidGeometry = new THREE.SphereGeometry(0.16, 16, 8);
        const eyelidMaterial = this.createFurMaterial();
        
        this.leftEyelid = new THREE.Mesh(eyelidGeometry, eyelidMaterial);
        this.leftEyelid.position.set(-0.3, 2.1, 0.7);
        this.leftEyelid.scale.set(1, 0.01, 1);
        this.group.add(this.leftEyelid);

        this.rightEyelid = new THREE.Mesh(eyelidGeometry, eyelidMaterial);
        this.rightEyelid.position.set(0.3, 2.1, 0.7);
        this.rightEyelid.scale.set(1, 0.01, 1);
        this.group.add(this.rightEyelid);
    }

    createMouth() {
        // Create mouth geometry that can open and close
        const mouthGeometry = new THREE.RingGeometry(0.05, 0.12, 8);
        const mouthMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B0000,
            side: THREE.DoubleSide 
        });
        
        this.mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        this.mouth.position.set(0, 1.7, 0.85);
        this.mouth.rotation.x = Math.PI / 2;
        this.mouth.scale.set(1, 1, 0.1);
        this.group.add(this.mouth);
    }

    createBody() {
        const bodyGeometry = new THREE.SphereGeometry(1.2, 32, 32);
        const bodyMaterial = this.createFurMaterial();
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.position.set(0, 0, 0);
        this.body.scale.set(1, 1.3, 0.8);
        this.group.add(this.body);
    }

    createArms() {
        const armGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const armMaterial = this.createFurMaterial();
        
        // Left arm
        this.leftArm = new THREE.Group();
        const leftUpperArm = new THREE.Mesh(armGeometry, armMaterial);
        leftUpperArm.scale.set(1, 1.5, 1);
        this.leftArm.add(leftUpperArm);
        
        const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), armMaterial);
        leftHand.position.set(0, -0.8, 0);
        this.leftArm.add(leftHand);
        
        this.leftArm.position.set(-1.3, 0.5, 0);
        this.group.add(this.leftArm);

        // Right arm
        this.rightArm = new THREE.Group();
        const rightUpperArm = new THREE.Mesh(armGeometry, armMaterial);
        rightUpperArm.scale.set(1, 1.5, 1);
        this.rightArm.add(rightUpperArm);
        
        const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), armMaterial);
        rightHand.position.set(0, -0.8, 0);
        this.rightArm.add(rightHand);
        
        this.rightArm.position.set(1.3, 0.5, 0);
        this.group.add(this.rightArm);
    }

    createLegs() {
        const legGeometry = new THREE.SphereGeometry(0.45, 16, 16);
        const legMaterial = this.createFurMaterial();
        
        // Left leg
        this.leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        this.leftLeg.position.set(-0.5, -1.8, 0);
        this.leftLeg.scale.set(1, 1.2, 1.2);
        this.group.add(this.leftLeg);

        // Right leg
        this.rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        this.rightLeg.position.set(0.5, -1.8, 0);
        this.rightLeg.scale.set(1, 1.2, 1.2);
        this.group.add(this.rightLeg);

        // Feet
        const footGeometry = new THREE.SphereGeometry(0.35, 16, 16);
        const footMaterial = this.createFurMaterial(0x654321);
        
        const leftFoot = new THREE.Mesh(footGeometry, footMaterial);
        leftFoot.position.set(-0.5, -2.4, 0.2);
        leftFoot.scale.set(1.2, 0.6, 1.5);
        this.group.add(leftFoot);

        const rightFoot = new THREE.Mesh(footGeometry, footMaterial);
        rightFoot.position.set(0.5, -2.4, 0.2);
        rightFoot.scale.set(1.2, 0.6, 1.5);
        this.group.add(rightFoot);
    }

    createBowTie() {
        const bowTieGroup = new THREE.Group();
        
        // Main bow tie parts
        const bowGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.15);
        const bowMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
        
        const leftBow = new THREE.Mesh(bowGeometry, bowMaterial);
        leftBow.position.set(-0.2, 0, 0);
        leftBow.rotation.z = Math.PI / 6;
        bowTieGroup.add(leftBow);

        const rightBow = new THREE.Mesh(bowGeometry, bowMaterial);
        rightBow.position.set(0.2, 0, 0);
        rightBow.rotation.z = -Math.PI / 6;
        bowTieGroup.add(rightBow);

        // Center knot
        const knotGeometry = new THREE.BoxGeometry(0.1, 0.15, 0.08);
        const knotMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
        const knot = new THREE.Mesh(knotGeometry, knotMaterial);
        bowTieGroup.add(knot);

        bowTieGroup.position.set(0, 1.2, 0.9);
        this.group.add(bowTieGroup);
    }

    setupAnimations() {
        // Setup animation mixer if needed for complex animations
        this.mixer = new THREE.AnimationMixer(this.group);
    }

    // Animation methods
    blink() {
        const duration = 0.15;
        
        // Close eyes
        const closeAnimation = () => {
            this.leftEyelid.scale.y = 1;
            this.rightEyelid.scale.y = 1;
        };
        
        // Open eyes
        const openAnimation = () => {
            this.leftEyelid.scale.y = 0.01;
            this.rightEyelid.scale.y = 0.01;
        };
        
        closeAnimation();
        setTimeout(openAnimation, duration * 1000);
    }

    startBlinkLoop() {
        const blink = () => {
            this.blink();
            // Random blink interval between 2-6 seconds
            const nextBlink = Math.random() * 4000 + 2000;
            setTimeout(blink, nextBlink);
        };
        
        // Start first blink after 2 seconds
        setTimeout(blink, 2000);
    }

    wave() {
        const originalRotation = this.rightArm.rotation.z;
        const waveAnimation = (progress) => {
            const angle = Math.sin(progress * Math.PI * 4) * 0.5;
            this.rightArm.rotation.z = originalRotation + angle;
            this.rightArm.rotation.x = Math.sin(progress * Math.PI * 4) * 0.3;
        };

        this.animateProperty(waveAnimation, 2000, () => {
            this.rightArm.rotation.z = originalRotation;
            this.rightArm.rotation.x = 0;
        });
    }

    dance() {
        const originalPosition = { ...this.group.position };
        const originalRotation = { ...this.group.rotation };
        
        const danceAnimation = (progress) => {
            const bounce = Math.sin(progress * Math.PI * 8) * 0.2;
            const sway = Math.sin(progress * Math.PI * 4) * 0.1;
            
            this.group.position.y = originalPosition.y + bounce;
            this.group.rotation.z = originalRotation.z + sway;
            
            // Move arms
            this.leftArm.rotation.z = Math.sin(progress * Math.PI * 8) * 0.5;
            this.rightArm.rotation.z = -Math.sin(progress * Math.PI * 8) * 0.5;
        };

        this.animateProperty(danceAnimation, 3000, () => {
            this.group.position.copy(originalPosition);
            this.group.rotation.copy(originalRotation);
            this.leftArm.rotation.z = 0;
            this.rightArm.rotation.z = 0;
        });
    }

    setMouthOpen(amount) {
        this.mouthOpenAmount = Math.max(0, Math.min(1, amount));
        this.mouth.scale.z = 0.1 + this.mouthOpenAmount * 0.4;
        this.mouth.scale.x = 1 + this.mouthOpenAmount * 0.5;
        this.mouth.scale.y = 1 + this.mouthOpenAmount * 0.5;
    }

    setExpression(expression) {
        this.expressionState = expression;
        
        switch (expression) {
            case 'happy':
                this.leftPupil.position.y = 2.15;
                this.rightPupil.position.y = 2.15;
                break;
            case 'surprised':
                this.leftEyeWhite.scale.setScalar(1.3);
                this.rightEyeWhite.scale.setScalar(1.3);
                this.setMouthOpen(0.8);
                break;
            case 'speaking':
                // Mouth will be animated during speech
                break;
            default: // neutral
                this.leftPupil.position.y = 2.1;
                this.rightPupil.position.y = 2.1;
                this.leftEyeWhite.scale.setScalar(1);
                this.rightEyeWhite.scale.setScalar(1);
                this.setMouthOpen(0);
                break;
        }
    }

    animateProperty(animationFunction, duration, onComplete = null) {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            animationFunction(progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (onComplete) {
                onComplete();
            }
        };
        
        animate();
    }

    update(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
        
        // Add subtle breathing animation
        const breathe = Math.sin(Date.now() * 0.001) * 0.02;
        this.body.scale.z = 0.8 + breathe;
        
        // Add subtle head movement
        const headSway = Math.sin(Date.now() * 0.0005) * 0.05;
        this.head.rotation.y = headSway;
    }

    lookAt(target) {
        // Make teddy bear look at a specific point
        this.head.lookAt(target);
        this.leftPupil.lookAt(target);
        this.rightPupil.lookAt(target);
    }

    // Method to handle speech animation
    animateSpeech(text, onComplete = null) {
        this.setExpression('speaking');
        
        // Simple mouth animation based on speech
        const words = text.split(' ');
        let wordIndex = 0;
        
        const speakWord = () => {
            if (wordIndex < words.length) {
                // Open mouth for syllables
                const word = words[wordIndex];
                const syllables = Math.max(1, Math.floor(word.length / 3));
                
                for (let i = 0; i < syllables; i++) {
                    setTimeout(() => {
                        this.setMouthOpen(0.6);
                        setTimeout(() => this.setMouthOpen(0.1), 100);
                    }, i * 200);
                }
                
                wordIndex++;
                setTimeout(speakWord, syllables * 200 + 100);
            } else {
                this.setExpression('neutral');
                if (onComplete) onComplete();
            }
        };
        
        speakWord();
    }
}