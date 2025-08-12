import './style.css'
import * as THREE from 'three'

// Basic renderer and scene setup
const canvas = document.getElementById('scene') as HTMLCanvasElement
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace

const scene = new THREE.Scene()
scene.background = null

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 100)
camera.position.set(0, 1.2, 3.2)

const ambient = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambient)

const keyLight = new THREE.DirectionalLight(0xfff0e0, 1.2)
keyLight.position.set(2, 4, 3)
keyLight.castShadow = false
scene.add(keyLight)

const rimLight = new THREE.DirectionalLight(0x99c2ff, 0.6)
rimLight.position.set(-3, 3, -2)
scene.add(rimLight)

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.ShadowMaterial({ opacity: 0.12 })
)
floor.rotation.x = -Math.PI / 2
floor.position.y = -0.01
floor.receiveShadow = true
// Not adding to scene to keep transparent bg by default

function createFurMaterial(color: number) {
  // Soft, warm velvet-like material using matcap-ish lighting
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.9,
    metalness: 0.0,
  })
  mat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <output_fragment>',
      `#include <output_fragment>
       // Slight warm AO tint
       float aoTint = clamp(0.7 + 0.3 * dot(normalize(vNormal), vec3(0.0,1.0,0.0)), 0.0, 1.0);
       outgoingLight *= mix(vec3(1.0), vec3(1.02, 0.98, 0.96), aoTint);
      `
    )
  }
  return mat
}

class TeddyBear {
  group: THREE.Group
  head: THREE.Group
  leftEyeLid: THREE.Mesh
  rightEyeLid: THREE.Mesh
  mouth: THREE.Mesh
  leftArm: THREE.Group
  rightArm: THREE.Group
  jaw: THREE.Group
  eyeBlinkTimer = 0
  mouthOpen = 0
  mouthTarget = 0
  gestureTimer = 0
  bow: THREE.Mesh

