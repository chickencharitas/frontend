import api from './api';

export const songsApi = {
  // Get all songs
  getAll: async () => {
    const response = await api.get('/songs');
    return response.data;
  },

  // Get song by ID
  getById: async (id) => {
    const response = await api.get(`/songs/${id}`);
    return response.data;
  },

  // Create new song
  create: async (songData) => {
    const response = await api.post('/songs', songData);
    return response.data;
  },

  // Update song
  update: async (id, songData) => {
    const response = await api.put(`/songs/${id}`, songData);
    return response.data;
  },

  // Delete song
  delete: async (id) => {
    const response = await api.delete(`/songs/${id}`);
    return response.data;
  },

  // Search songs
  search: async (query) => {
    const response = await api.get(`/songs/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
};
