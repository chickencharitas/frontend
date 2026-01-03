import React, { useEffect, useRef, useState } from 'react';
import { Box, keyframes } from '@mui/material';

// CSS Keyframe Animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const pulseAnimation = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const riseAnimation = keyframes`
  0% { transform: translateY(100%) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
`;

const driftAnimation = keyframes`
  0% { transform: translateX(-100px) translateY(0); opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0.8; }
  100% { transform: translateX(calc(100vw + 100px)) translateY(-50px); opacity: 0; }
`;

const sparkleAnimation = keyframes`
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
`;

const waveAnimation = keyframes`
  0% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(-25%) translateY(-5%); }
  100% { transform: translateX(-50%) translateY(0); }
`;

const glowAnimation = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.3); }
  50% { box-shadow: 0 0 40px rgba(255,215,0,0.6); }
`;

// Particle System Component
export const ParticleSystem = ({ 
  type = 'dust', 
  count = 30, 
  color = 'rgba(255,255,255,0.5)',
  speed = 'normal'
}) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: speed === 'slow' ? 15 + Math.random() * 10 : speed === 'fast' ? 5 + Math.random() * 5 : 8 + Math.random() * 7,
    size: type === 'snow' ? 4 + Math.random() * 6 : type === 'dust' ? 2 + Math.random() * 3 : 3 + Math.random() * 4
  }));

  const getParticleStyle = (particle) => {
    const baseStyle = {
      position: 'absolute',
      left: `${particle.left}%`,
      width: particle.size,
      height: particle.size,
      backgroundColor: color,
      borderRadius: '50%',
      animation: `${riseAnimation} ${particle.duration}s linear ${particle.delay}s infinite`,
      pointerEvents: 'none'
    };

    if (type === 'snow') {
      return { ...baseStyle, filter: 'blur(1px)' };
    }
    if (type === 'sparkle') {
      return { 
        ...baseStyle, 
        animation: `${sparkleAnimation} ${2 + Math.random() * 2}s ease-in-out ${particle.delay}s infinite`,
        boxShadow: `0 0 ${particle.size * 2}px ${color}`
      };
    }
    if (type === 'firefly') {
      return {
        ...baseStyle,
        backgroundColor: '#ffff00',
        boxShadow: '0 0 10px #ffff00, 0 0 20px #ffaa00',
        animation: `${pulseAnimation} ${3 + Math.random() * 2}s ease-in-out ${particle.delay}s infinite`
      };
    }
    return baseStyle;
  };

  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map(particle => (
        <Box key={particle.id} sx={getParticleStyle(particle)} />
      ))}
    </Box>
  );
};

// Light Rays Component
export const LightRays = ({ color = 'rgba(255,215,0,0.15)', count = 5, direction = 'top' }) => {
  const rays = Array.from({ length: count }, (_, i) => ({
    id: i,
    width: 10 + Math.random() * 20,
    left: (100 / count) * i + Math.random() * 10,
    opacity: 0.1 + Math.random() * 0.2,
    delay: Math.random() * 3
  }));

  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {rays.map(ray => (
        <Box
          key={ray.id}
          sx={{
            position: 'absolute',
            left: `${ray.left}%`,
            top: direction === 'top' ? 0 : 'auto',
            bottom: direction === 'bottom' ? 0 : 'auto',
            width: `${ray.width}%`,
            height: '150%',
            background: `linear-gradient(${direction === 'top' ? '180deg' : '0deg'}, ${color} 0%, transparent 100%)`,
            opacity: ray.opacity,
            transform: `rotate(${-15 + Math.random() * 30}deg)`,
            transformOrigin: direction === 'top' ? 'top center' : 'bottom center',
            animation: `${pulseAnimation} ${5 + Math.random() * 3}s ease-in-out ${ray.delay}s infinite`
          }}
        />
      ))}
    </Box>
  );
};

// Animated Gradient Background
export const AnimatedGradient = ({ colors = ['#1a0a2e', '#2d1b4e', '#0a0a1a'], speed = 10 }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(-45deg, ${colors.join(', ')})`,
        backgroundSize: '400% 400%',
        animation: `gradientShift ${speed}s ease infinite`,
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      }}
    />
  );
};

// Video Background Component
export const VideoBackground = ({ src, opacity = 0.5, overlay = 'rgba(0,0,0,0.3)' }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log('Video autoplay prevented:', e));
    }
  }, [src]);

  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity
        }}
      />
      {overlay && (
        <Box sx={{ position: 'absolute', inset: 0, backgroundColor: overlay }} />
      )}
    </Box>
  );
};

// Floating Elements
export const FloatingElements = ({ type = 'circles', count = 10, color = 'rgba(255,255,255,0.1)' }) => {
  const elements = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 20 + Math.random() * 80,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 10 + Math.random() * 10,
    delay: Math.random() * 5
  }));

  const getShape = (el) => {
    if (type === 'circles') return { borderRadius: '50%' };
    if (type === 'squares') return { borderRadius: '10%', transform: 'rotate(45deg)' };
    if (type === 'crosses') return { 
      width: el.size / 4, 
      height: el.size,
      '&::after': {
        content: '""',
        position: 'absolute',
        width: el.size,
        height: el.size / 4,
        backgroundColor: color,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }
    };
    return { borderRadius: '50%' };
  };

  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {elements.map(el => (
        <Box
          key={el.id}
          sx={{
            position: 'absolute',
            left: `${el.left}%`,
            top: `${el.top}%`,
            width: el.size,
            height: el.size,
            backgroundColor: color,
            animation: `${floatAnimation} ${el.duration}s ease-in-out ${el.delay}s infinite`,
            ...getShape(el)
          }}
        />
      ))}
    </Box>
  );
};

// Wave Overlay
export const WaveOverlay = ({ color = 'rgba(255,255,255,0.05)', layers = 3 }) => {
  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: layers }, (_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            bottom: -10 - i * 20,
            left: '-50%',
            width: '200%',
            height: 100 + i * 30,
            backgroundColor: color,
            borderRadius: '50% 50% 0 0',
            animation: `${waveAnimation} ${8 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
            opacity: 1 - i * 0.2
          }}
        />
      ))}
    </Box>
  );
};

