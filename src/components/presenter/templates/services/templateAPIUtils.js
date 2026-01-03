/**
 * Template API Utilities
 * Advanced utilities for backend synchronization and authentication
 */

class TemplateAPIUtils {
  constructor() {
    this.requestQueue = [];
    this.isSyncing = false;
    this.syncInterval = null;
    this.retryConfig = {
      maxRetries: 3,
      initialDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2
    };
  }

  /**
   * Authentication Helpers
   */
  
  // Get auth token from storage
  getAuthToken() {
    return localStorage.getItem('authToken') || null;
  }

  // Set auth token in storage
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  // Check if token is expired
  isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  // Refresh token if needed
  async ensureValidToken() {
    const token = this.getAuthToken();
    if (token && !this.isTokenExpired(token)) {
      return token;
    }

    try {
      const response = await fetch(`${this.getAPIBase()}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Token refresh failed');
      const data = await response.json();
      this.setAuthToken(data.token);
      return data.token;
    } catch (err) {
      console.warn('Token refresh failed:', err);
      return null;
    }
  }

  /**
   * Request/Response Interceptors
   */

  // Add authorization header
  addAuthHeader(headers = {}) {
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Transform response
  transformResponse(response) {
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: null,
      error: null,
      headers: {
        'content-type': response.headers.get('content-type'),
        'x-ratelimit-remaining': response.headers.get('x-ratelimit-remaining'),
        'x-ratelimit-reset': response.headers.get('x-ratelimit-reset')
      }
    };
  }

  // Handle response errors
  async handleResponseError(response, requestData) {
    const errorResponse = this.transformResponse(response);
    
    try {
      errorResponse.error = await response.json();
    } catch {
      errorResponse.error = { message: response.statusText };
    }

    // Log error details
    console.error('API Error:', {
      status: response.status,
      url: requestData?.url,
      error: errorResponse.error
    });

    return errorResponse;
  }

  /**
   * Retry Logic with Exponential Backoff
   */

  // Calculate retry delay
  getRetryDelay(attemptNumber) {
    const delay = Math.min(
      this.retryConfig.initialDelay * Math.pow(this.retryConfig.backoffMultiplier, attemptNumber - 1),
      this.retryConfig.maxDelay
    );
    // Add jitter
    return delay + Math.random() * 1000;
  }

  // Fetch with retry
  async fetchWithRetry(url, options = {}, attemptNumber = 1) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        if (response.status === 401 && attemptNumber === 1) {
          // Try to refresh token
          const token = await this.ensureValidToken();
          if (token) {
            options.headers = this.addAuthHeader(options.headers);
            return this.fetchWithRetry(url, options, 2);
          }
        }

        if (response.status >= 500 && attemptNumber <= this.retryConfig.maxRetries) {
          const delay = this.getRetryDelay(attemptNumber);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.fetchWithRetry(url, options, attemptNumber + 1);
        }

        return this.handleResponseError(response, { url, ...options });
      }

      const transformedResponse = this.transformResponse(response);
      
      try {
        transformedResponse.data = await response.json();
      } catch {
        transformedResponse.data = null;
      }

      return transformedResponse;
    } catch (err) {
      if (attemptNumber <= this.retryConfig.maxRetries) {
        const delay = this.getRetryDelay(attemptNumber);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchWithRetry(url, options, attemptNumber + 1);
      }

      console.error('Fetch failed after retries:', err);
      return {
        ok: false,
        status: 0,
        statusText: 'Network Error',
        data: null,
        error: { message: err.message }
      };
    }
  }

  /**
   * Offline-First Sync Queue
   */

  // Add request to sync queue
  queueRequest(requestData) {
    this.requestQueue.push({
      ...requestData,
      timestamp: Date.now(),
      retryCount: 0
    });

    // Persist queue to localStorage
    this.persistSyncQueue();
  }

  // Get sync queue from storage
  getSyncQueue() {
    try {
      return JSON.parse(localStorage.getItem('templateSyncQueue') || '[]');
    } catch {
      return [];
    }
  }

  // Persist sync queue to storage
  persistSyncQueue() {
    localStorage.setItem('templateSyncQueue', JSON.stringify(this.requestQueue));
  }

  // Load sync queue from storage
  loadSyncQueue() {
    this.requestQueue = this.getSyncQueue();
  }

  /**
   * Sync Operations
   */

  // Start background sync
  startBackgroundSync(interval = 30000) {
    if (this.syncInterval) return;

    this.syncInterval = setInterval(() => {
      this.syncQueuedRequests();
    }, interval);

    console.log('Background sync started');
  }

  // Stop background sync
  stopBackgroundSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('Background sync stopped');
    }
  }

  // Process sync queue
  async syncQueuedRequests() {
    if (this.isSyncing || this.requestQueue.length === 0) return;

    this.isSyncing = true;

    try {
      const processed = [];

      for (const request of this.requestQueue) {
        try {
          const response = await this.fetchWithRetry(request.url, {
            method: request.method,
            headers: this.addAuthHeader(request.headers),
            body: request.body ? JSON.stringify(request.body) : undefined
          });

          if (response.ok) {
            // Dispatch sync event
            window.dispatchEvent(new CustomEvent('template:synced', {
              detail: { request, response: response.data }
            }));
            processed.push(request);
          }
        } catch (err) {
          console.error('Sync request failed:', err);
          request.retryCount++;

          // Remove if max retries exceeded
          if (request.retryCount > this.retryConfig.maxRetries) {
            processed.push(request);
          }
        }
      }

      // Remove processed requests
      this.requestQueue = this.requestQueue.filter(r => !processed.includes(r));
      this.persistSyncQueue();

      // Dispatch completion event
      window.dispatchEvent(new CustomEvent('template:syncComplete', {
        detail: { processedCount: processed.length }
      }));
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Conflict Resolution
   */

  // Detect conflicts between local and backend versions
  detectConflict(localTemplate, backendTemplate) {
    if (!localTemplate || !backendTemplate) return null;

    const localTime = new Date(localTemplate.updatedAt).getTime();
    const backendTime = new Date(backendTemplate.updatedAt).getTime();

    if (Math.abs(localTime - backendTime) < 1000) {
      // Timestamps within 1 second = no conflict
      return null;
    }

    return {
      type: 'version_conflict',
      local: localTemplate,
      backend: backendTemplate,
      localTime,
      backendTime,
      newerVersion: localTime > backendTime ? 'local' : 'backend'
    };
  }

  // Resolve conflict with merge strategy
  resolveConflict(conflict, strategy = 'newer') {
    switch (strategy) {
      case 'newer':
        return conflict.newerVersion === 'local' ? conflict.local : conflict.backend;
      
      case 'local':
        return conflict.local;
      
      case 'backend':
        return conflict.backend;
      
      case 'merge':
        return this.mergeTemplates(conflict.local, conflict.backend);
      
      default:
        return conflict.local;
    }
  }

  // Merge two template versions
  mergeTemplates(local, backend) {
    return {
      ...backend,
      name: local.name || backend.name,
      description: local.description || backend.description,
      tags: [...new Set([...(local.tags || []), ...(backend.tags || [])])],
      mergedAt: new Date().toISOString(),
      mergeStrategy: 'auto'
    };
  }

  /**
   * Utility Methods
   */

  // Get API base URL
  getAPIBase() {
    return process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  }

  // Format API URL
  formatURL(endpoint) {
    return `${this.getAPIBase()}${endpoint}`;
  }

  // Get sync status
  getSyncStatus() {
    return {
      isSyncing: this.isSyncing,
      queueLength: this.requestQueue.length,
      syncInterval: this.syncInterval ? 'active' : 'inactive'
    };
  }

  // Clear sync queue
  clearSyncQueue() {
    this.requestQueue = [];
    localStorage.removeItem('templateSyncQueue');
  }

  // Listen to sync events
  onSyncComplete(callback) {
    window.addEventListener('template:syncComplete', callback);
    return () => window.removeEventListener('template:syncComplete', callback);
  }

  onSynced(callback) {
    window.addEventListener('template:synced', callback);
    return () => window.removeEventListener('template:synced', callback);
  }
}

// Export singleton instance
export const templateAPIUtils = new TemplateAPIUtils();

export default TemplateAPIUtils;
