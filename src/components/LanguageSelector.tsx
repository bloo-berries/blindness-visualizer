import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, SupportedLanguage } from '../i18n';

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const currentLanguage = (i18n.language?.split('-')[0] || 'en') as SupportedLanguage;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
    handleClose();
  };

  return (
    <>
      <Tooltip title={t('language.select')}>
        <IconButton
          onClick={handleClick}
          aria-label={t('language.select')}
          aria-controls={open ? 'language-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:focus-visible': {
              outline: '2px solid #60a5fa',
              outlineOffset: '2px'
            }
          }}
        >
          <LanguageIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
          role: 'listbox'
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            maxHeight: 240, // Show ~5 items with scroll
            width: 200,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              },
            },
          }
        }}
      >
        {Object.entries(supportedLanguages).map(([code, { nativeName }]) => (
          <MenuItem
            key={code}
            onClick={() => handleLanguageChange(code as SupportedLanguage)}
            selected={currentLanguage === code}
            role="option"
            aria-selected={currentLanguage === code}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(33, 150, 243, 0.08)',
              },
              '&.Mui-selected:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.12)',
              }
            }}
          >
            <ListItemText primary={nativeName} />
            {currentLanguage === code && (
              <ListItemIcon sx={{ minWidth: 'auto', ml: 1 }}>
                <CheckIcon fontSize="small" color="primary" />
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;
