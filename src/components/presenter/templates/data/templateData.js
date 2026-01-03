/**
 * Comprehensive Template Data - All 5 Template Types
 * 50+ pre-built professional templates
 */

// ============================================
// SLIDE TEMPLATES (14 templates)
// ============================================
export const slideTemplates = [
  {
    id: 'slide-title-basic',
    name: 'Title Slide',
    category: 'Basic',
    tags: ['title', 'opening', 'simple'],
    layout: {
      title: { position: 'center', size: 'xl', weight: 'bold' },
      subtitle: { position: 'center-bottom', size: 'lg', weight: 'normal' },
      background: 'gradient-blue'
    },
    preview: {
      title: 'Your Presentation Title',
      subtitle: 'Add your subtitle here',
      bgColor: '#1a1a1a'
    },
    featured: true
  },
  {
    id: 'slide-title-image',
    name: 'Title with Image',
    category: 'Advanced',
    tags: ['image', 'title', 'featured'],
    layout: {
      title: { position: 'bottom-left', size: 'xl', weight: 'bold' },
      image: { position: 'right', width: '50%' },
      background: 'solid-dark'
    },
    preview: {
      title: 'Compelling Title',
      bgColor: '#1a1a1a',
      imagePosition: 'right'
    }
  },
  {
    id: 'slide-two-column',
    name: 'Two Column',
    category: 'Layout',
    tags: ['columns', 'text', 'balanced'],
    layout: {
      leftColumn: { width: '50%', position: 'left' },
      rightColumn: { width: '50%', position: 'right' },
      background: 'solid-dark'
    },
    preview: {
      leftText: 'Left Content',
      rightText: 'Right Content',
      bgColor: '#1a1a1a'
    }
  },
  {
    id: 'slide-three-column',
    name: 'Three Column',
    category: 'Layout',
    tags: ['columns', 'comparison', 'thirds'],
    layout: {
      column1: { width: '33%', position: 'left' },
      column2: { width: '33%', position: 'center' },
      column3: { width: '33%', position: 'right' },
      background: 'solid-dark'
    },
    preview: { bgColor: '#1a1a1a' }
  },
  {
    id: 'slide-image-full',
    name: 'Full Screen Image',
    category: 'Media',
    tags: ['image', 'fullscreen', 'background'],
    layout: {
      image: { position: 'full', overlay: 'dark-50' },
      title: { position: 'bottom-center', size: 'xl', color: 'white' }
    },
    preview: { imagePosition: 'full', bgColor: '#2d2d2e' }
  },
  {
    id: 'slide-quote',
    name: 'Quote Slide',
    category: 'Special',
    tags: ['quote', 'inspiration', 'elegant'],
    layout: {
      quote: { position: 'center', size: 'xxl', style: 'italic', weight: 'bold' },
      author: { position: 'bottom-right', size: 'sm' },
      background: 'gradient-accent'
    },
    preview: {
      quote: '"Your message here"',
      bgColor: '#1a3a3a',
      accentColor: '#81c784'
    }
  },
  {
    id: 'slide-bullet-left',
    name: 'Bullet Points Left',
    category: 'Content',
    tags: ['bullets', 'text', 'list'],
    layout: {
      title: { position: 'top-center', size: 'lg' },
      bullets: { position: 'left', width: '70%', spacing: 'large' },
      image: { position: 'right', width: '25%' },
      background: 'solid-dark'
    },
    preview: { bgColor: '#1a1a1a' }
  },
  {
    id: 'slide-verse',
    name: 'Scripture Verse',
    category: 'Religious',
    tags: ['scripture', 'verse', 'spiritual'],
    layout: {
      verse: { position: 'center', size: 'xl', style: 'serif' },
      reference: { position: 'bottom-right', size: 'md' },
      background: 'gradient-purple'
    },
    preview: {
      verse: 'For God so loved the world...',
      bgColor: '#2a1a3a',
      accentColor: '#a78bfa'
    }
  },
  {
    id: 'slide-timeline',
    name: 'Timeline',
    category: 'Infographic',
    tags: ['timeline', 'progression', 'chronological'],
    layout: {
      items: [
        { label: 'Phase 1', position: 'left' },
        { label: 'Phase 2', position: 'center-left' },
        { label: 'Phase 3', position: 'center-right' },
        { label: 'Phase 4', position: 'right' }
      ],
      background: 'solid-dark'
    },
    preview: { bgColor: '#1a1a1a' }
  },
  {
    id: 'slide-comparison',
    name: 'Before/After',
    category: 'Special',
    tags: ['comparison', 'before-after', 'contrast'],
    layout: {
      before: { position: 'left', width: '45%', label: 'Before' },
      after: { position: 'right', width: '45%', label: 'After' },
      background: 'solid-dark'
    },
    preview: { bgColor: '#1a1a1a' }
  },
  {
    id: 'slide-video',
    name: 'Video Embed',
    category: 'Media',
    tags: ['video', 'media', 'embedded'],
    layout: {
      video: { position: 'center', width: '80%', ratio: '16:9' },
      title: { position: 'bottom-center', size: 'lg' },
      background: 'solid-dark'
    },
    preview: { bgColor: '#1a1a1a' }
  },
  {
    id: 'slide-agenda',
    name: 'Agenda/Outline',
    category: 'Navigation',
    tags: ['agenda', 'outline', 'structure'],
    layout: {
      title: { position: 'top-center', size: 'lg' },
      items: { position: 'center', spacing: 'medium' },
      background: 'gradient-blue'
    },
    preview: { bgColor: '#1a2a3a' }
  },
  {
    id: 'slide-blank',
    name: 'Blank Slide',
    category: 'Basic',
    tags: ['blank', 'empty', 'custom'],
    layout: {
      background: 'solid-dark'
    },
    preview: { bgColor: '#1a1a1a' }
  },
  {
    id: 'slide-text-overlay',
    name: 'Text Overlay on Image',
    category: 'Media',
    tags: ['overlay', 'image', 'text'],
    layout: {
      image: { position: 'full', overlay: 'dark-70' },
      text: { position: 'center', color: 'white', size: 'xl' },
      background: 'solid-dark'
    },
    preview: { bgColor: '#1a1a1a' }
  }
];

