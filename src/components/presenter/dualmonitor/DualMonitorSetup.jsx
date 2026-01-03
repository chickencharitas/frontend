import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  Alert,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Tv,
  Computer,
  Settings,
  Info,
  SwapHoriz,
  Fullscreen
} from '@mui/icons-material';

const DualMonitorSetup = ({ onSetupComplete, currentSetup = {} }) => {
  const [displays, setDisplays] = useState([]);
  const [selectedPrimary, setSelectedPrimary] = useState('');
  const [selectedSecondary, setSelectedSecondary] = useState('');
  const [dualMonitorEnabled, setDualMonitorEnabled] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [detectedDisplays, setDetectedDisplays] = useState([]);

  useEffect(() => {
    detectDisplays();
  }, []);

  const detectDisplays = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const screens = devices.filter(d => d.kind === 'videoinput');
        
        // Simulate multiple displays (in real app, use Screen API)
        const simulatedDisplays = [
          { id: 'primary', name: 'Main Display', width: 1920, height: 1080, refreshRate: 60 },
          { id: 'secondary', name: 'Secondary Display', width: 1920, height: 1080, refreshRate: 60 },
          { id: 'tertiary', name: 'Stage Display', width: 1024, height: 768, refreshRate: 60 }
        ];
        
        setDetectedDisplays(simulatedDisplays);
        setDisplays(simulatedDisplays);
        
        if (simulatedDisplays.length > 0) {
          setSelectedPrimary(simulatedDisplays[0].id);
        }
        if (simulatedDisplays.length > 1) {
          setSelectedSecondary(simulatedDisplays[1].id);
        }
      }
    } catch (error) {
      console.error('Error detecting displays:', error);
      // Fallback displays
      const fallback = [
        { id: 'primary', name: 'Main Display', width: 1920, height: 1080, refreshRate: 60 }
      ];
      setDisplays(fallback);
      setDetectedDisplays(fallback);
    }
  };

  const handleSetupDualMonitor = () => {
    if (selectedPrimary && selectedSecondary && selectedPrimary !== selectedSecondary) {
      const setup = {
        enabled: true,
        primary: displays.find(d => d.id === selectedPrimary),
        secondary: displays.find(d => d.id === selectedSecondary)
      };
      
      setDualMonitorEnabled(true);
      window.dispatchEvent(new CustomEvent('presenter:dual-monitor-enabled', { detail: setup }));
      localStorage.setItem('dualMonitorSetup', JSON.stringify(setup));
      
      onSetupComplete?.(setup);
      setOpenDialog(false);
    }
  };

  const handleSwapMonitors = () => {
    [setSelectedPrimary, setSelectedSecondary].forEach((setter, idx) => {
      const temp = selectedPrimary;
      setSelectedPrimary(selectedSecondary);
      setSelectedSecondary(temp);
    });
  };

  const handleDisableDualMonitor = () => {
    setDualMonitorEnabled(false);
    window.dispatchEvent(new CustomEvent('presenter:dual-monitor-disabled'));
    localStorage.removeItem('dualMonitorSetup');
  };

  return (
    <Box sx={{ bgcolor: '#1a1a1a', color: '#cccccc', p: 2 }}>
      {/* Status Card */}
      <Paper sx={{ backgroundColor: '#252526', p: 2, mb: 2, borderRadius: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tv sx={{ color: dualMonitorEnabled ? '#81c784' : '#808080' }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ color: '#cccccc' }}>
              Dual Monitor Status
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              {dualMonitorEnabled 
                ? `Primary: ${displays.find(d => d.id === selectedPrimary)?.name || 'Unknown'} | Secondary: ${displays.find(d => d.id === selectedSecondary)?.name || 'Unknown'}`
                : 'Single monitor mode'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            sx={{ backgroundColor: '#81c784', color: '#1a1a1a', borderRadius: 0 }}
          >
            <Settings sx={{ mr: 1 }} />
            Configure
          </Button>
        </Box>
      </Paper>

      {/* Active Setup Info */}
      {dualMonitorEnabled && (
        <Alert
          severity="success"
          sx={{
            backgroundColor: '#1f5e20',
            color: '#81c784',
            mb: 2,
            borderRadius: 0
          }}
        >
          ✓ Dual monitor setup is active. Presenter view will display on secondary monitor.
        </Alert>
      )}

      {/* Configuration Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Dual Monitor Configuration</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Display Detection */}
            <Alert
              icon={<Info />}
              severity="info"
              sx={{ mb: 2 }}
            >
              {detectedDisplays.length} display(s) detected
            </Alert>

            {/* Primary Monitor Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#b0b0b0', mb: 1 }}>
                Main Display (Audience View)
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={selectedPrimary}
                  onChange={(e) => setSelectedPrimary(e.target.value)}
                  sx={{
                    color: '#cccccc',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                  }}
                >
                  {displays.map(display => (
                    <MenuItem key={display.id} value={display.id}>
                      {display.name} ({display.width}x{display.height})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="caption" sx={{ color: '#808080', mt: 1, display: 'block' }}>
                This is what the audience sees
              </Typography>
            </Box>

            {/* Secondary Monitor Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#b0b0b0', mb: 1 }}>
                Presenter Display (Your View)
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={selectedSecondary}
                  onChange={(e) => setSelectedSecondary(e.target.value)}
                  sx={{
                    color: '#cccccc',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                  }}
                >
                  {displays.filter(d => d.id !== selectedPrimary).map(display => (
                    <MenuItem key={display.id} value={display.id}>
                      {display.name} ({display.width}x{display.height})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="caption" sx={{ color: '#808080', mt: 1, display: 'block' }}>
                Show presenter notes, timer, and next slide preview
              </Typography>
            </Box>

            {/* Swap Button */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<SwapHoriz />}
              onClick={handleSwapMonitors}
              sx={{ mb: 3, borderColor: '#81c784', color: '#81c784', borderRadius: 0 }}
            >
              Swap Displays
            </Button>

            {/* Display Preview */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: '#b0b0b0', mb: 1 }}>
                Preview
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Paper sx={{ backgroundColor: '#3c3c3d', p: 2, borderRadius: 0 }}>
                    <Computer sx={{ color: '#81c784', mb: 1 }} />
                    <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                      Audience
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cccccc', mt: 0.5 }}>
                      {displays.find(d => d.id === selectedPrimary)?.name}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ backgroundColor: '#3c3c3d', p: 2, borderRadius: 0 }}>
                    <Tv sx={{ color: '#81c784', mb: 1 }} />
                    <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                      Presenter
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cccccc', mt: 0.5 }}>
                      {displays.find(d => d.id === selectedSecondary)?.name}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Extended Display Warning */}
            <Alert severity="warning" sx={{ borderRadius: 0 }}>
              Ensure both displays are connected and set to Extended Display mode in your OS.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSetupDualMonitor}
            variant="contained"
            disabled={!selectedPrimary || !selectedSecondary || selectedPrimary === selectedSecondary}
            sx={{ backgroundColor: '#81c784', color: '#1a1a1a', borderRadius: 0 }}
          >
            Enable Dual Monitor
          </Button>
        </DialogActions>
      </Dialog>

      {/* Currently Active Setup */}
      {dualMonitorEnabled && (
        <Paper sx={{ backgroundColor: '#252526', p: 2, borderRadius: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#cccccc', mb: 1 }}>
                Active Configuration
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                📺 Audience: {displays.find(d => d.id === selectedPrimary)?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                🎤 Presenter: {displays.find(d => d.id === selectedSecondary)?.name}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDisableDualMonitor}
              sx={{ borderRadius: 0 }}
            >
              Disable
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default DualMonitorSetup;
