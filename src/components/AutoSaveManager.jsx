import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  LinearProgress,
  Snackbar,
  Tooltip
} from '@mui/material';
import {
  Save,
  Restore,
  Backup,
  RestoreFromTrash,
  History,
  CloudUpload,
  CloudDownload,
  Warning,
  CheckCircle,
  Error,
  Info,
  Schedule,
  Timer,
  Storage,
  Folder,
  DeleteForever,
  Undo,
  Redo,
  Settings
} from '@mui/icons-material';

// Mock auto-save data
const mockAutoSaves = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    title: 'Sunday Morning Service - AutoSave',
    size: 245680,
    status: 'completed'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    title: 'Sunday Morning Service - AutoSave',
    size: 234560,
    status: 'completed'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    title: 'Sunday Morning Service - AutoSave',
    size: 223440,
    status: 'completed'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    title: 'Sunday Morning Service - AutoSave',
    size: 212320,
    status: 'completed'
  }
];

const mockBackups = [
  {
    id: 'backup_1',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    title: 'Sunday Morning Service - Backup',
    size: 456780,
    location: '~/Documents/ProPresenter/Backups',
    status: 'completed'
  },
  {
    id: 'backup_2',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    title: 'Sunday Morning Service - Backup',
    size: 445660,
    location: '~/Documents/ProPresenter/Backups',
    status: 'completed'
  },
  {
    id: 'backup_3',
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    title: 'Sunday Morning Service - Backup',
    size: 434540,
    location: '~/Documents/ProPresenter/Backups',
    status: 'completed'
  }
];