// ============================================
// PRESENTATION TEMPLATES (12 templates)
// ============================================
export const presentationTemplates = [
  {
    id: 'pres-worship-service',
    name: 'Worship Service',
    category: 'Religious',
    tags: ['worship', 'church', 'service', 'complete'],
    slides: [
      { type: 'title', content: 'Sunday Worship' },
      { type: 'announcement', content: 'Welcome Message' },
      { type: 'song', content: 'Opening Song' },
      { type: 'prayer', content: 'Prayer' },
      { type: 'scripture', content: 'Scripture Reading' },
      { type: 'sermon', content: 'Sermon Title' },
      { type: 'song', content: 'Closing Song' },
      { type: 'closing', content: 'Benediction' }
    ],
    slideCount: 8,
    duration: '60-90 min',
    featured: true
  },
  {
    id: 'pres-sermon-series',
    name: 'Sermon Series',
    category: 'Religious',
    tags: ['sermon', 'series', 'teaching', 'multi-week'],
    slides: [
      { type: 'title', content: 'Series: Week 1' },
      { type: 'agenda', content: 'Overview' },
      { type: 'verse', content: 'Main Scripture' },
      { type: 'content', content: 'Key Point 1' },
      { type: 'content', content: 'Key Point 2' },
      { type: 'content', content: 'Key Point 3' },
      { type: 'application', content: 'Application' },
      { type: 'closing', content: 'Next Steps' }
    ],
    slideCount: 8,
    duration: '30-45 min'
  },
  {
    id: 'pres-business-pitch',
    name: 'Business Pitch',
    category: 'Corporate',
    tags: ['business', 'pitch', 'professional', 'investor'],
    slides: [
      { type: 'title', content: 'Company Overview' },
      { type: 'problem', content: 'Problem Statement' },
      { type: 'solution', content: 'Our Solution' },
      { type: 'market', content: 'Market Opportunity' },
      { type: 'team', content: 'Team' },
      { type: 'financials', content: 'Financial Projections' },
      { type: 'contact', content: 'Contact & Q&A' }
    ],
    slideCount: 7,
    duration: '15-20 min'
  },
  {
    id: 'pres-training',
    name: 'Training Program',
    category: 'Educational',
    tags: ['training', 'education', 'learning', 'workshop'],
    slides: [
      { type: 'title', content: 'Training Title' },
      { type: 'agenda', content: 'Course Agenda' },
      { type: 'lesson', content: 'Lesson 1' },
      { type: 'lesson', content: 'Lesson 2' },
      { type: 'lesson', content: 'Lesson 3' },
      { type: 'activity', content: 'Group Activity' },
      { type: 'summary', content: 'Key Takeaways' },
      { type: 'closing', content: 'Resources' }
    ],
    slideCount: 8,
    duration: '2-4 hours'
  },
  {
    id: 'pres-conference',
    name: 'Conference Talk',
    category: 'Professional',
    tags: ['conference', 'talk', 'speaking', 'presentation'],
    slides: [
      { type: 'title', content: 'Talk Title' },
      { type: 'speaker-bio', content: 'Speaker Introduction' },
      { type: 'agenda', content: 'What We\'ll Cover' },
      { type: 'content', content: 'Main Content 1' },
      { type: 'content', content: 'Main Content 2' },
      { type: 'content', content: 'Main Content 3' },
      { type: 'qa', content: 'Questions & Answers' }
    ],
    slideCount: 7,
    duration: '45-60 min'
  },
  {
    id: 'pres-sales-deck',
    name: 'Sales Deck',
    category: 'Corporate',
    tags: ['sales', 'commercial', 'proposal', 'offer'],
    slides: [
      { type: 'title', content: 'Solution Overview' },
      { type: 'problem', content: 'Client Challenge' },
      { type: 'benefits', content: 'Key Benefits' },
      { type: 'features', content: 'Product Features' },
      { type: 'case-study', content: 'Success Story' },
      { type: 'pricing', content: 'Investment' },
      { type: 'next-steps', content: 'Action Items' }
    ],
    slideCount: 7,
    duration: '20-30 min'
  },
  {
    id: 'pres-event-program',
    name: 'Event Program',
    category: 'Events',
    tags: ['event', 'program', 'schedule', 'announcement'],
    slides: [
      { type: 'title', content: 'Event Title' },
      { type: 'schedule', content: 'Event Schedule' },
      { type: 'speaker', content: 'Speaker 1' },
      { type: 'speaker', content: 'Speaker 2' },
      { type: 'activity', content: 'Interactive Activity' },
      { type: 'sponsors', content: 'Sponsors' },
      { type: 'contact', content: 'Contact Info' }
    ],
    slideCount: 7,
    duration: 'varies'
  },
  {
    id: 'pres-youth-event',
    name: 'Youth Event',
    category: 'Religious',
    tags: ['youth', 'fun', 'interactive', 'modern'],
    slides: [
      { type: 'title', content: 'Youth Event' },
      { type: 'icebreaker', content: 'Icebreaker' },
      { type: 'game', content: 'Activity 1' },
      { type: 'game', content: 'Activity 2' },
      { type: 'message', content: 'Main Message' },
      { type: 'challenge', content: 'Challenge' },
      { type: 'closing', content: 'Closing' }
    ],
    slideCount: 7,
    duration: '60-90 min'
  },
  {
    id: 'pres-quarterly-review',
    name: 'Quarterly Review',
    category: 'Corporate',
    tags: ['review', 'quarterly', 'metrics', 'performance'],
    slides: [
      { type: 'title', content: 'Q1 Review' },
      { type: 'metrics', content: 'Key Metrics' },
      { type: 'achievements', content: 'Achievements' },
      { type: 'challenges', content: 'Challenges' },
      { type: 'goals', content: 'Next Quarter Goals' },
      { type: 'team-highlights', content: 'Team Highlights' },
      { type: 'closing', content: 'Looking Ahead' }
    ],
    slideCount: 7,
    duration: '30-45 min'
  },
  {
    id: 'pres-wedding',
    name: 'Wedding Ceremony',
    category: 'Events',
    tags: ['wedding', 'ceremony', 'personal', 'celebration'],
    slides: [
      { type: 'title', content: 'Wedding Title' },
      { type: 'couple-intro', content: 'Meet the Couple' },
      { type: 'story', content: 'Our Story' },
      { type: 'vows', content: 'Vows & Promises' },
      { type: 'photos', content: 'Photo Montage' },
      { type: 'reception-info', content: 'Reception Details' },
      { type: 'closing', content: 'Celebration' }
    ],
    slideCount: 7,
    duration: '30-60 min'
  },
  {
    id: 'pres-small-group',
    name: 'Small Group Study',
    category: 'Religious',
    tags: ['small-group', 'study', 'discussion', 'interactive'],
    slides: [
      { type: 'title', content: 'Study Topic' },
      { type: 'opener', content: 'Icebreaker Question' },
      { type: 'scripture', content: 'Scripture Focus' },
      { type: 'discussion', content: 'Discussion 1' },
      { type: 'discussion', content: 'Discussion 2' },
      { type: 'application', content: 'Life Application' },
      { type: 'prayer', content: 'Prayer Request Time' }
    ],
    slideCount: 7,
    duration: '45-60 min'
  },
  {
    id: 'pres-minimal',
    name: 'Minimal Deck (Blank)',
    category: 'Basic',
    tags: ['blank', 'minimal', 'custom', 'flexible'],
    slides: [
      { type: 'title', content: 'Your Title Here' },
      { type: 'blank', content: 'Custom Slide' },
      { type: 'blank', content: 'Custom Slide' },
      { type: 'blank', content: 'Custom Slide' }
    ],
    slideCount: 4,
    duration: 'flexible'
  }
];