// Lens Flare Effect
export const LensFlare = ({ x = 50, y = 30, color = '#ffd700', size = 100 }) => {
  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <Box
        sx={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: 'blur(10px)',
          animation: `${glowAnimation} 3s ease-in-out infinite`
        }}
      />
      {/* Secondary flares */}
      {[0.3, 0.5, 0.7].map((offset, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            left: `${x + (50 - x) * offset}%`,
            top: `${y + (50 - y) * offset}%`,
            width: size * (0.3 - i * 0.08),
            height: size * (0.3 - i * 0.08),
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}66 0%, transparent 70%)`,
            filter: 'blur(5px)'
          }}
        />
      ))}
    </Box>
  );
};

// Motion Background Wrapper - combines all effects
const MotionBackground = ({ 
  children,
  motionType = 'none',
  particleType = 'none',
  particleColor = 'rgba(255,255,255,0.5)',
  particleCount = 30,
  lightRays = false,
  lightRayColor = 'rgba(255,215,0,0.15)',
  floatingElements = false,
  floatingType = 'circles',
  floatingColor = 'rgba(255,255,255,0.1)',
  waves = false,
  waveColor = 'rgba(255,255,255,0.05)',
  lensFlare = false,
  lensFlareColor = '#ffd700',
  videoSrc = '',
  videoOpacity = 0.5,
  animatedGradient = false,
  gradientColors = ['#1a0a2e', '#2d1b4e', '#0a0a1a'],
  gradientSpeed = 10,
  sx = {}
}) => {
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', ...sx }}>
      {/* Video Background */}
      {videoSrc && <VideoBackground src={videoSrc} opacity={videoOpacity} />}
      
      {/* Animated Gradient */}
      {animatedGradient && <AnimatedGradient colors={gradientColors} speed={gradientSpeed} />}
      
      {/* Light Rays */}
      {lightRays && <LightRays color={lightRayColor} />}
      
      {/* Floating Elements */}
      {floatingElements && <FloatingElements type={floatingType} color={floatingColor} />}
      
      {/* Particles */}
      {particleType !== 'none' && (
        <ParticleSystem type={particleType} count={particleCount} color={particleColor} />
      )}
      
      {/* Waves */}
      {waves && <WaveOverlay color={waveColor} />}
      
      {/* Lens Flare */}
      {lensFlare && <LensFlare color={lensFlareColor} />}
      
      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default MotionBackground;

// Motion presets for quick use
export const MOTION_PRESETS = {
  none: { motionType: 'none' },
  worship: {
    lightRays: true,
    lightRayColor: 'rgba(255,215,0,0.15)',
    particleType: 'dust',
    particleColor: 'rgba(255,215,0,0.3)',
    particleCount: 20
  },
  heavenly: {
    lightRays: true,
    lightRayColor: 'rgba(255,255,255,0.2)',
    particleType: 'sparkle',
    particleColor: 'rgba(255,255,255,0.8)',
    particleCount: 40,
    lensFlare: true,
    lensFlareColor: '#ffffff'
  },
  nature: {
    floatingElements: true,
    floatingType: 'circles',
    floatingColor: 'rgba(129,199,132,0.1)',
    particleType: 'dust',
    particleColor: 'rgba(165,214,167,0.4)',
    particleCount: 25
  },
  christmas: {
    particleType: 'snow',
    particleColor: 'rgba(255,255,255,0.8)',
    particleCount: 50,
    lensFlare: true,
    lensFlareColor: '#ff6b6b'
  },
  easter: {
    lightRays: true,
    lightRayColor: 'rgba(255,215,0,0.25)',
    particleType: 'sparkle',
    particleColor: 'rgba(255,215,0,0.6)',
    particleCount: 30,
    animatedGradient: true,
    gradientColors: ['#2d1a4a', '#6b4a8a', '#ffd700'],
    gradientSpeed: 15
  },
  modern: {
    animatedGradient: true,
    gradientColors: ['#0f0c29', '#302b63', '#24243e'],
    gradientSpeed: 8,
    floatingElements: true,
    floatingType: 'squares',
    floatingColor: 'rgba(0,255,255,0.05)'
  },
  ocean: {
    waves: true,
    waveColor: 'rgba(77,208,225,0.1)',
    particleType: 'dust',
    particleColor: 'rgba(128,222,234,0.4)',
    particleCount: 20
  },
  fireflies: {
    particleType: 'firefly',
    particleCount: 25,
    floatingElements: true,
    floatingColor: 'rgba(255,255,0,0.02)'
  }
};
