/**
 * AI-Powered Worship Assistant - Revolutionary Feature for WorshipPress
 * 
 * This AI assistant will:
 * - Automatically suggest appropriate songs based on scripture/theme
 * - Generate worship service sequences
 * - Provide real-time presentation suggestions
 * - Analyze sermon content for relevant media
 * - Offer intelligent transition recommendations
 * - Create dynamic backgrounds based on mood/theme
 * - Suggest scripture references for topics
 * - Generate prayer prompts and announcements
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/material';
import {
  SmartToy as AIIcon,
  AutoAwesome as SparkleIcon,
  MusicNote as MusicIcon,
  MenuBook as BibleIcon,
  Slideshow as PresentationIcon,
  Lightbulb as IdeaIcon,
  Prayer as PrayerIcon,
  Campaign as AnnouncementIcon,
  Psychology as SuggestIcon,
  TrendingUp as TrendingIcon,
  Schedule as ScheduleIcon,
  Palette as PaletteIcon,
  Mic as MicIcon,
  VideoLibrary as MediaIcon,
  Close as CloseIcon,
  Send as SendIcon,
  ThumbUp as LikeIcon,
  ThumbDown as DislikeIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as CircleIcon
} from '@mui/icons-material';

// AI Service Module
const aiService = {
  // Simulated AI responses (in production, these would call actual AI APIs)
  async generateSongSuggestions(theme, scripture, mood) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const songDatabase = [
      { title: "Amazing Grace", artist: "Traditional", key: "G", tempo: "Slow", theme: "Grace, Redemption" },
      { title: "How Great Thou Art", artist: "Stuart Hine", key: "D", tempo: "Medium", theme: "Worship, Creation" },
      { title: "Blessed Be Your Name", artist: "Matt Redman", key: "B", tempo: "Upbeat", theme: "Praise, Trust" },
      { title: "Here I Am to Worship", artist: "Tim Hughes", key: "E", tempo: "Medium", theme: "Worship, Surrender" },
      { title: "In Christ Alone", artist: "Keith Getty", key: "G", tempo: "Medium", theme: "Christ, Salvation" }
    ];
    
    return songDatabase.filter(song => 
      song.theme.toLowerCase().includes(theme.toLowerCase()) ||
      song.theme.toLowerCase().includes(mood.toLowerCase())
    ).slice(0, 4);
  },

  async generateServiceSequence(theme, duration, serviceType) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return [
      { time: "0:00", element: "Welcome & Announcements", duration: "5 min", type: "announcement" },
      { time: "5:00", element: "Opening Prayer", duration: "2 min", type: "prayer" },
      { time: "7:00", element: "Opening Worship Song", duration: "4 min", type: "music" },
      { time: "11:00", element: "Scripture Reading", duration: "3 min", type: "scripture" },
      { time: "14:00", element: "Worship Set (2-3 songs)", duration: "15 min", type: "music" },
      { time: "29:00", element: "Sermon", duration: "25 min", type: "sermon" },
      { time: "54:00", element: "Closing Song", duration: "4 min", type: "music" },
      { time: "58:00", element: "Closing Prayer & Benediction", duration: "2 min", type: "prayer" }
    ];
  },

  async generateMediaSuggestions(sermonTopic, scripture) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      { type: "background", title: "Mountain Sunrise", description: "Perfect for themes of creation and majesty", mood: "awe-inspiring" },
      { type: "video", title: "Cross Animation", description: "Subtle cross animation for reflection moments", mood: "reverent" },
      { type: "image", title: "Empty Tomb", description: "Resurrection themed imagery", mood: "victorious" },
      { type: "motion", title: "Gentle Waves", description: "Calming ocean waves for meditation", mood: "peaceful" }
    ];
  },

  async generateScriptureSuggestions(topic) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const scriptureMap = {
      "grace": ["Ephesians 2:8-9", "Romans 3:23-24", "2 Corinthians 12:9"],
      "love": ["1 Corinthians 13", "John 3:16", "Romans 8:38-39"],
      "faith": ["Hebrews 11:1", "Hebrews 11:6", "James 2:17"],
      "hope": ["Romans 15:13", "Jeremiah 29:11", "1 Peter 1:3"],
      "worship": ["Psalm 95:6", "John 4:24", "Romans 12:1"]
    };
    
    return scriptureMap[topic.toLowerCase()] || ["John 3:16", "Romans 8:28", "Philippians 4:13"];
  },

  async generatePrayerPrompts(serviceType, theme) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return [
      "Lord, prepare our hearts to receive Your word today",
      "Thank you for your faithfulness throughout this week",
      "Guide our speaker as they share Your truth",
      "Help us to apply what we learn to our daily lives",
      "Bless our time of fellowship and worship"
    ];
  },

  async generateAnnouncements(serviceContext) {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return [
      "Don't forget our potluck fellowship after service",
      "Small group sign-ups are available in the lobby",
      "Prayer team meets every Wednesday at 7 PM",
      "Youth group this Friday - bring a friend!",
      "Volunteers needed for next month's outreach event"
    ];
  }
};

const AIWorshipAssistant = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your AI Worship Assistant. I can help you plan services, select songs, find scripture, and create presentations. What would you like to work on today?" }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [suggestions, setSuggestions] = useState({
    songs: [],
    sequence: [],
    media: [],
    scripture: [],
    prayers: [],
    announcements: []
  });
  const [serviceContext, setServiceContext] = useState({
    theme: '',
    scripture: '',
    mood: '',
    duration: '60',
    serviceType: 'sunday',
    sermonTopic: ''
  });
  const [aiEnabled, setAiEnabled] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [feedback, setFeedback] = useState({});

  // Handle AI chat interaction
  const handleChatSubmit = async () => {
    if (!currentInput.trim()) return;
    
    const userMessage = { role: 'user', content: currentInput };
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      let aiResponse = "I'm analyzing your request...";
      
      // Simple keyword-based responses (in production, use actual AI)
      if (currentInput.toLowerCase().includes('song')) {
        aiResponse = "I can help you select songs! What theme or scripture are you focusing on?";
      } else if (currentInput.toLowerCase().includes('scripture')) {
        aiResponse = "Let me find relevant scripture passages. What topic or theme would you like to explore?";
      } else if (currentInput.toLowerCase().includes('service')) {
        aiResponse = "I can help you plan a complete service sequence. What's the main theme and duration?";
      } else if (currentInput.toLowerCase().includes('media')) {
        aiResponse = "I can suggest appropriate media. What's your sermon topic or theme?";
      } else {
        aiResponse = "I understand you need help with worship planning. Could you tell me more about your specific service or theme?";
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsProcessing(false);
    }, 1500);
  };

  // Generate AI suggestions based on context
  const generateSuggestions = async (type) => {
    setIsProcessing(true);
    
    try {
      let results = [];
      
      switch (type) {
        case 'songs':
          results = await aiService.generateSongSuggestions(
            serviceContext.theme || 'worship',
            serviceContext.scripture || '',
            serviceContext.mood || 'uplifting'
          );
          break;
        case 'sequence':
          results = await aiService.generateServiceSequence(
            serviceContext.theme || 'worship',
            serviceContext.duration || '60',
            serviceContext.serviceType || 'sunday'
          );
          break;
        case 'media':
          results = await aiService.generateMediaSuggestions(
            serviceContext.sermonTopic || 'faith',
            serviceContext.scripture || ''
          );
          break;
        case 'scripture':
          results = await aiService.generateScriptureSuggestions(
            serviceContext.theme || 'grace'
          );
          break;
        case 'prayers':
          results = await aiService.generatePrayerPrompts(
            serviceContext.serviceType || 'sunday',
            serviceContext.theme || 'worship'
          );
          break;
        case 'announcements':
          results = await aiService.generateAnnouncements(serviceContext);
          break;
      }
      
      setSuggestions(prev => ({ ...prev, [type]: results }));
    } catch (error) {
      console.error('AI generation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle feedback for AI suggestions
  const handleFeedback = (type, index, isPositive) => {
    setFeedback(prev => ({
      ...prev,
      [`${type}-${index}`]: isPositive
    }));
  };

  // Tab panel component
  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2e 100%)' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: '#81c784', width: 56, height: 56 }}>
            <AIIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box flex={1}>
            <Typography variant="h4" sx={{ color: '#cccccc', fontWeight: 600 }}>
              AI Worship Assistant
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              Intelligent worship planning powered by AI - Create services that inspire
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={aiEnabled}
                onChange={(e) => setAiEnabled(e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#81c784' } }}
              />
            }
            label="AI Enabled"
            sx={{ color: '#cccccc' }}
          />
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {/* Main Content Area */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ background: '#252526' }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ 
                borderBottom: '1px solid #333333',
                '& .MuiTab-root': { color: '#b0b0b0' },
                '& .Mui-selected': { color: '#81c784' }
              }}
            >
              <Tab icon={<AIIcon />} label="AI Chat" />
              <Tab icon={<MusicIcon />} label="Song Suggestions" />
              <Tab icon={<ScheduleIcon />} label="Service Sequence" />
              <Tab icon={<MediaIcon />} label="Media Ideas" />
              <Tab icon={<BibleIcon />} label="Scripture" />
            </Tabs>

            {/* AI Chat Tab */}
            <TabPanel value={activeTab} index={0}>
              <Box sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flex: 1, overflow: 'auto', mb: 2, p: 2 }}>
                  {chatMessages.map((msg, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32,
                            bgcolor: msg.role === 'assistant' ? '#81c784' : '#3c3c3d'
                          }}
                        >
                          {msg.role === 'assistant' ? <AIIcon /> : <MicIcon />}
                        </Avatar>
                        <Paper sx={{ p: 2, flex: 1, background: '#3c3c3d' }}>
                          <Typography sx={{ color: '#cccccc' }}>{msg.content}</Typography>
                        </Paper>
                      </Stack>
                    </Box>
                  ))}
                  {isProcessing && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#81c784' }}>
                        <AIIcon />
                      </Avatar>
                      <Paper sx={{ p: 2, background: '#3c3c3d' }}>
                        <LinearProgress sx={{ width: 200 }} />
                      </Paper>
                    </Stack>
                  )}
                </Box>
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    placeholder="Ask me anything about worship planning..."
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
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
                  <IconButton 
                    onClick={handleChatSubmit}
                    sx={{ bgcolor: '#81c784', color: '#1a1a1a', '&:hover': { bgcolor: '#66bb6a' } }}
                  >
                    <SendIcon />
                  </IconButton>
                </Stack>
              </Box>
            </TabPanel>

            {/* Song Suggestions Tab */}
            <TabPanel value={activeTab} index={1}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="contained"
                    onClick={() => generateSuggestions('songs')}
                    disabled={isProcessing}
                    startIcon={<SparkleIcon />}
                    sx={{ bgcolor: '#81c784', '&:hover': { bgcolor: '#66bb6a' } }}
                  >
                    Generate Song Suggestions
                  </Button>
                  {isProcessing && <LinearProgress sx={{ flex: 1 }} />}
                </Stack>
                <Grid container spacing={2}>
                  {suggestions.songs.map((song, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card sx={{ background: '#3c3c3d', border: '1px solid #333333' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: '#cccccc' }}>{song.title}</Typography>
                          <Typography variant="body2" sx={{ color: '#b0b0b0' }}>{song.artist}</Typography>
                          <Stack direction="row" spacing={1} mt={1}>
                            <Chip label={song.key} size="small" sx={{ bgcolor: '#2d2d2e', color: '#cccccc' }} />
                            <Chip label={song.tempo} size="small" sx={{ bgcolor: '#2d2d2e', color: '#cccccc' }} />
                          </Stack>
                          <Typography variant="caption" sx={{ color: '#888888' }}>{song.theme}</Typography>
                        </CardContent>
                        <CardActions>
                          <IconButton 
                            size="small"
                            onClick={() => handleFeedback('songs', index, true)}
                            sx={{ color: feedback[`songs-${index}`] ? '#81c784' : '#666666' }}
                          >
                            <LikeIcon />
                          </IconButton>
                          <IconButton 
                            size="small"
                            onClick={() => handleFeedback('songs', index, false)}
                            sx={{ color: feedback[`songs-${index}`] === false ? '#f44336' : '#666666' }}
                          >
                            <DislikeIcon />
                          </IconButton>
                          <Button size="small" sx={{ color: '#81c784' }}>Add to Service</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </TabPanel>

            {/* Service Sequence Tab */}
            <TabPanel value={activeTab} index={2}>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => generateSuggestions('sequence')}
                  disabled={isProcessing}
                  startIcon={<ScheduleIcon />}
                  sx={{ bgcolor: '#81c784', '&:hover': { bgcolor: '#66bb6a' } }}
                >
                  Generate Service Sequence
                </Button>
                {suggestions.sequence.length > 0 && (
                  <Timeline sx={{ '& .MuiTimelineItem-root:before': { display: 'none' } }}>
                    {suggestions.sequence.map((item, index) => (
                      <TimelineItem key={index}>
                        <TimelineSeparator>
                          <TimelineDot sx={{ bgcolor: '#81c784' }}>
                            {item.type === 'music' && <MusicIcon />}
                            {item.type === 'prayer' && <PrayerIcon />}
                            {item.type === 'scripture' && <BibleIcon />}
                            {item.type === 'sermon' && <MicIcon />}
                            {item.type === 'announcement' && <AnnouncementIcon />}
                          </TimelineDot>
                          {index < suggestions.sequence.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Paper sx={{ p: 2, background: '#3c3c3d', border: '1px solid #333333' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography variant="h6" sx={{ color: '#cccccc' }}>{item.element}</Typography>
                                <Typography variant="caption" sx={{ color: '#b0b0b0' }}>{item.duration}</Typography>
                              </Box>
                              <Chip label={item.time} size="small" sx={{ bgcolor: '#2d2d2e', color: '#81c784' }} />
                            </Stack>
                          </Paper>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                )}
              </Stack>
            </TabPanel>

            {/* Media Ideas Tab */}
            <TabPanel value={activeTab} index={3}>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => generateSuggestions('media')}
                  disabled={isProcessing}
                  startIcon={<PaletteIcon />}
                  sx={{ bgcolor: '#81c784', '&:hover': { bgcolor: '#66bb6a' } }}
                >
                  Generate Media Suggestions
                </Button>
                <Grid container spacing={2}>
                  {suggestions.media.map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card sx={{ background: '#3c3c3d', border: '1px solid #333333' }}>
                        <CardContent>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Chip label={item.type} size="small" sx={{ bgcolor: '#81c784', color: '#1a1a1a' }} />
                            <Chip label={item.mood} size="small" sx={{ bgcolor: '#2d2d2e', color: '#cccccc' }} />
                          </Stack>
                          <Typography variant="h6" sx={{ color: '#cccccc', mt: 1 }}>{item.title}</Typography>
                          <Typography variant="body2" sx={{ color: '#b0b0b0' }}>{item.description}</Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" sx={{ color: '#81c784' }}>Preview</Button>
                          <Button size="small" sx={{ color: '#81c784' }}>Use in Presentation</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </TabPanel>

            {/* Scripture Tab */}
            <TabPanel value={activeTab} index={4}>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => generateSuggestions('scripture')}
                  disabled={isProcessing}
                  startIcon={<BibleIcon />}
                  sx={{ bgcolor: '#81c784', '&:hover': { bgcolor: '#66bb6a' } }}
                >
                  Generate Scripture Suggestions
                </Button>
                <List>
                  {suggestions.scripture.map((verse, index) => (
                    <ListItem key={index} sx={{ background: '#3c3c3d', mb: 1, borderRadius: 1 }}>
                      <ListItemIcon>
                        <BibleIcon sx={{ color: '#81c784' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={verse}
                        primaryTypographyProps={{ sx: { color: '#cccccc' } }}
                      />
                      <Button size="small" sx={{ color: '#81c784' }}>Add to Slide</Button>
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </TabPanel>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            {/* Service Context */}
            <Paper sx={{ p: 2, background: '#252526' }}>
              <Typography variant="h6" sx={{ color: '#cccccc', mb: 2 }}>Service Context</Typography>
              <Stack spacing={2}>
                <TextField
                  label="Theme"
                  size="small"
                  value={serviceContext.theme}
                  onChange={(e) => setServiceContext(prev => ({ ...prev, theme: e.target.value }))}
                  sx={{ '& .MuiInputLabel-root': { color: '#b0b0b0' }, '& .MuiOutlinedInput-root': { input: { color: '#cccccc' } } }}
                />
                <TextField
                  label="Scripture Reference"
                  size="small"
                  value={serviceContext.scripture}
                  onChange={(e) => setServiceContext(prev => ({ ...prev, scripture: e.target.value }))}
                  sx={{ '& .MuiInputLabel-root': { color: '#b0b0b0' }, '& .MuiOutlinedInput-root': { input: { color: '#cccccc' } } }}
                />
                <TextField
                  label="Mood"
                  size="small"
                  value={serviceContext.mood}
                  onChange={(e) => setServiceContext(prev => ({ ...prev, mood: e.target.value }))}
                  sx={{ '& .MuiInputLabel-root': { color: '#b0b0b0' }, '& .MuiOutlinedInput-root': { input: { color: '#cccccc' } } }}
                />
                <TextField
                  label="Duration (minutes)"
                  size="small"
                  value={serviceContext.duration}
                  onChange={(e) => setServiceContext(prev => ({ ...prev, duration: e.target.value }))}
                  sx={{ '& .MuiInputLabel-root': { color: '#b0b0b0' }, '& .MuiOutlinedInput-root': { input: { color: '#cccccc' } } }}
                />
                <TextField
                  label="Sermon Topic"
                  size="small"
                  value={serviceContext.sermonTopic}
                  onChange={(e) => setServiceContext(prev => ({ ...prev, sermonTopic: e.target.value }))}
                  sx={{ '& .MuiInputLabel-root': { color: '#b0b0b0' }, '& .MuiOutlinedInput-root': { input: { color: '#cccccc' } } }}
                />
              </Stack>
            </Paper>

            {/* Quick Actions */}
            <Paper sx={{ p: 2, background: '#252526' }}>
              <Typography variant="h6" sx={{ color: '#cccccc', mb: 2 }}>Quick Actions</Typography>
              <Stack spacing={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() => generateSuggestions('prayers')}
                  startIcon={<PrayerIcon />}
                  sx={{ color: '#81c784', borderColor: '#81c784', '&:hover': { borderColor: '#66bb6a' } }}
                >
                  Generate Prayer Prompts
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() => generateSuggestions('announcements')}
                  startIcon={<AnnouncementIcon />}
                  sx={{ color: '#81c784', borderColor: '#81c784', '&:hover': { borderColor: '#66bb6a' } }}
                >
                  Generate Announcements
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  startIcon={<RefreshIcon />}
                  sx={{ color: '#81c784', borderColor: '#81c784', '&:hover': { borderColor: '#66bb6a' } }}
                >
                  Refresh All Suggestions
                </Button>
              </Stack>
            </Paper>

            {/* AI Insights */}
            <Paper sx={{ p: 2, background: '#252526' }}>
              <Typography variant="h6" sx={{ color: '#cccccc', mb: 2 }}>AI Insights</Typography>
              <Stack spacing={1}>
                <Alert severity="info" sx={{ background: '#3c3c3d', color: '#b0b0b0' }}>
                  <Typography variant="body2">
                    Based on your theme, consider opening with an upbeat song to create energy
                  </Typography>
                </Alert>
                <Alert severity="success" sx={{ background: '#3c3c3d', color: '#b0b0b0' }}>
                  <Typography variant="body2">
                    Your service duration allows for 3-4 worship songs
                  </Typography>
                </Alert>
                <Alert severity="warning" sx={{ background: '#3c3c3d', color: '#b0b0b0' }}>
                  <Typography variant="body2">
                    Consider adding a moment for reflection after the sermon
                  </Typography>
                </Alert>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: '#81c784',
          '&:hover': { bgcolor: '#66bb6a' }
        }}
        onClick={() => setShowSuggestions(!showSuggestions)}
      >
        <AIIcon />
      </Fab>
    </Container>
  );
};

export default AIWorshipAssistant;
