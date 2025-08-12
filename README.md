# 🤖 AI Teddy Bear - Your Friendly 3D Companion

A delightful 3D animated teddy bear character with AI-powered speech capabilities, built with Three.js and Web Speech API. The teddy bear features realistic animations, natural speech recognition, and expressive facial responses.

## ✨ Features

### 🎭 Expressive Animations
- **Realistic blinking** with natural timing
- **Facial expressions** (happy, sad, surprised, neutral)
- **Mouth movement** synchronized with speech
- **Hand gestures** including waving animation
- **Gentle floating** and rotation animations

### 🗣️ AI Speech Capabilities
- **Voice recognition** using Web Speech API
- **Natural text-to-speech** with customizable voice
- **Real-time conversation** with contextual responses
- **Speech-to-expression mapping** for realistic reactions

### 🎨 Beautiful Design
- **Soft, textured fur** with warm brown coloring
- **Charming bow tie** with vibrant red color
- **Realistic lighting** with shadows and ambient glow
- **Responsive design** that works on all devices

### 🎮 Interactive Features
- **Click to wave** - Click anywhere on the teddy to make it wave
- **Orbit controls** - Drag to rotate and zoom around the teddy
- **Real-time status** updates during speech recognition
- **Smooth animations** optimized for 60fps performance

## 🚀 Quick Start

### Prerequisites
- Modern web browser with WebGL support
- Microphone access for speech recognition
- Speakers/headphones for audio output

### Installation

1. **Clone or download** the project files
2. **Navigate** to the project directory
3. **Start a local server** (required for speech recognition):

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

4. **Open your browser** and go to `http://localhost:8000`
5. **Allow microphone access** when prompted
6. **Click "Start Listening"** to begin talking to your teddy bear!

## 🎯 How to Use

### Basic Interaction
1. **Start Listening**: Click the red "Start Listening" button
2. **Speak**: Talk to the teddy bear naturally
3. **Listen**: The teddy will respond with voice and expressions
4. **Stop**: Click "Stop Listening" when done

### Voice Commands
The teddy bear responds to various phrases:

- **"Hello"** or **"Hi"** - Friendly greeting with happy expression
- **"How are you?"** - Status update with cheerful response
- **"Wave"** - Makes the teddy wave its arm
- **"Tell me a joke"** - Shares a teddy bear joke
- **"What's your name?"** - Introduces itself as Teddy
- **"Goodbye"** - Farewell with sad expression

### Interactive Features
- **Click the teddy** to make it wave
- **Drag to rotate** the view around the teddy
- **Scroll to zoom** in and out
- **Watch expressions** change based on conversation

## 🛠️ Technical Details

### Technologies Used
- **Three.js** - 3D graphics and rendering
- **Web Speech API** - Speech recognition and synthesis
- **WebGL** - Hardware-accelerated graphics
- **CSS3** - Modern styling and animations
- **Vanilla JavaScript** - No framework dependencies

### Browser Compatibility
- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ❌ Internet Explorer (not supported)

### Performance Optimization
- **60fps animations** with requestAnimationFrame
- **Efficient 3D rendering** with proper geometry optimization
- **Responsive design** that adapts to screen size
- **Memory management** with proper cleanup

## 🎨 Customization

### Changing Colors
Edit the `teddy-bear.js` file to modify colors:

```javascript
// Change fur color
const furMaterial = new THREE.MeshLambertMaterial({
    color: 0x8B4513, // Brown - change this hex value
    transparent: true,
    opacity: 0.9
});

// Change bow tie color
const bowMaterial = new THREE.MeshLambertMaterial({ 
    color: 0xff6b6b // Red - change this hex value
});
```

### Adding New Expressions
Extend the `setExpression()` method to add new facial expressions:

```javascript
setExpression(expression) {
    switch (expression) {
        case 'your-new-expression':
            this.mouth.scale.y = 0.6;
            this.mouth.scale.x = 1.3;
            break;
        // ... existing cases
    }
}
```

### Custom Voice Responses
Modify the `processSpeech()` method to add new conversation patterns:

```javascript
if (lowerText.includes('your-keyword')) {
    response = 'Your custom response here!';
    expression = 'happy';
}
```

## 🔧 Troubleshooting

### Speech Recognition Issues
- **Ensure HTTPS or localhost** - Speech API requires secure context
- **Check microphone permissions** - Allow access when prompted
- **Try different browsers** - Chrome has the best support
- **Check console errors** - Look for speech recognition errors

### Performance Issues
- **Close other tabs** - Free up system resources
- **Update graphics drivers** - Ensure WebGL support
- **Reduce browser zoom** - High zoom levels can impact performance
- **Disable browser extensions** - Some may interfere with WebGL

### 3D Rendering Problems
- **Check WebGL support** - Visit `get.webgl.org` to test
- **Update browser** - Use the latest version
- **Clear browser cache** - Remove old cached files
- **Try incognito mode** - Disable extensions temporarily

## 🤝 Contributing

Contributions are welcome! Here are some ideas:

- **Add more expressions** and animations
- **Implement advanced AI** responses using external APIs
- **Create different teddy bear** variations
- **Add sound effects** and background music
- **Improve accessibility** features
- **Add mobile touch** controls

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Three.js community** for the amazing 3D library
- **Web Speech API** for speech capabilities
- **Browser vendors** for implementing modern web standards
- **Open source community** for inspiration and tools

---

**Made with ❤️ using Three.js and Web Speech API**

*Enjoy your conversations with Teddy! 🧸*