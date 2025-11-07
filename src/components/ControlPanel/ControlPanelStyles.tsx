import React from 'react';

/**
 * CSS animations and styles for ControlPanel
 * Extracted to keep main component clean
 */
export const ControlPanelStyles: React.FC = () => (
  <style>
    {`
      @keyframes auraFlicker {
        0% { opacity: 0.3; }
        100% { opacity: 0.8; }
      }
      @keyframes auraScintillation {
        0% { 
          opacity: 0.4; 
          filter: hue-rotate(0deg) brightness(1.2);
        }
        50% { 
          opacity: 0.8; 
          filter: hue-rotate(180deg) brightness(1.5);
        }
        100% { 
          opacity: 0.4; 
          filter: hue-rotate(360deg) brightness(1.2);
        }
      }
      @keyframes auraSlowScintillation {
        0% { 
          opacity: 0.2; 
          filter: brightness(1.05) contrast(1.05) hue-rotate(0deg);
        }
        25% { 
          opacity: 0.35; 
          filter: brightness(1.15) contrast(1.1) hue-rotate(45deg);
        }
        50% { 
          opacity: 0.5; 
          filter: brightness(1.2) contrast(1.15) hue-rotate(90deg);
        }
        75% { 
          opacity: 0.35; 
          filter: brightness(1.1) contrast(1.05) hue-rotate(135deg);
        }
        100% { 
          opacity: 0.2; 
          filter: brightness(1.05) contrast(1.05) hue-rotate(180deg);
        }
      }
      @keyframes hallucinationFade {
        0% { 
          opacity: 0.1; 
          filter: blur(0px) brightness(1.0);
        }
        25% { 
          opacity: 0.4; 
          filter: blur(0.5px) brightness(1.1);
        }
        50% { 
          opacity: 0.7; 
          filter: blur(0px) brightness(1.2);
        }
        75% { 
          opacity: 0.3; 
          filter: blur(0.3px) brightness(0.9);
        }
        100% { 
          opacity: 0.1; 
          filter: blur(0px) brightness(1.0);
        }
      }
      @keyframes visualSnowFlicker {
        0% { opacity: 0.2; }
        12.5% { opacity: 0.8; }
        25% { opacity: 0.3; }
        37.5% { opacity: 0.9; }
        50% { opacity: 0.1; }
        62.5% { opacity: 0.7; }
        75% { opacity: 0.4; }
        87.5% { opacity: 0.6; }
        100% { opacity: 0.2; }
      }
      @keyframes visualSnowPersistent {
        0% { opacity: 0.4; }
        20% { opacity: 0.6; }
        40% { opacity: 0.5; }
        60% { opacity: 0.7; }
        80% { opacity: 0.4; }
        100% { opacity: 0.5; }
      }
      @keyframes floaterDrift {
        0% { transform: translate(0px, 0px); }
        25% { transform: translate(2px, -1px); }
        50% { transform: translate(-1px, 2px); }
        75% { transform: translate(1px, 1px); }
        100% { transform: translate(0px, 0px); }
      }
    `}
  </style>
);

