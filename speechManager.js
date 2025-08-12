class SpeechManager {
    constructor(teddyBear) {
        this.teddyBear = teddyBear;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSpeaking = false;
        this.currentVoice = null;
        
        this.initializeSpeechRecognition();
        this.initializeSpeechSynthesis();
        this.setupEventHandlers();
        
        // Status update callback
        this.onStatusUpdate = null;
        
        // Pre-defined responses for more natural interaction
        this.responses = {
            greeting: [
                "Hello there! I'm so happy to see you!",
                "Hi! What a wonderful day to chat!",
                "Hey friend! How are you doing today?",
                "Hello! I've been waiting to talk with you!"
            ],
            goodbye: [
                "Goodbye! It was lovely talking with you!",
                "See you later! Have a wonderful day!",
                "Bye bye! Come back and visit me soon!",
                "Take care! I'll miss you!"
            ],
            compliment: [
                "You're so kind! That makes me very happy!",
                "Thank you! You're wonderful too!",
                "Aww, you're making me blush! You're the best!",
                "That's so sweet of you to say!"
            ],
            question: [
                "That's a great question! Let me think about that.",
                "Hmm, that's interesting! I'd love to chat about that.",
                "What a thoughtful question! I enjoy talking with you.",
                "You always ask such interesting things!"
            ],
            default: [
                "That's really interesting! Tell me more!",
                "I love listening to you talk!",
                "You're so fun to chat with!",
                "That sounds wonderful!",
                "I'm so glad you shared that with me!",
                "You always have such great things to say!"
            ]
        };
    }

    initializeSpeechRecognition() {
        // Check for speech recognition support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported in this browser');
            this.updateStatus('Speech recognition not supported in this browser');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateStatus('Listening... Speak now!');
            this.teddyBear.setExpression('happy');
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                this.updateStatus(`You said: "${finalTranscript}"`);
                this.processUserInput(finalTranscript.trim());
            } else if (interimTranscript) {
                this.updateStatus(`Listening: "${interimTranscript}"`);
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.updateStatus(`Recognition error: ${event.error}`);
            this.isListening = false;
            this.teddyBear.setExpression('neutral');
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateStatus('Stopped listening');
            this.teddyBear.setExpression('neutral');
        };
    }

    initializeSpeechSynthesis() {
        // Wait for voices to load
        const loadVoices = () => {
            const voices = this.synthesis.getVoices();
            
            // Prefer female voices for a friendlier teddy bear
            const preferredVoices = voices.filter(voice => 
                voice.lang.startsWith('en') && 
                (voice.name.toLowerCase().includes('female') || 
                 voice.name.toLowerCase().includes('samantha') ||
                 voice.name.toLowerCase().includes('karen') ||
                 voice.name.toLowerCase().includes('moira'))
            );

            this.currentVoice = preferredVoices[0] || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
            
            if (this.currentVoice) {
                console.log('Selected voice:', this.currentVoice.name);
            }
        };

        if (this.synthesis.getVoices().length > 0) {
            loadVoices();
        } else {
            this.synthesis.onvoiceschanged = loadVoices;
        }
    }

    setupEventHandlers() {
        // Handle speech synthesis events
        this.synthesis.onend = () => {
            this.isSpeaking = false;
            this.teddyBear.setExpression('neutral');
        };
    }

    startListening() {
        if (!this.recognition) {
            this.updateStatus('Speech recognition not available');
            return false;
        }

        if (this.isListening) {
            this.updateStatus('Already listening...');
            return false;
        }

        try {
            this.recognition.start();
            return true;
        } catch (error) {
            console.error('Error starting recognition:', error);
            this.updateStatus('Error starting speech recognition');
            return false;
        }
    }

    stopListening() {
        if (!this.recognition || !this.isListening) {
            return false;
        }

        this.recognition.stop();
        return true;
    }

    speak(text, options = {}) {
        if (!text || this.isSpeaking) {
            return false;
        }

        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure voice settings
        if (this.currentVoice) {
            utterance.voice = this.currentVoice;
        }
        
        utterance.rate = options.rate || 0.9; // Slightly slower for friendliness
        utterance.pitch = options.pitch || 1.1; // Slightly higher for cuteness
        utterance.volume = options.volume || 0.8;

        // Handle speech events
        utterance.onstart = () => {
            this.isSpeaking = true;
            this.updateStatus(`Teddy is saying: "${text}"`);
            this.teddyBear.animateSpeech(text);
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            this.updateStatus('Teddy finished speaking');
            this.teddyBear.setExpression('neutral');
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.isSpeaking = false;
            this.updateStatus('Error during speech synthesis');
            this.teddyBear.setExpression('neutral');
        };

        this.synthesis.speak(utterance);
        return true;
    }

    processUserInput(input) {
        const lowerInput = input.toLowerCase();
        let response = '';
        let animation = null;

        // Analyze input and generate appropriate response
        if (this.containsWords(lowerInput, ['hello', 'hi', 'hey', 'good morning', 'good afternoon'])) {
            response = this.getRandomResponse('greeting');
            animation = 'wave';
        } else if (this.containsWords(lowerInput, ['goodbye', 'bye', 'see you', 'farewell'])) {
            response = this.getRandomResponse('goodbye');
            animation = 'wave';
        } else if (this.containsWords(lowerInput, ['cute', 'adorable', 'sweet', 'nice', 'beautiful', 'lovely'])) {
            response = this.getRandomResponse('compliment');
            animation = 'dance';
            this.teddyBear.setExpression('happy');
        } else if (this.containsWords(lowerInput, ['dance', 'move', 'groove'])) {
            response = "I love to dance! Watch me move!";
            animation = 'dance';
        } else if (this.containsWords(lowerInput, ['wave', 'hand'])) {
            response = "Look at me wave! Hello there!";
            animation = 'wave';
        } else if (this.containsWords(lowerInput, ['blink', 'wink', 'eye'])) {
            response = "Watch me blink my eyes!";
            animation = 'blink';
        } else if (lowerInput.includes('?')) {
            response = this.getRandomResponse('question');
        } else {
            response = this.getRandomResponse('default');
        }

        // Perform animation if specified
        if (animation) {
            setTimeout(() => {
                switch (animation) {
                    case 'wave':
                        this.teddyBear.wave();
                        break;
                    case 'dance':
                        this.teddyBear.dance();
                        break;
                    case 'blink':
                        this.teddyBear.blink();
                        break;
                }
            }, 500); // Delay to allow speech to start first
        }

        // Speak the response
        setTimeout(() => {
            this.speak(response);
        }, 300);
    }

    containsWords(text, words) {
        return words.some(word => text.includes(word));
    }

    getRandomResponse(category) {
        const responses = this.responses[category] || this.responses.default;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    updateStatus(message) {
        if (this.onStatusUpdate) {
            this.onStatusUpdate(message);
        }
        console.log('Speech Status:', message);
    }

    // Advanced features
    setVoiceSettings(rate = 0.9, pitch = 1.1, volume = 0.8) {
        this.voiceSettings = { rate, pitch, volume };
    }

    // Get available voices
    getAvailableVoices() {
        return this.synthesis.getVoices().filter(voice => voice.lang.startsWith('en'));
    }

    // Set specific voice
    setVoice(voiceName) {
        const voices = this.synthesis.getVoices();
        const voice = voices.find(v => v.name === voiceName);
        if (voice) {
            this.currentVoice = voice;
            return true;
        }
        return false;
    }

    // Check if browser supports speech features
    static checkSupport() {
        return {
            recognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
            synthesis: !!window.speechSynthesis
        };
    }

    // Interactive conversation starter
    startConversation() {
        const greetings = [
            "Hello! I'm your friendly teddy bear. What would you like to talk about?",
            "Hi there! I'm so excited to chat with you today!",
            "Hey friend! Ready for some fun conversation?",
            "Hello! I love making new friends. What's your name?"
        ];
        
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        setTimeout(() => {
            this.speak(greeting);
            this.teddyBear.wave();
        }, 1000);
    }

    // Emergency stop
    stopAllSpeech() {
        this.synthesis.cancel();
        this.isSpeaking = false;
        this.teddyBear.setExpression('neutral');
    }
}