const AutoSaveManager = ({ onClose }) => {
  const [autoSaves, setAutoSaves] = useState(mockAutoSaves);
  const [backups, setBackups] = useState(mockBackups);
  const [activeTab, setActiveTab] = useState(0);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(new Date());
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [selectedSave, setSelectedSave] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Auto-save timer
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [timeUntilNextSave, setTimeUntilNextSave] = useState(300); // 5 minutes

  // Simulate auto-save process
  const performAutoSave = useCallback(() => {
    setIsAutoSaving(true);
    setTimeout(() => {
      const newSave = {
        id: Date.now().toString(),
        timestamp: new Date(),
        title: 'Sunday Morning Service - AutoSave',
        size: Math.floor(Math.random() * 10000) + 200000,
        status: 'completed'
      };

      setAutoSaves(prev => [newSave, ...prev.slice(0, 9)]); // Keep only 10 most recent
      setLastSaveTime(new Date());
      setTimeUntilNextSave(300); // Reset timer
      setIsAutoSaving(false);

      setSnackbar({
        open: true,
        message: 'Presentation auto-saved successfully',
        severity: 'success'
      });
    }, 2000);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeUntilNextSave > 0) {
      const timer = setTimeout(() => {
        setTimeUntilNextSave(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      performAutoSave();
    }
  }, [timeUntilNextSave, performAutoSave]);

  const formatTime = (date) => {
    return date.toLocaleString();
  };

  const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const handleRestoreSave = (save) => {
    setSelectedSave(save);
    setShowRestoreDialog(true);
  };

  const confirmRestore = () => {
    // In a real app, this would load the saved presentation
    console.log('Restoring save:', selectedSave);
    setShowRestoreDialog(false);
    setSelectedSave(null);

    setSnackbar({
      open: true,
      message: 'Presentation restored from auto-save',
      severity: 'success'
    });
  };

  const handleDeleteSave = (save) => {
    setSelectedSave(save);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedSave.id.startsWith('backup_')) {
      setBackups(prev => prev.filter(b => b.id !== selectedSave.id));
    } else {
      setAutoSaves(prev => prev.filter(s => s.id !== selectedSave.id));
    }
    setShowDeleteDialog(false);
    setSelectedSave(null);

    setSnackbar({
      open: true,
      message: 'Save file deleted',
      severity: 'info'
    });
  };

  const createManualBackup = () => {
    const newBackup = {
      id: `backup_${Date.now()}`,
      timestamp: new Date(),
      title: 'Sunday Morning Service - Manual Backup',
      size: Math.floor(Math.random() * 50000) + 400000,
      location: '~/Documents/ProPresenter/Backups',
      status: 'completed'
    };

    setBackups(prev => [newBackup, ...prev]);
    setSnackbar({
      open: true,
      message: 'Manual backup created successfully',
      severity: 'success'
    });
  };

  const renderAutoSavesTab = () => (
    <Box>
      <Box sx={{ mb: 3, p: 2, bgcolor: '#2a2a2a', borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timer sx={{ color: 'primary.main' }} />
          Auto-Save Status
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {Math.floor(timeUntilNextSave / 60)}:{(timeUntilNextSave % 60).toString().padStart(2, '0')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Next auto-save
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              {isAutoSaving ? (
                <Box>
                  <LinearProgress sx={{ mb: 1, bgcolor: '#404040' }} />
                  <Typography variant="body2" color="primary">
                    Saving...
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <CheckCircle sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Last saved: {formatTimeAgo(lastSaveTime)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {autoSaves.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Auto-saves available
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <History sx={{ color: '#81c784' }} />
            Recent Auto-Saves
          </Typography>

          <List>
            {autoSaves.map((save) => (
              <ListItem key={save.id} sx={{ borderBottom: '1px solid #404040', '&:last-child': { borderBottom: 'none' } }}>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2">{save.title}</Typography>
                      <Chip
                        label={formatFileSize(save.size)}
                        size="small"
                        sx={{ bgcolor: '#404040', color: '#b0b0b0' }}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(save.timestamp)} ({formatTimeAgo(save.timestamp)})
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Restore this version">
                    <IconButton
                      onClick={() => handleRestoreSave(save)}
                      sx={{ color: 'primary.main' }}
                    >
                      <Restore />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete this save">
                    <IconButton
                      onClick={() => handleDeleteSave(save)}
                      sx={{ color: '#e57373' }}
                    >
                      <DeleteForever />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );

  const renderBackupsTab = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Backup Management</Typography>
        <Button
          variant="contained"
          startIcon={<Backup />}
          onClick={createManualBackup}
          sx={{ bgcolor: 'primary.main' }}
        >
          Create Backup
        </Button>
      </Box>

      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Storage sx={{ color: '#ffb74d' }} />
            Available Backups
          </Typography>

          <List>
            {backups.map((backup) => (
              <ListItem key={backup.id} sx={{ borderBottom: '1px solid #404040', '&:last-child': { borderBottom: 'none' } }}>
                <ListItemIcon>
                  <Backup color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2">{backup.title}</Typography>
                      <Chip
                        label={formatFileSize(backup.size)}
                        size="small"
                        sx={{ bgcolor: '#404040', color: '#b0b0b0' }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(backup.timestamp)} ({formatTimeAgo(backup.timestamp)})
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Location: {backup.location}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Restore from backup">
                    <IconButton
                      onClick={() => handleRestoreSave(backup)}
                      sx={{ color: '#81c784' }}
                    >
                      <RestoreFromTrash />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete backup">
                    <IconButton
                      onClick={() => handleDeleteSave(backup)}
                      sx={{ color: '#e57373' }}
                    >
                      <DeleteForever />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Alert severity="info" sx={{ mt: 3, bgcolor: '#2a2a2a', color: '#b0b0b0' }}>
        <Typography variant="body2">
          <strong>Backup Tips:</strong> Backups are automatically created and stored in your Documents folder.
          You can restore from any backup at any time. Manual backups preserve your current work immediately.
        </Typography>
      </Alert>
    </Box>
  );

  const renderSettingsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Settings sx={{ color: 'primary.main' }} />
        Auto-Save & Backup Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Auto-Save Configuration</Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>Auto-save interval (minutes)</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="primary">5</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={((300 - timeUntilNextSave) / 300) * 100}
                    sx={{ flex: 1, bgcolor: '#404040' }}
                  />
                  <Typography variant="body2">{Math.floor(timeUntilNextSave / 60)}:{(timeUntilNextSave % 60).toString().padStart(2, '0')}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" size="small" sx={{ borderColor: 'primary.main', color: 'primary.main' }}>
                  Change Interval
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={performAutoSave}
                  disabled={isAutoSaving}
                  sx={{ borderColor: '#81c784', color: '#81c784' }}
                >
                  Save Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Backup Configuration</Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>Backup location</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Folder sx={{ color: '#ffb74d' }} />
                  <Typography variant="body2">~/Documents/ProPresenter/Backups</Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>Maximum backups to keep</Typography>
                <Typography variant="body2" color="primary">10</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" size="small" sx={{ borderColor: '#ffb74d', color: '#ffb74d' }}>
                  Change Location
                </Button>
                <Button variant="outlined" size="small" sx={{ borderColor: '#e57373', color: '#e57373' }}>
                  Clean Up
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Alert severity="warning" sx={{ mt: 3, bgcolor: '#2a2a2a', color: '#ffb74d' }}>
        <Typography variant="body2">
          <strong>Important:</strong> Auto-save files are temporary and may be deleted when you close the application.
          Always create manual backups for important presentations.
        </Typography>
      </Alert>
    </Box>
  );

  return (
    <Box sx={{ p: 3, bgcolor: '#1a1a1a', minHeight: '100vh', color: 'white' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Auto-Save & Backup Manager
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#b0b0b0' }}>
            Automatic saving and backup recovery for your presentations
          </Typography>
        </Box>
        {onClose && (
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        )}
      </Box>

      {/* Status Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Save color="success" />
                <Typography variant="h6">Auto-Save</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                Active
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Every 5 minutes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Backup color="warning" />
                <Typography variant="h6">Backups</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {backups.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available backups
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Storage color="info" />
                <Typography variant="h6">Storage</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                2.3 MB
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Used for saves & backups
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Box sx={{ display: 'flex', gap: 0 }}>
            {['Auto-Saves', 'Backups', 'Settings'].map((label, index) => (
              <Button
                key={label}
                onClick={() => setActiveTab(index)}
                sx={{
                  py: 2,
                  px: 3,
                  borderRadius: 0,
                  color: activeTab === index ? 'primary.main' : '#b0b0b0',
                  borderBottom: activeTab === index ? '2px solid' : 'none',
                  borderColor: activeTab === index ? 'primary.main' : 'transparent',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderAutoSavesTab()}
          {activeTab === 1 && renderBackupsTab()}
          {activeTab === 2 && renderSettingsTab()}
        </Box>
      </Paper>

      {/* Restore Dialog */}
      <Dialog
        open={showRestoreDialog}
        onClose={() => setShowRestoreDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: '#2a2a2a',
            color: 'white',
            border: '1px solid #404040'
          }
        }}
      >
        <DialogTitle>Restore Presentation</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to restore this presentation? Any unsaved changes will be lost.
          </Typography>
          {selectedSave && (
            <Box sx={{ p: 2, bgcolor: '#333', borderRadius: 1 }}>
              <Typography variant="subtitle2">{selectedSave.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                Saved: {formatTime(selectedSave.timestamp)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRestoreDialog(false)} sx={{ color: '#b0b0b0' }}>
            Cancel
          </Button>
          <Button onClick={confirmRestore} sx={{ color: 'primary.main' }}>
            Restore
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: '#2a2a2a',
            color: 'white',
            border: '1px solid #404040'
          }
        }}
      >
        <DialogTitle>Delete Save File</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            This action cannot be undone. Are you sure you want to delete this save file?
          </Typography>
          {selectedSave && (
            <Box sx={{ p: 2, bgcolor: '#333', borderRadius: 1 }}>
              <Typography variant="subtitle2">{selectedSave.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                {formatTime(selectedSave.timestamp)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} sx={{ color: '#b0b0b0' }}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} sx={{ color: '#e57373' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AutoSaveManager;