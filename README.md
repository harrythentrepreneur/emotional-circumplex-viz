# Emotional Circumplex Visualization

Hey! I created this beautiful circumplex graph visualization and wanted to share it with others. It's an interactive D3.js visualization that displays emotions as organic, flowing blobs that blend together beautifully. I originally built this for a personal project and thought others might find it useful or inspiring for their own work.

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
git clone https://github.com/harrythentrepreneur/emotional-circumplex-viz.git

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

## 🙏 Why I Made This

I was working on analyzing emotional patterns and wanted a beautiful way to visualize the complex relationships between different emotions. The organic blob effect creates a really unique aesthetic that I haven't seen in other emotion visualizations. Feel free to use this in your own projects - I'd love to see what you create with it!

---

**Created by**: Harry Edwards  
**Feel free to reach out if you have questions or want to share what you built!**
