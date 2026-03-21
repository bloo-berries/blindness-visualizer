import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, Button, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Close, ArrowForward, ArrowBack } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const TOUR_STORAGE_KEY = 'tour-completed-v1';

interface TourStep {
  targetSelector: string;
  titleKey: string;
  descriptionKey: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    targetSelector: '[data-tour-step="conditions"]',
    titleKey: 'tour.step1Title',
    descriptionKey: 'tour.step1Desc',
    position: 'right',
  },
  {
    targetSelector: '[data-tour-step="severity"]',
    titleKey: 'tour.step2Title',
    descriptionKey: 'tour.step2Desc',
    position: 'top',
  },
  {
    targetSelector: '[data-tour-step="compare"]',
    titleKey: 'tour.step3Title',
    descriptionKey: 'tour.step3Desc',
    position: 'bottom',
  },
  {
    targetSelector: '[data-tour-step="save"]',
    titleKey: 'tour.step4Title',
    descriptionKey: 'tour.step4Desc',
    position: 'top',
  },
];

interface GuidedTourProps {
  /** If true, force-show the tour even if already completed (for "restart tour" button) */
  forceShow?: boolean;
  onComplete?: () => void;
}

const GuidedTour: React.FC<GuidedTourProps> = ({ forceShow, onComplete }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Don't show tour on mobile - not enough screen space
    if (isMobile) {
      setIsVisible(false);
      return;
    }
    if (forceShow) {
      setIsVisible(true);
      return;
    }
    const completed = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!completed) {
      // Delay tour start to let the UI settle
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [forceShow, isMobile]);

  const updateTargetRect = useCallback(() => {
    if (!isVisible) return;
    const step = TOUR_STEPS[currentStep];
    const el = document.querySelector(step.targetSelector);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [currentStep, isVisible]);

  useEffect(() => {
    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);
    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [updateTargetRect]);

  const completeTour = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    onComplete?.();
  }, [onComplete]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTour();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  if (!isVisible) return null;

  const step = TOUR_STEPS[currentStep];
  const padding = 8;

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
    const base: React.CSSProperties = { position: 'fixed', zIndex: 100001 };
    switch (step.position) {
      case 'bottom':
        return { ...base, top: targetRect.bottom + 12, left: targetRect.left + targetRect.width / 2, transform: 'translateX(-50%)' };
      case 'top':
        return { ...base, bottom: window.innerHeight - targetRect.top + 12, left: targetRect.left + targetRect.width / 2, transform: 'translateX(-50%)' };
      case 'right':
        return { ...base, top: targetRect.top + targetRect.height / 2, left: targetRect.right + 12, transform: 'translateY(-50%)' };
      case 'left':
        return { ...base, top: targetRect.top + targetRect.height / 2, right: window.innerWidth - targetRect.left + 12, transform: 'translateY(-50%)' };
      default:
        return { ...base, top: targetRect.bottom + 12, left: targetRect.left };
    }
  };

  return (
    <>
      {/* Dark overlay with spotlight cutout */}
      <Box
        onClick={completeTour}
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 100000,
          cursor: 'pointer',
        }}
      >
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <mask id="tour-spotlight">
              <rect width="100%" height="100%" fill="white" />
              {targetRect && (
                <rect
                  x={targetRect.left - padding}
                  y={targetRect.top - padding}
                  width={targetRect.width + padding * 2}
                  height={targetRect.height + padding * 2}
                  rx="8"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.6)"
            mask="url(#tour-spotlight)"
          />
        </svg>
      </Box>

      {/* Spotlight border ring */}
      {targetRect && (
        <Box
          sx={{
            position: 'fixed',
            left: targetRect.left - padding,
            top: targetRect.top - padding,
            width: targetRect.width + padding * 2,
            height: targetRect.height + padding * 2,
            borderRadius: '8px',
            border: '2px solid rgba(96,165,250,0.8)',
            boxShadow: '0 0 0 4px rgba(96,165,250,0.2)',
            zIndex: 100001,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Tooltip */}
      <Box
        ref={tooltipRef}
        onClick={(e) => e.stopPropagation()}
        sx={{
          ...getTooltipStyle(),
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          p: 2.5,
          maxWidth: 320,
          minWidth: 240,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', pr: 2 }}>
            {t(step.titleKey)}
          </Typography>
          <IconButton size="small" onClick={completeTour} sx={{ mt: -0.5, mr: -0.5 }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t(step.descriptionKey)}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {currentStep + 1} / {TOUR_STEPS.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {currentStep > 0 && (
              <Button size="small" startIcon={<ArrowBack />} onClick={handleBack}>
                {t('tour.back', 'Back')}
              </Button>
            )}
            <Button size="small" variant="contained" endIcon={currentStep < TOUR_STEPS.length - 1 ? <ArrowForward /> : undefined} onClick={handleNext}>
              {currentStep < TOUR_STEPS.length - 1 ? t('tour.next', 'Next') : t('tour.finish', 'Got it!')}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default GuidedTour;