  constructor() {
    this.group = new THREE.Group()
    this.group.position.set(0, 0, 0)

    const fur = createFurMaterial(0x9b6e4a) // warm soft brown
    const innerFur = new THREE.MeshStandardMaterial({ color: 0xdec2a3, roughness: 0.8 })
    const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3 })
    const bowMat = new THREE.MeshStandardMaterial({ color: 0xe94d9b, roughness: 0.5 })

    // Body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.75, 48, 32), fur)
    body.scale.set(1, 1.15, 0.9)
    body.castShadow = true
    this.group.add(body)

    // Belly patch
    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 24), innerFur)
    belly.position.set(0, -0.05, 0.52)
    belly.scale.set(1, 1.1, 0.35)
    body.add(belly)

    // Head
    this.head = new THREE.Group()
    this.head.position.set(0, 1.05, 0)
    this.group.add(this.head)

    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.55, 48, 32), fur)
    headMesh.castShadow = true
    this.head.add(headMesh)

    // Ears
    const earGeom = new THREE.SphereGeometry(0.25, 32, 24)
    const earInnerGeom = new THREE.SphereGeometry(0.16, 24, 18)

    const leftEar = new THREE.Mesh(earGeom, fur)
    leftEar.position.set(0.35, 0.42, -0.05)
    leftEar.scale.set(0.85, 0.8, 0.85)
    const leftEarInner = new THREE.Mesh(earInnerGeom, innerFur)
    leftEarInner.position.set(0.02, 0, 0.12)
    leftEar.add(leftEarInner)

    const rightEar = new THREE.Mesh(earGeom, fur)
    rightEar.position.set(-0.35, 0.42, -0.05)
    rightEar.scale.set(0.85, 0.8, 0.85)
    const rightEarInner = new THREE.Mesh(earInnerGeom, innerFur)
    rightEarInner.position.set(-0.02, 0, 0.12)
    rightEar.add(rightEarInner)

    this.head.add(leftEar, rightEar)

    // Eyes and lids
    const eyeGroupL = new THREE.Group()
    const eyeGroupR = new THREE.Group()
    const eyeGeom = new THREE.SphereGeometry(0.07, 24, 16)
    const pupilGeom = new THREE.SphereGeometry(0.04, 24, 16)

    const leftEye = new THREE.Mesh(eyeGeom, eyeWhite)
    const rightEye = new THREE.Mesh(eyeGeom, eyeWhite)
    leftEye.position.set(0.18, 0.07, 0.48)
    rightEye.position.set(-0.18, 0.07, 0.48)

    const leftPupil = new THREE.Mesh(pupilGeom, pupilMat)
    const rightPupil = new THREE.Mesh(pupilGeom, pupilMat)
    leftPupil.position.set(0, 0, 0.08)
    rightPupil.position.set(0, 0, 0.08)

    eyeGroupL.position.set(0.18, 0.07, 0.4)
    eyeGroupR.position.set(-0.18, 0.07, 0.4)
    eyeGroupL.add(leftEye, leftPupil)
    eyeGroupR.add(rightEye, rightPupil)

    // Lids as thin capsules
    const lidGeom = new THREE.CapsuleGeometry(0.09, 0.02, 6, 12)
    this.leftEyeLid = new THREE.Mesh(lidGeom, fur)
    this.rightEyeLid = new THREE.Mesh(lidGeom, fur)
    this.leftEyeLid.position.set(0.18, 0.12, 0.47)
    this.rightEyeLid.position.set(-0.18, 0.12, 0.47)
    this.leftEyeLid.rotation.x = Math.PI * 0.08
    this.rightEyeLid.rotation.x = Math.PI * 0.08

    this.head.add(eyeGroupL, eyeGroupR, this.leftEyeLid, this.rightEyeLid)

    // Snout and nose
    const snout = new THREE.Mesh(new THREE.SphereGeometry(0.23, 32, 24), innerFur)
    snout.position.set(0, -0.03, 0.47)
    snout.scale.set(1, 0.8, 0.6)
    this.head.add(snout)

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.08, 24, 16), new THREE.MeshStandardMaterial({ color: 0x332b2b, roughness: 0.3 }))
    nose.position.set(0, 0.03, 0.63)
    this.head.add(nose)

    // Mouth/jaw
    this.jaw = new THREE.Group()
    this.jaw.position.set(0, -0.12, 0.35)
    const lowerLip = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 16), innerFur)
    lowerLip.scale.set(1.0, 0.5, 0.5)
    lowerLip.position.set(0, -0.02, 0.15)
    this.mouth = lowerLip
    this.jaw.add(lowerLip)
    this.head.add(this.jaw)

    // Arms
    const armGeom = new THREE.SphereGeometry(0.24, 32, 24)
    this.leftArm = new THREE.Group()
    const leftArmMesh = new THREE.Mesh(armGeom, fur)
    leftArmMesh.scale.set(0.8, 1.1, 0.8)
    leftArmMesh.castShadow = true
    this.leftArm.add(leftArmMesh)
    this.leftArm.position.set(0.62, 0.35, 0)
    this.leftArm.rotation.z = -0.8

    this.rightArm = new THREE.Group()
    const rightArmMesh = new THREE.Mesh(armGeom, fur)
    rightArmMesh.scale.set(0.8, 1.1, 0.8)
    rightArmMesh.castShadow = true
    this.rightArm.add(rightArmMesh)
    this.rightArm.position.set(-0.62, 0.35, 0)
    this.rightArm.rotation.z = 0.8

    this.group.add(this.leftArm, this.rightArm)

    // Bow tie
    const bowGeom = new THREE.CapsuleGeometry(0.12, 0.04, 8, 16)
    const bowLeft = new THREE.Mesh(bowGeom, bowMat)
    const bowRight = new THREE.Mesh(bowGeom, bowMat)
    bowLeft.position.set(0.08, 0.55, 0.45)
    bowRight.position.set(-0.08, 0.55, 0.45)
    bowLeft.rotation.z = Math.PI * 0.2
    bowRight.rotation.z = -Math.PI * 0.2
    const bowKnot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), bowMat)
    bowKnot.position.set(0, 0.55, 0.47)
    this.bow = bowKnot
    this.group.add(bowLeft, bowRight, bowKnot)
  }

  update(delta: number) {
    // Subtle idle motion
    this.group.position.y = Math.sin(performance.now() * 0.0015) * 0.02
    this.head.rotation.y = Math.sin(performance.now() * 0.001) * 0.08

    // Eye blink auto
    this.eyeBlinkTimer -= delta
    if (this.eyeBlinkTimer <= 0) {
      // trigger blink
      const phase = (performance.now() * 0.02) % 1
      const blink = Math.sin(phase * Math.PI)
      const amount = Math.pow(blink, 3)
      this.leftEyeLid.position.y = 0.12 - amount * 0.11
      this.rightEyeLid.position.y = 0.12 - amount * 0.11
      if (phase > 0.95) this.eyeBlinkTimer = 1.8 + Math.random() * 2.2
    }

    // Mouth animation towards target
    this.mouthOpen += (this.mouthTarget - this.mouthOpen) * Math.min(1, delta * 10)
    this.jaw.rotation.x = -this.mouthOpen * 0.6

    // Hand gesture loop
    this.gestureTimer += delta
    const gesture = Math.sin(this.gestureTimer * 1.2) * 0.5 + 0.5
    this.leftArm.rotation.x = -0.2 + gesture * 0.25
    this.rightArm.rotation.x = -0.1 + (1 - gesture) * 0.2
  }

  setTalkingIntensity(intensity: number) {
    // intensity in [0,1]
    this.mouthTarget = THREE.MathUtils.clamp(intensity, 0, 1)
  }
}

const bear = new TeddyBear()
scene.add(bear.group)