// ============================================
// THEME TEMPLATES (8 templates)
// ============================================
export const themeTemplates = [
  {
    id: 'theme-modern-dark',
    name: 'Modern Dark',
    category: 'Contemporary',
    tags: ['dark', 'modern', 'professional', 'sleek'],
    colors: {
      primary: '#1a1a1a',
      secondary: '#252526',
      accent: '#81c784',
      text: '#ffffff',
      highlight: '#64b5f6'
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Inter, sans-serif',
      accent: 'Playfair Display, serif'
    },
    featured: true
  },
  {
    id: 'theme-corporate-blue',
    name: 'Corporate Blue',
    category: 'Professional',
    tags: ['blue', 'corporate', 'trust', 'business'],
    colors: {
      primary: '#0d47a1',
      secondary: '#1565c0',
      accent: '#ffd600',
      text: '#ffffff',
      highlight: '#42a5f5'
    },
    fonts: {
      heading: 'Montserrat, sans-serif',
      body: 'Open Sans, sans-serif',
      accent: 'Roboto, sans-serif'
    }
  },
  {
    id: 'theme-vibrant',
    name: 'Vibrant Rainbow',
    category: 'Contemporary',
    tags: ['colorful', 'vibrant', 'modern', 'youth'],
    colors: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      accent: '#ffd93d',
      text: '#ffffff',
      highlight: '#a8e6cf'
    },
    fonts: {
      heading: 'Fredoka, sans-serif',
      body: 'Quicksand, sans-serif',
      accent: 'Bangers, cursive'
    }
  },
  {
    id: 'theme-minimalist',
    name: 'Minimalist Light',
    category: 'Clean',
    tags: ['light', 'minimal', 'clean', 'simple'],
    colors: {
      primary: '#f5f5f5',
      secondary: '#e0e0e0',
      accent: '#1976d2',
      text: '#212121',
      highlight: '#0d47a1'
    },
    fonts: {
      heading: 'Helvetica, Arial, sans-serif',
      body: 'Segoe UI, Tahoma, sans-serif',
      accent: 'Georgia, serif'
    }
  },
  {
    id: 'theme-spiritual',
    name: 'Spiritual',
    category: 'Religious',
    tags: ['spiritual', 'religious', 'peaceful', 'calming'],
    colors: {
      primary: '#2c1a2e',
      secondary: '#4a235a',
      accent: '#b39ddb',
      text: '#e8d5e8',
      highlight: '#d1c4e9'
    },
    fonts: {
      heading: 'IM Fell DW Pica, serif',
      body: 'Lora, serif',
      accent: 'Cinzel, serif'
    }
  },
  {
    id: 'theme-warm-earth',
    name: 'Warm Earth Tones',
    category: 'Natural',
    tags: ['warm', 'earth', 'organic', 'natural'],
    colors: {
      primary: '#3e2723',
      secondary: '#5d4037',
      accent: '#d7ccc8',
      text: '#faf4f1',
      highlight: '#ff7043'
    },
    fonts: {
      heading: 'Bitter, serif',
      body: 'Droid Serif, serif',
      accent: 'Ubuntu, sans-serif'
    }
  },
  {
    id: 'theme-tech-neon',
    name: 'Tech Neon',
    category: 'Futuristic',
    tags: ['neon', 'tech', 'future', 'trendy'],
    colors: {
      primary: '#0a0e27',
      secondary: '#1a1a3a',
      accent: '#00ff88',
      text: '#ffffff',
      highlight: '#ff006e'
    },
    fonts: {
      heading: 'Space Grotesk, sans-serif',
      body: 'Courier Prime, monospace',
      accent: 'IBM Plex Mono, monospace'
    }
  },
  {
    id: 'theme-sunset',
    name: 'Sunset Gradient',
    category: 'Artistic',
    tags: ['gradient', 'sunset', 'warm', 'artistic'],
    colors: {
      primary: '#ff6b35',
      secondary: '#f7931e',
      accent: '#fdb833',
      text: '#ffffff',
      highlight: '#fff700'
    },
    fonts: {
      heading: 'Dancing Script, cursive',
      body: 'Comfortaa, sans-serif',
      accent: 'Indie Flower, cursive'
    }
  }
];

