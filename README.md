# AI Teddy Bear Companion

This project showcases a 3-D animated teddy bear that can talk with visitors in real time using AI-powered speech recognition and synthesis.

## Features

* Cute, friendly teddy bear rendered with **Three.js**.
* Smooth idle animations plus procedural blinking, mouth movement, and hand gestures.
* Voice input via **Web Speech API**.
* AI responses from **OpenAI GPT-3.5-Turbo** (or preset fallback).
* Natural voice output via **SpeechSynthesis API** with synchronized mouth movement.
* Optimised for modern browsers and real-time performance.

## Getting Started

1. **Clone or download** this repository and open `index.html` in a compatible browser (Chrome, Edge, or Safari).
2. **Provide a 3-D model** named `teddy_bear.glb` in the project root.  
   • The model should include _morph targets_ (aka **blend-shapes**) named `Blink` and `MouthOpen`.  
   • Add a simple bow-tie mesh and warm, soft-textured fur material.  
   • Recommended poly-count ≤ 30k triangles and **KTX2**/Basis textures for small file size.
3. **Set your OpenAI key** (optional, but enables smarter answers). Open developer console and run:
   ```js
   localStorage.setItem('OPENAI_API_KEY', 'sk-YOUR_SECRET_KEY');
   ```
   Refresh the page. Without a key, Teddy will reply with a canned greeting.
4. **Click “Speak”** and start chatting!

## Customisation

| Aspect | Where | Notes |
| --- | --- | --- |
| Background gradient | `style.css` | Replace radial colours. |
| Teddy scale/position | `main.js` | Edit `teddy.scale` or `camera.position`. |
| System prompt | `main.js` | Change the `messages` array in `getAIResponse`. |
| Speech voice | `speak()` in `main.js` | Select voice with `speechSynthesis.getVoices()`. |

## File Overview

```text
index.html   – Boilerplate HTML + CDN scripts
style.css    – Responsive layout & button styling
main.js      – Three.js scene, voice pipeline, AI calls
README.md    – This guide
teddy_bear.glb – (user-supplied) 3-D model with animations
```

## Notes & Tips

* Tested with Three.js r158.
* Ensure SSL (https) when deploying if you want microphone access.
* For production use, proxy OpenAI requests through your backend to keep keys private.
* Want richer lipsync? Replace the simple random mouth algorithm with _rhubarb-lip-sync_, viseme data, or [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) amplitude analysis.

## License

MIT © 2023