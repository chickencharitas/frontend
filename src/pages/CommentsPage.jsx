import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function CommentsPage() {
  const { mediaId } = useParams();

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    if (!mediaId) return;

    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/comments/media/${mediaId}`);
      setComments(res.data);
    } catch (err) {
      setError('Failed to fetch comments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [mediaId]);

  const handleAddComment = async () => {
    if (!comment.trim() || !mediaId) return;

    setError('');
    try {
      await api.post(`/comments/media/${mediaId}`, {
        comment: comment.trim(),
      });
      setComment('');
      fetchComments();
    } catch {
      setError('Failed to add comment.');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Comments & Annotations
      </Typography>

      <TextField
        label="Add Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={handleAddComment}>
        Submit
      </Button>

      {loading && <CircularProgress sx={{ mt: 2 }} />}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <List sx={{ mt: 2 }}>
        {comments.map((c) => (
          <ListItem key={c.id}>
            <strong>
              {c.firstName ? `${c.firstName} ${c.lastName ?? ''}` : 'User'}:
            </strong>
            &nbsp;{c.comment}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
