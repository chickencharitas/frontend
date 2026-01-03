import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Paper,
  Grid
} from '@mui/material';
import {
  Monitor as MonitorIcon,
  Tv as TvIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  OpenInNew as OpenInNewIcon,
  Close as CloseIcon,
  Fullscreen as FullscreenIcon
} from '@mui/icons-material';

// Screen Context for global access
const ScreenContext = createContext(null);

export const useScreenManager = () => {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error('useScreenManager must be used within a ScreenManagerProvider');
  }
  return context;
};

// Main Output Window Component - renders current slide for congregation
const MainOutputContent = ({ currentSlide, formatting }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: formatting?.backgroundColor || '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: formatting?.fontColor || '#ffffff',
        fontFamily: formatting?.fontFamily || 'Arial',
        fontSize: formatting?.fontSize || '48px',
        textAlign: 'center',
        padding: 4
      }}
    >
      {currentSlide ? (
        <Typography
          sx={{
            fontSize: 'inherit',
            fontFamily: 'inherit',
            color: 'inherit',
            whiteSpace: 'pre-wrap',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          {currentSlide.content || currentSlide.text || 'No content'}
        </Typography>
      ) : (
        <Typography sx={{ opacity: 0.5, fontSize: '24px' }}>
          No slide selected
        </Typography>
      )}
    </Box>
  );
};

// Stage Display Content - shows current + next slide for worship team
const StageDisplayContent = ({ currentSlide, nextSlide, formatting, timer }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        color: '#ffffff',
        fontFamily: 'Arial'
      }}
    >
      {/* Timer Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          backgroundColor: '#16213e',
          borderBottom: '2px solid #0f3460'
        }}
      >
        <Typography variant="h6" sx={{ color: '#81c784' }}>
          STAGE DISPLAY
        </Typography>
        <Typography variant="h4" sx={{ fontFamily: 'monospace', color: '#e94560' }}>
          {timer || '00:00:00'}
        </Typography>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', p: 2, gap: 2 }}>
        {/* Current Slide */}
        <Paper
          sx={{
            flex: 2,
            backgroundColor: '#0f3460',
            p: 3,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="overline" sx={{ color: '#81c784', mb: 1 }}>
            CURRENT
          </Typography>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: formatting?.backgroundColor || '#000000',
              borderRadius: 1,
              p: 2
            }}
          >
            <Typography
              sx={{
                fontSize: '32px',
                color: formatting?.fontColor || '#ffffff',
                fontFamily: formatting?.fontFamily || 'Arial',
                textAlign: 'center',
                whiteSpace: 'pre-wrap'
              }}
            >
              {currentSlide?.content || currentSlide?.text || 'No current slide'}
            </Typography>
          </Box>
        </Paper>

        {/* Next Slide */}
        <Paper
          sx={{
            flex: 1,
            backgroundColor: '#1a1a2e',
            border: '2px solid #0f3460',
            p: 2,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="overline" sx={{ color: '#e94560', mb: 1 }}>
            NEXT
          </Typography>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: 1,
              p: 2,
              opacity: 0.8
            }}
          >
            <Typography
              sx={{
                fontSize: '18px',
                color: '#cccccc',
                fontFamily: formatting?.fontFamily || 'Arial',
                textAlign: 'center',
                whiteSpace: 'pre-wrap'
              }}
            >
              {nextSlide?.content || nextSlide?.text || 'End of presentation'}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Notes Area */}
      <Box
        sx={{
          p: 2,
          backgroundColor: '#16213e',
          borderTop: '2px solid #0f3460',
          minHeight: 80
        }}
      >
        <Typography variant="overline" sx={{ color: '#888', display: 'block', mb: 0.5 }}>
          NOTES
        </Typography>
        <Typography sx={{ color: '#ccc', fontSize: '14px' }}>
          {currentSlide?.notes || 'No notes for this slide'}
        </Typography>
      </Box>
    </Box>
  );
};

