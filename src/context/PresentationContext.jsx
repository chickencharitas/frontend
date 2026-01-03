import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const PresentationContext = createContext(null);

// Sample data for demonstration
const sampleSongs = [
  {
    id: 'song-1',
    type: 'song',
    title: 'Amazing Grace',
    artist: 'Traditional',
    key: 'G',
    slides: [
      { id: 's1-1', content: 'Amazing grace, how sweet the sound\nThat saved a wretch like me', label: 'Verse 1' },
      { id: 's1-2', content: "I once was lost, but now am found\nWas blind, but now I see", label: 'Verse 1 (cont)' },
      { id: 's1-3', content: "'Twas grace that taught my heart to fear\nAnd grace my fears relieved", label: 'Verse 2' },
      { id: 's1-4', content: "How precious did that grace appear\nThe hour I first believed", label: 'Verse 2 (cont)' },
    ]
  },
  {
    id: 'song-2',
    type: 'song',
    title: 'How Great Thou Art',
    artist: 'Traditional',
    key: 'Bb',
    slides: [
      { id: 's2-1', content: 'O Lord my God, when I in awesome wonder\nConsider all the worlds Thy hands have made', label: 'Verse 1' },
      { id: 's2-2', content: 'I see the stars, I hear the rolling thunder\nThy power throughout the universe displayed', label: 'Verse 1 (cont)' },
      { id: 's2-3', content: 'Then sings my soul, my Savior God, to Thee\nHow great Thou art, how great Thou art', label: 'Chorus' },
    ]
  },
  {
    id: 'song-3',
    type: 'song',
    title: 'Build My Life',
    artist: 'Pat Barrett',
    key: 'D',
    slides: [
      { id: 's3-1', content: 'Worthy of every song we could ever sing\nWorthy of all the praise we could ever bring', label: 'Verse 1' },
      { id: 's3-2', content: 'Worthy of every breath we could ever breathe\nWe live for You', label: 'Verse 1 (cont)' },
      { id: 's3-3', content: 'Holy, there is no one like You\nThere is none beside You\nOpen up my eyes in wonder', label: 'Chorus' },
    ]
  }
];

