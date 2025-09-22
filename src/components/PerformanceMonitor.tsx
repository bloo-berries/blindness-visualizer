import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Tooltip } from '@mui/material';
import { PerformanceOptimizer } from '../utils/performanceOptimizer';

interface PerformanceMonitorProps {
  conditionCount: number;
  isVisible?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  conditionCount, 
  isVisible = false 
}) => {
  const [performanceStatus, setPerformanceStatus] = useState({
    fps: 60,
    isThrottling: false
  });

  useEffect(() => {
    if (!isVisible) return;

    const optimizer = PerformanceOptimizer.getInstance();
    
    const updatePerformance = () => {
      setPerformanceStatus({
        fps: optimizer['fps'],
        isThrottling: optimizer['isThrottling']
      });
    };

    // Update performance status every second
    const interval = setInterval(updatePerformance, 1000);
    
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const getPerformanceColor = (fps: number) => {
    if (fps >= 50) return 'success';
    if (fps >= 30) return 'warning';
    return 'error';
  };

  const getPerformanceLabel = (fps: number) => {
    if (fps >= 50) return 'Excellent';
    if (fps >= 30) return 'Good';
    return 'Poor';
  };

  const getOptimizationStatus = (count: number) => {
    if (count >= 6) return 'Heavy optimization active';
    if (count >= 4) return 'Moderate optimization active';
    return 'Standard performance';
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 10,
        right: 10,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        minWidth: '200px'
      }}
    >
      <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
        Performance Monitor
      </Typography>
      
      <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>FPS:</span>
          <Chip
            label={`${performanceStatus.fps} (${getPerformanceLabel(performanceStatus.fps)})`}
            size="small"
            color={getPerformanceColor(performanceStatus.fps)}
            sx={{ height: '20px', fontSize: '10px' }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Conditions:</span>
          <Chip
            label={conditionCount}
            size="small"
            color={conditionCount >= 4 ? 'warning' : 'default'}
            sx={{ height: '20px', fontSize: '10px' }}
          />
        </Box>
        
        <Tooltip title={getOptimizationStatus(conditionCount)}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Status:</span>
            <Chip
              label={performanceStatus.isThrottling ? 'Throttled' : 'Normal'}
              size="small"
              color={performanceStatus.isThrottling ? 'warning' : 'success'}
              sx={{ height: '20px', fontSize: '10px' }}
            />
          </Box>
        </Tooltip>
      </Box>
      
      {conditionCount >= 4 && (
        <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>
            ⚡ Performance optimizations active for {conditionCount}+ conditions
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PerformanceMonitor;
