import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  transition?: any;
  noTilt?: boolean; // For mobile or if disabled
}

const TiltCard: React.FC<TiltCardProps> = ({ 
    children, 
    className = "", 
    initial, 
    animate, 
    transition,
    noTilt: propNoTilt = false
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const disableTilt = propNoTilt || isMobile;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 250, damping: 25 });
  const mouseY = useSpring(y, { stiffness: 250, damping: 25 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["2.5deg", "-2.5deg"]); // Max 2.5 degrees for subtle effect
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-2.5deg", "2.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disableTilt || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;

    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={transition}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: disableTilt ? 0 : rotateX,
        rotateY: disableTilt ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ y: -4, scale: 1.005 }} // Subtle Lift effect
      whileTap={{ scale: 0.99 }}
      className={`relative transform-gpu transition-all duration-300 ease-out group ${className}`}
    >
      {/* 1. Subtle Spotlight Border - Reveals on hover */}
      <div 
        className="absolute inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
           background: "linear-gradient(to bottom right, rgba(99, 102, 241, 0.3), rgba(20, 184, 166, 0.1), transparent)",
           maskImage: "linear-gradient(black, black)",
           WebkitMaskImage: "linear-gradient(black, black)",
           filter: "blur(4px)",
           transform: 'translateZ(-1px)' 
        }}
      />
      
      {/* 2. Content Container - Ensures content is above border */}
      <div className="relative z-10">
        {children}
      </div>

      {/* 3. Dynamic Specular Reflection (Glare) */}
       <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 mix-blend-overlay"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([currentX, currentY]) => `radial-gradient(circle at ${50 + (currentX as number) * 100}% ${50 + (currentY as number) * 100}%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.01) 40%, transparent 60%)`
          ),
        }}
      />

      {/* 4. Soft Bottom Shadow for Depth */}
      <div 
         className="absolute -bottom-2 left-[5%] right-[5%] h-4 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"
         style={{ transform: 'translateZ(-20px)' }}
      />
    </motion.div>
  );
};

export default TiltCard;
