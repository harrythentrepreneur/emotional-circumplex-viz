# Emotional Circumplex Visualization

A beautiful, interactive D3.js visualization of emotional states with organic blob effects. Perfect for psychology applications, mood trackers, and emotional intelligence dashboards.

![Emotional Circumplex Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

## ✨ Features

- 🎨 **Beautiful Organic Blobs**: Smooth, organic shapes that represent emotional intensities
- 🌈 **16 Emotions**: Comprehensive emotional spectrum with customizable colors
- ⚡ **Smooth Animations**: D3.js powered transitions and effects
- 🎯 **Interactive**: Click to toggle emotions on/off
- 📱 **Responsive**: Works perfectly on all screen sizes
- 🔧 **Customizable**: Easy to modify colors, intensities, and positions

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/emotional-circumplex-viz.git

# Navigate to the project
cd emotional-circumplex-viz

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the visualization.

### Using in Your Project

1. Copy the component from `src/app/page.tsx`
2. Install required dependencies:
   ```bash
   npm install d3 react
   npm install -D @types/d3  # For TypeScript
   ```
3. Import and use:
   ```tsx
   import EmotionalCircumplex from './EmotionalCircumplex';
   
   <EmotionalCircumplex />
   ```

## 🎨 Customization

### Modifying Emotions

Edit the `EMOTIONS` array in the component:

```typescript
const EMOTIONS = [
  { id: 'joy', name: 'Joy', color: '#FFD700' },
  { id: 'sadness', name: 'Sadness', color: '#00D4FF' },
  // Add or modify emotions here
];
```

### Adjusting Visual Properties

- **Intensity**: Controls the size and brightness (0-1 range)
- **Influence**: Controls the spread of each emotion blob (80-200 range)
- **Colors**: Any valid CSS color value
- **Position**: Automatically calculated based on circular arrangement

## 🛠️ Technical Details

### Built With

- **Next.js 14**: React framework with app router
- **D3.js**: For data visualization and animations
- **TypeScript**: For type safety
- **Canvas API**: For organic blob rendering

### How It Works

1. **Data Processing**: Emotions are positioned in a circle with normalized intensities
2. **Organic Shapes**: Canvas-based rendering with Perlin-noise-like effects
3. **Blend Modes**: Screen blend mode for beautiful color mixing
4. **Animations**: D3.js transitions with custom easing functions

## 📸 Screenshots

The visualization features:
- Organic, flowing emotion blobs
- Percentage indicators for each emotion
- Smooth color blending between overlapping emotions
- Interactive emotion toggles

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

MIT License - feel free to use this in your projects!

## 🙏 Credits

Created with ❤️ using D3.js and Next.js

---

**Live Demo**: [View on GitHub Pages](#)  
**Author**: Your Name  
**Contact**: your.email@example.com