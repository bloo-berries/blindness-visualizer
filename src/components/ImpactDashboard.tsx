import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

interface StatItem {
  target: number;
  suffix: string;
  label: string;
}

const STATS: StatItem[] = [
  { target: 148, suffix: '+', label: 'Vision Conditions' },
  { target: 214, suffix: '+', label: 'Famous People' },
  { target: 26, suffix: '', label: 'Languages' },
  { target: 27, suffix: '', label: 'Animated Effects' },
];

function useCountUp(target: number, isVisible: boolean, duration = 1500): number {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);

  return count;
}

const StatCard: React.FC<{ stat: StatItem; isVisible: boolean }> = ({ stat, isVisible }) => {
  const count = useCountUp(stat.target, isVisible);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0,
    }}>
      <Typography variant="body1" sx={{ fontWeight: 700, color: '#000000', fontSize: '0.9rem' }}>
        {count}{stat.suffix}
      </Typography>
      <Typography variant="caption" sx={{ textAlign: 'center', fontSize: '0.7rem', color: '#333333' }}>
        {stat.label}
      </Typography>
    </Box>
  );
};

const ImpactDashboard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(4, auto)', md: 'repeat(4, auto)' },
        justifyContent: 'center',
        gap: { xs: 1, md: 2 },
        py: { xs: 0.5, md: 1.5 },
        mb: { xs: 2, md: 3 },
        maxWidth: { xs: '300px', md: '500px' },
        mx: 'auto',
      }}
    >
      {STATS.map((stat, i) => (
        <StatCard key={i} stat={stat} isVisible={isVisible} />
      ))}
    </Box>
  );
};

export default ImpactDashboard;
