import { useState, useEffect, useCallback } from 'react';
import { searchBible, getAvailableVersions, BIBLE_VERSIONS } from '../services/bibleApi';

/**
 * Custom hook for accessing Bible API
 * @param {string} defaultVersion - Default Bible version (default: 'KJV')
 * @returns {Object} - Bible API methods and state
 */
const useBible = (defaultVersion = 'KJV') => {
  const [verses, setVerses] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(defaultVersion);
  const [versions, setVersions] = useState([]);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bibleFavorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  // Add missing state for new ScriptureLookup component
  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [currentVerse, setCurrentVerse] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  
  // Mock Bible books data
  const bibleBooks = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
    '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah',
    'Esther', 'Job', 'Psalm', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
    'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah',
    'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
    'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
    'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
    '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
    '1 John', '2 John', '3 John', 'Jude', 'Revelation'
  ];

  // Load Bible versions on mount
  useEffect(() => {
    const loadVersions = async () => {
      try {
        const versionData = await getAvailableVersions();
        // versionData is already an array from getAvailableVersions
        if (Array.isArray(versionData)) {
          setVersions(versionData);
        } else {
          // Fallback if it's still an object
          const versionArray = Object.entries(versionData || BIBLE_VERSIONS).map(([code, versionInfo]) => {
            if (typeof versionInfo === 'string') {
              return { code, name: versionInfo, language: 'English', free: true, category: 'Other', installed: true };
            }
            return {
              code,
              name: versionInfo.name || versionInfo,
              language: versionInfo.language || 'English',
              free: versionInfo.free !== false,
              category: versionInfo.category || 'Other',
              installed: versionInfo.installed !== false
            };
          });
          setVersions(versionArray);
        }
      } catch (err) {
        console.error('Failed to load Bible versions:', err);
        // Fallback to hardcoded versions
        const versionArray = Object.entries(BIBLE_VERSIONS).map(([code, name]) => ({
          code,
          name,
          language: 'English',
          free: true,
          category: 'Classic',
          installed: true
        }));
        setVersions(versionArray);
      }
    };
    
    loadVersions();
    
    // Initialize books
    setBooks(bibleBooks);
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bibleFavorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  /**
   * Search for Bible verses
   * @param {string} query - The search query (e.g., 'John 3:16')
   * @param {string} version - Bible version code (optional)
   */
  const search = useCallback(async (query, versionToUse = version) => {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const result = await searchBible(query, versionToUse);
      
      if (result.success) {
        // Ensure verses is always an array
        let versesData = result.data;
        if (!Array.isArray(versesData)) {
          versesData = versesData ? [versesData] : [];
        }
        setVerses(versesData);
        setVersion(versionToUse);
        
        // Add to history if not already present
        setHistory(prev => {
          const newHistory = [{ query, version: versionToUse, timestamp: new Date() }, ...prev];
          // Keep only the last 10 searches
          return newHistory.slice(0, 10);
        });
      } else {
        setError(result.error || 'Failed to fetch Bible verses');
        setVerses([]);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching Bible verses');
      setVerses([]);
    } finally {
      setLoading(false);
    }
  }, [version]);

  /**
   * Add current verse to favorites
   * @param {string} reference - The Bible reference (e.g., 'John 3:16')
   * @param {string} text - The verse text
   * @param {string} version - The Bible version
   */
  const addToFavorites = useCallback((reference, text, version) => {
    setFavorites(prev => {
      // Check if already in favorites
      const exists = prev.some(fav => 
        fav.reference === reference && fav.version === version
      );
      
      if (exists) return prev;
      
      return [...prev, { reference, text, version, timestamp: new Date() }];
    });
  }, []);

  /**
   * Remove a verse from favorites
   * @param {string} reference - The Bible reference to remove
   * @param {string} version - The Bible version
   */
  const removeFromFavorites = useCallback((reference, version) => {
    setFavorites(prev => 
      prev.filter(fav => !(fav.reference === reference && fav.version === version))
    );
  }, []);

  /**
   * Check if a verse is in favorites
   * @param {string} reference - The Bible reference to check
   * @param {string} version - The Bible version
   * @returns {boolean} - Whether the verse is in favorites
   */
  const isFavorite = useCallback((reference, version) => {
    return favorites.some(fav => 
      fav.reference === reference && fav.version === version
    );
  }, [favorites]);

  /**
   * Fetch a specific verse by reference
   * @param {string} reference - Bible reference (e.g., 'John 3:16')
   */
  const fetchVerse = useCallback(async (reference) => {
    if (!reference) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await searchBible(reference, version);
      
      if (result.success) {
        let versesData = result.data;
        if (!Array.isArray(versesData)) {
          versesData = versesData ? [versesData] : [];
        }
        setVerses(versesData);
        setCurrentVerse({
          reference,
          text: Array.isArray(versesData) ? versesData.map(v => v.text).join('\n') : versesData.text,
          verses: versesData
        });
      } else {
        setError(result.error || 'Failed to fetch Bible verses');
        setCurrentVerse(null);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching Bible verses');
      setCurrentVerse(null);
    } finally {
      setLoading(false);
    }
  }, [version]);

  /**
   * Search scripture with results
   * @param {string} query - Search query
   */
  const searchScripture = useCallback(async (query) => {
    if (!query) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await searchBible(query, version);
      
      if (result.success) {
        let versesData = result.data;
        if (!Array.isArray(versesData)) {
          versesData = versesData ? [versesData] : [];
        }
        setSearchResults(versesData.map((v, idx) => ({
          reference: v.reference || `Verse ${idx + 1}`,
          text: v.text,
          verse: idx + 1
        })));
      } else {
        setError(result.error || 'Search failed');
        setSearchResults([]);
      }
    } catch (err) {
      setError(err.message || 'Search failed');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [version]);

  /**
   * Get chapters for a book
   * @param {string} bookName - Book name
   */
  const getChapter = useCallback((bookName) => {
    // Mock chapter numbers (most books have 50 chapters or less)
    const bookChapters = [];
    const bookIndex = bibleBooks.indexOf(bookName);
    if (bookIndex !== -1) {
      const chapterCount = bookIndex < 39 ? 50 : 28; // Old Testament books have ~50, New Testament ~28
      for (let i = 1; i <= chapterCount; i++) {
        bookChapters.push(i.toString());
      }
    }
    setChapters(bookChapters);
    return bookChapters;
  }, []);

  /**
   * Clear search results
   */
  const clearResults = useCallback(() => {
    setSearchResults([]);
    setCurrentVerse(null);
  }, []);

  return {
    // State
    verses,
    loading,
    error,
    version,
    versions,
    history,
    favorites,
    books,
    chapters,
    currentVerse,
    searchResults,
    
    // Methods
    search,
    setVersion,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    fetchVerse,
    searchScripture,
    getChapter,
    clearResults,
  };
};

export default useBible;
