import React from 'react';
import { motion } from 'framer-motion';

const StudyGraphics: React.FC = () => {
  return (
    <div className="relative w-full h-64 overflow-hidden">
      <svg
        viewBox="0 0 500 200"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Background */}
        <rect width="500" height="200" fill="#f0f4f8" />

        {/* Book */}
        <motion.g
          initial={{ rotateY: -30 }}
          animate={{ rotateY: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <rect x="50" y="50" width="120" height="150" fill="#4a5568" rx="5" />
          <rect x="55" y="55" width="110" height="140" fill="#ffffff" rx="5" />
          <line x1="65" y1="75" x2="155" y2="75" stroke="#718096" strokeWidth="2" />
          <line x1="65" y1="95" x2="155" y2="95" stroke="#718096" strokeWidth="2" />
          <line x1="65" y1="115" x2="155" y2="115" stroke="#718096" strokeWidth="2" />
          <line x1="65" y1="135" x2="155" y2="135" stroke="#718096" strokeWidth="2" />
        </motion.g>

        {/* Pencil */}
        <motion.g
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <rect x="200" y="100" width="150" height="20" fill="#fbd38d" rx="2" />
          <polygon points="350,100 370,110 350,120" fill="#ed8936" />
          <rect x="200" y="105" width="100" height="10" fill="#f6ad55" />
        </motion.g>

        {/* Light bulb */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <circle cx="420" cy="70" r="30" fill="#faf089" />
          <path d="M420 40 L420 20 M450 70 L470 70 M420 100 L420 120 M390 70 L370 70 M442 48 L456 34 M398 48 L384 34 M442 92 L456 106 M398 92 L384 106" stroke="#ecc94b" strokeWidth="4" />
          <rect x="410" y="95" width="20" height="10" fill="#718096" rx="2" />
        </motion.g>

        {/* IELTS text */}
        <motion.text
          x="250"
          y="180"
          fontSize="24"
          fontWeight="bold"
          fill="#2d3748"
          textAnchor="middle"
          initial={{ y: 220 }}
          animate={{ y: 180 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          IELTS Preparation
        </motion.text>
      </svg>
    </div>
  );
};

export default StudyGraphics;

