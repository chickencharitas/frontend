import React from 'react';
import { Box, Typography, Button, TextField, List, ListItem, Select, MenuItem } from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function ApprovalPage() {
  const { mediaId } = useParams();
  const [approvals, setApprovals] = React.useState([]);
  const [approverId, setApproverId] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [status, setStatus] = React.useState('pending');

  const fetchApprovals = async () => {
    const res = await api.get(`/approvals/${mediaId}`);
    setApprovals(res.data);
  };

  React.useEffect(() => {
    fetchApprovals();
  }, [mediaId]);

  const requestApproval = async () => {
    await api.post('/approvals/request', { media_id: mediaId, approver_id: approverId, comment });
    setComment('');
    fetchApprovals();
  };

  const respondApproval = async (approval_id, status) => {
    await api.post('/approvals/respond', { approval_id, status, comment: '' });
    fetchApprovals();
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>Approval Workflow</Typography>
      <TextField
        label="Approver User ID"
        value={approverId}
        onChange={e => setApproverId(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={requestApproval}>Request Approval</Button>
      <List sx={{ mt: 2 }}>
        {approvals.map(a => (
          <ListItem key={a.id}>
            <strong>{a.status}</strong> by {a.approver_id || 'N/A'}: {a.comment}
            {a.status === 'pending' && (
              <>
                <Button size="small" sx={{ ml: 2 }} onClick={() => respondApproval(a.id, 'approved')}>Approve</Button>
                <Button size="small" sx={{ ml: 1 }} onClick={() => respondApproval(a.id, 'rejected')}>Reject</Button>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}