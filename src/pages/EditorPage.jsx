import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress
} from '@mui/material';
import {
  Wand2,
  Scissors,
  Volume2,
  Image as ImageIcon,
  Film,
  Music,
  Water,
  UploadCloud,
  Droplet
} from 'lucide-react';
import api from '../services/api';

export default function EditorPage() {
  const [tab, setTab] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState('');
  const [error, setError] = useState('');
  const [params, setParams] = useState({});

  // Handle file upload
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResultUrl('');
    setError('');
  };

  // Handle editor actions
  const handleEdit = async () => {
    setUploading(true);
    setProgress(0);
    setResultUrl('');
    setError('');
    const formData = new FormData();
    formData.append('file', selectedFile);

    // Add params for each tool
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value);
    });

    let endpoint = '';
    if (tab === 0) endpoint = '/image/edit';
    if (tab === 1) endpoint = '/video/trim';
    if (tab === 2) endpoint = '/audio/mix';
    if (tab === 3) endpoint = '/watermark/add';

    try {
      const res = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total))
      });
      setResultUrl(res.data.url);
    } catch (err) {
      setError(err?.response?.data?.error || 'Processing failed');
    }
    setUploading(false);
  };

  // Editor tool configs
  const toolConfigs = [
    {
      label: 'Image Editor',
      icon: <ImageIcon size={20} />,
      fields: [
        { label: 'Resize Width', name: 'width', type: 'number' },
        { label: 'Resize Height', name: 'height', type: 'number' }
      ]
    },
    {
      label: 'Video Trimmer',
      icon: <Film size={20} />,
      fields: [
        { label: 'Start (sec)', name: 'start', type: 'number' },
        { label: 'End (sec)', name: 'end', type: 'number' }
      ]
    },
    {
      label: 'Audio Mixer',
      icon: <Music size={20} />,
      fields: [
        { label: 'Second Audio File', name: 'audio2', type: 'file' }
      ]
    },
    {
      label: 'Watermark',
      icon: <Droplet size={20} />, // <-- use Droplet instead of Water
      fields: [
        { label: 'Watermark Image', name: 'watermarkPath', type: 'file' }
      ]
    }
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Media Editor
      </Typography>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        {toolConfigs.map((tool, i) => (
          <Tab key={tool.label} icon={tool.icon} label={tool.label} />
        ))}
      </Tabs>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <UploadCloud size={32} />
            <input
              type="file"
              accept={tab === 0 ? 'image/*' : tab === 1 ? 'video/*' : tab === 2 ? 'audio/*' : 'image/*'}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="main-file-upload"
            />
            <label htmlFor="main-file-upload">
              <Button variant="contained" component="span">
                Select {tab === 0 ? 'Image' : tab === 1 ? 'Video' : tab === 2 ? 'Audio' : 'Image'}
              </Button>
            </label>
            {selectedFile && (
              <Typography variant="body2" sx={{ ml: 2 }}>
                {selectedFile.name}
              </Typography>
            )}
          </Box>

          {/* Tool-specific fields */}
          <Grid container spacing={2}>
            {toolConfigs[tab].fields.map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                {field.type === 'file' ? (
                  <>
                    <input
                      type="file"
                      accept={field.name === 'audio2' ? 'audio/*' : 'image/*'}
                      onChange={(e) => setParams({ ...params, [field.name]: e.target.files[0] })}
                      style={{ display: 'none' }}
                      id={field.name + '-upload'}
                    />
                    <label htmlFor={field.name + '-upload'}>
                      <Button variant="outlined" component="span">
                        {field.label}
                      </Button>
                    </label>
                    {params[field.name] && (
                      <Typography variant="caption" sx={{ ml: 2 }}>
                        {params[field.name].name}
                      </Typography>
                    )}
                  </>
                ) : (
                  <TextField
                    label={field.label}
                    type={field.type}
                    size="small"
                    fullWidth
                    value={params[field.name] || ''}
                    onChange={(e) => setParams({ ...params, [field.name]: e.target.value })}
                  />
                )}
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              disabled={!selectedFile || uploading}
              onClick={handleEdit}
            >
              {uploading ? 'Processing...' : 'Start'}
            </Button>
          </Box>

          {uploading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {progress}%
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {resultUrl && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Result:</Typography>
              {tab === 0 || tab === 3 ? (
                <CardMedia
                  component="img"
                  image={resultUrl}
                  alt="Result"
                  sx={{ maxWidth: 400, borderRadius: 2, mt: 2 }}
                />
              ) : (
                <Button
                  variant="outlined"
                  href={resultUrl}
                  target="_blank"
                  sx={{ mt: 2 }}
                >
                  Download Result
                </Button>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}