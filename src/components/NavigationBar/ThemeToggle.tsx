import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LightModeIcon from '@mui/icons-material/LightMode';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import DarkModeIcon from '@mui/icons-material/DarkMode';

interface ThemeToggleProps {
  themeMode: 'light' | 'dim' | 'dark';
  onCycleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ themeMode, onCycleTheme }) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t(`theme.${themeMode}`)}>
      <IconButton
        onClick={onCycleTheme}
        aria-label={t('theme.toggle')}
        size="large"
        sx={{
          color: 'white',
          width: '40px',
          height: '40px',
          '&:hover': {
            color: '#60a5fa',
            backgroundColor: 'rgba(96, 165, 250, 0.15)',
          },
          '&.Mui-focusVisible': {
            outline: '3px solid #60a5fa',
            outlineOffset: '2px'
          },
          transition: 'all 0.2s ease-in-out'
        }}
      >
        {themeMode === 'light' && <LightModeIcon fontSize="medium" />}
        {themeMode === 'dim' && <Brightness4Icon fontSize="medium" />}
        {themeMode === 'dark' && <DarkModeIcon fontSize="medium" />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
