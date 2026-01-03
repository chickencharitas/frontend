import React, { useState, useEffect } from 'react';
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  LinearProgress,
  Avatar,
  Badge,
  Tooltip,
  Stack,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
  Favorite,
  EmojiEmotions,
  Poll,
  QuestionAnswer,
  Chat,
  People,
  TrendingUp,
  AccessTime,
  CheckCircle,
  Cancel,
  Send,
  Add,
  Visibility,
  VisibilityOff,
  Settings,
  BarChart,
  PieChart,
  Timeline,
  Notifications,
  NotificationsOff,
  VolumeUp,
  VolumeOff,
  Refresh,
  Clear,
  Star,
  StarBorder
} from '@mui/icons-material';

// Mock audience data
const mockAudienceStats = {
  totalAttendees: 247,
  activeParticipants: 189,
  engagementRate: 76.5,
  averageResponseTime: 2.3
};

const mockReactions = [
  { type: 'like', count: 45, percentage: 18.2 },
  { type: 'love', count: 67, percentage: 27.1 },
  { type: 'laugh', count: 23, percentage: 9.3 },
  { type: 'sad', count: 8, percentage: 3.2 },
  { type: 'angry', count: 3, percentage: 1.2 }
];

const mockPolls = [
  {
    id: '1',
    question: 'How relevant was today\'s message?',
    options: [
      { text: 'Very relevant', votes: 89, percentage: 36.0 },
      { text: 'Somewhat relevant', votes: 98, percentage: 39.7 },
      { text: 'Not very relevant', votes: 32, percentage: 13.0 },
      { text: 'Not relevant at all', votes: 28, percentage: 11.3 }
    ],
    totalVotes: 247,
    status: 'active'
  },
  {
    id: '2',
    question: 'Will you attend next week\'s service?',
    options: [
      { text: 'Definitely', votes: 156, percentage: 63.2 },
      { text: 'Probably', votes: 67, percentage: 27.1 },
      { text: 'Maybe', votes: 18, percentage: 7.3 },
      { text: 'Unlikely', votes: 6, percentage: 2.4 }
    ],
    totalVotes: 247,
    status: 'completed'
  }
];

const mockQuestions = [
  {
    id: '1',
    author: 'Anonymous',
    question: 'Can you explain the concept of grace in more detail?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    answered: false,
    upvotes: 12
  },
  {
    id: '2',
    author: 'Mary Johnson',
    question: 'What are the meeting times for the youth group?',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    answered: true,
    upvotes: 8
  },
  {
    id: '3',
    author: 'John Smith',
    question: 'Is there a Bible study group for beginners?',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    answered: false,
    upvotes: 15
  }
];

const mockChatMessages = [
  {
    id: '1',
    author: 'Sarah Wilson',
    message: 'Beautiful message today!',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    type: 'message'
  },
  {
    id: '2',
    author: 'Mike Chen',
    message: '🙏 Amen',
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    type: 'reaction'
  },
  {
    id: '3',
    author: 'Lisa Rodriguez',
    message: 'Thank you for the encouraging words',
    timestamp: new Date(Date.now() - 7 * 60 * 1000),
    type: 'message'
  }
];

