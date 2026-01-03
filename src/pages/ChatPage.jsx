import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Send, Trash2, Pin } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function ChatPage() {
  const { streamId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [streams, setStreams] = useState([]);
  const [selectedStream, setSelectedStream] = useState(streamId || '');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchStreams = async () => {
    try {
      const res = await api.get('/streaming/list');
      setStreams(res.data);
      if (!selectedStream && res.data.length > 0) {
        setSelectedStream(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch streams:', err);
    }
  };

  const fetchMessages = async () => {
    if (!selectedStream) return;
    setLoading(true);
    try {
      const res = await api.get(`/streaming/${selectedStream}/chat`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  useEffect(() => {
    if (selectedStream) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedStream]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedStream) return;
    try {
      await api.post('/streaming/chat/add', {
        stream_id: selectedStream,
        platform: 'internal',
        username: 'You',
        message: newMessage
      });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const deleteMessage = async (message_id) => {
    try {
      await api.delete(`/streaming/chat/${message_id}`);
      fetchMessages();
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const pinMessage = async (message_id, is_pinned) => {
    try {
      await api.post('/streaming/chat/pin', {
        message_id,
        is_pinned: !is_pinned
      });
      fetchMessages();
    } catch (err) {
      console.error('Failed to pin message:', err);
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'youtube':
        return '#FF0000';
      case 'facebook':
        return '#1877F2';
      case 'twitch':
        return '#9146FF';
      default:
        return '#666';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 150px)' }}>
      <Box sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Stream</InputLabel>
          <Select
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
            label="Select Stream"
          >
            {streams.map((stream) => (
              <MenuItem key={stream.id} value={stream.id}>
                {stream.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper
            sx={{
              flex: 1,
              overflow: 'auto',
              mb: 2,
              p: 2,
              backgroundColor: '#f9f9f9'
            }}
          >
            <List sx={{ p: 0 }}>
              {messages.map((msg) => (
                <ListItem key={msg.id} sx={{ mb: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                    <Avatar
                      src={msg.user_avatar_url}
                      sx={{ mr: 1, width: 32, height: 32 }}
                    >
                      {msg.username.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {msg.username}
                        </Typography>
                        {msg.platform !== 'internal' && (
                          <Chip
                            label={msg.platform}
                            size="small"
                            sx={{
                              backgroundColor: getPlatformColor(msg.platform),
                              color: 'white',
                              fontSize: '0.7rem'
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      onClick={() => deleteMessage(msg.id)}
                      startIcon={<Trash2 size={16} />}
                    >
                      Delete
                    </Button>
                  </Box>
                  <Paper
                    sx={{
                      p: 1.5,
                      backgroundColor: msg.is_pinned ? '#fff3e0' : 'white',
                      width: '100%'
                    }}
                  >
                    <Typography variant="body2">{msg.message}</Typography>
                  </Paper>
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
          </Paper>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              fullWidth
              multiline
              maxRows={3}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              endIcon={<Send size={20} />}
              sx={{ alignSelf: 'flex-end' }}
            >
              Send
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}