// Simple responsive handling
function onResize() {
  const w = window.innerWidth
  const h = window.innerHeight
  renderer.setSize(w, h)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', onResize)

// Animation loop with amplitude smoothing for speech viseme
let lastTime = performance.now()
function animate() {
  const now = performance.now()
  const delta = Math.min(0.05, (now - lastTime) / 1000)
  lastTime = now

  bear.update(delta)
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
requestAnimationFrame(animate)

// ---- Speech I/O integration ----
const listenBtn = document.getElementById('listenBtn') as HTMLButtonElement
const speakBtn = document.getElementById('speakBtn') as HTMLButtonElement
const textInput = document.getElementById('textInput') as HTMLInputElement
const statusEl = document.getElementById('status') as HTMLSpanElement

const OPENAI_KEY = (import.meta as any).env?.VITE_OPENAI_API_KEY as string | undefined

let isRecognizing = false
let recognition: any = null
const SpeechRecognition: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition

if (SpeechRecognition) {
  recognition = new SpeechRecognition()
  recognition.lang = 'en-US'
  recognition.interimResults = true
  recognition.continuous = true

  recognition.onstart = () => {
    isRecognizing = true
    statusEl.textContent = 'Listening...'
  }
  recognition.onend = () => {
    isRecognizing = false
    statusEl.textContent = ''
  }
  recognition.onresult = (event: any) => {
    let transcript = ''
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript
    }
    statusEl.textContent = transcript
    textInput.value = transcript
  }

  // Hold-to-talk behavior with keyboard fallback
  const startRec = () => { if (!isRecognizing) recognition.start() }
  const stopRec = () => { if (isRecognizing) recognition.stop() }
  listenBtn.addEventListener('pointerdown', startRec)
  listenBtn.addEventListener('pointerup', stopRec)
  listenBtn.addEventListener('keydown', (e) => { if (e.code === 'Space' || e.code === 'Enter') startRec() })
  listenBtn.addEventListener('keyup', (e) => { if (e.code === 'Space' || e.code === 'Enter') stopRec() })
} else {
  listenBtn.disabled = true
  listenBtn.title = 'Speech recognition not supported in this browser.'
}

// Speech synthesis with mouth sync via audio amplitude
let synthUtterance: SpeechSynthesisUtterance | null = null

function speak(text: string) {
  if (!('speechSynthesis' in window)) {
    statusEl.textContent = 'Speech synthesis not supported.'
    return
  }

  if (synthUtterance) {
    window.speechSynthesis.cancel()
    synthUtterance = null
  }

  synthUtterance = new SpeechSynthesisUtterance(text)
  synthUtterance.lang = 'en-US'
  synthUtterance.rate = 1.0
  synthUtterance.pitch = 1.05

  // Prefer a natural English voice if available
  const pickVoice = () => {
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v => /en-US|en_GB/.test(v.lang) && /Natural|Neural|WaveNet|Jenny|Matthew|Alloy|Nova/i.test(v.name))
    return preferred || voices.find(v => /en/i.test(v.lang)) || null
  }
  const setVoice = () => {
    const v = pickVoice()
    if (v) synthUtterance!.voice = v
  }
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = setVoice
  } else {
    setVoice()
  }

  // Track viseme-like intensity by faking a rhythm using boundary and char events
  let intensity = 0
  let decay = 0.85
  const tick = () => {
    intensity *= decay
    bear.setTalkingIntensity(intensity)
    if (synthUtterance) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)

  synthUtterance.onstart = () => {
    statusEl.textContent = 'Speaking...'
  }
  synthUtterance.onend = () => {
    statusEl.textContent = ''
    bear.setTalkingIntensity(0)
    synthUtterance = null
  }
  synthUtterance.onpause = () => bear.setTalkingIntensity(0)
  synthUtterance.onresume = () => { /* keep anim loop running */ }

  // Boost intensity on word/char boundaries to simulate mouth movement
  ;(synthUtterance as any).onboundary = () => { intensity = 1 }

  window.speechSynthesis.speak(synthUtterance)
}

speakBtn.addEventListener('click', () => {
  const text = textInput.value.trim() || 'Hi there! I am your friendly teddy bear. How can I help you today?'
  speak(text)
})

// AI response on release if API key provided; fallback to canned response
async function aiRespond(prompt: string) {
  if (!OPENAI_KEY) {
    speak(`You said: ${prompt}. I am happy to chat!`)
    return
  }
  try {
    statusEl.textContent = 'Thinking...'
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a friendly, cute teddy bear. Keep responses short and warm.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 120
      })
    })
    const data = await response.json()
    const text = data.choices?.[0]?.message?.content?.trim() || 'Hello!'
    speak(text)
  } catch (e) {
    console.error(e)
    speak('Sorry, I had trouble thinking of a response.')
  } finally {
    statusEl.textContent = ''
  }
}

if (recognition) {
  listenBtn.addEventListener('pointerup', () => {
    const text = (textInput.value || '').trim()
    if (text) {
      aiRespond(text)
    }
  })
}
