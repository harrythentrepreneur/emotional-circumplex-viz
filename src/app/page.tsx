'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';

// Type definitions
interface CircumplexDataItem {
  id: string;
  name: string;
  color: string;
  basePosition: { x: number; y: number };
  angle: number;
  intensity: number;
  influence: number;
}

// Emotion data
const EMOTIONS = [
  { id: 'fear', name: 'Fear', color: '#8B5CF6' },
  { id: 'joy', name: 'Joy', color: '#FFD700' },
  { id: 'sadness', name: 'Sadness', color: '#00D4FF' },
  { id: 'surprise', name: 'Surprise', color: '#F59E0B' },
  { id: 'anger', name: 'Anger', color: '#FF4757' },
  { id: 'disgust', name: 'Disgust', color: '#10B981' },
  { id: 'anticipation', name: 'Anticipation', color: '#9D4EDD' },
  { id: 'trust', name: 'Trust', color: '#06D6A0' },
  { id: 'love', name: 'Love', color: '#FF6B9D' },
  { id: 'confusion', name: 'Confusion', color: '#FB8500' },
  { id: 'excitement', name: 'Excitement', color: '#FF006E' },
  { id: 'calm', name: 'Calm', color: '#4ECDC4' },
  { id: 'hope', name: 'Hope', color: '#45B7D1' },
  { id: 'frustration', name: 'Frustration', color: '#E74C3C' },
  { id: 'gratitude', name: 'Gratitude', color: '#F39C12' },
  { id: 'compassion', name: 'Compassion', color: '#A855F7' }
];

// Default active emotions
const DEFAULT_ACTIVE_EMOTIONS = ['joy', 'sadness', 'anger', 'love'];

