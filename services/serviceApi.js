import api from './api';

export const serviceApi = {
  // Get current service items
  getService: async () => {
    const response = await api.get('/service');
    return response.data;
  },

  // Add item to service
  addToService: async (item) => {
    const response = await api.post('/service/items', item);
    return response.data;
  },

  // Remove item from service
  removeFromService: async (itemId) => {
    const response = await api.delete(`/service/items/${itemId}`);
    return response.data;
  },

  // Update service item order
  updateOrder: async (items) => {
    const response = await api.put('/service/order', { items });
    return response.data;
  },

  // Clear entire service
  clearService: async () => {
    const response = await api.delete('/service');
    return response.data;
  }
};
