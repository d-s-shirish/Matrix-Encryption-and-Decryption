# 🤖 AI Teddy Bear Companion

A delightful 3D animated teddy bear character with AI-powered speech capabilities, designed for interactive web experiences. The teddy bear features smooth animations, voice interaction, and a warm, friendly personality.

## ✨ Features

### 🎭 Expressive 3D Character
- **Realistic 3D Model**: Built with Three.js using geometric primitives
- **Smooth Animations**: Blinking, talking, listening, and waving gestures
- **Soft Fur Texture**: Warm brown color with realistic lighting and shadows
- **Fashion Accessory**: Adorable pink bow tie for extra charm

### 🗣️ AI Speech Interaction
- **Voice Recognition**: Listen to user speech input in real-time
- **Text-to-Speech**: Natural voice responses with friendly tone
- **Text Input**: Alternative typing interface for accessibility
- **Smart Responses**: Context-aware AI responses with personality

### 🎨 Beautiful UI/UX
- **Modern Design**: Gradient backgrounds with glassmorphism effects
- **Responsive Layout**: Works perfectly on desktop and mobile devices
- **Real-time Feedback**: Visual indicators for listening and speaking states
- **Conversation History**: Scrollable chat interface with message bubbles

### 🎮 Interactive Controls
- **Voice Controls**: Start/stop listening with button controls
- **Keyboard Support**: Enter key for sending text messages
- **Visual Feedback**: Status indicators and loading animations

## 🚀 Getting Started

### Prerequisites
- Modern web browser with WebGL support
- Microphone access for voice interaction
- Speakers/headphones for audio output

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/ai-teddy-bear-companion.git
   cd ai-teddy-bear-companion
   ```

2. **Start the local server**:
   ```bash
   # Using Python (recommended)
   python -m http.server 8000
   
   # Or using Node.js
   npx serve .
   
   # Or using PHP
   php -S localhost:8000
   ```

3. **Open your browser**:
   Navigate to `http://localhost:8000`

### Usage

1. **Voice Interaction**:
   - Click "Start Listening" to begin voice recognition
   - Speak clearly into your microphone
   - Click "Stop Listening" when finished

2. **Text Interaction**:
   - Type your message in the text input field
   - Press Enter or click "Send" to submit

3. **Conversation Topics**:
   - Greetings: "Hello", "Hi", "Hey"
   - Feelings: "How are you?", "How are you feeling?"
   - Weather: Ask about weather
   - Jokes: "Tell me a joke", "Say something funny"

## 🛠️ Technical Details

### Technologies Used
- **Three.js**: 3D graphics and rendering
- **Web Speech API**: Speech recognition and synthesis
- **Vanilla JavaScript**: Core functionality and animations
- **CSS3**: Modern styling with animations and responsive design
- **HTML5**: Semantic markup and accessibility

### Architecture
```
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and animations
├── teddy-bear.js       # Core JavaScript application
├── package.json        # Project metadata
└── README.md          # Documentation
```

### Key Components

#### TeddyBear Class
- **3D Scene Management**: Three.js scene, camera, and renderer setup
- **Character Creation**: Geometric teddy bear model with materials
- **Animation System**: Blinking, talking, listening, and gesture animations
- **Speech Integration**: Web Speech API for voice interaction
- **AI Response Generation**: Context-aware conversation responses

#### Animation System
- **Blinking**: Periodic eye scaling animation
- **Talking**: Mouth scaling during speech synthesis
- **Listening**: Gentle head rotation during voice recognition
- **Waving**: Arm rotation for gesture animations
- **Floating**: Subtle body movement for liveliness

#### Speech Features
- **Recognition**: Real-time speech-to-text conversion
- **Synthesis**: Natural voice output with friendly tone
- **Voice Selection**: Automatic friendly voice detection
- **Error Handling**: Graceful fallbacks for unsupported browsers

## 🎨 Customization

### Modifying the Teddy Bear
- **Colors**: Change material colors in `createTeddyBear()`
- **Size**: Adjust geometry parameters for different proportions
- **Accessories**: Add or modify the bow tie and other features
- **Animations**: Customize animation timing and effects

### Styling Changes
- **Colors**: Modify CSS custom properties for theme changes
- **Layout**: Adjust grid and flexbox properties for different layouts
- **Animations**: Customize CSS keyframes for different effects

### AI Responses
- **Personality**: Modify response arrays in `generateResponse()`
- **Topics**: Add new conversation categories and responses
- **Language**: Change speech recognition language settings

## 🌐 Browser Compatibility

### Supported Browsers
- ✅ Chrome 66+ (Full support)
- ✅ Firefox 60+ (Full support)
- ✅ Safari 14+ (Full support)
- ✅ Edge 79+ (Full support)

### Features by Browser
- **Speech Recognition**: Chrome, Firefox, Safari, Edge
- **Speech Synthesis**: All modern browsers
- **WebGL**: All modern browsers
- **CSS Grid/Flexbox**: All modern browsers

## 🔧 Troubleshooting

### Common Issues

1. **Speech Recognition Not Working**:
   - Ensure microphone permissions are granted
   - Check browser compatibility
   - Try refreshing the page

2. **3D Model Not Displaying**:
   - Verify WebGL support in your browser
   - Check console for JavaScript errors
   - Ensure Three.js is loading correctly

3. **Audio Not Playing**:
   - Check speaker/headphone connections
   - Verify browser audio permissions
   - Try different voice options

### Performance Optimization
- **Mobile Devices**: Reduced animation complexity for better performance
- **Low-end PCs**: Simplified lighting and shadows
- **Network**: CDN-hosted Three.js for faster loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js Community**: For the amazing 3D graphics library
- **Web Speech API**: For enabling voice interaction
- **CSS Community**: For modern styling techniques
- **Open Source Community**: For inspiration and support

## 📞 Support

If you encounter any issues or have questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review browser compatibility requirements

---

**Made with ❤️ for interactive web experiences**