// ============================================
// SERVICE TEMPLATES (10 templates)
// ============================================
export const serviceTemplates = [
  {
    id: 'svc-sunday-worship',
    name: 'Sunday Worship',
    category: 'Weekly',
    tags: ['sunday', 'worship', 'weekly', 'traditional'],
    order: [
      { section: 'Welcome', duration: '5 min' },
      { section: 'Opening Song', duration: '5 min' },
      { section: 'Scripture Reading', duration: '5 min' },
      { section: 'Worship Songs', duration: '15 min' },
      { section: 'Announcements', duration: '5 min' },
      { section: 'Offering', duration: '5 min' },
      { section: 'Sermon', duration: '30 min' },
      { section: 'Closing Song', duration: '5 min' },
      { section: 'Prayer/Dismissal', duration: '5 min' }
    ],
    totalDuration: '80 min',
    featured: true
  },
  {
    id: 'svc-midweek',
    name: 'Midweek Prayer Service',
    category: 'Weekly',
    tags: ['midweek', 'prayer', 'informal', 'brief'],
    order: [
      { section: 'Opening Prayer', duration: '3 min' },
      { section: 'Song', duration: '5 min' },
      { section: 'Scripture Reading', duration: '3 min' },
      { section: 'Teaching', duration: '15 min' },
      { section: 'Prayer Time', duration: '20 min' },
      { section: 'Closing', duration: '2 min' }
    ],
    totalDuration: '48 min'
  },
  {
    id: 'svc-youth-service',
    name: 'Youth Service',
    category: 'Specialized',
    tags: ['youth', 'fun', 'interactive', 'modern', 'energetic'],
    order: [
      { section: 'Welcome/Icebreaker', duration: '5 min' },
      { section: 'High Energy Worship', duration: '10 min' },
      { section: 'Testimonies', duration: '8 min' },
      { section: 'Interactive Game', duration: '10 min' },
      { section: 'Message', duration: '20 min' },
      { section: 'Response Activity', duration: '10 min' },
      { section: 'Closing Song/Prayer', duration: '5 min' }
    ],
    totalDuration: '68 min'
  },
  {
    id: 'svc-special-event',
    name: 'Special Event Service',
    category: 'Seasonal',
    tags: ['special', 'event', 'holiday', 'celebration'],
    order: [
      { section: 'Welcome & Theme Introduction', duration: '5 min' },
      { section: 'Special Music', duration: '10 min' },
      { section: 'Participatory Worship', duration: '15 min' },
      { section: 'Guest Speaker/Testimony', duration: '25 min' },
      { section: 'Interactive Element', duration: '10 min' },
      { section: 'Closing & Benediction', duration: '5 min' }
    ],
    totalDuration: '70 min'
  },
  {
    id: 'svc-wedding-ceremony',
    name: 'Wedding Ceremony',
    category: 'Milestone',
    tags: ['wedding', 'ceremony', 'milestone', 'formal'],
    order: [
      { section: 'Seating/Prelude Music', duration: '15 min' },
      { section: 'Processional', duration: '3 min' },
      { section: 'Welcome Address', duration: '3 min' },
      { section: 'Opening Prayer', duration: '2 min' },
      { section: 'Readings', duration: '5 min' },
      { section: 'Vows Exchange', duration: '5 min' },
      { section: 'Ring Exchange', duration: '2 min' },
      { section: 'Unity Ceremony', duration: '3 min' },
      { section: 'Pronouncement', duration: '1 min' },
      { section: 'Recessional', duration: '2 min' }
    ],
    totalDuration: '41 min'
  },
  {
    id: 'svc-funeral',
    name: 'Funeral Service',
    category: 'Milestone',
    tags: ['funeral', 'memorial', 'solemn', 'reflective'],
    order: [
      { section: 'Welcome & Opening Prayer', duration: '5 min' },
      { section: 'Hymn/Worship Song', duration: '5 min' },
      { section: 'Scripture Reading', duration: '5 min' },
      { section: 'Eulogies', duration: '20 min' },
      { section: 'Message of Hope', duration: '15 min' },
      { section: 'Prayer', duration: '5 min' },
      { section: 'Final Blessing', duration: '2 min' }
    ],
    totalDuration: '57 min'
  },
  {
    id: 'svc-baptism',
    name: 'Baptism Service',
    category: 'Sacrament',
    tags: ['baptism', 'sacrament', 'celebration', 'water'],
    order: [
      { section: 'Welcome', duration: '3 min' },
      { section: 'Opening Song', duration: '5 min' },
      { section: 'Scripture Reading', duration: '3 min' },
      { section: 'Teaching on Baptism', duration: '10 min' },
      { section: 'Baptism Ceremony', duration: '20 min' },
      { section: 'Celebration Song', duration: '5 min' },
      { section: 'Closing Prayer', duration: '2 min' }
    ],
    totalDuration: '48 min'
  },
  {
    id: 'svc-prayer-vigil',
    name: '24-Hour Prayer Vigil',
    category: 'Special',
    tags: ['prayer', 'vigil', 'intercession', 'extended'],
    order: [
      { section: 'Opening Ceremony', duration: '30 min' },
      { section: 'Hour 1-6: Prayer Stations', duration: '6 hours', repeating: true },
      { section: 'Hour 7-12: Guided Prayers', duration: '6 hours', repeating: true },
      { section: 'Hour 13-18: Worship & Prayer', duration: '6 hours', repeating: true },
      { section: 'Hour 19-24: Dawn Prayer', duration: '6 hours', repeating: true },
      { section: 'Closing Ceremony', duration: '30 min' }
    ],
    totalDuration: '24 hours'
  },
  {
    id: 'svc-small-group',
    name: 'Small Group Meeting',
    category: 'Informal',
    tags: ['small-group', 'discussion', 'intimate', 'flexible'],
    order: [
      { section: 'Welcome & Ice Breaker', duration: '5 min' },
      { section: 'Opening Prayer', duration: '2 min' },
      { section: 'Scripture Reading', duration: '3 min' },
      { section: 'Group Discussion', duration: '20 min' },
      { section: 'Personal Testimonies', duration: '10 min' },
      { section: 'Prayer Requests & Prayer', duration: '15 min' },
      { section: 'Closing', duration: '2 min' }
    ],
    totalDuration: '57 min'
  },
  {
    id: 'svc-conference',
    name: 'Multi-Session Conference',
    category: 'Major Event',
    tags: ['conference', 'multi-day', 'keynote', 'breakout'],
    order: [
      { section: 'Opening Keynote', duration: '60 min' },
      { section: 'Breakout Session 1', duration: '45 min' },
      { section: 'Break', duration: '15 min' },
      { section: 'Breakout Session 2', duration: '45 min' },
      { section: 'Lunch', duration: '60 min' },
      { section: 'Keynote 2', duration: '60 min' },
      { section: 'Panel Discussion', duration: '45 min' },
      { section: 'Closing Session', duration: '30 min' }
    ],
    totalDuration: '360 min',
    multiDay: true
  }
];

