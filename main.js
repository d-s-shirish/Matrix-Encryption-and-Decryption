/*
 * AI Teddy Bear Companion
 * ----------------------
 * This script sets up a Three.js scene displaying an animated teddy bear that can
 * listen to the user's voice, generate AI-powered responses, and speak back while
 * displaying corresponding facial animations.
 */

// ========= CONFIG ========= //
// Replace with your own OpenAI API key. You can also set it dynamically in the browser
// e.g. localStorage.setItem('OPENAI_API_KEY', 'sk-...');
const OPENAI_API_KEY = localStorage.getItem('OPENAI_API_KEY') || '';
// Path to your GLB teddy model (ensure the model has morph targets: Blink, MouthOpen)
const MODEL_URL = 'teddy_bear.glb';

// ========= THREE.JS SETUP ========= //
let scene, camera, renderer, teddy, mixer, clock;
const canvas = document.getElementById('teddyCanvas');

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffe9e5);

  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.5, 3);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(devicePixelRatio);

  // Lighting
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  hemi.position.set(0, 2, 0);
  scene.add(hemi);

  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(5, 10, 7.5);
  scene.add(dir);

  // Load Teddy model
  const loader = new THREE.GLTFLoader();
  loader.load(
    MODEL_URL,
    (gltf) => {
      teddy = gltf.scene;
      teddy.scale.set(1.5, 1.5, 1.5);
      scene.add(teddy);

      // If animations included
      if (gltf.animations && gltf.animations.length) {
        mixer = new THREE.AnimationMixer(teddy);
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });
      }
    },
    undefined,
    (error) => console.error('Error loading model', error)
  );

  clock = new THREE.Clock();

  window.addEventListener('resize', onWindowResize);
  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ========= EXPRESSIONS & ANIMATION HELPERS ========= //
let blinkTimer = 0;
let mouthOpen = 0;
let speakingInterval = null;

function updateExpressions(delta) {
  if (!teddy) return;
  const skinnedMesh = teddy.getObjectByProperty('type', 'SkinnedMesh');
  if (!skinnedMesh || !skinnedMesh.morphTargetDictionary) return;
  const { Blink = -1, MouthOpen = -1 } = skinnedMesh.morphTargetDictionary;

  // Blinking (random every 2-5 seconds)
  blinkTimer -= delta;
  if (blinkTimer <= 0) {
    blinkTimer = THREE.MathUtils.randFloat(2, 5);
    // quick blink
    if (Blink !== -1) {
      gsap.to(skinnedMesh.morphTargetInfluences, { [Blink]: 1, duration: 0.05, yoyo: true, repeat: 1 });
    }
  }

  // Mouth animation while speaking
  if (MouthOpen !== -1) {
    skinnedMesh.morphTargetInfluences[MouthOpen] = mouthOpen; // 0 to 1
  }
}

// ========= RENDER LOOP ========= //
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  updateExpressions(delta);
  renderer.render(scene, camera);
}

// ========= SPEECH RECOGNITION ========= //
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognizer;
if (SpeechRecognition) {
  recognizer = new SpeechRecognition();
  recognizer.lang = 'en-US';
  recognizer.continuous = false;
  recognizer.interimResults = false;
  recognizer.maxAlternatives = 1;
} else {
  document.getElementById('status').textContent = 'Speech recognition not supported in this browser.';
}

const talkButton = document.getElementById('talkButton');

talkButton.addEventListener('click', () => {
  if (!recognizer) return;
  document.getElementById('status').textContent = 'Listening...';
  recognizer.start();
});

recognizer?.addEventListener('result', async (e) => {
  const transcript = e.results[0][0].transcript;
  document.getElementById('status').textContent = `You said: "${transcript}"`;
  recognizer.stop();

  const reply = await getAIResponse(transcript);
  speak(reply);
});

recognizer?.addEventListener('error', (err) => {
  console.error(err);
  document.getElementById('status').textContent = 'Error during speech recognition.';
});

// ========= OPENAI CHAT COMPLETION ========= //
async function getAIResponse(prompt) {
  if (!OPENAI_API_KEY) {
    console.warn('Missing OpenAI API Key. Returning preset response.');
    return "Hello! I'm your cuddly teddy friend. How can I help you today?";
  }
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: "You are a friendly teddy bear talking to a child on a website." },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 60,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "I'm not sure what to say.";
  } catch (error) {
    console.error('Error fetching AI response', error);
    return "Oops! Something went wrong getting my response.";
  }
}

// ========= SPEECH SYNTHESIS ========= //
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.pitch = 1.1;
  utter.rate = 1.0;
  utter.onstart = () => {
    document.getElementById('status').textContent = 'Teddy is speaking...';
    startMouthMove();
  };
  utter.onend = () => {
    stopMouthMove();
    document.getElementById('status').textContent = 'Click "Speak" and start talking...';
  };
  speechSynthesis.speak(utter);
}

function startMouthMove() {
  if (speakingInterval) return;
  speakingInterval = setInterval(() => {
    mouthOpen = Math.random() * 0.5 + 0.2; // random openness
    setTimeout(() => (mouthOpen = 0), 80);
  }, 120);
}

function stopMouthMove() {
  clearInterval(speakingInterval);
  speakingInterval = null;
  mouthOpen = 0;
}

// ========= INIT ========= //
initThree();