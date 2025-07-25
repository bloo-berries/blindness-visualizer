import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AccessibilityPreferences {
  highContrast: boolean;
  largeText: boolean;
  increasedSpacing: boolean;
  enhancedFocus: boolean;
  reducedMotion: boolean;
}

interface AccessibilityContextType {
  preferences: AccessibilityPreferences;
  updatePreferences: (newPreferences: Partial<AccessibilityPreferences>) => void;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleIncreasedSpacing: () => void;
  toggleEnhancedFocus: () => void;
  toggleReducedMotion: () => void;
}

const defaultPreferences: AccessibilityPreferences = {
  highContrast: false,
  largeText: false,
  increasedSpacing: false,
  enhancedFocus: false,
  reducedMotion: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    // Load preferences from localStorage on initialization
    const saved = localStorage.getItem('accessibility-preferences');
    if (saved) {
      try {
        return { ...defaultPreferences, ...JSON.parse(saved) };
      } catch {
        return defaultPreferences;
      }
    }
    return defaultPreferences;
  });

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('accessibility-preferences', JSON.stringify(preferences));
    
    // Apply preferences to document
    applyPreferencesToDocument(preferences);
  }, [preferences]);

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + A (Windows/Linux) or Option + A (Mac) to open accessibility menu
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        // This will be handled by the AccessibilityMenu component
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const applyPreferencesToDocument = (prefs: AccessibilityPreferences) => {
    const root = document.documentElement;
    
    // High contrast mode
    if (prefs.highContrast) {
      root.classList.add('high-contrast-mode');
    } else {
      root.classList.remove('high-contrast-mode');
    }
    
    // Large text mode
    if (prefs.largeText) {
      root.classList.add('large-text-mode');
    } else {
      root.classList.remove('large-text-mode');
    }
    
    // Increased spacing mode
    if (prefs.increasedSpacing) {
      root.classList.add('increased-spacing-mode');
    } else {
      root.classList.remove('increased-spacing-mode');
    }
    
    // Enhanced focus indicators
    if (prefs.enhancedFocus) {
      root.classList.add('enhanced-focus-mode');
    } else {
      root.classList.remove('enhanced-focus-mode');
    }
    
    // Reduced motion
    if (prefs.reducedMotion) {
      root.classList.add('reduced-motion-mode');
    } else {
      root.classList.remove('reduced-motion-mode');
    }
  };

  const updatePreferences = (newPreferences: Partial<AccessibilityPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  const toggleHighContrast = () => {
    setPreferences(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleLargeText = () => {
    setPreferences(prev => ({ ...prev, largeText: !prev.largeText }));
  };

  const toggleIncreasedSpacing = () => {
    setPreferences(prev => ({ ...prev, increasedSpacing: !prev.increasedSpacing }));
  };

  const toggleEnhancedFocus = () => {
    setPreferences(prev => ({ ...prev, enhancedFocus: !prev.enhancedFocus }));
  };

  const toggleReducedMotion = () => {
    setPreferences(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  };

  const value: AccessibilityContextType = {
    preferences,
    updatePreferences,
    toggleHighContrast,
    toggleLargeText,
    toggleIncreasedSpacing,
    toggleEnhancedFocus,
    toggleReducedMotion,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}; 