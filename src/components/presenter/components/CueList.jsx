import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Box, 
  Typography,
  Tooltip,
  useTheme,
} from '@mui/material';
import { 
  PlayArrow as PlayIcon, 
  Edit as EditIcon, 
  ContentCopy as DuplicateIcon, 
  Delete as DeleteIcon,
  DragIndicator as DragHandleIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  Audiotrack as AudioIcon,
  TextFields as TextIcon,
  Language as WebIcon,
} from '@mui/icons-material';

const CueList = ({ 
  cues = [], 
  activeCueId, 
  onCueSelect, 
  onCueDelete, 
  onCueDuplicate, 
  onCuesReorder,
  onCuePlay,
  onCueEdit,
  height = '100%',
}) => {
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(false);

  const getCueIcon = (type) => {
    switch (type) {
      case 'image':
        return <ImageIcon />;
      case 'video':
        return <VideoIcon />;
      case 'audio':
        return <AudioIcon />;
      case 'web':
        return <WebIcon />;
      default:
        return <TextIcon />;
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (result) => {
    setIsDragging(false);
    
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;
    
    // No movement
    if (source.index === destination.index) {
      return;
    }

    onCuesReorder(source.index, destination.index);
  };

  return (
    <Box 
      sx={{ 
        height,
        overflow: 'auto',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Droppable droppableId="cues-droppable">
          {(provided) => (
            <List 
              ref={provided.innerRef}
              {...provided.droppableProps}
              dense
              disablePadding
            >
              {cues.length === 0 ? (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    height: 100,
                    color: 'text.secondary',
                  }}
                >
                  <Typography variant="body2">No cues yet. Add one to get started.</Typography>
                </Box>
              ) : (
                cues.map((cue, index) => (
                  <Draggable key={cue.id} draggableId={cue.id} index={index}>
                    {(provided, snapshot) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        secondaryAction={
                          <Box sx={{ display: 'flex' }}>
                            <Tooltip title="Edit">
                              <IconButton 
                                edge="end" 
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCueEdit(cue.id);
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Duplicate">
                              <IconButton 
                                edge="end" 
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCueDuplicate(cue.id);
                                }}
                              >
                                <DuplicateIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                edge="end" 
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCueDelete(cue.id);
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        }
                        disablePadding
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          bgcolor: activeCueId === cue.id 
                            ? theme.palette.action.selected 
                            : snapshot.isDragging 
                              ? theme.palette.action.hover 
                              : 'inherit',
                          opacity: snapshot.isDragging ? 0.8 : 1,
                          transition: 'background-color 0.2s, opacity 0.2s',
                        }}
                      >
                        <ListItemButton
                          selected={activeCueId === cue.id}
                          onClick={() => onCueSelect(cue.id)}
                          onDoubleClick={() => onCuePlay(cue.id)}
                          sx={{
                            pr: 1,
                            '&.Mui-selected': {
                              bgcolor: theme.palette.action.selected,
                            },
                            '&:hover': {
                              bgcolor: theme.palette.action.hover,
                            },
                          }}
                        >
                          <Box 
                            {...provided.dragHandleProps}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mr: 1,
                              color: 'text.secondary',
                              '&:hover': {
                                color: 'text.primary',
                                cursor: isDragging ? 'grabbing' : 'grab',
                              },
                            }}
                          >
                            <DragHandleIcon />
                          </Box>
                          <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                            {getCueIcon(cue.type)}
                          </ListItemIcon>
                          <ListItemText 
                            primary={
                              <Typography noWrap variant="body2">
                                {cue.title || 'Untitled Cue'}
                              </Typography>
                            }
                            secondary={
                              <Typography noWrap variant="caption" color="text.secondary">
                                {cue.type.charAt(0).toUpperCase() + cue.type.slice(1)}
                                {cue.timing?.duration ? ` • ${cue.timing.duration}s` : ''}
                              </Typography>
                            }
                          />
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              onCuePlay(cue.id);
                            }}
                            sx={{
                              ml: 1,
                              color: activeCueId === cue.id 
                                ? theme.palette.primary.main 
                                : 'inherit',
                            }}
                          >
                            <PlayIcon />
                          </IconButton>
                        </ListItemButton>
                      </ListItem>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default React.memo(CueList);