// ============================================
// MEDIA TEMPLATES (8 templates)
// ============================================
export const mediaTemplates = [
  {
    id: 'media-worship-intro',
    name: 'Worship Intro',
    category: 'Video',
    tags: ['video', 'intro', 'worship', 'opening'],
    type: 'video',
    duration: '0:30',
    resolution: '1920x1080',
    featured: true,
    description: 'Dynamic worship service intro video with music and transitions'
  },
  {
    id: 'media-sermon-background',
    name: 'Sermon Background Loop',
    category: 'Background',
    tags: ['background', 'video', 'loop', 'subtle'],
    type: 'video',
    duration: '5:00',
    resolution: '1920x1080',
    loop: true,
    description: 'Subtle animated background for sermon presentation'
  },
  {
    id: 'media-transition-fade',
    name: 'Fade Transition',
    category: 'Transition',
    tags: ['transition', 'effect', 'fade', 'smooth'],
    type: 'effect',
    duration: '0:05',
    description: 'Smooth fade transition between slides'
  },
  {
    id: 'media-transition-swipe',
    name: 'Swipe Transition',
    category: 'Transition',
    tags: ['transition', 'effect', 'swipe', 'dynamic'],
    type: 'effect',
    duration: '0:08',
    description: 'Dynamic swipe transition with motion'
  },
  {
    id: 'media-background-particle',
    name: 'Particle Background',
    category: 'Background',
    tags: ['background', 'particles', 'modern', 'abstract'],
    type: 'video',
    duration: '10:00',
    resolution: '1920x1080',
    loop: true,
    description: 'Modern particle animation background'
  },
  {
    id: 'media-hymn-lyric-video',
    name: 'Hymn Lyric Video Template',
    category: 'Music',
    tags: ['lyrics', 'hymn', 'music', 'worship'],
    type: 'video',
    duration: 'varies',
    resolution: '1920x1080',
    description: 'Template for creating hymn lyric videos with music'
  },
  {
    id: 'media-countdown-timer',
    name: 'Countdown Timer (5 min)',
    category: 'Timer',
    tags: ['timer', 'countdown', 'event', 'visual'],
    type: 'video',
    duration: '5:00',
    resolution: '1920x1080',
    description: 'Professional 5-minute countdown timer for events'
  },
  {
    id: 'media-lower-third-template',
    name: 'Lower Third Graphics',
    category: 'Graphics',
    tags: ['graphics', 'lower-third', 'title', 'overlay'],
    type: 'graphics',
    resolution: '1920x1080',
    description: 'Animated lower third graphics for speaker names and titles'
  }
];

// ============================================
// EXPORT ALL TEMPLATES
// ============================================
export const allTemplates = {
  slides: slideTemplates,
  presentations: presentationTemplates,
  themes: themeTemplates,
  services: serviceTemplates,
  media: mediaTemplates
};

export const templateCategories = {
  slides: ['Basic', 'Advanced', 'Layout', 'Media', 'Special', 'Religious', 'Content', 'Infographic', 'Navigation'],
  presentations: ['Religious', 'Corporate', 'Educational', 'Professional', 'Events', 'Basic'],
  themes: ['Contemporary', 'Professional', 'Clean', 'Religious', 'Natural', 'Futuristic', 'Artistic'],
  services: ['Weekly', 'Specialized', 'Seasonal', 'Milestone', 'Sacrament', 'Special', 'Informal', 'Major Event'],
  media: ['Video', 'Background', 'Transition', 'Music', 'Timer', 'Graphics']
};
