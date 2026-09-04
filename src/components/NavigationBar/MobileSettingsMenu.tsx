import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import SettingsIcon from '@mui/icons-material/Settings';
import LightModeIcon from '@mui/icons-material/LightMode';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';
import { supportedLanguages, SupportedLanguage } from '../../i18n';

interface MobileSettingsMenuProps {
  themeMode: 'light' | 'dim' | 'dark';
  onCycleTheme: () => void;
}

const MobileSettingsMenu: React.FC<MobileSettingsMenuProps> = ({
  themeMode,
  onCycleTheme
}) => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [languageSubmenuOpen, setLanguageSubmenuOpen] = useState(false);
  const open = Boolean(anchorEl);
  const currentLanguage = (i18n.language?.split('-')[0] || 'en') as SupportedLanguage;

  const handleClose = () => {
    setAnchorEl(null);
    setLanguageSubmenuOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
          setLanguageSubmenuOpen(false);
        }}
        aria-label={t('nav.settings', 'Settings')}
        sx={{
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <SettingsIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            minWidth: 220,
            backgroundColor: 'var(--color-drawer-bg)',
            color: 'white',
            border: '1px solid var(--color-navbar-border)',
            maxHeight: 400,
          }
        }}
      >
        {/* Theme section */}
        <MenuItem
          onClick={() => { onCycleTheme(); }}
          sx={{ '&:hover': { backgroundColor: 'rgba(96, 165, 250, 0.1)' } }}
        >
          <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
            {themeMode === 'light' && <LightModeIcon fontSize="small" />}
            {themeMode === 'dim' && <Brightness4Icon fontSize="small" />}
            {themeMode === 'dark' && <DarkModeIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText
            primary={t('theme.toggle', 'Theme')}
            secondary={t(`theme.${themeMode}`)}
            primaryTypographyProps={{ color: 'white', fontSize: '0.9rem' }}
            secondaryTypographyProps={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}
          />
        </MenuItem>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
        {/* Language section */}
        <MenuItem
          onClick={() => setLanguageSubmenuOpen(!languageSubmenuOpen)}
          sx={{ '&:hover': { backgroundColor: 'rgba(96, 165, 250, 0.1)' } }}
        >
          <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
            <LanguageIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={t('language.select', 'Language')}
            secondary={supportedLanguages[currentLanguage]?.nativeName || currentLanguage}
            primaryTypographyProps={{ color: 'white', fontSize: '0.9rem' }}
            secondaryTypographyProps={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}
          />
        </MenuItem>
        {languageSubmenuOpen && (
          <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {Object.entries(supportedLanguages).map(([code, { nativeName }]) => (
              <MenuItem
                key={code}
                onClick={() => {
                  i18n.changeLanguage(code);
                  handleClose();
                }}
                selected={currentLanguage === code}
                sx={{
                  pl: 6,
                  py: 0.75,
                  fontSize: '0.85rem',
                  color: 'white',
                  '&.Mui-selected': { backgroundColor: 'rgba(96, 165, 250, 0.15)' },
                  '&.Mui-selected:hover': { backgroundColor: 'rgba(96, 165, 250, 0.2)' },
                  '&:hover': { backgroundColor: 'rgba(96, 165, 250, 0.1)' },
                }}
              >
                <ListItemText
                  primary={nativeName}
                  primaryTypographyProps={{ color: 'white', fontSize: '0.85rem' }}
                />
                {currentLanguage === code && (
                  <CheckIcon fontSize="small" sx={{ color: '#60a5fa', ml: 1 }} />
                )}
              </MenuItem>
            ))}
          </Box>
        )}
      </Menu>
    </>
  );
};

export default MobileSettingsMenu;
