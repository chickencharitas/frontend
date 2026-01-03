/**
 * Template System API Service
 * Backend integration layer for all template operations
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// ============================================
// ERROR HANDLING
// ============================================
class TemplateAPIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'TemplateAPIError';
    this.status = status;
    this.data = data;
  }
}

const handleAPIError = (response) => {
  throw new TemplateAPIError(
    response.statusText || 'API Error',
    response.status,
    response.data
  );
};

// ============================================
// API ENDPOINTS
// ============================================
export const templateAPI = {
  
  // ========== TEMPLATE CRUD ==========
  templates: {
    /**
     * GET /templates
     * Fetch all available templates
     */
    getAll: async (filters = {}) => {
      try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_BASE_URL}/templates?${params}`);
        if (!response.ok) throw new Error('Failed to fetch templates');
        return await response.json();
      } catch (error) {
        console.error('Error fetching templates:', error);
        throw error;
      }
    },
    
    /**
     * GET /templates/:id
     * Fetch single template by ID
     */
    getById: async (id) => {
      try {
        const response = await fetch(`${API_BASE_URL}/templates/${id}`);
        if (!response.ok) throw new Error('Template not found');
        return await response.json();
      } catch (error) {
        console.error(`Error fetching template ${id}:`, error);
        throw error;
      }
    },
    
    /**
     * POST /templates
     * Create new template
     */
    create: async (templateData) => {
      try {
        const response = await fetch(`${API_BASE_URL}/templates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(templateData)
        });
        if (!response.ok) throw new Error('Failed to create template');
        return await response.json();
      } catch (error) {
        console.error('Error creating template:', error);
        throw error;
      }
    },
    
    /**
     * PUT /templates/:id
     * Update existing template
     */
    update: async (id, templateData) => {
      try {
        const response = await fetch(`${API_BASE_URL}/templates/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(templateData)
        });
        if (!response.ok) throw new Error('Failed to update template');
        return await response.json();
      } catch (error) {
        console.error(`Error updating template ${id}:`, error);
        throw error;
      }
    },
    
    /**
     * DELETE /templates/:id
     * Delete template
     */
    delete: async (id) => {
      try {
        const response = await fetch(`${API_BASE_URL}/templates/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete template');
        return await response.json();
      } catch (error) {
        console.error(`Error deleting template ${id}:`, error);
        throw error;
      }
    }
  },
  
  // ========== CUSTOM TEMPLATES ==========
  customTemplates: {
    /**
     * GET /custom-templates
     * Fetch user's custom templates
     */
    getMy: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/custom-templates`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch custom templates');
        return await response.json();
      } catch (error) {
        console.error('Error fetching custom templates:', error);
        throw error;
      }
    },
    
    /**
     * POST /custom-templates
     * Save new custom template
     */
    save: async (templateData) => {
      try {
        const response = await fetch(`${API_BASE_URL}/custom-templates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(templateData)
        });
        if (!response.ok) throw new Error('Failed to save custom template');
        return await response.json();
      } catch (error) {
        console.error('Error saving custom template:', error);
        throw error;
      }
    },
    
    /**
     * DELETE /custom-templates/:id
     * Delete custom template
     */
    delete: async (id) => {
      try {
        const response = await fetch(`${API_BASE_URL}/custom-templates/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to delete custom template');
        return await response.json();
      } catch (error) {
        console.error(`Error deleting custom template ${id}:`, error);
        throw error;
      }
    }
  },
  
  // ========== FAVORITES ==========
  favorites: {
    /**
     * GET /favorites
     * Fetch user's favorite templates
     */
    getAll: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/favorites`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch favorites');
        return await response.json();
      } catch (error) {
        console.error('Error fetching favorites:', error);
        throw error;
      }
    },
    
    /**
     * POST /favorites/:templateId
     * Add template to favorites
     */
    add: async (templateId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/favorites/${templateId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to add favorite');
        return await response.json();
      } catch (error) {
        console.error('Error adding favorite:', error);
        throw error;
      }
    },
    
    /**
     * DELETE /favorites/:templateId
     * Remove template from favorites
     */
    remove: async (templateId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/favorites/${templateId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to remove favorite');
        return await response.json();
      } catch (error) {
        console.error('Error removing favorite:', error);
        throw error;
      }
    }
  },
  
  // ========== TEAM LIBRARY ==========
  teamLibrary: {
    /**
     * GET /teams/:teamId/templates
     * Fetch team's template library
     */
    getTeamTemplates: async (teamId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/teams/${teamId}/templates`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch team templates');
        return await response.json();
      } catch (error) {
        console.error('Error fetching team templates:', error);
        throw error;
      }
    },
    
    /**
     * POST /teams/:teamId/templates
     * Add template to team library
     */
    addToTeam: async (teamId, templateId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/teams/${teamId}/templates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ templateId })
        });
        if (!response.ok) throw new Error('Failed to add template to team');
        return await response.json();
      } catch (error) {
        console.error('Error adding template to team:', error);
        throw error;
      }
    },
    
    /**
     * DELETE /teams/:teamId/templates/:templateId
     * Remove template from team library
     */
    removeFromTeam: async (teamId, templateId) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/teams/${teamId}/templates/${templateId}`,
          {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }
        );
        if (!response.ok) throw new Error('Failed to remove template from team');
        return await response.json();
      } catch (error) {
        console.error('Error removing template from team:', error);
        throw error;
      }
    }
  },
  
  // ========== TEMPLATE SHARING ==========
  sharing: {
    /**
     * POST /templates/:id/share
     * Share template with team/users
     */
    share: async (templateId, shareData) => {
      try {
        const response = await fetch(`${API_BASE_URL}/templates/${templateId}/share`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(shareData)
        });
        if (!response.ok) throw new Error('Failed to share template');
        return await response.json();
      } catch (error) {
        console.error('Error sharing template:', error);
        throw error;
      }
    },
    
    /**
     * GET /templates/:id/shares
     * Get sharing info for template
     */
    getShares: async (templateId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/templates/${templateId}/shares`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch shares');
        return await response.json();
      } catch (error) {
        console.error('Error fetching shares:', error);
        throw error;
      }
    },
    
    /**
     * DELETE /templates/:id/shares/:shareId
     * Revoke sharing
     */
    revoke: async (templateId, shareId) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/templates/${templateId}/shares/${shareId}`,
          {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }
        );
        if (!response.ok) throw new Error('Failed to revoke sharing');
        return await response.json();
      } catch (error) {
        console.error('Error revoking sharing:', error);
        throw error;
      }
    }
  },
  
  // ========== ANALYTICS ==========
  analytics: {
    /**
     * GET /analytics/templates
     * Get template usage analytics
     */
    getUsage: async (filters = {}) => {
      try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_BASE_URL}/analytics/templates?${params}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch analytics');
        return await response.json();
      } catch (error) {
        console.error('Error fetching analytics:', error);
        throw error;
      }
    },
    
    /**
     * POST /analytics/templates/:id/track
     * Track template usage
     */
    track: async (templateId, action) => {
      try {
        const response = await fetch(`${API_BASE_URL}/analytics/templates/${templateId}/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ action, timestamp: new Date().toISOString() })
        });
        if (!response.ok) throw new Error('Failed to track usage');
        return await response.json();
      } catch (error) {
        console.error('Error tracking usage:', error);
        throw error;
      }
    }
  }
};

// ============================================
// SYNC HELPERS
// ============================================
export const syncLocalToBackend = async () => {
  try {
    const localTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
    const localFavorites = {
      slides: JSON.parse(localStorage.getItem('favoriteSlideTemplates') || '[]'),
      presentations: JSON.parse(localStorage.getItem('favoritePresentationTemplates') || '[]'),
      themes: JSON.parse(localStorage.getItem('favoriteThemeTemplates') || '[]'),
      services: JSON.parse(localStorage.getItem('favoriteServiceTemplates') || '[]'),
      media: JSON.parse(localStorage.getItem('favoriteMediaTemplates') || '[]')
    };

    // Sync custom templates
    for (const template of localTemplates) {
      if (!template.synced) {
        await templateAPI.customTemplates.save(template);
        template.synced = true;
      }
    }

    // Sync favorites
    // (Implementation depends on backend structure)

    return { success: true, templatesCount: localTemplates.length };
  } catch (error) {
    console.error('Error syncing to backend:', error);
    throw error;
  }
};

export const syncBackendToLocal = async () => {
  try {
    const templates = await templateAPI.customTemplates.getMy();
    const favorites = await templateAPI.favorites.getAll();

    // Save to localStorage
    localStorage.setItem('savedTemplates', JSON.stringify(templates));
    localStorage.setItem('syncedFavorites', JSON.stringify(favorites));

    return { success: true, templatesCount: templates.length };
  } catch (error) {
    console.error('Error syncing from backend:', error);
    throw error;
  }
};

export default templateAPI;
