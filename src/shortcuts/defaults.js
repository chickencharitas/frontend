const defaults = {
  // Presentation Navigation
  nextCue: [' ', 'ArrowRight'],
  previousCue: ['ArrowLeft'],
  playPause: ['p'],
  toggleFullscreen: ['F11', 'f'],
  toggleStageDisplay: ['s'],
  showShortcuts: ['F1'],
  
  // File Operations
  newPresentation: ['Ctrl+N'],
  save: ['Ctrl+S'],
  undo: ['Ctrl+Z'],
  redo: ['Ctrl+Y', 'Ctrl+Shift+Z'],
  
  // Cue/Slide Management
  addCue: ['Ctrl+A'],
  duplicateCue: ['Ctrl+D'],
  deleteCue: ['Delete', 'Del'],
  editCue: ['F2'],
  stopPresentation: ['Escape'],
  goLive: ['g'],
  
  // Phase 1: Presentation Builder Shortcuts
  addSlide: ['Ctrl+Shift+N'],
  deleteSlide: ['Ctrl+Shift+Delete'],
  duplicateSlide: ['Ctrl+Shift+D'],
  moveSlideUp: ['Ctrl+Shift+ArrowUp'],
  moveSlideDown: ['Ctrl+Shift+ArrowDown'],
  
  // Phase 1: Slide Editor Shortcuts
  addTextElement: ['Ctrl+T'],
  addImageElement: ['Ctrl+I'],
  addVideoElement: ['Ctrl+Shift+V'],
  deleteElement: ['Backspace'],
  formatBold: ['Ctrl+B'],
  formatItalic: ['Ctrl+Shift+I'],
  formatUnderline: ['Ctrl+U'],
  
  // Phase 1: Presenter View Shortcuts
  startPresentation: ['F5'],
  pausePresentation: ['Ctrl+Shift+P'],
  resetTimer: ['Ctrl+Shift+R'],
  nextSlide: ['Space', 'ArrowRight'],
  previousSlide: ['Backspace', 'ArrowLeft'],
  
  // Phase 1: Content Panel Shortcuts
  openSongs: ['Ctrl+Shift+S'],
  openScripture: ['Ctrl+Shift+B'],
  openEditor: ['Ctrl+Shift+E'],
  openPresenter: ['Ctrl+Shift+L'],
  searchContent: ['Ctrl+F']
};

export default defaults;
