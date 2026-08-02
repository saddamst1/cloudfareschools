'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Default_Gradients = [
  "linear-gradient(135deg, #1E1B4B 0%, #0F766E 100%)",
  "linear-gradient(135deg, #0F172A 0%, #1E40AF 100%)",
  "linear-gradient(135deg, #111827 0%, #0D9488 100%)",
  "linear-gradient(135deg, #1E1B4B 0%, #1E3A8A 100%)",
  "linear-gradient(135deg, #1E1B4B 0%, #0F766E 100%)",
];

export function GradientBackground({
  children,
  className = '',
  gradients = Default_Gradients,
  animationDuration = 10,
  animationDelay = 0.5,
  overlay = false,
  overlayOpacity = 0.3,
}) {
  return (
    <div className={cn('w-full relative', className)}>
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{ background: gradients[0] }}
        animate={{ background: gradients }}
        transition={{
          delay: animationDelay,
          duration: animationDuration,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />

      {/* Optional overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black z-0"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content wrapper */}
      {children && (
        <div className="relative z-10 w-full">
          {children}
        </div>
      )}
    </div>
  );
}
