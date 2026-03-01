import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dim' | 'dark';

export interface AccessibilityPreferences {
  highContrast: boolean;
  largeText: boolean;
  increasedSpacing: boolean;
  enhancedFocus: boolean;
  reducedMotion: boolean;
  themeMode: ThemeMode;
}

interface AccessibilityContextType {
  preferences: AccessibilityPreferences;
  updatePreferences: (newPreferences: Partial<AccessibilityPreferences>) => void;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleIncreasedSpacing: () => void;
  toggleEnhancedFocus: () => void;
  toggleReducedMotion: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  cycleThemeMode: () => void;
}

const defaultPreferences: AccessibilityPreferences = {
  highContrast: false,
  largeText: false,
  increasedSpacing: false,
  enhancedFocus: false,
  reducedMotion: false,
  themeMode: 'dim',
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
        const parsed = { ...defaultPreferences, ...JSON.parse(saved) };
        // One-time migration: switch users from light to dim default
        const migrated = localStorage.getItem('theme-migrated-v1');
        if (!migrated && parsed.themeMode === 'light') {
          parsed.themeMode = 'dim';
          localStorage.setItem('theme-migrated-v1', '1');
          localStorage.setItem('accessibility-preferences', JSON.stringify(parsed));
        } else if (!migrated) {
          localStorage.setItem('theme-migrated-v1', '1');
        }
        return parsed;
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

    // Theme mode
    root.classList.remove('dim-mode', 'dark-mode');
    if (prefs.themeMode === 'dim') {
      root.classList.add('dim-mode');
    } else if (prefs.themeMode === 'dark') {
      root.classList.add('dark-mode');
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

  const setThemeMode = (mode: ThemeMode) => {
    setPreferences(prev => ({ ...prev, themeMode: mode }));
  };

  const cycleThemeMode = () => {
    setPreferences(prev => {
      const order: ThemeMode[] = ['light', 'dim', 'dark'];
      const currentIndex = order.indexOf(prev.themeMode);
      const nextIndex = (currentIndex + 1) % order.length;
      return { ...prev, themeMode: order[nextIndex] };
    });
  };

  const value: AccessibilityContextType = {
    preferences,
    updatePreferences,
    toggleHighContrast,
    toggleLargeText,
    toggleIncreasedSpacing,
    toggleEnhancedFocus,
    toggleReducedMotion,
    setThemeMode,
    cycleThemeMode,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};