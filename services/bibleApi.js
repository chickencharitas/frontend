/**
 * Install a Bible version (premium/paid)
 * @param {string} code - Version code to install
 * @returns {Promise<object>} - Result
 */
const installBibleVersion = async (code) => {
  try {
    const response = await fetch(`${API_BASE}/bible/install-version`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
      timeout: 2000
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
};
/**
 * Bible API Service - Mock Mode for development
 * Returns mock Bible verses for testing
 */

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'; // Backend API (unused in mock mode)
const GETBIBLE_API = 'https://api.getbible.com/v1';
const CORS_PROXY = 'https://api.allorigins.win/raw?url='; // CORS proxy for external API

// Available Bible versions (fallback - use this if backend unavailable)
const BIBLE_VERSIONS = {
  'kjv': 'King James Version',
  'niv': 'New International Version',
  'nkjv': 'New King James Version',
  'esv': 'English Standard Version',
  'nasb': 'New American Standard Bible',
  'nrsv': 'New Revised Standard Version',
  'amp': 'Amplified Bible',
  'nlt': 'New Living Translation',
  'msg': 'The Message',
  'tlb': 'The Living Bible',
  'gnt': 'Good News Translation',
  'asv': 'American Standard Version',
  'web': 'World English Bible',
  'ylt': 'Young\'s Literal Translation',
  'darby': 'Darby Bible',
  'rsv': 'Revised Standard Version',
  'hcsb': 'Holman Christian Standard Bible',
  'ncv': 'New Century Version',
  'icb': 'International Children\'s Bible',
  'gw': 'God\'s Word Translation',
  'rvc': 'Reina-Valera Contemporánea',
  'rv1960': 'Reina-Valera (1960)',
  'bsy': 'Bible in Simplified Chinese',
  'btv': 'Bible in Traditional Chinese',
  'lut': 'Luther Bible German',
  'ara': 'Arabic Bible',
  'heb': 'Hebrew Bible',
  'gre': 'Greek Bible',
  'jpn': 'Japanese Bible',
  'por': 'Portuguese Bible',
  'rus': 'Russian Bible',
  'ukr': 'Ukrainian Bible',
  'ita': 'Italian Bible',
  'fra': 'French Bible',
};

/**
 * Parse Bible reference (e.g., 'John 3:16' or 'Genesis 1:1-3')
 * @param {string} query - The Bible reference
 * @returns {Object} - Parsed reference with book, chapter, verse(s)
 */
const parseReference = (query) => {
  const match = query.match(/^([A-Za-z\s]+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
  if (!match) {
    throw new Error('Invalid Bible reference format. Use format: "Book Chapter:Verse" (e.g., "John 3:16")');
  }
  
  const bookName = match[1].trim();
  const chapter = match[2];
  const startVerse = match[3];
  const endVerse = match[4];
  
  return { bookName, chapter, startVerse, endVerse };
};

/**
 * Try to search using backend first, fall back to GetBible.com
 * @param {string} query - The search query (e.g., 'John 3:16')
 * @param {string} version - Bible version code (default: 'kjv')
 * @returns {Promise<Object>} - Bible verses and metadata
 */
const searchBible = async (query, version = 'kjv') => {
  try {
    parseReference(query); // Validate format
    const versionCode = version.toLowerCase();

    // Mock Bible verses for development
    const mockVerses = {
      'John 3:16': {
        text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
        reference: 'John 3:16',
        book: 'John',
        chapter: 3,
        verse: 16
      },
      'Genesis 1:1': {
        text: 'In the beginning God created the heavens and the earth.',
        reference: 'Genesis 1:1',
        book: 'Genesis',
        chapter: 1,
        verse: 1
      },
      'Psalm 23:1': {
        text: 'The LORD is my shepherd; I shall not want.',
        reference: 'Psalm 23:1',
        book: 'Psalm',
        chapter: 23,
        verse: 1
      },
      'Psalm 23:4': {
        text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',
        reference: 'Psalm 23:4',
        book: 'Psalm',
        chapter: 23,
        verse: 4
      },
      'Matthew 28:19': {
        text: 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.',
        reference: 'Matthew 28:19',
        book: 'Matthew',
        chapter: 28,
        verse: 19
      },
      'Romans 3:23': {
        text: 'For all have sinned and fall short of the glory of God.',
        reference: 'Romans 3:23',
        book: 'Romans',
        chapter: 3,
        verse: 23
      },
      'Ephesians 2:8': {
        text: 'For by grace you have been saved through faith; and this is not your own doing; it is the gift of God.',
        reference: 'Ephesians 2:8',
        book: 'Ephesians',
        chapter: 2,
        verse: 8
      },
      'Philippians 4:13': {
        text: 'I can do all things through Christ who strengthens me.',
        reference: 'Philippians 4:13',
        book: 'Philippians',
        chapter: 4,
        verse: 13
      }
    };

    // Return mock data if available
    if (mockVerses[query]) {
      return {
        success: true,
        data: [mockVerses[query]],
        version: BIBLE_VERSIONS[versionCode] || versionCode.toUpperCase(),
        versionCode: versionCode,
        offline: true,
        source: 'mock'
      };
    }

    // Generate mock verse for any other reference
    const parsed = parseReference(query);
    const mockVerse = {
      text: `This is a mock verse for ${query}. In a real implementation, this would fetch the actual Bible text.`,
      reference: query,
      book: parsed.bookName,
      chapter: parsed.chapter,
      verse: parsed.startVerse
    };

    return {
      success: true,
      data: [mockVerse],
      version: BIBLE_VERSIONS[versionCode] || versionCode.toUpperCase(),
      versionCode: versionCode,
      offline: true,
      source: 'mock'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to search Bible',
      version: BIBLE_VERSIONS[version] || version.toUpperCase(),
      versionCode: version,
    };
  }
};

/**
 * Get available Bible versions (try backend, fallback to hardcoded)
 * @returns {Promise<Array>} - Array of version objects with metadata
 */
const getAvailableVersions = async () => {
  try {
    // Try backend first with proper timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`${API_BASE}/bible/versions`, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data.versions) {
        // Ensure we return an array, not an object
        if (Array.isArray(data.versions)) {
          return data.versions;
        }
        
        // Convert object to array for Autocomplete
        return Object.entries(data.versions).map(([code, versionData]) => {
          // Handle different response formats
          if (typeof versionData === 'string') {
            return {
              code,
              name: versionData,
              language: 'English',
              free: true,
              category: 'Other',
              installed: true
            };
          }
          
          return {
            code,
            name: versionData.name || versionData,
            language: versionData.language || 'English',
            free: versionData.free !== false,
            category: versionData.category || 'Other',
            installed: versionData.installed !== false
          };
        });
      }
    }
  } catch (error) {
    console.log('Backend unavailable, using fallback versions:', error.message);
  }
  
  // Return hardcoded versions as fallback
  return Object.entries(BIBLE_VERSIONS).map(([code, name]) => ({
    code,
    name,
    language: 'English',
    free: true,
    category: 'Classic',
    installed: true
  }));
};

/**
 * Get all Bible books from backend (fallback to empty array)
 * @returns {Promise<Array>} - Array of Bible books
 */
const getBooks = async () => {
  try {
    const response = await fetch(`${API_BASE}/bible/books`, { timeout: 2000 });
    if (response.ok) {
      const data = await response.json();
      return data.books || [];
    }
  } catch (error) {
    console.log('Backend unavailable for books');
  }
  return [];
};

/**
 * Add a verse to user favorites
 */
const addToFavorites = async (bookId, chapter, verse, versionCode, notes = '') => {
  try {
    const response = await fetch(`${API_BASE}/bible/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, chapter, verse, versionCode, notes }),
      timeout: 2000
    });

    if (!response.ok) {
      throw new Error('Failed to add to favorites');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

/**
 * Get user favorites
 */
const getFavorites = async () => {
  try {
    const response = await fetch(`${API_BASE}/bible/favorites`, { timeout: 2000 });
    if (response.ok) {
      const data = await response.json();
      return data.favorites || [];
    }
  } catch (error) {
    console.log('Backend unavailable for favorites');
  }
  return [];
};

export { 
  searchBible, 
  getAvailableVersions, 
  getBooks,
  addToFavorites,
  getFavorites,
  installBibleVersion,
  BIBLE_VERSIONS
};
