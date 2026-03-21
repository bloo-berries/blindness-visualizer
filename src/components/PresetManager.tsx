import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Share as ShareIcon,
  BookmarkBorder as PresetIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import { VisualEffect } from '../types/visualEffects';

const PRESETS_STORAGE_KEY = 'vision-presets';

interface SavedPreset {
  name: string;
  conditions: { id: string; i: number }[];
  createdAt: number;
}

interface PresetManagerProps {
  effects: VisualEffect[];
  onLoadPreset: (conditions: { id: string; intensity: number }[]) => void;
}

function encodePreset(conditions: { id: string; i: number }[]): string {
  const json = JSON.stringify({ c: conditions });
  return btoa(json);
}

function decodePreset(encoded: string): { id: string; intensity: number }[] | null {
  try {
    const json = atob(encoded);
    const parsed = JSON.parse(json);
    if (parsed.c && Array.isArray(parsed.c)) {
      return parsed.c.map((c: { id: string; i: number }) => ({
        id: c.id,
        intensity: c.i,
      }));
    }
    return null;
  } catch {
    return null;
  }
}

function getSavedPresets(): SavedPreset[] {
  try {
    return JSON.parse(localStorage.getItem(PRESETS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function savePresets(presets: SavedPreset[]) {
  try {
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
  } catch {
    // localStorage unavailable (private/incognito mode quota exceeded)
  }
}

// Exported for use in VisionSimulator
export { decodePreset };

const PresetManager: React.FC<PresetManagerProps> = ({ effects, onLoadPreset }) => {
  const { t } = useTranslation();
  const [presetName, setPresetName] = useState('');
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>(getSavedPresets);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [presetsDialogOpen, setPresetsDialogOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [shareUrl, setShareUrl] = useState('');

  const enabledEffects = useMemo(
    () => effects.filter((e) => e.enabled),
    [effects]
  );

  const handleSavePreset = useCallback(() => {
    if (!presetName.trim() || enabledEffects.length === 0) return;
    const conditions = enabledEffects.map((e) => ({ id: e.id, i: e.intensity }));
    const preset: SavedPreset = {
      name: presetName.trim(),
      conditions,
      createdAt: Date.now(),
    };
    const updated = [preset, ...savedPresets].slice(0, 20); // max 20 presets
    savePresets(updated);
    setSavedPresets(updated);
    setPresetName('');
    setSnackMessage(t('presets.saved', 'Preset saved!'));
  }, [presetName, enabledEffects, savedPresets, t]);

  const handleDeletePreset = useCallback(
    (index: number) => {
      const updated = savedPresets.filter((_, i) => i !== index);
      savePresets(updated);
      setSavedPresets(updated);
    },
    [savedPresets]
  );

  const handleLoadPreset = useCallback(
    (preset: SavedPreset) => {
      onLoadPreset(
        preset.conditions.map((c) => ({ id: c.id, intensity: c.i }))
      );
      setPresetsDialogOpen(false);
      setSnackMessage(t('presets.loaded', `Loaded "${preset.name}"`));
    },
    [onLoadPreset, t]
  );

  const handleShare = useCallback(() => {
    if (enabledEffects.length === 0) return;
    const conditions = enabledEffects.map((e) => ({ id: e.id, i: e.intensity }));
    const encoded = encodePreset(conditions);
    const baseUrl = window.location.origin + (process.env.PUBLIC_URL || '');
    const url = `${baseUrl}/simulator?preset=${encoded}`;
    setShareUrl(url);
    setShareDialogOpen(true);
  }, [enabledEffects]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setSnackMessage(t('presets.linkCopied', 'Link copied to clipboard!'));
    } catch {
      setSnackMessage(t('presets.copyFailed', 'Failed to copy link'));
    }
  }, [shareUrl, t]);

  const handleNativeShare = useCallback(async () => {
    if (!navigator.share) return;
    const conditionNames = enabledEffects.map((e) => e.name).join(', ');
    try {
      await navigator.share({
        title: `See Through My Eyes — ${conditionNames}`,
        text: `Experience what vision looks like with ${conditionNames}. Try the free interactive simulator.`,
        url: shareUrl,
      });
    } catch {
      // User cancelled share
    }
  }, [shareUrl, enabledEffects]);

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Save Preset */}
        <TextField
          size="small"
          placeholder={t('presets.namePlaceholder', 'Preset name...')}
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
          sx={{ width: 160 }}
        />
        <Tooltip title={t('presets.saveTooltip', 'Save current conditions as a preset')}>
          <span>
            <Button
              size="small"
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleSavePreset}
              disabled={!presetName.trim() || enabledEffects.length === 0}
            >
              {t('presets.save', 'Save')}
            </Button>
          </span>
        </Tooltip>

        {/* Load Preset */}
        {savedPresets.length > 0 && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<PresetIcon />}
            onClick={() => setPresetsDialogOpen(true)}
          >
            {t('presets.myPresets', 'My Presets')} ({savedPresets.length})
          </Button>
        )}

        {/* Share */}
        <Tooltip title={t('presets.shareTooltip', 'Generate a shareable link')}>
          <span>
            <Button
              size="small"
              variant="contained"
              startIcon={<ShareIcon />}
              onClick={handleShare}
              disabled={enabledEffects.length === 0}
            >
              {t('presets.share', 'Share')}
            </Button>
          </span>
        </Tooltip>
      </Box>

      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {t('presets.shareTitle', 'Share Simulation')}
          <IconButton onClick={() => setShareDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {/* Active conditions */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {t('presets.activeConditions', 'Active Conditions')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {enabledEffects.map((e) => (
                  <Chip key={e.id} label={`${e.name} (${Math.round(e.intensity * 100)}%)`} size="small" />
                ))}
              </Box>
            </Box>

            {/* Shareable link */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {t('presets.shareableLink', 'Shareable Link')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={shareUrl}
                  InputProps={{ readOnly: true }}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <IconButton onClick={handleCopyLink} color="primary">
                  <CopyIcon />
                </IconButton>
              </Box>
            </Box>

            {/* QR Code */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2, display: 'inline-flex' }}>
                <QRCodeSVG value={shareUrl} size={180} />
              </Box>
            </Box>

            {/* Native Share */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <Button variant="outlined" startIcon={<ShareIcon />} onClick={handleNativeShare}>
                {t('presets.nativeShare', 'Share via...')}
              </Button>
            )}

            {/* Donation CTA */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(135deg, rgba(96,165,250,0.1), rgba(96,165,250,0.05))',
                border: '1px solid rgba(96,165,250,0.2)',
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                <FavoriteIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                {t('presets.donationText', 'Help us keep this free')}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                href="https://linktr.ee/bloomedhealth"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<FavoriteIcon sx={{ color: '#ef4444' }} />}
              >
                {t('presets.supportUs', 'Support The Blind Spot')}
              </Button>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Saved Presets Dialog */}
      <Dialog
        open={presetsDialogOpen}
        onClose={() => setPresetsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {t('presets.myPresetsTitle', 'My Saved Presets')}
        </DialogTitle>
        <DialogContent>
          {savedPresets.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
              {t('presets.noPresets', 'No saved presets yet.')}
            </Typography>
          ) : (
            <Stack spacing={1} sx={{ pt: 1 }}>
              {savedPresets.map((preset, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                >
                  <Box
                    sx={{ cursor: 'pointer', flex: 1 }}
                    onClick={() => handleLoadPreset(preset)}
                  >
                    <Typography variant="subtitle2">{preset.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {preset.conditions.length} condition{preset.conditions.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={() => handleDeletePreset(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPresetsDialogOpen(false)}>
            {t('common.cancel', 'Close')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackMessage}
        autoHideDuration={3000}
        onClose={() => setSnackMessage('')}
        message={snackMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default PresetManager;
