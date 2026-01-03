/**
 * Team Library
 * Browse, manage, and collaborate on team-shared templates
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  AvatarGroup,
  Divider,
  LinearProgress,
  Badge,
  Tab,
  Tabs
} from '@mui/material';
import {
  Share as ShareIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Public as PublicIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { templateAPI } from './services/templateAPI';
import { brandConfig } from './config/brandConfig';

const TeamLibrary = ({ onTemplateSelected, onTemplateImported }) => {
  const [tabValue, setTabValue] = useState(0);
  const [teamTemplates, setTeamTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [sharePermission, setSharePermission] = useState('view');

  // Load team templates
  useEffect(() => {
    loadTeamTemplates();
  }, []);

  const loadTeamTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const templates = await templateAPI.teamLibrary.getTeamTemplates();
      setTeamTemplates(templates);
    } catch (err) {
      console.warn('Failed to load team templates from backend:', err);
      // Fall back to localStorage
      const saved = JSON.parse(localStorage.getItem('teamTemplates') || '[]');
      setTeamTemplates(saved);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToTeamLibrary = async (template) => {
    try {
      setLoading(true);
      const result = await templateAPI.teamLibrary.addToTeam(template.id, template);
      setTeamTemplates(prev => {
        const exists = prev.some(t => t.id === template.id);
        if (!exists) {
          return [result, ...prev];
        }
        return prev;
      });

      // Update localStorage
      const saved = JSON.parse(localStorage.getItem('teamTemplates') || '[]');
      if (!saved.some(t => t.id === template.id)) {
        saved.push(result);
        localStorage.setItem('teamTemplates', JSON.stringify(saved));
      }

      setError(null);
    } catch (err) {
      setError(`Failed to add template to team: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromTeamLibrary = async (templateId) => {
    try {
      setLoading(true);
      await templateAPI.teamLibrary.removeFromTeam(templateId);
      setTeamTemplates(prev => prev.filter(t => t.id !== templateId));

      // Update localStorage
      const saved = JSON.parse(localStorage.getItem('teamTemplates') || '[]');
      localStorage.setItem(
        'teamTemplates',
        JSON.stringify(saved.filter(t => t.id !== templateId))
      );

      setError(null);
    } catch (err) {
      setError(`Failed to remove template: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenShareDialog = async (template) => {
    try {
      setSelectedTemplate(template);
      const shares = await templateAPI.sharing.getShares(template.id);
      setCollaborators(shares);
      setShareDialogOpen(true);
    } catch (err) {
      setError(`Failed to load shares: ${err.message}`);
    }
  };

  const handleAddCollaborator = async () => {
    if (!newCollaboratorEmail || !selectedTemplate) return;

    try {
      setLoading(true);
      const result = await templateAPI.sharing.share(
        selectedTemplate.id,
        [newCollaboratorEmail],
        sharePermission
      );
      setCollaborators(result);
      setNewCollaboratorEmail('');
      setError(null);
    } catch (err) {
      setError(`Failed to add collaborator: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (email) => {
    if (!selectedTemplate) return;

    try {
      setLoading(true);
      await templateAPI.sharing.revoke(selectedTemplate.id, [email]);
      setCollaborators(prev => prev.filter(c => c.email !== email));
      setError(null);
    } catch (err) {
      setError(`Failed to remove collaborator: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImportTemplate = (template) => {
    onTemplateImported?.(template);
    setDetailsDialogOpen(false);
  };

  const filteredTemplates = teamTemplates.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const myTemplates = filteredTemplates.filter(t => t.author === localStorage.getItem('userId'));
  const sharedWithMe = filteredTemplates.filter(
    t => t.author !== localStorage.getItem('userId') && t.sharedWith?.includes(localStorage.getItem('userId'))
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: brandConfig.secondary }}>
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Team Library
          </Typography>

          <TextField
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: brandConfig.textTertiary }} />
            }}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                color: brandConfig.textPrimary,
                '& fieldset': { borderColor: brandConfig.border },
                '&:hover fieldset': { borderColor: brandConfig.accent }
              }
            }}
          />
        </Stack>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: `1px solid ${brandConfig.border}`, mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            '& .MuiTab-root': { color: brandConfig.textTertiary },
            '& .Mui-selected': { color: brandConfig.accent },
            '& .MuiTabs-indicator': { backgroundColor: brandConfig.accent }
          }}
        >
          <Tab label={`All (${filteredTemplates.length})`} />
          <Tab label={`My Templates (${myTemplates.length})`} />
          <Tab label={`Shared with Me (${sharedWithMe.length})`} />
        </Tabs>
      </Box>

      {/* Loading State */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Empty State */}
      {filteredTemplates.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: brandConfig.tertiary }}>
          <Typography sx={{ color: brandConfig.textTertiary }}>
            {searchTerm ? 'No templates match your search' : 'No templates in team library'}
          </Typography>
        </Paper>
      )}

      {/* Templates Grid */}
      {filteredTemplates.length > 0 && (
        <Grid container spacing={2}>
          {(tabValue === 0
            ? filteredTemplates
            : tabValue === 1
              ? myTemplates
              : sharedWithMe
          ).map(template => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card
                sx={{
                  backgroundColor: brandConfig.tertiary,
                  border: `1px solid ${brandConfig.border}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: brandConfig.accent,
                    boxShadow: `0 0 12px ${brandConfig.accent}40`
                  }
                }}
              >
                <CardContent>
                  <Stack spacing={1}>
                    {/* Header with badge */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {template.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: brandConfig.textTertiary }}
                        >
                          by {template.author}
                        </Typography>
                      </Box>
                      {template.isPublic ? (
                        <Tooltip title="Public">
                          <PublicIcon
                            sx={{
                              fontSize: 18,
                              color: brandConfig.accentSecondary
                            }}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Private">
                          <LockIcon
                            sx={{
                              fontSize: 18,
                              color: brandConfig.textTertiary
                            }}
                          />
                        </Tooltip>
                      )}
                    </Box>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: brandConfig.textSecondary,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {template.description}
                    </Typography>

                    {/* Meta Info */}
                    <Stack direction="row" spacing={1} sx={{ fontSize: 12, color: brandConfig.textTertiary }}>
                      <span>📊 {template.slideCount || 0} slides</span>
                      <span>👥 {template.collaborators?.length || 0} collaborators</span>
                    </Stack>

                    {/* Tags */}
                    {template.tags && template.tags.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {template.tags.slice(0, 2).map(tag => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                              backgroundColor: brandConfig.accentTertiary,
                              color: brandConfig.accent,
                              height: 22
                            }}
                          />
                        ))}
                        {template.tags.length > 2 && (
                          <Typography variant="caption" sx={{ color: brandConfig.textTertiary }}>
                            +{template.tags.length - 2} more
                          </Typography>
                        )}
                      </Box>
                    )}

                    {/* Collaborators */}
                    {template.collaborators && template.collaborators.length > 0 && (
                      <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
                        {template.collaborators.map(collaborator => (
                          <Tooltip key={collaborator} title={collaborator}>
                            <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>
                              {collaborator.charAt(0).toUpperCase()}
                            </Avatar>
                          </Tooltip>
                        ))}
                      </AvatarGroup>
                    )}

                    {/* Updated date */}
                    <Typography
                      variant="caption"
                      sx={{
                        color: brandConfig.textTertiary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <ScheduleIcon sx={{ fontSize: 14 }} />
                      Updated {new Date(template.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Stack>
                </CardContent>

                <Divider sx={{ borderColor: brandConfig.border }} />

                <CardActions>
                  <Tooltip title="View Details">
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setDetailsDialogOpen(true);
                      }}
                    >
                      Details
                    </Button>
                  </Tooltip>
                  <Tooltip title="Import">
                    <Button
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleImportTemplate(template)}
                      sx={{ color: brandConfig.accent }}
                    >
                      Import
                    </Button>
                  </Tooltip>
                  {template.author === localStorage.getItem('userId') && (
                    <Tooltip title="Share">
                      <Button
                        size="small"
                        startIcon={<ShareIcon />}
                        onClick={() => handleOpenShareDialog(template)}
                      >
                        Share
                      </Button>
                    </Tooltip>
                  )}
                  {template.author === localStorage.getItem('userId') && (
                    <Tooltip title="Remove">
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveFromTeamLibrary(template.id)}
                        sx={{ color: brandConfig.danger }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, background: brandConfig.secondary }}>
          {selectedTemplate?.name}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ color: brandConfig.textTertiary }}>
                Description
              </Typography>
              <Typography variant="body2">
                {selectedTemplate?.description}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: brandConfig.textTertiary }}>
                Author
              </Typography>
              <Typography variant="body2">
                {selectedTemplate?.author}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: brandConfig.textTertiary }}>
                Type
              </Typography>
              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                {selectedTemplate?.type}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: brandConfig.textTertiary }}>
                Slides
              </Typography>
              <Typography variant="body2">
                {selectedTemplate?.slideCount || selectedTemplate?.slides?.length || 0}
              </Typography>
            </Box>

            {selectedTemplate?.tags && (
              <Box>
                <Typography variant="caption" sx={{ color: brandConfig.textTertiary }}>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                  {selectedTemplate.tags.map(tag => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ background: brandConfig.secondary }}>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          <Button
            onClick={() => handleImportTemplate(selectedTemplate)}
            variant="contained"
            sx={{ background: brandConfig.accent, color: '#000' }}
          >
            Import Template
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, background: brandConfig.secondary }}>
          Share: {selectedTemplate?.name}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            {/* Add collaborator */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Add Collaborator
              </Typography>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  placeholder="Email address"
                  value={newCollaboratorEmail}
                  onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: brandConfig.textPrimary,
                      '& fieldset': { borderColor: brandConfig.border }
                    }
                  }}
                />
                <Button
                  onClick={handleAddCollaborator}
                  disabled={loading || !newCollaboratorEmail}
                  variant="contained"
                  sx={{ background: brandConfig.accent, color: '#000' }}
                >
                  Add
                </Button>
              </Stack>
            </Box>

            <Divider />

            {/* Current collaborators */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Current Collaborators ({collaborators.length})
              </Typography>
              {collaborators.length === 0 ? (
                <Typography variant="body2" sx={{ color: brandConfig.textTertiary }}>
                  No collaborators yet
                </Typography>
              ) : (
                <List dense>
                  {collaborators.map(collaborator => (
                    <ListItem
                      key={collaborator.email}
                      secondaryAction={
                        <Tooltip title="Remove">
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveCollaborator(collaborator.email)}
                            sx={{ color: brandConfig.danger }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      }
                    >
                      <ListItemIcon>
                        <PersonIcon sx={{ color: brandConfig.accent }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={collaborator.email}
                        secondary={
                          <Typography
                            variant="caption"
                            sx={{
                              color: brandConfig.textTertiary,
                              textTransform: 'capitalize'
                            }}
                          >
                            {collaborator.permission}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ background: brandConfig.secondary }}>
          <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamLibrary;
