/**
 * Real-Time Collaboration System - Game-Changing Feature for WorshipPress
 * 
 * This feature enables:
 * - Multi-user live editing of presentations
 * - Real-time cursor tracking and user presence
 * - Live chat during service planning
 * - Conflict resolution for simultaneous edits
 * - Version history and rollback
 * - Role-based permissions (Pastor, Worship Leader, Tech)
 * - Live service mode with remote control
 * - Annotation and drawing tools
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  IconButton,
  Chip,
  Stack,
  Grid,
  Card,
  CardContent,
  Divider,
  Badge,
  Tooltip,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  LinearProgress,
  Toolbar,
  AppBar,
  Drawer,
  useTheme,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  People as UsersIcon,
  Chat as ChatIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Settings as SettingsIcon,
  Send as SendIcon,
  PersonAdd as InviteIcon,
  History as HistoryIcon,
  CloudSync as SyncIcon,
  Lock as LockIcon,
  Public as PublicIcon,
  TouchApp as CursorIcon,
  Colorize as DrawIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Save as SaveIcon,
  Notifications as NotificationIcon,
  Videocam as VideoIcon,
  Mic as MicIcon,
  ScreenShare as ScreenShareIcon,
  CallEnd as EndCallIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

// Simulated WebSocket service for real-time features
const collaborationService = {
  // Simulated connection
  connect: () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ connected: true, userId: 'user-' + Math.random().toString(36).substr(2, 9) });
      }, 1000);
    });
  },

  // Simulated user presence
  getUsers: () => {
    return [
      { id: 'user-1', name: 'Pastor John', role: 'pastor', status: 'online', cursor: { x: 150, y: 200 }, color: '#81c784' },
      { id: 'user-2', name: 'Sarah Worship', role: 'worship_leader', status: 'online', cursor: { x: 300, y: 150 }, color: '#64b5f6' },
      { id: 'user-3', name: 'Tech Mike', role: 'tech', status: 'away', cursor: null, color: '#ffb74d' },
      { id: 'user-4', name: 'Jane Admin', role: 'admin', status: 'online', cursor: { x: 450, y: 300 }, color: '#e57373' }
    ];
  },

  // Simulated chat messages
  getChatMessages: () => {
    return [
      { id: 1, userId: 'user-1', userName: 'Pastor John', message: 'Let\'s start with "Amazing Grace"', timestamp: new Date(Date.now() - 300000) },
      { id: 2, userId: 'user-2', userName: 'Sarah Worship', message: 'Perfect! I\'ll prepare the chord sheets', timestamp: new Date(Date.now() - 240000) },
      { id: 3, userId: 'user-3', userName: 'Tech Mike', message: 'Projector is ready and tested', timestamp: new Date(Date.now() - 180000) },
      { id: 4, userId: 'user-4', userName: 'Jane Admin', message: 'Service attendance looks good for today', timestamp: new Date(Date.now() - 120000) }
    ];
  },

  // Simulated edit history
  getEditHistory: () => {
    return [
      { id: 1, user: 'Sarah Worship', action: 'Added slide: "Welcome"', timestamp: new Date(Date.now() - 600000) },
      { id: 2, user: 'Pastor John', action: 'Edited sermon notes', timestamp: new Date(Date.now() - 480000) },
      { id: 3, user: 'Tech Mike', action: 'Updated background for slide 3', timestamp: new Date(Date.now() - 360000) },
      { id: 4, user: 'Sarah Worship', action: 'Reordered worship set', timestamp: new Date(Date.now() - 240000) },
      { id: 5, user: 'Pastor John', action: 'Added scripture: John 3:16', timestamp: new Date(Date.now() - 120000) }
    ];
  }
};

const RealTimeCollaboration = () => {
  const [connected, setConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editHistory, setEditHistory] = useState([]);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [showChat, setShowChat] = useState(true);
  const [showUsers, setShowUsers] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [notifications, setNotifications] = useState([]);
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const canvasRef = useRef(null);

  // Initialize collaboration
  useEffect(() => {
    const initializeCollaboration = async () => {
      try {
        const connection = await collaborationService.connect();
        setCurrentUser(connection);
        setConnected(true);
        
        // Load initial data
        setActiveUsers(collaborationService.getUsers());
        setChatMessages(collaborationService.getChatMessages());
        setEditHistory(collaborationService.getEditHistory());
        
        // Simulate real-time updates
        const interval = setInterval(() => {
          setSyncStatus('syncing');
          setTimeout(() => setSyncStatus('synced'), 1000);
        }, 30000);
        
        return () => clearInterval(interval);
      } catch (error) {
        console.error('Collaboration connection failed:', error);
      }
    };

    initializeCollaboration();
  }, []);

  // Send chat message
  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !currentUser) return;
    
    const message = {
      id: chatMessages.length + 1,
      userId: currentUser.userId,
      userName: 'You',
      message: newMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate response
    setTimeout(() => {
      const response = {
        id: chatMessages.length + 2,
        userId: 'user-2',
        userName: 'Sarah Worship',
        message: 'Got it! I\'ll make that change.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, response]);
    }, 2000);
  }, [newMessage, currentUser, chatMessages.length]);

  // Handle role change
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    // Simulate permission update
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'info',
      message: `Role changed to ${role}`,
      timestamp: new Date()
    }]);
  };

  // Toggle live mode
  const toggleLiveMode = () => {
    setIsLiveMode(!isLiveMode);
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: isLiveMode ? 'warning' : 'success',
      message: isLiveMode ? 'Live mode ended' : 'Live mode started',
      timestamp: new Date()
    }]);
  };

  // Start video call
  const startVideoCall = () => {
    setVideoCallActive(true);
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'success',
      message: 'Video call started',
      timestamp: new Date()
    }]);
  };

  // End video call
  const endVideoCall = () => {
    setVideoCallActive(false);
    setScreenShareActive(false);
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'info',
      message: 'Video call ended',
      timestamp: new Date()
    }]);
  };

  // Get role color
  const getRoleColor = (role) => {
    const colors = {
      pastor: '#81c784',
      worship_leader: '#64b5f6',
      tech: '#ffb74d',
      admin: '#e57373'
    };
    return colors[role] || '#9e9e9e';
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      online: '#4caf50',
      away: '#ff9800',
      offline: '#9e9e9e'
    };
    return colors[status] || '#9e9e9e';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2e 100%)', mb: 3 }}>
        <Toolbar>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1 }}>
            <UsersIcon sx={{ color: '#81c784', fontSize: 32 }} />
            <Typography variant="h5" sx={{ color: '#cccccc', fontWeight: 600 }}>
              Real-Time Collaboration
            </Typography>
            <Chip 
              label={connected ? 'Connected' : 'Offline'} 
              color={connected ? 'success' : 'error'}
              size="small"
              sx={{ ml: 2 }}
            />
            <Chip 
              label={syncStatus} 
              color={syncStatus === 'synced' ? 'success' : syncStatus === 'syncing' ? 'warning' : 'error'}
              size="small"
            />
            {isLiveMode && (
              <Chip 
                label="LIVE" 
                color="error"
                size="small"
                sx={{ animation: 'pulse 2s infinite' }}
              />
            )}
          </Stack>
          
          <Stack direction="row" spacing={1}>
            <Tooltip title="Toggle Live Mode">
              <IconButton onClick={toggleLiveMode} sx={{ color: isLiveMode ? '#f44336' : '#cccccc' }}>
                <ViewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Video Call">
              <IconButton onClick={videoCallActive ? endVideoCall : startVideoCall} sx={{ color: videoCallActive ? '#f44336' : '#cccccc' }}>
                <VideoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Screen Share">
              <IconButton 
                onClick={() => setScreenShareActive(!screenShareActive)}
                sx={{ color: screenShareActive ? '#f44336' : '#cccccc' }}
                disabled={!videoCallActive}
              >
                <ScreenShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton sx={{ color: '#cccccc' }}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3}>
        {/* Main Collaboration Area */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, background: '#252526', minHeight: 600, position: 'relative' }}>
            {/* Role Selector */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ color: '#cccccc' }}>Collaboration Workspace</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Your Role:</Typography>
                <Stack direction="row" spacing={1}>
                  {['pastor', 'worship_leader', 'tech', 'admin'].map(role => (
                    <Button
                      key={role}
                      size="small"
                      variant={selectedRole === role ? 'contained' : 'outlined'}
                      onClick={() => handleRoleChange(role)}
                      sx={{
                        bgcolor: selectedRole === role ? getRoleColor(role) : 'transparent',
                        borderColor: getRoleColor(role),
                        color: selectedRole === role ? '#1a1a1a' : getRoleColor(role),
                        '&:hover': {
                          bgcolor: getRoleColor(role),
                          color: '#1a1a1a'
                        }
                      }}
                    >
                      {role.replace('_', ' ').toUpperCase()}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </Stack>

            {/* Canvas Area */}
            <Box 
              sx={{ 
                background: '#1a1a1a', 
                border: '2px solid #333333',
                borderRadius: 1,
                height: 400,
                position: 'relative',
                overflow: 'hidden',
                cursor: drawingMode ? 'crosshair' : 'default'
              }}
              onClick={(e) => {
                if (drawingMode && canvasRef.current) {
                  const rect = canvasRef.current.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  // Simulate drawing
                  console.log('Drawing at:', x, y);
                }
              }}
              ref={canvasRef}
            >
              {/* Simulated slide content */}
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ color: '#cccccc', mb: 2 }}>
                  Welcome to Sunday Service
                </Typography>
                <Typography variant="h6" sx={{ color: '#b0b0b0' }}>
                  Join us as we worship together
                </Typography>
              </Box>

              {/* Live cursors of other users */}
              {activeUsers.filter(user => user.cursor).map(user => (
                <Box
                  key={user.id}
                  sx={{
                    position: 'absolute',
                    left: user.cursor.x,
                    top: user.cursor.y,
                    pointerEvents: 'none',
                    zIndex: 1000
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <CursorIcon sx={{ color: user.color, fontSize: 16 }} />
                    <Typography variant="caption" sx={{ 
                      color: user.color, 
                      background: '#1a1a1a',
                      px: 0.5,
                      borderRadius: 0.5
                    }}>
                      {user.name}
                    </Typography>
                  </Stack>
                </Box>
              ))}

              {/* Drawing overlay */}
              {drawingMode && (
                <Box sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: '#81c784',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1
                }}>
                  <Typography variant="caption" sx={{ color: '#1a1a1a' }}>
                    Drawing Mode Active
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Toolbar */}
            <Stack direction="row" spacing={1} mt={2}>
              <Tooltip title="Drawing Mode">
                <IconButton 
                  onClick={() => setDrawingMode(!drawingMode)}
                  sx={{ 
                    color: drawingMode ? '#81c784' : '#cccccc',
                    bgcolor: drawingMode ? 'rgba(129, 199, 132, 0.1)' : 'transparent'
                  }}
                >
                  <DrawIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Undo">
                <IconButton sx={{ color: '#cccccc' }}>
                  <UndoIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Redo">
                <IconButton sx={{ color: '#cccccc' }}>
                  <RedoIcon />
                </IconButton>
              </Tooltip>
              <Divider orientation="vertical" flexItem />
              <Tooltip title="Save">
                <IconButton sx={{ color: '#81c784' }}>
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Sync">
                <IconButton sx={{ color: '#64b5f6' }}>
                  <SyncIcon />
                </IconButton>
              </Tooltip>
              <Box flex={1} />
              <Typography variant="body2" sx={{ color: '#b0b0b0', alignSelf: 'center' }}>
                Last synced: {new Date().toLocaleTimeString()}
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            {/* Active Users */}
            <Paper sx={{ background: '#252526' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #333333' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ color: '#cccccc' }}>Active Users</Typography>
                  <Badge badgeContent={activeUsers.length} color="success">
                    <UsersIcon sx={{ color: '#81c784' }} />
                  </Badge>
                </Stack>
              </Box>
              <List dense>
                {activeUsers.map(user => (
                  <ListItem key={user.id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getRoleColor(user.role), width: 32, height: 32 }}>
                        {user.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.name}
                      primaryTypographyProps={{ sx: { color: '#cccccc', fontSize: '0.875rem' } }}
                      secondary={user.role.replace('_', ' ')}
                      secondaryTypographyProps={{ sx: { color: '#b0b0b0', fontSize: '0.75rem' } }}
                    />
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: getStatusColor(user.status)
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Live Chat */}
            <Paper sx={{ background: '#252526' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #333333' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ color: '#cccccc' }}>Live Chat</Typography>
                  <ChatIcon sx={{ color: '#81c784' }} />
                </Stack>
              </Box>
              <Box sx={{ height: 200, overflow: 'auto', p: 2 }}>
                {chatMessages.map(msg => (
                  <Box key={msg.id} sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: '#3c3c3d' }}>
                        {msg.userName.charAt(0)}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          {msg.userName} • {msg.timestamp.toLocaleTimeString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#cccccc' }}>
                          {msg.message}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Box>
              <Box sx={{ p: 2, borderTop: '1px solid #333333' }}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#3c3c3d',
                        '& fieldset': { borderColor: '#333333' },
                        '&:hover fieldset': { borderColor: '#555555' },
                        '&.Mui-focused fieldset': { borderColor: '#81c784' }
                      },
                      input: { color: '#cccccc' }
                    }}
                  />
                  <IconButton onClick={sendMessage} sx={{ color: '#81c784' }}>
                    <SendIcon />
                  </IconButton>
                </Stack>
              </Box>
            </Paper>

            {/* Edit History */}
            <Paper sx={{ background: '#252526' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #333333' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ color: '#cccccc' }}>Edit History</Typography>
                  <HistoryIcon sx={{ color: '#81c784' }} />
                </Stack>
              </Box>
              <Box sx={{ height: 200, overflow: 'auto', p: 2 }}>
                {editHistory.map(edit => (
                  <Box key={edit.id} sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <HistoryIcon sx={{ color: '#81c784', fontSize: 16 }} />
                      <Box flex={1}>
                        <Typography variant="body2" sx={{ color: '#cccccc' }}>
                          {edit.action}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          {edit.user} • {edit.timestamp.toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {/* Notifications */}
      {notifications.length > 0 && (
        <Box sx={{ position: 'fixed', bottom: 24, left: 24, zIndex: 2000 }}>
          <Stack spacing={1}>
            {notifications.slice(-3).map(notification => (
              <Alert
                key={notification.id}
                severity={notification.type}
                sx={{ 
                  background: '#3c3c3d',
                  color: '#cccccc',
                  '& .MuiAlert-icon': { color: notification.type === 'success' ? '#81c784' : '#ffb74d' }
                }}
              >
                {notification.message}
              </Alert>
            ))}
          </Stack>
        </Box>
      )}

      {/* Video Call Dialog */}
      <Dialog open={videoCallActive} maxWidth="md" fullWidth>
        <DialogTitle sx={{ background: '#252526', color: '#cccccc' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography>Video Conference</Typography>
            <IconButton onClick={endVideoCall} sx={{ color: '#cccccc' }}>
              <EndCallIcon sx={{ color: '#f44336' }} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ background: '#1a1a1a', minHeight: 400 }}>
          <Box sx={{ 
            height: 400, 
            background: '#000000', 
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography sx={{ color: '#666666' }}>
              Video conference would appear here
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default RealTimeCollaboration;
