import React from 'react';
import { Box, Typography, List, ListItem, Button, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function VersionsPage() {
  const { mediaId } = useParams();
  const [versions, setVersions] = React.useState([]);
  const [fileUrl, setFileUrl] = React.useState('');
  const [changeSummary, setChangeSummary] = React.useState('');

  const fetchVersions = async () => {
    const res = await api.get(`/versions/${mediaId}`);
    setVersions(res.data);
  };

  React.useEffect(() => {
    fetchVersions();
  }, [mediaId]);

  const addVersion = async () => {
    await api.post('/versions/add', { media_id: mediaId, file_url: fileUrl, change_summary: changeSummary });
    setFileUrl('');
    setChangeSummary('');
    fetchVersions();
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>Change History / Versioning</Typography>
      <TextField
        label="File URL"
        value={fileUrl}
        onChange={e => setFileUrl(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Change Summary"
        value={changeSummary}
        onChange={e => setChangeSummary(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={addVersion}>Add Version</Button>
      <List sx={{ mt: 2 }}>
        {versions.map(v => (
          <ListItem key={v.id}>
            <strong>v{v.version_number}</strong>: {v.change_summary} (<a href={v.file_url} target="_blank" rel="noopener noreferrer">Download</a>)
          </ListItem>
        ))}
      </List>
    </Box>
  );
}