const sampleScriptures = [
  {
    id: 'scripture-1',
    type: 'scripture',
    title: 'John 3:16',
    reference: 'John 3:16 (NIV)',
    slides: [
      { id: 'sc1-1', content: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', label: 'John 3:16' }
    ]
  },
  {
    id: 'scripture-2',
    type: 'scripture',
    title: 'Psalm 23',
    reference: 'Psalm 23:1-3 (NIV)',
    slides: [
      { id: 'sc2-1', content: 'The LORD is my shepherd, I lack nothing.', label: 'Psalm 23:1' },
      { id: 'sc2-2', content: 'He makes me lie down in green pastures,\nhe leads me beside quiet waters,', label: 'Psalm 23:2' },
      { id: 'sc2-3', content: 'he refreshes my soul.\nHe guides me along the right paths\nfor his name\'s sake.', label: 'Psalm 23:3' },
    ]
  }
];

const sampleMedia = [
  { id: 'media-1', type: 'image', title: 'Worship Background 1', url: '/backgrounds/worship1.jpg', thumbnail: '/thumbnails/worship1.jpg' },
  { id: 'media-2', type: 'image', title: 'Nature Background', url: '/backgrounds/nature.jpg', thumbnail: '/thumbnails/nature.jpg' },
  { id: 'media-3', type: 'video', title: 'Welcome Loop', url: '/videos/welcome.mp4', thumbnail: '/thumbnails/welcome.jpg' },
  { id: 'media-4', type: 'image', title: 'Cross Background', url: '/backgrounds/cross.jpg', thumbnail: '/thumbnails/cross.jpg' },
];

export function PresentationProvider({ children }) {
  // === SERVICE PLAYLIST STATE ===
  const [serviceItems, setServiceItems] = useState([
    { ...sampleSongs[0], order: 0 },
    { ...sampleScriptures[0], order: 1 },
    { ...sampleSongs[1], order: 2 },
  ]);

  // === LIVE OUTPUT STATE ===
  const [liveOutput, setLiveOutput] = useState({
    isLive: false,
    currentItem: null,      // Current service item being presented
    currentSlideIndex: 0,   // Index of current slide within the item
    background: null,       // Background media
    isBlacked: false,       // Black screen
    isCleared: false,       // Clear text (show only background)
    logo: null,             // Logo overlay
  });

  // === PREVIEW STATE ===
  const [preview, setPreview] = useState({
    item: null,
    slideIndex: 0,
  });

  // === LIBRARY DATA ===
  const [songs, setSongs] = useState(sampleSongs);
  const [scriptures, setScriptures] = useState(sampleScriptures);
  const [media, setMedia] = useState(sampleMedia);

  // === ACTIVE PANEL STATE ===
  const [activeLibraryPanel, setActiveLibraryPanel] = useState('songs'); // 'songs', 'scriptures', 'media', 'presentations'
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);

  // === SERVICE PLAYLIST ACTIONS ===
  const addToService = useCallback((item) => {
    setServiceItems(prev => [...prev, { ...item, order: prev.length }]);
  }, []);

  const removeFromService = useCallback((itemId) => {
    setServiceItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const reorderService = useCallback((startIndex, endIndex) => {
    setServiceItems(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((item, index) => ({ ...item, order: index }));
    });
  }, []);

  const clearService = useCallback(() => {
    setServiceItems([]);
  }, []);

  // === LIVE OUTPUT ACTIONS ===
  const goLive = useCallback((item, slideIndex = 0) => {
    setLiveOutput(prev => ({
      ...prev,
      isLive: true,
      currentItem: item,
      currentSlideIndex: slideIndex,
      isBlacked: false,
      isCleared: false,
    }));
  }, []);

  const goToSlide = useCallback((slideIndex) => {
    setLiveOutput(prev => ({
      ...prev,
      currentSlideIndex: Math.max(0, Math.min(slideIndex, (prev.currentItem?.slides?.length || 1) - 1)),
    }));
  }, []);

  const nextSlide = useCallback(() => {
    setLiveOutput(prev => {
      const maxIndex = (prev.currentItem?.slides?.length || 1) - 1;
      if (prev.currentSlideIndex >= maxIndex) {
        // Auto-advance to next service item
        const currentServiceIndex = serviceItems.findIndex(s => s.id === prev.currentItem?.id);
        if (currentServiceIndex >= 0 && currentServiceIndex < serviceItems.length - 1) {
          const nextItem = serviceItems[currentServiceIndex + 1];
          setSelectedServiceIndex(currentServiceIndex + 1);
          return {
            ...prev,
            currentItem: nextItem,
            currentSlideIndex: 0,
          };
        }
        return prev;
      }
      return { ...prev, currentSlideIndex: prev.currentSlideIndex + 1 };
    });
  }, [serviceItems]);

  const prevSlide = useCallback(() => {
    setLiveOutput(prev => {
      if (prev.currentSlideIndex <= 0) {
        // Go to previous service item's last slide
        const currentServiceIndex = serviceItems.findIndex(s => s.id === prev.currentItem?.id);
        if (currentServiceIndex > 0) {
          const prevItem = serviceItems[currentServiceIndex - 1];
          setSelectedServiceIndex(currentServiceIndex - 1);
          return {
            ...prev,
            currentItem: prevItem,
            currentSlideIndex: (prevItem.slides?.length || 1) - 1,
          };
        }
        return prev;
      }
      return { ...prev, currentSlideIndex: prev.currentSlideIndex - 1 };
    });
  }, [serviceItems]);

  const toggleBlack = useCallback(() => {
    setLiveOutput(prev => ({ ...prev, isBlacked: !prev.isBlacked, isCleared: false }));
  }, []);

  const toggleClear = useCallback(() => {
    setLiveOutput(prev => ({ ...prev, isCleared: !prev.isCleared, isBlacked: false }));
  }, []);

  const setBackground = useCallback((mediaItem) => {
    setLiveOutput(prev => ({ ...prev, background: mediaItem }));
  }, []);

  const stopLive = useCallback(() => {
    setLiveOutput(prev => ({
      ...prev,
      isLive: false,
      isBlacked: true,
    }));
  }, []);

  // === PREVIEW ACTIONS ===
  const setPreviewItem = useCallback((item, slideIndex = 0) => {
    setPreview({ item, slideIndex });
  }, []);

  const previewSlide = useCallback((slideIndex) => {
    setPreview(prev => ({ ...prev, slideIndex }));
  }, []);

  // === QUICK GO LIVE (from any library) ===
  const quickGoLive = useCallback((item, slideIndex = 0) => {
    // Add to service if not already there
    const existsInService = serviceItems.some(s => s.id === item.id);
    if (!existsInService) {
      addToService(item);
    }
    // Go live with the item
    goLive(item, slideIndex);
  }, [serviceItems, addToService, goLive]);

  // === SONG LIBRARY ACTIONS ===
  const addSong = useCallback((song) => {
    setSongs(prev => [...prev, { ...song, id: `song-${Date.now()}` }]);
  }, []);

  const updateSong = useCallback((songId, updatedSong) => {
    setSongs(prev => prev.map(song => 
      song.id === songId ? { ...song, ...updatedSong } : song
    ));
  }, []);

  // === SCRIPTURE ACTIONS ===
  const addScripture = useCallback((scripture) => {
    setScriptures(prev => [...prev, { ...scripture, id: `scripture-${Date.now()}` }]);
  }, []);

  const updateScripture = useCallback((scriptureId, updatedScripture) => {
    setScriptures(prev => prev.map(scripture => 
      scripture.id === scriptureId ? { ...scripture, ...updatedScripture } : scripture
    ));
  }, []);

  // === MEDIA ACTIONS ===
  const addMedia = useCallback((mediaItem) => {
    setMedia(prev => [...prev, { ...mediaItem, id: `media-${Date.now()}` }]);
  }, []);

  const updateMedia = useCallback((mediaId, updatedMedia) => {
    setMedia(prev => prev.map(mediaItem => 
      mediaItem.id === mediaId ? { ...mediaItem, ...updatedMedia } : mediaItem
    ));
  }, []);

  // === BROADCAST TO OUTPUT SCREENS ===
  useEffect(() => {
    if (liveOutput.isLive && liveOutput.currentItem) {
      const currentSlide = liveOutput.currentItem.slides?.[liveOutput.currentSlideIndex];
      const nextSlide = liveOutput.currentItem.slides?.[liveOutput.currentSlideIndex + 1];
      
      // Broadcast to Main Output and Stage Display
      window.dispatchEvent(new CustomEvent('slide:change', {
        detail: {
          currentSlide: liveOutput.isBlacked ? null : (liveOutput.isCleared ? { content: '' } : currentSlide),
          nextSlide: nextSlide || null,
          formatting: {
            backgroundColor: '#000000',
            fontColor: '#ffffff',
            fontFamily: 'Arial'
          },
          slideIndex: liveOutput.currentSlideIndex,
          totalSlides: liveOutput.currentItem.slides?.length || 0,
          presentationTitle: liveOutput.currentItem.title,
          isLive: true,
          isBlacked: liveOutput.isBlacked,
          isCleared: liveOutput.isCleared
        }
      }));
    } else if (!liveOutput.isLive) {
      // Clear output when not live
      window.dispatchEvent(new CustomEvent('slide:change', {
        detail: {
          currentSlide: null,
          nextSlide: null,
          formatting: {},
          isLive: false
        }
      }));
    }
  }, [liveOutput]);

  // === KEYBOARD SHORTCUTS ===
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          toggleBlack();
          break;
        case 'c':
        case 'C':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toggleClear();
          }
          break;
        case 'Escape':
          e.preventDefault();
          stopLive();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, toggleBlack, toggleClear, stopLive]);

  const value = {
    // Service Playlist
    serviceItems,
    addToService,
    removeFromService,
    reorderService,
    clearService,
    selectedServiceIndex,
    setSelectedServiceIndex,

    // Live Output
    liveOutput,
    goLive,
    goToSlide,
    nextSlide,
    prevSlide,
    toggleBlack,
    toggleClear,
    setBackground,
    stopLive,
    quickGoLive,

    // Preview
    preview,
    setPreviewItem,
    previewSlide,

    // Libraries
    songs,
    scriptures,
    media,
    addSong,
    updateSong,
    addScripture,
    updateScripture,
    addMedia,
    updateMedia,

    // UI State
    activeLibraryPanel,
    setActiveLibraryPanel,
  };

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation() {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
}

export default PresentationContext;
