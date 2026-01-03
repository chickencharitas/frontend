import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import {
  Palette,
  Notifications,
  Save,
  Lock,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check,
  Close,
  Keyboard
} from '@mui/icons-material';
import api from '../services/api';
import { useAuthStore } from '../context/authStore';
import defaults from '../shortcuts/defaults';

function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box sx={{
          p: 3,
          bgcolor: '#1a1a1a',
          color: '#e0e0e0',
          // Make descendant inputs use light outlines and text
          '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
          '& .MuiInputLabel-root': { color: '#e0e0e0' },
          '& .MuiFormHelperText-root': { color: 'rgba(224,224,224,0.8)' },
          '& .MuiInputBase-input': { color: '#e0e0e0' }
        }}>{children}</Box>
      )}
    </div>
  );
} 

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [userSettings, setUserSettings] = useState(null);
  const [orgSettings, setOrgSettings] = useState(null);
  const [displaySettings, setDisplaySettings] = useState(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: userSettingsData, isLoading: userLoading } = useQuery('user-settings', () =>
    api.get('/settings/user')
  );

  const { data: orgSettingsData, isLoading: orgLoading } = useQuery('org-settings', () =>
    api.get('/settings/organization')
  );

  const { data: displaySettingsData, isLoading: displayLoading } = useQuery('display-settings', () =>
    api.get('/settings/display')
  );

  const { data: subscriptionData, isLoading: subLoading } = useQuery('subscription-info', () =>
    api.get('/settings/subscription')
  );

  useEffect(() => {
    if (userSettingsData?.data) setUserSettings(userSettingsData.data);
    if (orgSettingsData?.data) setOrgSettings(orgSettingsData.data);
    if (displaySettingsData?.data) setDisplaySettings(displaySettingsData.data);
    if (subscriptionData?.data) setSubscriptionInfo(subscriptionData.data);
  }, [userSettingsData, orgSettingsData, displaySettingsData, subscriptionData]);

  const updateUserMutation = useMutation(
    (data) => api.put('/settings/user', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user-settings');
        setSuccessMessage('User settings updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      onError: () => {
        setErrorMessage('Failed to update settings');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  );

  const updateOrgMutation = useMutation(
    (data) => api.put('/settings/organization', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('org-settings');
        setSuccessMessage('Organization settings updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      onError: () => {
        setErrorMessage('Failed to update settings');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  );

  const updateDisplayMutation = useMutation(
    (data) => api.put('/settings/display', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('display-settings');
        setSuccessMessage('Display settings updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      onError: () => {
        setErrorMessage('Failed to update settings');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  );

  const changePasswordMutation = useMutation(
    (data) => api.post('/users/change-password', data),
    {
      onSuccess: () => {
        setSuccessMessage('Password changed successfully');
        setOpenPasswordDialog(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      onError: (error) => {
        setErrorMessage(error.response?.data?.error || 'Failed to change password');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  );

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  const TierFeatures = (tier) => {
    const features = {
      free: ['3 users', '5 playlists', '500 MB storage', '1 output'],
      basic: ['10 users', '50 playlists', '5 GB storage', '3 outputs', 'OBS + MIDI'],
      professional: ['50 users', '500 playlists', '50 GB storage', '8 outputs', 'All integrations'],
      enterprise: ['Unlimited users', 'Unlimited playlists', 'Unlimited storage', 'Dedicated support']
    };
    return features[tier] || [];
  };

  // Shortcuts local state (persisted to localStorage)
  const [shortcuts, setShortcuts] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('shortcuts') || '{}');
      return Object.keys(defaults).reduce((acc, k) => ({ ...acc, [k]: stored[k] || defaults[k] }), {});
    } catch (err) {
      return defaults;
    }
  });

  const [shortcutsMessage, setShortcutsMessage] = useState('');

  const saveShortcuts = () => {
    try {
      localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
      window.dispatchEvent(new CustomEvent('app:shortcuts-updated', { detail: shortcuts }));
      setShortcutsMessage('Keyboard shortcuts saved');
      setTimeout(() => setShortcutsMessage(''), 3000);
    } catch (err) {
      setShortcutsMessage('Failed to save shortcuts');
      setTimeout(() => setShortcutsMessage(''), 3000);
    }
  };

  const resetShortcuts = () => {
    localStorage.removeItem('shortcuts');
    setShortcuts(defaults);
    window.dispatchEvent(new CustomEvent('app:shortcuts-updated', { detail: defaults }));
    setShortcutsMessage('Shortcuts reset to defaults');
    setTimeout(() => setShortcutsMessage(''), 3000);
  };

  const humanize = (s) => s.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#e0e0e0' }}>
        Settings
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      <Card sx={{ backgroundColor: '#1a1a1a', color: '#e0e0e0', border: '1px solid rgba(224,224,224,0.06)' }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, v) => setTabValue(v)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="General" icon={<Palette />} iconPosition="start" />
          <Tab label="Organization" icon={<EditIcon />} iconPosition="start" />
          <Tab label="Display" icon={<Notifications />} iconPosition="start" />
          <Tab label="Subscription" />
          <Tab label="Shortcuts" icon={<Keyboard />} iconPosition="start" />
        </Tabs>

        {/* General Settings Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" sx={{ mb: 3 }}>User Preferences</Typography>
          
          {userLoading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={3} sx={{ maxWidth: 600 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={userSettings?.theme || 'light'}
                    onChange={(e) => {
                      const updated = { ...userSettings, theme: e.target.value };
                      setUserSettings(updated);
                      updateUserMutation.mutate(updated);
                    }}
                    label="Theme"
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="auto">Auto (System)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={userSettings?.language || 'en'}
                    onChange={(e) => {
                      const updated = { ...userSettings, language: e.target.value };
                      setUserSettings(updated);
                      updateUserMutation.mutate(updated);
                    }}
                    label="Language"
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                    <MenuItem value="pt">Português</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Scripture Translation</InputLabel>
                  <Select
                    value={userSettings?.default_scripture_translation || 'kjv'}
                    onChange={(e) => {
                      const updated = { ...userSettings, default_scripture_translation: e.target.value };
                      setUserSettings(updated);
                      updateUserMutation.mutate(updated);
                    }}
                    label="Scripture Translation"
                  >
                    <MenuItem value="kjv">King James Version (KJV)</MenuItem>
                    <MenuItem value="niv">New International Version (NIV)</MenuItem>
                    <MenuItem value="nlt">New Living Translation (NLT)</MenuItem>
                    <MenuItem value="esv">English Standard Version (ESV)</MenuItem>
                    <MenuItem value="nasb">New American Standard Bible (NASB)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={userSettings?.notifications !== false}
                      onChange={(e) => {
                        const updated = { ...userSettings, notifications: e.target.checked };
                        setUserSettings(updated);
                        updateUserMutation.mutate(updated);
                      }}
                    />
                  }
                  label="Email Notifications"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={userSettings?.auto_save !== false}
                      onChange={(e) => {
                        const updated = { ...userSettings, auto_save: e.target.checked };
                        setUserSettings(updated);
                        updateUserMutation.mutate(updated);
                      }}
                    />
                  }
                  label="Auto-save Presentations"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>Account Security</Typography>
                <Button
                  variant="outlined"
                  startIcon={<Lock />}
                  onClick={() => setOpenPasswordDialog(true)}
                  fullWidth
                >
                  Change Password
                </Button>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        {/* Organization Settings Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" sx={{ mb: 3 }}>Organization Settings</Typography>
          
          {orgLoading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={3} sx={{ maxWidth: 600 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Organization Name"
                  value={orgSettings?.organization_name || ''}
                  onChange={(e) => setOrgSettings({ ...orgSettings, organization_name: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Logo URL"
                  type="url"
                  value={orgSettings?.logo || ''}
                  onChange={(e) => setOrgSettings({ ...orgSettings, logo: e.target.value })}
                  helperText="Enter URL to your church logo"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Primary Color"
                  type="color"
                  value={orgSettings?.primary_color || '#1976d2'}
                  onChange={(e) => setOrgSettings({ ...orgSettings, primary_color: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Secondary Color"
                  type="color"
                  value={orgSettings?.secondary_color || '#dc004e'}
                  onChange={(e) => setOrgSettings({ ...orgSettings, secondary_color: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 2 }}>CCLI Settings</Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="CCLI Account Number"
                  value={orgSettings?.ccli_id || ''}
                  onChange={(e) => setOrgSettings({ ...orgSettings, ccli_id: e.target.value })}
                  helperText="Your CCLI account number for licensing tracking"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="CCLI Account Name"
                  value={orgSettings?.ccli_account || ''}
                  onChange={(e) => setOrgSettings({ ...orgSettings, ccli_account: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={orgSettings?.maintenance_mode === true}
                      onChange={(e) => setOrgSettings({ ...orgSettings, maintenance_mode: e.target.checked })}
                    />
                  }
                  label="Maintenance Mode (disables presentations)"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => updateOrgMutation.mutate(orgSettings)}
                  disabled={updateOrgMutation.isLoading}
                  fullWidth
                >
                  Save Organization Settings
                </Button>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        {/* Display Settings Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" sx={{ mb: 3 }}>Display & Output Settings</Typography>
          
          {displayLoading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={3} sx={{ maxWidth: 600 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Livestream Resolution</InputLabel>
                  <Select
                    value={displaySettings?.livestream_resolution || '1080p'}
                    onChange={(e) => setDisplaySettings({ 
                      ...displaySettings, 
                      livestream_resolution: e.target.value 
                    })}
                    label="Livestream Resolution"
                  >
                    <MenuItem value="720p">720p (HD)</MenuItem>
                    <MenuItem value="1080p">1080p (Full HD)</MenuItem>
                    <MenuItem value="1440p">1440p (2K)</MenuItem>
                    <MenuItem value="2160p">2160p (4K)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Recording Resolution</InputLabel>
                  <Select
                    value={displaySettings?.recording_resolution || '1080p'}
                    onChange={(e) => setDisplaySettings({ 
                      ...displaySettings, 
                      recording_resolution: e.target.value 
                    })}
                    label="Recording Resolution"
                  >
                    <MenuItem value="720p">720p (HD)</MenuItem>
                    <MenuItem value="1080p">1080p (Full HD)</MenuItem>
                    <MenuItem value="1440p">1440p (2K)</MenuItem>
                    <MenuItem value="2160p">2160p (4K)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Outputs"
                  value={displaySettings?.output_count || 1}
                  onChange={(e) => setDisplaySettings({ 
                    ...displaySettings, 
                    output_count: parseInt(e.target.value) 
                  })}
                  inputProps={{ min: 1, max: 10 }}
                  helperText="Main display, stage monitor, livestream, etc."
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={displaySettings?.ndi_enabled === true}
                      onChange={(e) => setDisplaySettings({ 
                        ...displaySettings, 
                        ndi_enabled: e.target.checked 
                      })}
                    />
                  }
                  label="Enable NDI (Network Device Interface)"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={() => updateDisplayMutation.mutate(displaySettings)}
                  disabled={updateDisplayMutation.isLoading}
                  fullWidth
                >
                  Save Display Settings
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 2 }}>Output Status</Typography>
                <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><Check color="success" /></ListItemIcon>
                      <ListItemText 
                        primary="Main Display" 
                        secondary="Projection screen"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Check color="success" /></ListItemIcon>
                      <ListItemText 
                        primary="Stage Monitor" 
                        secondary="Foldback display"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Check color="success" /></ListItemIcon>
                      <ListItemText 
                        primary="Livestream" 
                        secondary="Facebook, YouTube, etc."
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        {/* Subscription Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" sx={{ mb: 3 }}>Subscription & Plan</Typography>
          
          {subLoading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{ mb: 3, backgroundColor: '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Current Plan: <span style={{ color: '#1976d2', textTransform: 'capitalize' }}>
                        {subscriptionInfo?.tier || 'free'}
                      </span>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {subscriptionInfo?.started_at && (
                        <>Started: {new Date(subscriptionInfo.started_at).toLocaleDateString()}</>
                      )}
                    </Typography>

                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                      Included Features:
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {TierFeatures(subscriptionInfo?.tier || 'free').map((feature, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                          <Check sx={{ color: 'success.main', fontSize: 20 }} />
                          <Typography variant="body2">{feature}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>

                <Typography variant="h6" sx={{ mb: 2 }}>Available Plans</Typography>
                <Grid container spacing={2}>
                  {['basic', 'professional', 'enterprise'].map((tier) => (
                    <Grid item xs={12} sm={6} md={4} key={tier}>
                      <Card sx={{
                        border: subscriptionInfo?.tier === tier ? '2px solid #1976d2' : '1px solid #ddd',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': { boxShadow: 3 }
                      }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ textTransform: 'capitalize', mb: 1 }}>
                            {tier}
                          </Typography>
                          <Box>
                            {TierFeatures(tier).slice(0, 3).map((feature, idx) => (
                              <Typography key={idx} variant="caption" display="block" sx={{ mb: 0.5 }}>
                                ✓ {feature}
                              </Typography>
                            ))}
                          </Box>
                          <Button 
                            fullWidth 
                            variant={subscriptionInfo?.tier === tier ? 'contained' : 'outlined'}
                            sx={{ mt: 2 }}
                          >
                            {subscriptionInfo?.tier === tier ? 'Current Plan' : 'Upgrade'}
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ backgroundColor: '#f9f9f9' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Billing Information</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary">Renewal Date</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {subscriptionInfo?.renewal_date 
                          ? new Date(subscriptionInfo.renewal_date).toLocaleDateString()
                          : 'N/A'
                        }
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="textSecondary">Payment Method</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                        {subscriptionInfo?.payment_method || 'None'}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Button fullWidth variant="contained" sx={{ mb: 1 }}>
                      Update Payment Method
                    </Button>
                    <Button fullWidth variant="outlined">
                      Download Invoice
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </TabPanel>
      </Card>

        {/* Shortcuts Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" sx={{ mb: 2 }}>Keyboard Shortcuts</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Customize keyboard shortcuts. Use + for modifiers (Ctrl+S, Shift+Ctrl+Z) and comma to separate multiple bindings for an action.
          </Typography>

          <Grid container spacing={2}>
            {Object.keys(shortcuts).map((k) => (
              <Grid item xs={12} md={6} key={k}>
                <TextField
                  fullWidth
                  label={humanize(k)}
                  value={(shortcuts[k] || []).join(', ')}
                  onChange={(e) => {
                    const parts = e.target.value.split(',').map(p => p.trim()).filter(Boolean);
                    setShortcuts((prev) => ({ ...prev, [k]: parts }));
                  }}
                  helperText="Example: Ctrl+S, F11"
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" startIcon={<Save />} onClick={saveShortcuts}>Save Shortcuts</Button>
                <Button variant="outlined" onClick={resetShortcuts}>Reset to Defaults</Button>
                {shortcutsMessage && <Typography sx={{ ml: 2 }}>{shortcutsMessage}</Typography>}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Preview</Typography>
              <Paper sx={{ p: 2, bgcolor: '#121212' }}>
                <List dense>
                  {Object.keys(shortcuts).map((k) => (
                    <ListItem key={k} sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
                      <ListItemText primary={humanize(k)} secondary={(shortcuts[k] || []).join(', ')} />
                      <Box>
                        {(shortcuts[k] || []).map((s, idx) => (
                          <Chip key={idx} label={s} size="small" sx={{ mr: 1 }} />
                        ))}
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#1a1a1a', color: '#e0e0e0', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' }, '& .MuiInputLabel-root': { color: '#e0e0e0' }, '& .MuiInputBase-input': { color: '#e0e0e0' } } }}>
        <DialogTitle sx={{ color: '#e0e0e0' }}>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' }, '& .MuiInputLabel-root': { color: '#e0e0e0' }, '& .MuiInputBase-input': { color: '#e0e0e0' } }} />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              helperText="Minimum 8 characters"
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={changePasswordMutation.isLoading}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}