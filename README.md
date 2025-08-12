# 🧸 3D AI Teddy Bear - Interactive Web Character

A friendly, cute, and expressive 3D animated teddy bear character that can listen to your voice, respond with natural speech, and show corresponding facial expressions. Built with Three.js and Web Speech APIs for real-time interaction in web browsers.

![Teddy Bear Demo](https://img.shields.io/badge/Status-Ready-green) ![Browser Support](https://img.shields.io/badge/Browser-Chrome%20%7C%20Edge%20%7C%20Safari-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🎨 3D Visual Features
- **Realistic 3D Model**: Detailed teddy bear with soft fur texture and warm colors
- **Animated Expressions**: Smooth blinking, mouth movement, and facial expressions
- **Physical Features**: Red bow tie, soft fur materials, and expressive eyes
- **Interactive Gestures**: Wave, dance, and hand movement animations
- **Responsive Design**: Adapts to different screen sizes and orientations

### 🎤 AI Speech Features
- **Voice Recognition**: Listen to user speech using Web Speech API
- **Natural Responses**: Contextual AI responses with personality
- **Text-to-Speech**: Clear, friendly voice output with emotion
- **Synchronized Animation**: Mouth movement and expressions sync with speech
- **Multiple Interaction Types**: Voice commands, text input, and button controls

### 🎯 Interactive Features
- **Mouse Tracking**: Teddy bear follows your mouse cursor with its eyes
- **Real-time Animation**: Smooth breathing and subtle movements
- **Performance Optimization**: Adaptive quality based on device performance
- **Browser Compatibility**: Works on modern web browsers with fallbacks

## 🚀 Quick Start

### 1. Clone or Download
```bash
git clone <repository-url>
# OR download the files directly
```

### 2. Open in Browser
Simply open `index.html` in a modern web browser:
```bash
# Using a local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000

# OR double-click index.html (basic functionality)
```

### 3. Grant Permissions
- **Microphone Access**: Allow microphone access for voice interaction
- **Audio Playback**: Ensure audio is enabled for speech output

### 4. Start Chatting!
- Click "🎤 Start Listening" to begin voice interaction
- Type in the text box and click "💬 Make Teddy Speak"
- Use animation buttons for manual gestures

## 🎮 How to Use

### Voice Interaction
1. **Start Listening**: Click the microphone button
2. **Speak Clearly**: Say something to the teddy bear
3. **Wait for Response**: The bear will respond with voice and animation
4. **Continue Conversation**: Keep talking naturally!

### Text Interaction
1. **Type Message**: Enter text in the input field
2. **Press Enter** or click "Make Teddy Speak"
3. **Watch Animation**: See synchronized mouth movement

### Manual Controls
- **👋 Wave**: Make teddy wave its hand
- **💃 Dance**: Trigger a dance animation
- **😉 Blink**: Manual blink command

### Conversation Examples
Try saying:
- "Hello teddy bear!" → Greeting response with wave
- "You're so cute!" → Happy expression with dance
- "Can you dance?" → Dance animation
- "Goodbye!" → Farewell message with wave

## 🛠️ Technical Requirements

### Browser Support
| Browser | Voice Recognition | Speech Synthesis | 3D Graphics |
|---------|-------------------|------------------|-------------|
| Chrome 58+ | ✅ Full Support | ✅ Full Support | ✅ WebGL 2.0 |
| Edge 79+ | ✅ Full Support | ✅ Full Support | ✅ WebGL 2.0 |
| Safari 14+ | ❌ Limited | ✅ Full Support | ✅ WebGL 2.0 |
| Firefox 88+ | ❌ Not Supported | ✅ Full Support | ✅ WebGL 2.0 |

### System Requirements
- **CPU**: Modern multi-core processor
- **RAM**: 4GB+ recommended
- **GPU**: Integrated graphics or better
- **Network**: Internet connection for CDN resources

### Dependencies
All dependencies are loaded via CDN:
- **Three.js r128**: 3D graphics and animation
- **dat.GUI**: Debug controls (optional)
- **Web Speech API**: Voice recognition and synthesis

## 🏗️ Project Structure

```
📁 ai-teddy-bear/
├── 📄 index.html          # Main HTML file with UI
├── 📄 teddyBear.js        # 3D model and animation logic
├── 📄 speechManager.js    # Voice recognition and synthesis
├── 📄 app.js              # Main application controller
└── 📄 README.md           # This documentation
```

## 🎨 Customization

### Appearance Modifications
```javascript
// Change teddy bear colors
const customColors = {
    fur: 0x8B4513,      // Brown fur
    bowTie: 0xFF0000,   // Red bow tie
    innerEar: 0xFF69B4  // Pink inner ears
};

// Modify in teddyBear.js createFurMaterial() method
```

### Voice Settings
```javascript
// Adjust speech parameters
speechManager.setVoiceSettings(
    0.9,  // Rate (speed)
    1.1,  // Pitch (higher = cuter)
    0.8   // Volume
);
```

### Animation Timing
```javascript
// Modify blink frequency
// In teddyBear.js startBlinkLoop() method
const nextBlink = Math.random() * 4000 + 2000; // 2-6 seconds
```

## 🔧 Performance Optimization

The application includes several optimization features:

### Automatic Quality Adjustment
- Monitors FPS and adjusts rendering quality
- Reduces pixel ratio on slower devices
- Disables shadows when performance drops

### Manual Optimizations
```javascript
// Disable auto-rotation for better performance
app.enableAutoRotation(false);

// Reduce particle count
// Modify particleCount in app.js createParticles()

// Lower shadow quality
renderer.shadowMap.type = THREE.BasicShadowMap;
```

## 🐛 Troubleshooting

### Common Issues

**❌ "Speech recognition not supported"**
- Use Chrome or Edge browser
- Ensure HTTPS connection (required for microphone access)
- Check browser settings for microphone permissions

**❌ "No audio output"**
- Check system volume settings
- Verify browser audio permissions
- Try a different browser

**❌ "3D model not loading"**
- Check internet connection for CDN resources
- Verify WebGL support: Visit [webglreport.com](https://webglreport.com)
- Update graphics drivers

**❌ "Poor performance"**
- Close other browser tabs
- Reduce browser zoom level
- Check Task Manager for high CPU usage

### Debug Mode
Open browser console (F12) to see detailed logs:
```javascript
// Access the app instance
window.teddyBearApp

// Check speech support
SpeechManager.checkSupport()

// Monitor performance
console.log('FPS:', window.teddyBearApp.fps)
```

## 🤝 Contributing

### Feature Requests
- Additional animations (jump, sit, etc.)
- More conversation topics
- Language support beyond English
- Emotion recognition from voice tone

### Development
```bash
# For development, use a local server
npm install -g live-server
live-server --port=8080
```

## 📜 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **Three.js Community**: For excellent 3D graphics framework
- **Web Speech API**: For making voice interaction possible
- **MDN Web Docs**: For comprehensive API documentation

---

**Made with ❤️ for interactive web experiences**

*For support or questions, please check the troubleshooting section or create an issue.*