export default function EmotionalCircumplex() {
  const d3Container = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 900 });
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [activeEmotions, setActiveEmotions] = useState<string[]>(DEFAULT_ACTIVE_EMOTIONS);

  // Generate circumplex data
  const circumplexData = useMemo(() => {
    const activeItemsList = EMOTIONS.filter(e => activeEmotions.includes(e.id));
    
    return activeItemsList.map((item, index) => {
      const seed = item.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      const pseudoRandom1 = ((seed * 9301 + 49297) % 233280) / 233280;
      const pseudoRandom2 = ((seed * 17 + 23) % 100) / 100;
      const normalizedIntensity = 0.3 + (pseudoRandom1 * 0.4);

      return {
        ...item,
        basePosition: {
          x: Math.cos(index * 2 * Math.PI / activeItemsList.length),
          y: Math.sin(index * 2 * Math.PI / activeItemsList.length)
        },
        angle: index * 360 / activeItemsList.length,
        intensity: normalizedIntensity,
        influence: 80 + (pseudoRandom2 * 120)
      };
    });
  }, [activeEmotions]);

  const handleCopyCode = () => {
    const code = `// Copy the full component code from the repository
// https://github.com/yourusername/emotional-circumplex-viz`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const drawLayeredEmotions = useCallback(() => {
    if (!d3Container.current) return;

    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;
    
    const labelMargin = 120;
    const availableRadius = Math.min(width, height) / 2 - labelMargin;
    const baseRadius = Math.max(200, availableRadius);

    const container = d3.select(d3Container.current);
    container.select('svg').remove();

    const svg = d3.select(d3Container.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('overflow', 'visible')
      .style('background', 'transparent')
      .style('overflow', 'visible');

    const defs = svg.append('defs');

    // Create glow filter
    const glowFilter = defs.append('filter')
      .attr('id', 'emotion-glow')
      .attr('x', '-100%')
      .attr('y', '-100%')
      .attr('width', '300%')
      .attr('height', '300%');

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '15')
      .attr('result', 'coloredBlur');

    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Create inner glow filter
    const innerGlowFilter = defs.append('filter')
      .attr('id', 'inner-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    innerGlowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '8')
      .attr('result', 'innerBlur');

    const g = svg.append('g')
      .attr('transform', `translate(${centerX},${centerY})`);

    // Create emotion layer function
    const createEmotionLayer = (item: CircumplexDataItem) => {
      const canvas = document.createElement('canvas');
      const resolution = 400;
      canvas.width = resolution;
      canvas.height = resolution;
      const ctx = canvas.getContext('2d')!;
      
      const imageData = ctx.createImageData(resolution, resolution);
      const canvasData = imageData.data;

      const intensityBoost = Math.pow(item.intensity, 0.7);
      const expansionFactor = 0.6 + (intensityBoost * 0.8);
      const centerPull = (1 - intensityBoost) * 0.3;
      const baseDistance = resolution * 0.3 * expansionFactor;
      
      const itemCenter = {
        x: item.basePosition.x * baseDistance * (1 - centerPull),
        y: item.basePosition.y * baseDistance * (1 - centerPull),
        effectiveRadius: item.influence * intensityBoost * 1.2,
        maxIntensity: item.intensity
      };

      const getOrganicRadius = (angle: number, baseRadius: number, item: CircumplexDataItem) => {
        const itemSeed = item.id.charCodeAt(0) * 0.1;
        const noise1 = Math.sin(angle * 4 + itemSeed) * 0.2;
        const noise2 = Math.sin(angle * 8 + itemSeed + 1) * 0.1;
        const noise3 = Math.sin(angle * 16 + itemSeed + 2) * 0.05;
        
        const intensityFactor = 1 + (item.intensity * 0.4);
        return baseRadius * intensityFactor * (1 + noise1 + noise2 + noise3);
      };

      const maxDistance = resolution * 0.4;

      for (let x = 0; x < resolution; x++) {
        for (let y = 0; y < resolution; y++) {
          const px = x - resolution / 2;
          const py = y - resolution / 2;
          const distanceFromCenter = Math.sqrt(px * px + py * py);
          
          if (distanceFromCenter > maxDistance) {
            const pixelIndex = (y * resolution + x) * 4;
            canvasData[pixelIndex] = 0;
            canvasData[pixelIndex + 1] = 0;
            canvasData[pixelIndex + 2] = 0;
            canvasData[pixelIndex + 3] = 0;
            continue;
          }

          const dx = px - itemCenter.x;
          const dy = py - itemCenter.y;
          const itemDistance = Math.sqrt(dx * dx + dy * dy);

          const angleToCenter = Math.atan2(dy, dx);
          const organicRadius = getOrganicRadius(angleToCenter, itemCenter.effectiveRadius, item);

          let pixelIntensity = 0;
          if (itemDistance < organicRadius) {
            const normalizedDistance = itemDistance / organicRadius;
            pixelIntensity = Math.pow(1 - normalizedDistance, 1.5) * itemCenter.maxIntensity;
            
            const textureAngle = Math.atan2(py, px);
            const texture = (Math.sin(textureAngle * 6) + Math.sin(textureAngle * 13)) * 0.1 + 1;
            pixelIntensity *= Math.max(0.3, texture);
          }

          const globalFalloff = 1 - Math.pow(distanceFromCenter / maxDistance, 1.8);
          pixelIntensity *= Math.max(0, globalFalloff);

          if (pixelIntensity > 0.05) {
            const itemColor = d3.color(item.color)!.rgb();
            const alpha = Math.min(255, pixelIntensity * 255 * 0.8);

            const pixelIndex = (y * resolution + x) * 4;
            canvasData[pixelIndex] = itemColor.r;
            canvasData[pixelIndex + 1] = itemColor.g;
            canvasData[pixelIndex + 2] = itemColor.b;
            canvasData[pixelIndex + 3] = alpha;
          } else {
            const pixelIndex = (y * resolution + x) * 4;
            canvasData[pixelIndex] = 0;
            canvasData[pixelIndex + 1] = 0;
            canvasData[pixelIndex + 2] = 0;
            canvasData[pixelIndex + 3] = 0;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL();
    };

    // Draw emotion layers
    circumplexData.forEach((item, index) => {
      const layerDataURL = createEmotionLayer(item);
      
      const pattern = defs.append('pattern')
        .attr('id', `emotion-layer-${item.id}`)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', baseRadius * 2.5)
        .attr('height', baseRadius * 2.5)
        .attr('x', -baseRadius * 1.25)
        .attr('y', -baseRadius * 1.25);

      pattern.append('image')
        .attr('href', layerDataURL)
        .attr('width', baseRadius * 2.5)
        .attr('height', baseRadius * 2.5);

      const emotionLayer = g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 0)
        .style('fill', `url(#emotion-layer-${item.id})`)
        .style('opacity', 0)
        .style('mix-blend-mode', index === 0 ? 'normal' : 'screen')
        .style('filter', 'url(#emotion-glow)');

      emotionLayer
        .transition()
        .delay(500 + index * 300)
        .duration(1500 + index * 200)
        .ease(d3.easeBackOut.overshoot(1.1))
        .attr('r', baseRadius * 1.2)
        .style('opacity', 0.7 + (item.intensity * 0.3));
    });

    // Add labels
    const maxIntensityExtension = Math.max(...circumplexData.map(d => d.intensity * 30));
    const labelRadius = baseRadius + 60;
    const maxLabelDistance = labelRadius + maxIntensityExtension;
    
    const safeMaxDistance = Math.min(maxLabelDistance, (Math.min(width, height) / 2) - 60);
    const safetyRatio = maxLabelDistance > safeMaxDistance ? safeMaxDistance / maxLabelDistance : 1;

    const labels = g.selectAll('.emotion-label')
      .data(circumplexData)
      .enter()
      .append('g')
      .attr('class', 'emotion-label')
      .attr('transform', (d: CircumplexDataItem) => {
        const intensityBoost = Math.pow(d.intensity, 0.7);
        const expansionFactor = 0.6 + (intensityBoost * 0.8);
        const centerPull = (1 - intensityBoost) * 0.3;
        const baseDistance = baseRadius * 0.3 * expansionFactor;
        
        const emotionCenterX = d.basePosition.x * baseDistance * (1 - centerPull);
        const emotionCenterY = d.basePosition.y * baseDistance * (1 - centerPull);
        
        const distanceFromCenter = Math.sqrt(emotionCenterX * emotionCenterX + emotionCenterY * emotionCenterY);
        
        const labelDistance = distanceFromCenter + (labelRadius * 0.8) + (d.intensity * 30);
        const safeLabelDistance = labelDistance * safetyRatio;
        
        if (distanceFromCenter > 0) {
          const directionX = emotionCenterX / distanceFromCenter;
          const directionY = emotionCenterY / distanceFromCenter;
          
          const x = directionX * safeLabelDistance;
          const y = directionY * safeLabelDistance;
          
          return `translate(${x},${y})`;
        } else {
          const angle = d.angle * (Math.PI / 180);
          const x = Math.cos(angle - Math.PI/2) * safeLabelDistance;
          const y = Math.sin(angle - Math.PI/2) * safeLabelDistance;
          return `translate(${x},${y})`;
        }
      });

    const circleRadius = (d: CircumplexDataItem) => 12 + d.intensity * 18;
    
    // Add circles with percentage
    labels.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 0)
      .style('fill', (d: CircumplexDataItem) => d.color)
      .style('opacity', 0)
      .style('stroke', 'rgba(255, 255, 255, 0.3)')
      .style('stroke-width', 1)
      .style('filter', 'url(#inner-glow)')
      .transition()
      .delay((d: CircumplexDataItem, i: number) => 2000 + i * 200)
      .duration(1000)
      .ease(d3.easeBounceOut)
      .attr('r', circleRadius)
      .style('opacity', (d: CircumplexDataItem) => 0.85 + d.intensity * 0.15);

    // Add percentage text
    labels.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('y', 0)
      .style('fill', '#1A1A2E')
      .style('font-family', "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif")
      .style('font-size', (d: CircumplexDataItem) => `${10 + d.intensity * 3}px`)
      .style('font-weight', '700')
      .style('opacity', 0)
      .style('letter-spacing', '0.5px')
      .text((d: CircumplexDataItem) => `${Math.round(d.intensity * 100)}%`)
      .transition()
      .delay((d: CircumplexDataItem, i: number) => 2300 + i * 150)
      .duration(800)
      .style('opacity', 1);

    // Add emotion name text
    labels.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('y', (d: CircumplexDataItem) => -(circleRadius(d) + 16))
      .style('fill', '#F0F0F0')
      .style('font-family', "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif")
      .style('font-size', (d: CircumplexDataItem) => `${14 + d.intensity * 2}px`)
      .style('font-weight', (d: CircumplexDataItem) => d.intensity > 0.6 ? '500' : '400')
      .style('opacity', 0)
      .style('letter-spacing', '0.5px')
      .text((d: CircumplexDataItem) => d.name)
      .transition()
      .delay((d: CircumplexDataItem, i: number) => 2500 + i * 150)
      .duration(1000)
      .style('opacity', (d: CircumplexDataItem) => 0.9 + d.intensity * 0.1);

  }, [circumplexData, dimensions]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (d3Container.current) {
        const containerWidth = d3Container.current.clientWidth;
        const newSize = Math.max(850, Math.min(1300, containerWidth));
        setDimensions({
          width: newSize,
          height: newSize
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (d3Container.current) {
      resizeObserver.observe(d3Container.current);
      handleResize();
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    drawLayeredEmotions();
  }, [dimensions, drawLayeredEmotions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (d3Container.current) {
        const container = d3.select(d3Container.current);
        container.select('svg').remove();
      }
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1A1A2E',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
          }}>
            Emotional Circumplex
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1.25rem',
            fontFamily: "'Inter', sans-serif"
          }}>
            Beautiful D3.js visualization with organic emotion blobs
          </p>
        </div>

        {/* Controls */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '3rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            color: '#FFD700',
            marginBottom: '1.5rem',
            fontFamily: "'Inter', sans-serif"
          }}>
            Select Emotions to Display
          </h2>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            {EMOTIONS.map(emotion => (
              <button
                key={emotion.id}
                onClick={() => {
                  if (activeEmotions.includes(emotion.id)) {
                    if (activeEmotions.length > 1) {
                      setActiveEmotions(activeEmotions.filter(e => e !== emotion.id));
                    }
                  } else {
                    setActiveEmotions([...activeEmotions, emotion.id]);
                  }
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: activeEmotions.includes(emotion.id) ? emotion.color : 'rgba(255, 255, 255, 0.1)',
                  border: `2px solid ${emotion.color}`,
                  borderRadius: '8px',
                  color: activeEmotions.includes(emotion.id) ? '#1A1A2E' : '#F0F0F0',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                {emotion.name}
              </button>
            ))}
          </div>
        </div>

        {/* Visualization */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '3rem',
          overflow: 'visible'
        }}>
          <div style={{
            position: 'relative',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(48px)',
            borderRadius: '24px',
            padding: '64px',
            overflow: 'visible',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), transparent, rgba(0, 0, 0, 0.2))',
              borderRadius: '24px',
              pointerEvents: 'none'
            }}></div>
            
            <div 
              ref={d3Container} 
              style={{ 
                position: 'relative',
                width: dimensions.width, 
                height: dimensions.height,
                minWidth: dimensions.width,
                minHeight: dimensions.height,
                overflow: 'visible'
              }}
            />
          </div>
        </div>

        {/* Info Section */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{
            color: '#4ECDC4',
            marginBottom: '1rem',
            fontSize: '1.5rem',
            fontFamily: "'Inter', sans-serif"
          }}>
            About This Visualization
          </h3>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '1.8',
            fontFamily: "'Inter', sans-serif"
          }}>
            This emotional circumplex visualization uses organic blob shapes to represent emotional states and their intensities. 
            Each emotion is positioned in a circular arrangement, with overlapping areas showing emotional blending through 
            screen blend modes. The visualization is built with D3.js for smooth animations and Canvas API for organic shape rendering.
          </p>
        </div>
      </div>
    </div>
  );
}