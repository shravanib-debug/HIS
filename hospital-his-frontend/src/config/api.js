// API Configuration - Uses environment variable or falls back to localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1';
export const API_ROOT_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

// Helper to construct full API URLs
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

// Helper to construct file/image URLs (for uploads, reports, etc.)
export const getFileUrl = (path) => {
    if (!path) return '';
    // If path already has http, return as is
    if (path.startsWith('http')) return path;
    // Otherwise prepend the root URL
    return `${API_ROOT_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};