// Configure Screens Dialog
export const ConfigureScreensDialog = ({ open, onClose, screenConfig, onSave }) => {
  const [config, setConfig] = useState(screenConfig || {
    mainOutput: { enabled: true, monitor: 'window' },
    stageDisplay: { enabled: true, monitor: 'window' }
  });

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#2d2d30',
          color: '#cccccc'
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #3e3e42' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon />
          Configure Screens
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Alert severity="info" sx={{ mb: 3, backgroundColor: '#1e3a5f', color: '#fff' }}>
          Configure how outputs are displayed. In a browser environment, outputs open as separate windows.
          For full-screen projection, use the fullscreen button in each output window.
        </Alert>

        <Grid container spacing={3}>
          {/* Main Output Config */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, backgroundColor: '#3c3c3d' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TvIcon sx={{ color: '#81c784' }} />
                <Typography variant="h6">Main Output</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#999', mb: 2 }}>
                The primary display for congregation. Shows current slide content.
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.mainOutput.enabled}
                    onChange={(e) => setConfig({
                      ...config,
                      mainOutput: { ...config.mainOutput, enabled: e.target.checked }
                    })}
                    sx={{ '& .MuiSwitch-thumb': { backgroundColor: '#81c784' } }}
                  />
                }
                label="Enable Main Output"
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel sx={{ color: '#999' }}>Display Mode</InputLabel>
                <Select
                  value={config.mainOutput.monitor}
                  label="Display Mode"
                  onChange={(e) => setConfig({
                    ...config,
                    mainOutput: { ...config.mainOutput, monitor: e.target.value }
                  })}
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' }
                  }}
                >
                  <MenuItem value="window">Popup Window</MenuItem>
                  <MenuItem value="fullscreen">Fullscreen (Primary)</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>

          {/* Stage Display Config */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, backgroundColor: '#3c3c3d' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <MonitorIcon sx={{ color: '#e94560' }} />
                <Typography variant="h6">Stage Display</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#999', mb: 2 }}>
                Confidence monitor for worship team. Shows current, next slide, and timer.
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.stageDisplay.enabled}
                    onChange={(e) => setConfig({
                      ...config,
                      stageDisplay: { ...config.stageDisplay, enabled: e.target.checked }
                    })}
                    sx={{ '& .MuiSwitch-thumb': { backgroundColor: '#e94560' } }}
                  />
                }
                label="Enable Stage Display"
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel sx={{ color: '#999' }}>Display Mode</InputLabel>
                <Select
                  value={config.stageDisplay.monitor}
                  label="Display Mode"
                  onChange={(e) => setConfig({
                    ...config,
                    stageDisplay: { ...config.stageDisplay, monitor: e.target.value }
                  })}
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' }
                  }}
                >
                  <MenuItem value="window">Popup Window</MenuItem>
                  <MenuItem value="fullscreen">Fullscreen (Secondary)</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid #3e3e42', p: 2 }}>
        <Button onClick={onClose} sx={{ color: '#999' }}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: '#0e639c' }}>
          Save Configuration
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Screen Manager Provider
export const ScreenManagerProvider = ({ children }) => {
  const [mainOutputWindow, setMainOutputWindow] = useState(null);
  const [stageDisplayWindow, setStageDisplayWindow] = useState(null);
  const [mainOutputActive, setMainOutputActive] = useState(false);
  const [stageDisplayActive, setStageDisplayActive] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [nextSlide, setNextSlide] = useState(null);
  const [formatting, setFormatting] = useState({});
  const [isBlacked, setIsBlacked] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [presentationTitle, setPresentationTitle] = useState('');
  const [slideIndex, setSlideIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timer, setTimer] = useState('00:00:00');
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [screenConfig, setScreenConfig] = useState(() => {
    const saved = localStorage.getItem('screenConfig');
    return saved ? JSON.parse(saved) : {
      mainOutput: { enabled: true, monitor: 'window' },
      stageDisplay: { enabled: true, monitor: 'window', timerMode: 'elapsed', countdownSeconds: 300 }
    };
  });

  // Timer effect
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const totalSeconds = Math.floor(elapsed / 1000);
      setElapsedSeconds(totalSeconds);
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setTimer(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen for slide changes
  useEffect(() => {
    const handleSlideChange = (event) => {
      if (event.detail) {
        setCurrentSlide(event.detail.currentSlide);
        setNextSlide(event.detail.nextSlide);
        setFormatting(event.detail.formatting || {});
        setIsBlacked(Boolean(event.detail.isBlacked));
        setIsCleared(Boolean(event.detail.isCleared));
        setPresentationTitle(typeof event.detail.presentationTitle === 'string' ? event.detail.presentationTitle : '');
        setSlideIndex(Number.isFinite(event.detail.slideIndex) ? event.detail.slideIndex : 0);
        setTotalSlides(Number.isFinite(event.detail.totalSlides) ? event.detail.totalSlides : 0);
        setIsLive(Boolean(event.detail.isLive));
      }
    };

    window.addEventListener('slide:change', handleSlideChange);
    return () => window.removeEventListener('slide:change', handleSlideChange);
  }, []);

  // Listen for overlay controls (message + logo)
  useEffect(() => {
    const handleOverlayMessage = (event) => {
      const message = typeof event.detail?.message === 'string' ? event.detail.message : '';
      setOverlayMessage(message);
    };

    const handleOverlayLogo = (event) => {
      const url = typeof event.detail?.url === 'string' ? event.detail.url : '';
      setLogoUrl(url);
    };

    window.addEventListener('output:overlay-message', handleOverlayMessage);
    window.addEventListener('output:overlay-logo', handleOverlayLogo);
    return () => {
      window.removeEventListener('output:overlay-message', handleOverlayMessage);
      window.removeEventListener('output:overlay-logo', handleOverlayLogo);
    };
  }, []);

  // Define update functions first (before useEffects that use them)
  const ensureMainOutputDom = useCallback(() => {
    if (!mainOutputWindow || mainOutputWindow.closed) return;

    const doc = mainOutputWindow.document;
    const hasRoot = Boolean(doc.getElementById('wr-main-root'));
    if (hasRoot) return;

    doc.open();
    doc.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Main Output - WorshipRess</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { overflow: hidden; }
            .fullscreen-btn {
              position: fixed;
              top: 10px;
              right: 10px;
              background: rgba(255,255,255,0.1);
              border: 1px solid rgba(255,255,255,0.3);
              color: white;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
              z-index: 1000;
              opacity: 0;
              transition: opacity 0.3s;
            }
            .fullscreen-btn:hover { background: rgba(255,255,255,0.2); }
            body:hover .fullscreen-btn { opacity: 1; }
            .overlay-message {
              position: fixed;
              left: 50%;
              bottom: 28px;
              transform: translateX(-50%);
              background: rgba(0,0,0,0.6);
              border: 1px solid rgba(255,255,255,0.2);
              color: #fff;
              padding: 10px 16px;
              border-radius: 10px;
              font-size: 18px;
              font-family: 'Segoe UI', Arial, sans-serif;
              max-width: calc(100vw - 80px);
              text-align: center;
              z-index: 999;
              display: none;
            }
            .logo {
              position: fixed;
              left: 28px;
              bottom: 28px;
              width: 120px;
              height: 120px;
              object-fit: contain;
              opacity: 0.9;
              z-index: 998;
              filter: drop-shadow(0 4px 10px rgba(0,0,0,0.7));
              display: none;
            }
            .slide-content {
              width: 100vw;
              height: 100vh;
              padding: 60px;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              white-space: pre-wrap;
              line-height: 1.4;
            }
            .no-content { opacity: 0.3; font-size: 24px; }
          </style>
        </head>
        <body>
          <script>
            function toggleFullscreen() {
              try {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  document.documentElement.requestFullscreen();
                }
              } catch (e) {}
            }
          </script>
          <button class="fullscreen-btn" onclick="toggleFullscreen()">⛶ Fullscreen</button>
          <div id="wr-main-root" class="slide-content"></div>
          <img id="wr-main-logo" class="logo" alt="logo" />
          <div id="wr-main-message" class="overlay-message"></div>
        </body>
      </html>
    `);
    doc.close();
  }, [mainOutputWindow]);

  const ensureStageDisplayDom = useCallback(() => {
    if (!stageDisplayWindow || stageDisplayWindow.closed) return;

    const doc = stageDisplayWindow.document;
    const hasRoot = Boolean(doc.getElementById('wr-stage-container'));
    if (hasRoot) return;

    doc.open();
    doc.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Stage Display - WorshipRess</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { overflow: hidden; font-family: 'Segoe UI', Arial, sans-serif; }
            .fullscreen-btn {
              position: fixed;
              top: 10px;
              right: 10px;
              background: rgba(255,255,255,0.1);
              border: 1px solid rgba(255,255,255,0.3);
              color: white;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
              z-index: 1000;
              opacity: 0;
              transition: opacity 0.3s;
            }
            .fullscreen-btn:hover { background: rgba(255,255,255,0.2); }
            body:hover .fullscreen-btn { opacity: 1; }
            .container {
              width: 100vw;
              height: 100vh;
              background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
              display: flex;
              flex-direction: column;
              color: #ffffff;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 20px;
              background: rgba(0,0,0,0.3);
              border-bottom: 2px solid #0f3460;
            }
            .header-left { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
            .logo { color: #81c784; font-size: 16px; font-weight: bold; letter-spacing: 1px; }
            .title { color: #fff; font-size: 14px; opacity: 0.9; }
            .slidepos { color: #fff; font-size: 14px; opacity: 0.75; font-family: 'Consolas', monospace; }
            .clock { font-family: 'Consolas', monospace; font-size: 28px; color: #4fc3f7; }
            .timer { font-family: 'Consolas', monospace; font-size: 28px; color: #e94560; }
            .main-content { flex: 1; display: flex; padding: 16px; gap: 16px; overflow: hidden; }
            .current-panel {
              flex: 2;
              background: rgba(15, 52, 96, 0.5);
              border-radius: 12px;
              padding: 16px;
              display: flex;
              flex-direction: column;
              border: 1px solid #0f3460;
            }
            .next-panel {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 16px;
            }
            .panel-label {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 2px;
              margin-bottom: 8px;
              font-weight: 600;
            }
            .current-label { color: #81c784; }
            .next-label { color: #e94560; }
            .slide-preview {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
              padding: 20px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            }
            .current-text {
              font-size: 32px;
              text-align: center;
              white-space: pre-wrap;
              line-height: 1.3;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            .next-box {
              flex: 1;
              background: rgba(0,0,0,0.3);
              border: 2px solid #0f3460;
              border-radius: 12px;
              padding: 12px;
              display: flex;
              flex-direction: column;
            }
            .next-preview {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(0,0,0,0.2);
              border-radius: 6px;
              padding: 12px;
            }
            .next-text {
              font-size: 16px;
              color: #aaa;
              text-align: center;
              white-space: pre-wrap;
              line-height: 1.3;
            }
            .footer {
              padding: 12px 20px;
              background: rgba(0,0,0,0.3);
              border-top: 2px solid #0f3460;
              display: flex;
              gap: 40px;
            }
            .notes-section { flex: 2; }
            .info-section { flex: 1; display: flex; flex-direction: column; align-items: flex-end; }
            .section-label { color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
            .notes-text { color: #ccc; font-size: 14px; line-height: 1.4; }
            .slide-label { color: #4fc3f7; font-size: 14px; font-weight: 500; }
          </style>
        </head>
        <body>
          <script>
            function toggleFullscreen() {
              try {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  document.documentElement.requestFullscreen();
                }
              } catch (e) {}
            }
          </script>
          <button class="fullscreen-btn" onclick="toggleFullscreen()">⛶ Fullscreen</button>
          <div id="wr-stage-container" class="container">
            <div class="header">
              <div class="header-left">
                <span class="logo">📺 STAGE DISPLAY</span>
                <span id="wr-stage-title" class="title"></span>
                <span id="wr-stage-slidepos" class="slidepos"></span>
                <span id="wr-stage-clock" class="clock"></span>
              </div>
              <span id="wr-stage-timer" class="timer"></span>
            </div>
            <div class="main-content">
              <div class="current-panel">
                <span class="panel-label current-label">● CURRENT SLIDE</span>
                <div id="wr-stage-current-box" class="slide-preview">
                  <span id="wr-stage-current" class="current-text"></span>
                </div>
              </div>
              <div class="next-panel">
                <div class="next-box">
                  <span class="panel-label next-label">◐ UP NEXT</span>
                  <div class="next-preview">
                    <span id="wr-stage-next" class="next-text"></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="footer">
              <div class="notes-section">
                <div class="section-label">📝 Notes</div>
                <div id="wr-stage-notes" class="notes-text"></div>
              </div>
              <div class="info-section">
                <div class="section-label">Slide Info</div>
                <div id="wr-stage-label" class="slide-label"></div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    doc.close();
  }, [stageDisplayWindow]);

  const updateMainOutputWindow = useCallback(() => {
    if (mainOutputWindow && !mainOutputWindow.closed) {
      ensureMainOutputDom();

      const doc = mainOutputWindow.document;
      const root = doc.getElementById('wr-main-root');
      const logoEl = doc.getElementById('wr-main-logo');
      const msgEl = doc.getElementById('wr-main-message');
      if (!root) return;

      const content = isBlacked ? '' : (isCleared ? '' : (currentSlide?.content || currentSlide?.text || ''));
      const bg = formatting?.backgroundColor || '#000000';
      const color = formatting?.fontColor || '#ffffff';
      const font = formatting?.fontFamily || 'Arial';
      const fontSize = formatting?.fontSize || 48;
      const backgroundColor = isBlacked ? '#000000' : bg;

      root.style.backgroundColor = backgroundColor;
      root.style.color = color;
      root.style.fontFamily = `'${font}', Arial, sans-serif`;
      root.style.fontSize = `${fontSize}px`;
      root.style.textShadow = '2px 2px 8px rgba(0,0,0,0.9)';

      if (content) {
        root.textContent = content;
      } else if (!isBlacked && !isCleared) {
        root.innerHTML = '<span class="no-content">No slide selected<br><small>Go live from Worship Workspace</small></span>';
      } else {
        root.textContent = '';
      }

      if (logoEl) {
        if (logoUrl) {
          if (logoEl.getAttribute('src') !== logoUrl) logoEl.setAttribute('src', logoUrl);
          logoEl.style.display = 'block';
        } else {
          logoEl.style.display = 'none';
        }
      }

      if (msgEl) {
        if (overlayMessage) {
          msgEl.textContent = overlayMessage;
          msgEl.style.display = 'block';
        } else {
          msgEl.style.display = 'none';
        }
      }
    }
  }, [mainOutputWindow, currentSlide, formatting, isBlacked, isCleared, overlayMessage, logoUrl, ensureMainOutputDom]);

  const updateStageDisplayWindow = useCallback(() => {
    if (stageDisplayWindow && !stageDisplayWindow.closed) {
      ensureStageDisplayDom();

      const current = currentSlide?.content || currentSlide?.text || 'No current slide';
      const next = nextSlide?.content || nextSlide?.text || 'End of presentation';
      const notes = currentSlide?.notes || currentSlide?.label || '';
      const slideLabel = currentSlide?.label || '';
      const font = formatting?.fontFamily || 'Arial';
      const bg = formatting?.backgroundColor || '#000000';
      const color = formatting?.fontColor || '#ffffff';
      const now = new Date();
      const clockTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const safeTitle = presentationTitle || 'WorshipRess';
      const safeIndex = (Number.isFinite(slideIndex) ? slideIndex : 0) + 1;
      const safeTotal = Number.isFinite(totalSlides) ? totalSlides : 0;
      const timerMode = screenConfig?.stageDisplay?.timerMode || 'elapsed';
      const countdownSeconds = Number.isFinite(screenConfig?.stageDisplay?.countdownSeconds)
        ? screenConfig.stageDisplay.countdownSeconds
        : 0;
      const remaining = Math.max(0, countdownSeconds - elapsedSeconds);

      const formatHMS = (total) => {
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = Math.floor(total % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      };

      const stageTimer = timerMode === 'countdown' ? formatHMS(remaining) : timer;

      const doc = stageDisplayWindow.document;
      const titleEl = doc.getElementById('wr-stage-title');
      const slidePosEl = doc.getElementById('wr-stage-slidepos');
      const clockEl = doc.getElementById('wr-stage-clock');
      const timerEl = doc.getElementById('wr-stage-timer');
      const currentBoxEl = doc.getElementById('wr-stage-current-box');
      const currentEl = doc.getElementById('wr-stage-current');
      const nextEl = doc.getElementById('wr-stage-next');
      const notesEl = doc.getElementById('wr-stage-notes');
      const labelEl = doc.getElementById('wr-stage-label');

      if (titleEl) titleEl.textContent = safeTitle;
      if (slidePosEl) slidePosEl.textContent = `${safeTotal ? `${safeIndex}/${safeTotal}` : `${safeIndex}`}${isLive ? ' LIVE' : ''}`;
      if (clockEl) clockEl.textContent = `🕐 ${clockTime}`;
      if (timerEl) timerEl.textContent = `${timerMode === 'countdown' ? '⏳' : '⏱'} ${stageTimer}`;

      if (currentBoxEl) currentBoxEl.style.background = bg;
      if (currentEl) {
        currentEl.textContent = current;
        currentEl.style.color = color;
        currentEl.style.fontFamily = `'${font}', Arial, sans-serif`;
      }
      if (nextEl) {
        nextEl.textContent = next;
        nextEl.style.fontFamily = `'${font}', Arial, sans-serif`;
      }
      if (notesEl) notesEl.textContent = notes || 'No notes for this slide';
      if (labelEl) labelEl.textContent = slideLabel || 'Slide';
    }
  }, [stageDisplayWindow, currentSlide, nextSlide, formatting, timer, presentationTitle, slideIndex, totalSlides, isLive, elapsedSeconds, screenConfig, ensureStageDisplayDom]);

  const requestFullscreenForWindow = useCallback((target) => {
    const targetWindow = target === 'stage' ? stageDisplayWindow : mainOutputWindow;
    if (!targetWindow || targetWindow.closed) return;

    try {
      targetWindow.focus();
      const doc = targetWindow.document;
      const el = doc?.documentElement;
      if (!el) return;
      if (doc.fullscreenElement) {
        doc.exitFullscreen?.();
      } else {
        el.requestFullscreen?.();
      }
    } catch (e) {
      // Fullscreen requests often require a direct user gesture.
      // The in-window fullscreen button remains the most reliable path.
    }
  }, [mainOutputWindow, stageDisplayWindow]);

  const focusOutputWindow = useCallback((target) => {
    const targetWindow = target === 'stage' ? stageDisplayWindow : mainOutputWindow;
    if (!targetWindow || targetWindow.closed) return;
    try {
      targetWindow.focus();
    } catch (e) {
      // ignore
    }
  }, [mainOutputWindow, stageDisplayWindow]);

  // Allow app-level fullscreen toggles (may be blocked by browser gesture rules)
  useEffect(() => {
    const handleToggleFullscreen = (event) => {
      const target = event.detail?.target;
      if (target === 'stage' || target === 'main') {
        requestFullscreenForWindow(target === 'stage' ? 'stage' : 'main');
      } else {
        // default: toggle main output
        requestFullscreenForWindow('main');
      }
    };

    window.addEventListener('app:toggle-fullscreen', handleToggleFullscreen);
    return () => window.removeEventListener('app:toggle-fullscreen', handleToggleFullscreen);
  }, [requestFullscreenForWindow]);

  // Update output windows when slide changes
  useEffect(() => {
    if (mainOutputWindow && !mainOutputWindow.closed) {
      updateMainOutputWindow();
    }
    if (stageDisplayWindow && !stageDisplayWindow.closed) {
      updateStageDisplayWindow();
    }
  }, [currentSlide, nextSlide, formatting, mainOutputWindow, stageDisplayWindow, updateMainOutputWindow, updateStageDisplayWindow]);

  // Update stage display timer every second
  useEffect(() => {
    if (stageDisplayWindow && !stageDisplayWindow.closed) {
      updateStageDisplayWindow();
    }
  }, [timer, stageDisplayWindow, updateStageDisplayWindow]);

  // Toggle Main Output
  const toggleMainOutput = useCallback(() => {
    if (mainOutputActive && mainOutputWindow && !mainOutputWindow.closed) {
      mainOutputWindow.close();
      setMainOutputWindow(null);
      setMainOutputActive(false);
    } else {
      const newWindow = window.open('', 'MainOutput', 'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no');
      if (newWindow) {
        newWindow.document.title = 'Main Output - WorshipRess';
        newWindow.document.body.style.margin = '0';
        newWindow.document.body.style.overflow = 'hidden';
        setMainOutputWindow(newWindow);
        setMainOutputActive(true);
        
        // Check if window was closed
        const checkClosed = setInterval(() => {
          if (newWindow.closed) {
            setMainOutputActive(false);
            setMainOutputWindow(null);
            clearInterval(checkClosed);
          }
        }, 500);
      }
    }
  }, [mainOutputActive, mainOutputWindow]);

  // Toggle Stage Display
  const toggleStageDisplay = useCallback(() => {
    if (stageDisplayActive && stageDisplayWindow && !stageDisplayWindow.closed) {
      stageDisplayWindow.close();
      setStageDisplayWindow(null);
      setStageDisplayActive(false);
    } else {
      const newWindow = window.open('', 'StageDisplay', 'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no');
      if (newWindow) {
        newWindow.document.title = 'Stage Display - WorshipRess';
        newWindow.document.body.style.margin = '0';
        newWindow.document.body.style.overflow = 'hidden';
        setStageDisplayWindow(newWindow);
        setStageDisplayActive(true);
        
        // Check if window was closed
        const checkClosed = setInterval(() => {
          if (newWindow.closed) {
            setStageDisplayActive(false);
            setStageDisplayWindow(null);
            clearInterval(checkClosed);
          }
        }, 500);
      }
    }
  }, [stageDisplayActive, stageDisplayWindow]);

  // Open Configure Dialog
  const openConfigureDialog = () => setConfigDialogOpen(true);
  const closeConfigureDialog = () => setConfigDialogOpen(false);

  // Save config
  const saveConfig = (newConfig) => {
    setScreenConfig(newConfig);
    localStorage.setItem('screenConfig', JSON.stringify(newConfig));
  };

  // Broadcast slide to outputs
  const broadcastSlide = useCallback((slide, next, format) => {
    setCurrentSlide(slide);
    setNextSlide(next);
    setFormatting(format || {});
  }, []);

  const value = {
    mainOutputActive,
    stageDisplayActive,
    toggleMainOutput,
    toggleStageDisplay,
    openConfigureDialog,
    broadcastSlide,
    currentSlide,
    screenConfig,
    requestFullscreenForWindow,
    focusOutputWindow,
    setOverlayMessage,
    setLogoUrl
  };

  return (
    <ScreenContext.Provider value={value}>
      {children}
      <ConfigureScreensDialog
        open={configDialogOpen}
        onClose={closeConfigureDialog}
        screenConfig={screenConfig}
        onSave={saveConfig}
      />
    </ScreenContext.Provider>
  );
};

export default ScreenManagerProvider;
