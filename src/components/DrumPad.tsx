'use client';

import { motion } from 'framer-motion';
import { DrumType, DRUM_KIT_CONFIG } from '../lib/constants';
import { useDrumStore } from '../stores/drumStore';
import { useKeyBindings } from '../hooks/useKeyBindings';
import Image from 'next/image';

interface DrumPadProps {
  drum: DrumType;
  className?: string;
}

export const DrumPad = ({ drum, className = '' }: DrumPadProps) => {
  const { activeDrums, keyBindings } = useDrumStore();
  const { triggerDrum } = useKeyBindings();
  
  const config = DRUM_KIT_CONFIG[drum];
  const isActive = activeDrums.has(drum);
  const assignedKey = keyBindings[drum];

  const handleClick = () => {
    triggerDrum(drum);
  };

  const containerStyle = {
    position: 'absolute' as const,
    left: `${config.position.x}%`,
    top: `${config.position.y}%`,
    transform: 'translate(-50%, -50%)',
    width: `${config.size.width}px`,
    height: `${config.size.height}px`,
  };

  // Responsive label sizing based on drum size
  const isLargeDrum = config.size.width >= 160;
  const isMediumDrum = config.size.width >= 130;

  return (
    <motion.div
      className={`relative cursor-pointer select-none ${className}`}
      data-drum={drum}
      onClick={handleClick}
      style={containerStyle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        scale: isActive ? 1.05 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25
      }}
    >
      {/* Hit effect ring */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-yellow-400"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
      
      {/* Drum image */}
      <div className="relative w-full h-full">
        <Image
          src={config.imageFile}
          alt={config.label}
          fill
          className={`object-contain transition-all duration-75 ${
            isActive ? 'brightness-125 drop-shadow-2xl' : 'brightness-100'
          }`}
          priority
        />
        
        {/* Active glow effect */}
        {isActive && (
          <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-lg" />
        )}
      </div>
      
      {/* Main label overlay - back on the drums with better positioning */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
        <div className={`bg-black/50 backdrop-blur-sm rounded-md px-2 py-1 text-center ${
          isLargeDrum ? 'min-w-16' : 'min-w-12'
        }`}>
          <div className={`${
            isLargeDrum ? 'text-sm' : isMediumDrum ? 'text-xs' : 'text-xs'
          } font-bold text-white drop-shadow-lg leading-tight`}>
            {config.label}
          </div>
          <div className={`${
            isLargeDrum ? 'text-sm' : 'text-xs'
          } text-yellow-300 font-mono font-bold drop-shadow-lg`}>
            {assignedKey.toUpperCase()}
          </div>
        </div>
      </div>
      
      {/* Hover effect */}
      <motion.div
        className="absolute inset-0 bg-white/3 rounded-full opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}; 