/**
 * Text Editor with Font Management
 * Like Photoshop: Choose from system fonts, Google Fonts, or upload custom fonts
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  ColorPicker,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  FormatAlignLeft as FormatAlignLeftIcon,
  FormatAlignCenter as FormatAlignCenterIcon,
  FormatAlignRight as FormatAlignRightIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { ChromePicker } from 'react-color';

export default function TextEditor() {
  const [text, setText] = useState('Enter your text here');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [fontSize, setFontSize] = useState(24);
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');
  const [textDecoration, setTextDecoration] = useState('none');
  const [textAlign, setTextAlign] = useState('left');
  const [textColor, setTextColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [bgColorPickerOpen, setBgColorPickerOpen] = useState(false);
  const [availableFonts, setAvailableFonts] = useState([]);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  
  // Edit functionality state
  const [history, setHistory] = useState([{
    text,
    selectedFont,
    fontSize,
    fontWeight,
    fontStyle,
    textDecoration,
    textAlign,
    textColor,
    backgroundColor,
    lineHeight,
    letterSpacing
  }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const textAreaRef = useRef(null);

  // Helper function to create history entry for formatting changes
  const createHistoryEntry = (updates) => {
    const historyEntry = {
      text,
      selectedFont,
      fontSize,
      fontWeight,
      fontStyle,
      textDecoration,
      textAlign,
      textColor,
      backgroundColor,
      lineHeight,
      letterSpacing,
      ...updates
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(historyEntry);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Load available fonts and listen for font selection events
  useEffect(() => {
    const customFonts = JSON.parse(localStorage.getItem('customFonts') || '[]');
    
    // Ensure custom fonts are loaded by recreating font-face rules if needed
    customFonts.forEach(font => {
      if (font.base64Data) {
        // Check if this font-face already exists
        const existingStyle = document.querySelector(`[data-font-id="${font.id}"]`);
        if (!existingStyle) {
          const fontFace = `
            @font-face {
              font-family: "${font.name}";
              src: url('data:font/ttf;base64,${font.base64Data}') format('truetype');
            }
          `;
          
          const style = document.createElement('style');
          style.textContent = fontFace;
          style.setAttribute('data-font-id', font.id);
          document.head.appendChild(style);
        }
      }
    });
    
    const systemFonts = [
      'Arial',
      'Times New Roman',
      'Courier New',
      'Georgia',
      'Verdana',
      'Trebuchet MS',
      'Comic Sans MS',
      'Impact',
      'Segoe UI',
      'Calibri',
      'Consolas',
      'Garamond',
    ];

    const allFonts = [
      ...systemFonts,
      ...customFonts.map((f) => f.name || f.family),
    ];

    setAvailableFonts([...new Set(allFonts)]);

    // Listen for font selection events from the toolbar
    const handleFontSelected = (event) => {
      const { font } = event.detail;
      if (font && font !== selectedFont) {
        setSelectedFont(font);
        createHistoryEntry({ selectedFont: font });
        
        // Update the text area font immediately
        const textArea = document.querySelector('#text-editor-input');
        if (textArea) {
          textArea.style.fontFamily = font;
        }
      }
    };

    // Edit functionality event listeners
    const handleUndo = () => {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        const previousState = history[newIndex];
        setHistoryIndex(newIndex);
        
        // Restore all properties from history
        if (typeof previousState === 'object') {
          setText(previousState.text);
          setSelectedFont(previousState.selectedFont);
          setFontSize(previousState.fontSize);
          setFontWeight(previousState.fontWeight);
          setFontStyle(previousState.fontStyle);
          setTextDecoration(previousState.textDecoration);
          setTextAlign(previousState.textAlign);
          setTextColor(previousState.textColor);
          setBackgroundColor(previousState.backgroundColor);
          setLineHeight(previousState.lineHeight);
          setLetterSpacing(previousState.letterSpacing);
        } else {
          // Backward compatibility for old history entries
          setText(previousState);
        }
      }
    };

    const handleRedo = () => {
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        const nextState = history[newIndex];
        setHistoryIndex(newIndex);
        
        // Restore all properties from history
        if (typeof nextState === 'object') {
          setText(nextState.text);
          setSelectedFont(nextState.selectedFont);
          setFontSize(nextState.fontSize);
          setFontWeight(nextState.fontWeight);
          setFontStyle(nextState.fontStyle);
          setTextDecoration(nextState.textDecoration);
          setTextAlign(nextState.textAlign);
          setTextColor(nextState.textColor);
          setBackgroundColor(nextState.backgroundColor);
          setLineHeight(nextState.lineHeight);
          setLetterSpacing(nextState.letterSpacing);
        } else {
          // Backward compatibility for old history entries
          setText(nextState);
        }
      }
    };

    const handleCut = async () => {
      if (textAreaRef.current) {
        const textArea = textAreaRef.current;
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        const selectedText = text.substring(start, end);
        
        if (selectedText) {
          try {
            await navigator.clipboard.writeText(selectedText);
            const newText = text.substring(0, start) + text.substring(end);
          setText(newText);
          updateHistory(newText);
          } catch (err) {
            console.error('Cut failed:', err);
          }
        }
      }
    };

    const handleCopy = async () => {
      if (textAreaRef.current) {
        const textArea = textAreaRef.current;
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        const selectedText = text.substring(start, end);
        
        if (selectedText) {
          try {
            await navigator.clipboard.writeText(selectedText);
          } catch (err) {
            console.error('Copy failed:', err);
          }
        }
      }
    };

    const handlePaste = async () => {
      if (textAreaRef.current) {
        try {
          const clipboardText = await navigator.clipboard.readText();
          const textArea = textAreaRef.current;
          const start = textArea.selectionStart;
          const end = textArea.selectionEnd;
          const newText = text.substring(0, start) + clipboardText + text.substring(end);
          setText(newText);
          updateHistory(newText);
        } catch (err) {
          console.error('Paste failed:', err);
        }
      }
    };

    const handleSelectAll = () => {
      if (textAreaRef.current) {
        textAreaRef.current.select();
      }
    };

    const handleFind = () => {
      // Simple find implementation - could be enhanced with a dialog
      const searchTerm = window.prompt('Find text:');
      if (searchTerm && textAreaRef.current) {
        const textArea = textAreaRef.current;
        const index = text.indexOf(searchTerm);
        if (index !== -1) {
          textArea.focus();
          textArea.setSelectionRange(index, index + searchTerm.length);
        } else {
          alert('Text not found');
        }
      }
    };

    const handleReplace = () => {
      // Simple replace implementation - could be enhanced with a dialog
      const searchTerm = window.prompt('Find text:');
      if (searchTerm) {
        const replaceTerm = window.prompt('Replace with:');
        if (replaceTerm !== null) {
          const newText = text.replaceAll(searchTerm, replaceTerm);
          setText(newText);
          updateHistory(newText);
        }
      }
    };

    // Update history when text changes
    const updateHistory = (newText) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newText);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    };

    window.addEventListener('font:selected', handleFontSelected);
    window.addEventListener('app:undo', handleUndo);
    window.addEventListener('app:redo', handleRedo);
    window.addEventListener('app:cut', handleCut);
    window.addEventListener('app:copy', handleCopy);
    window.addEventListener('app:paste', handlePaste);
    window.addEventListener('app:select-all', handleSelectAll);
    window.addEventListener('app:find', handleFind);
    window.addEventListener('app:replace', handleReplace);

    return () => {
      window.removeEventListener('font:selected', handleFontSelected);
      window.removeEventListener('app:undo', handleUndo);
      window.removeEventListener('app:redo', handleRedo);
      window.removeEventListener('app:cut', handleCut);
      window.removeEventListener('app:copy', handleCopy);
      window.removeEventListener('app:paste', handlePaste);
      window.removeEventListener('app:select-all', handleSelectAll);
      window.removeEventListener('app:find', handleFind);
      window.removeEventListener('app:replace', handleReplace);
    };
  }, [history, historyIndex, text, selectedFont, fontSize, fontWeight, fontStyle, textDecoration, textAlign, textColor, backgroundColor, lineHeight, letterSpacing]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    // Update history for undo/redo - save complete state
    const historyEntry = {
      text: newText,
      selectedFont,
      fontSize,
      fontWeight,
      fontStyle,
      textDecoration,
      textAlign,
      textColor,
      backgroundColor,
      lineHeight,
      letterSpacing
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(historyEntry);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const textStyles = {
    fontFamily: selectedFont,
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight === 'bold' ? 'bold' : 'normal',
    fontStyle: fontStyle === 'italic' ? 'italic' : 'normal',
    textDecoration: textDecoration === 'underline' ? 'underline' : 'none',
    textAlign,
    color: textColor,
    lineHeight,
    letterSpacing: `${letterSpacing}px`,
    padding: '20px',
    minHeight: '200px',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  };

  const exportText = () => {
    const exportData = {
      text,
      font: {
        family: selectedFont,
        size: fontSize,
        weight: fontWeight,
        style: fontStyle,
        decoration: textDecoration,
      },
      formatting: {
        align: textAlign,
        color: textColor,
        lineHeight,
        letterSpacing,
      },
      background: backgroundColor,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `text_${Date.now()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const presets = [
    { name: 'Title', size: 48, weight: 'bold' },
    { name: 'Heading', size: 36, weight: 'bold' },
    { name: 'Body', size: 16, weight: 'normal' },
    { name: 'Caption', size: 12, weight: 'normal' },
    { name: 'Large', size: 72, weight: 'bold' },
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: '#1a1a1a', minHeight: '100vh', color: '#e0e0e0' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#81c784' }}>
        Text Editor (Photoshop-style)
      </Typography>

      <Grid container spacing={3}>
        {/* Preview */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              backgroundColor: backgroundColor,
              p: 2,
              minHeight: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
            }}
          >
            <TextField
              id="text-editor-input"
              inputRef={textAreaRef}
              multiline
              fullWidth
              value={text}
              onChange={handleTextChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'transparent',
                  color: textColor,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
              }}
              inputProps={{
                style: textStyles,
              }}
            />
          </Paper>

          {/* Live Preview */}
          <Paper
            sx={{
              backgroundColor: backgroundColor,
              p: 3,
              mt: 2,
              borderRadius: 2,
              minHeight: 150,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={textStyles}>{text}</div>
          </Paper>
        </Grid>

        {/* Controls */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#252526', mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#81c784' }}>
                Font Settings
              </Typography>

              {/* Font Family */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: '#9e9e9e' }}>Font Family</InputLabel>
                <Select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  sx={{
                    backgroundColor: '#1a1a1a',
                    color: '#e0e0e0',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3c3c3d',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#81c784',
                    },
                  }}
                >
                  {availableFonts.map((font) => (
                    <MenuItem key={font} value={font}>
                      <span style={{ fontFamily: font }}>{font}</span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Font Size */}
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Size: {fontSize}px
              </Typography>
              <Slider
                value={fontSize}
                onChange={(e, value) => setFontSize(value)}
                min={8}
                max={120}
                step={1}
                marks={[
                  { value: 8, label: '8' },
                  { value: 120, label: '120' },
                ]}
                sx={{
                  color: '#81c784',
                  '& .MuiSlider-track': { backgroundColor: '#81c784' },
                  '& .MuiSlider-thumb': { backgroundColor: '#81c784' },
                }}
              />

              {/* Line Height */}
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Line Height: {lineHeight.toFixed(1)}
              </Typography>
              <Slider
                value={lineHeight}
                onChange={(e, value) => setLineHeight(value)}
                min={0.8}
                max={3}
                step={0.1}
                sx={{
                  color: '#81c784',
                  mb: 2,
                }}
              />

              {/* Letter Spacing */}
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Letter Spacing: {letterSpacing}px
              </Typography>
              <Slider
                value={letterSpacing}
                onChange={(e, value) => setLetterSpacing(value)}
                min={-5}
                max={10}
                step={0.5}
                sx={{
                  color: '#81c784',
                  mb: 2,
                }}
              />

              {/* Text Align */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                {[
                  { icon: FormatAlignLeftIcon, value: 'left' },
                  { icon: FormatAlignCenterIcon, value: 'center' },
                  { icon: FormatAlignRightIcon, value: 'right' },
                ].map(({ icon: Icon, value }) => (
                  <Button
                    key={value}
                    size="small"
                    onClick={() => setTextAlign(value)}
                    sx={{
                      backgroundColor: textAlign === value ? '#81c784' : '#3c3c3d',
                      color: textAlign === value ? '#000' : '#e0e0e0',
                      '&:hover': { backgroundColor: '#81c784' },
                    }}
                  >
                    <Icon />
                  </Button>
                ))}
              </Box>

              {/* Font Weight */}
              <FormControlLabel
                control={
                  <Switch
                    checked={fontWeight === 'bold'}
                    onChange={(e) => setFontWeight(e.target.checked ? 'bold' : 'normal')}
                  />
                }
                label="Bold"
                sx={{ display: 'block', mb: 1 }}
              />

              {/* Font Style */}
              <FormControlLabel
                control={
                  <Switch
                    checked={fontStyle === 'italic'}
                    onChange={(e) => setFontStyle(e.target.checked ? 'italic' : 'normal')}
                  />
                }
                label="Italic"
                sx={{ display: 'block', mb: 1 }}
              />

              {/* Text Decoration */}
              <FormControlLabel
                control={
                  <Switch
                    checked={textDecoration === 'underline'}
                    onChange={(e) => setTextDecoration(e.target.checked ? 'underline' : 'none')}
                  />
                }
                label="Underline"
                sx={{ display: 'block', mb: 2 }}
              />

              {/* Colors */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PaletteIcon />}
                  onClick={() => setColorPickerOpen(true)}
                  sx={{
                    backgroundColor: textColor,
                    color: '#000',
                    flex: 1,
                    '&:hover': { opacity: 0.8 },
                  }}
                >
                  Text
                </Button>
                <Button
                  variant="contained"
                  startIcon={<PaletteIcon />}
                  onClick={() => setBgColorPickerOpen(true)}
                  sx={{
                    backgroundColor: backgroundColor,
                    color: backgroundColor === '#000000' ? '#fff' : '#000',
                    flex: 1,
                    border: '1px solid #3c3c3d',
                  }}
                >
                  BG
                </Button>
              </Box>

              {/* Presets */}
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Presets
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {presets.map((preset) => (
                  <Button
                    key={preset.name}
                    size="small"
                    onClick={() => {
                      setFontSize(preset.size);
                      setFontWeight(preset.weight);
                    }}
                    sx={{
                      backgroundColor: '#3c3c3d',
                      color: '#81c784',
                      '&:hover': { backgroundColor: '#81c784', color: '#000' },
                    }}
                  >
                    {preset.name}
                  </Button>
                ))}
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={exportText}
                sx={{
                  backgroundColor: '#81c784',
                  color: '#000',
                  mt: 2,
                  '&:hover': { backgroundColor: '#66bb6a' },
                }}
              >
                Export Settings
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Color Picker Dialogs */}
      <Dialog open={colorPickerOpen} onClose={() => setColorPickerOpen(false)}>
        <DialogTitle>Select Text Color</DialogTitle>
        <DialogContent>
          <ChromePicker color={textColor} onChange={(color) => setTextColor(color.hex)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setColorPickerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={bgColorPickerOpen} onClose={() => setBgColorPickerOpen(false)}>
        <DialogTitle>Select Background Color</DialogTitle>
        <DialogContent>
          <ChromePicker color={backgroundColor} onChange={(color) => setBackgroundColor(color.hex)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBgColorPickerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