export default function AudienceFeedback({ onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [feedbackEnabled, setFeedbackEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newMessage, setNewMessage] = useState('');

  // Poll creation state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollType, setPollType] = useState('multiple-choice');

  // Simulate real-time updates
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleCreatePoll = () => {
    if (!pollQuestion.trim()) return;

    const newPoll = {
      id: Date.now().toString(),
      question: pollQuestion,
      options: pollOptions.filter(opt => opt.trim()).map(opt => ({
        text: opt,
        votes: 0,
        percentage: 0
      })),
      totalVotes: 0,
      status: 'active'
    };

    // In a real app, this would be sent to the backend
    console.log('Creating poll:', newPoll);

    setPollQuestion('');
    setPollOptions(['', '']);
    setShowCreatePoll(false);
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const updatePollOption = (index, value) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const sendQuestion = () => {
    if (!newQuestion.trim()) return;

    const question = {
      id: Date.now().toString(),
      author: 'Anonymous',
      question: newQuestion,
      timestamp: new Date(),
      answered: false,
      upvotes: 0
    };

    // In a real app, this would be sent to the backend
    console.log('Sending question:', question);

    setNewQuestion('');
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      author: 'Host',
      message: newMessage,
      timestamp: new Date(),
      type: 'message'
    };

    // In a real app, this would be sent to the backend
    console.log('Sending message:', message);

    setNewMessage('');
  };

  const renderOverviewTab = () => (
    <Box>
      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <People sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary">
                {mockAudienceStats.totalAttendees}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Attendees
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <TrendingUp sx={{ fontSize: 32, color: '#81c784', mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {mockAudienceStats.activeParticipants}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Active Participants
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <BarChart sx={{ fontSize: 32, color: '#ffb74d', mb: 1 }} />
              <Typography variant="h4" color="warning.main">
                {mockAudienceStats.engagementRate}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Engagement Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <AccessTime sx={{ fontSize: 32, color: '#e57373', mb: 1 }} />
              <Typography variant="h4" color="error.main">
                {mockAudienceStats.averageResponseTime}s
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Avg Response Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Live Reactions */}
      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmojiEmotions sx={{ color: 'primary.main' }} />
            Live Reactions
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {mockReactions.map((reaction) => (
              <Box key={reaction.type} sx={{ textAlign: 'center', minWidth: 80 }}>
                <Typography variant="h4" sx={{ color: '#ffb74d', mb: 0.5 }}>
                  {reaction.count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {reaction.type}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={reaction.percentage}
                  sx={{ height: 4, mt: 0.5, bgcolor: '#404040' }}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Settings sx={{ color: '#81c784' }} />
            Quick Actions
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Poll />}
              onClick={() => setShowCreatePoll(true)}
              sx={{ borderColor: 'primary.main', color: 'primary.main' }}
            >
              Create Poll
            </Button>

            <Button
              variant="outlined"
              startIcon={feedbackEnabled ? <Visibility /> : <VisibilityOff />}
              onClick={() => setFeedbackEnabled(!feedbackEnabled)}
              sx={{ borderColor: feedbackEnabled ? '#81c784' : '#e57373', color: feedbackEnabled ? '#81c784' : '#e57373' }}
            >
              {feedbackEnabled ? 'Feedback On' : 'Feedback Off'}
            </Button>

            <Button
              variant="outlined"
              startIcon={notificationsEnabled ? <Notifications /> : <NotificationsOff />}
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              sx={{ borderColor: '#ffb74d', color: '#ffb74d' }}
            >
              {notificationsEnabled ? 'Notifications On' : 'Notifications Off'}
            </Button>

            <Button
              variant="outlined"
              startIcon={<Refresh />}
              sx={{ borderColor: '#ba68c8', color: '#ba68c8' }}
            >
              Refresh Data
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  const renderPollsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Live Polls</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowCreatePoll(true)}
          sx={{ bgcolor: 'primary.main' }}
        >
          Create Poll
        </Button>
      </Box>

      <Stack spacing={3}>
        {mockPolls.map((poll) => (
          <Card key={poll.id} sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" sx={{ flex: 1, mr: 2 }}>
                  {poll.question}
                </Typography>
                <Chip
                  label={poll.status}
                  color={poll.status === 'active' ? 'success' : 'default'}
                  size="small"
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {poll.totalVotes} votes • {poll.status === 'active' ? 'Live' : 'Completed'}
              </Typography>

              <Stack spacing={1}>
                {poll.options.map((option, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{option.text}</Typography>
                      <Typography variant="body2" color="primary">
                        {option.votes} ({option.percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={option.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: '#404040',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          bgcolor: 'primary.main'
                        }
                      }}
                    />
                  </Box>
                ))}
              </Stack>

              {poll.status === 'active' && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined" sx={{ borderColor: '#e57373', color: '#e57373' }}>
                    End Poll
                  </Button>
                  <Button size="small" variant="outlined" sx={{ borderColor: '#ffb74d', color: '#ffb74d' }}>
                    Reset
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );

  const renderQuestionsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Q&A Session</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" sx={{ borderColor: '#ffb74d', color: '#ffb74d' }}>
            Clear Answered
          </Button>
          <Button variant="outlined" sx={{ borderColor: '#e57373', color: '#e57373' }}>
            End Session
          </Button>
        </Box>
      </Box>

      {/* Send Question */}
      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040', mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Ask a Question</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Type your question here..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendQuestion()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#404040' }
                }
              }}
            />
            <Button
              variant="contained"
              onClick={sendQuestion}
              disabled={!newQuestion.trim()}
              sx={{ bgcolor: 'primary.main' }}
            >
              <Send />
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Questions List */}
      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <CardContent sx={{ p: 0 }}>
          <List>
            {mockQuestions.map((question) => (
              <ListItem
                key={question.id}
                sx={{
                  borderBottom: '1px solid #404040',
                  '&:last-child': { borderBottom: 'none' }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {question.author.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ color: 'white' }}>
                      {question.question}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {question.author} • {question.timestamp.toLocaleTimeString()}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={question.answered ? 'Answered' : 'Pending'}
                          size="small"
                          color={question.answered ? 'success' : 'warning'}
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {question.upvotes} upvotes
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {!question.answered && (
                      <Button size="small" variant="outlined" sx={{ minWidth: 'auto', px: 1 }}>
                        Answer
                      </Button>
                    )}
                    <IconButton size="small" sx={{ color: '#ffb74d' }}>
                      <StarBorder fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );

  const renderChatTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Live Chat</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" sx={{ borderColor: '#ffb74d', color: '#ffb74d' }}>
            Export Chat
          </Button>
          <Button variant="outlined" sx={{ borderColor: '#e57373', color: '#e57373' }}>
            Clear Chat
          </Button>
        </Box>
      </Box>

      {/* Chat Messages */}
      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040', mb: 3, height: 400, overflow: 'auto' }}>
        <CardContent sx={{ p: 2 }}>
          <List>
            {mockChatMessages.map((msg) => (
              <ListItem key={msg.id} sx={{ px: 0, py: 1 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: msg.type === 'reaction' ? '#ffb74d' : 'primary.main', width: 32, height: 32 }}>
                    {msg.author.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {msg.author}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {msg.timestamp.toLocaleTimeString()}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ color: 'white', mt: 0.5 }}>
                      {msg.message}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Send Message */}
      <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Send Message</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#404040' }
                }
              }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              sx={{ bgcolor: 'primary.main' }}
            >
              <Send />
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Messages are sent anonymously to protect privacy
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ p: 3, bgcolor: '#1a1a1a', minHeight: '100vh', color: 'white' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Audience Feedback
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#b0b0b0' }}>
            Live interaction and engagement tools for your congregation
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={() => setShowSettings(true)}
            sx={{ borderColor: '#ffb74d', color: '#ffb74d' }}
          >
            Settings
          </Button>
          {onClose && (
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
          )}
        </Box>
      </Box>

      {/* Status Indicator */}
      <Alert
        severity={feedbackEnabled ? 'success' : 'warning'}
        sx={{ mb: 3, bgcolor: feedbackEnabled ? '#2a2a2a' : '#2a2a2a', color: feedbackEnabled ? '#81c784' : '#ffb74d' }}
      >
        <Typography variant="body2">
          {feedbackEnabled ? '✅ Audience feedback is active' : '⚠️ Audience feedback is disabled'}
          {' • '}Last updated: {lastUpdate.toLocaleTimeString()}
        </Typography>
      </Alert>

      {/* Main Content Tabs */}
      <Paper sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: '1px solid #404040',
            '& .MuiTab-root': { color: '#b0b0b0' },
            '& .MuiTab-root.Mui-selected': { color: 'primary.main' }
          }}
        >
          <Tab label="Overview" />
          <Tab label="Polls" />
          <Tab label="Q&A" />
          <Tab label="Chat" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && renderOverviewTab()}
          {activeTab === 1 && renderPollsTab()}
          {activeTab === 2 && renderQuestionsTab()}
          {activeTab === 3 && renderChatTab()}
        </Box>
      </Paper>

      {/* Create Poll Dialog */}
      <Dialog
        open={showCreatePoll}
        onClose={() => setShowCreatePoll(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#2a2a2a',
            color: 'white',
            border: '1px solid #404040'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Create Live Poll</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Poll Question"
              fullWidth
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#404040' }
                },
                '& .MuiInputLabel-root': { color: '#b0b0b0' }
              }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ color: '#b0b0b0' }}>Poll Type</InputLabel>
              <Select
                value={pollType}
                onChange={(e) => setPollType(e.target.value)}
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                }}
              >
                <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                <MenuItem value="yes-no">Yes/No</MenuItem>
                <MenuItem value="rating">Rating (1-5)</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Answer Options</Typography>
              <Stack spacing={2}>
                {pollOptions.map((option, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updatePollOption(index, e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: '#404040' }
                        }
                      }}
                    />
                    {pollOptions.length > 2 && (
                      <IconButton
                        onClick={() => removePollOption(index)}
                        sx={{ color: '#e57373' }}
                      >
                        <Cancel />
                      </IconButton>
                    )}
                  </Box>
                ))}
                {pollOptions.length < 6 && (
                  <Button
                    variant="outlined"
                    onClick={addPollOption}
                    sx={{ borderColor: 'primary.main', color: 'primary.main' }}
                  >
                    Add Option
                  </Button>
                )}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreatePoll(false)} sx={{ color: '#b0b0b0' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreatePoll}
            disabled={!pollQuestion.trim() || pollOptions.filter(opt => opt.trim()).length < 2}
            sx={{ bgcolor: 'primary.main' }}
          >
            Create Poll
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#2a2a2a',
            color: 'white',
            border: '1px solid #404040'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Feedback Settings</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={feedbackEnabled}
                  onChange={(e) => setFeedbackEnabled(e.target.checked)}
                  color="primary"
                />
              }
              label="Enable audience feedback"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  color="primary"
                />
              }
              label="Show notifications for new responses"
            />

            <Divider sx={{ bgcolor: '#404040' }} />

            <Typography variant="subtitle1" sx={{ color: 'white' }}>
              Privacy Settings
            </Typography>

            <FormControlLabel
              control={<Switch defaultChecked color="primary" />}
              label="Allow anonymous questions"
            />

            <FormControlLabel
              control={<Switch defaultChecked color="primary" />}
              label="Show participant count"
            />

            <FormControlLabel
              control={<Switch color="primary" />}
              label="Require moderator approval for questions"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)} sx={{ color: '#b0b0b0' }}>
            Cancel
          </Button>
          <Button variant="contained" sx={{ bgcolor: 'primary.main' }}>
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}