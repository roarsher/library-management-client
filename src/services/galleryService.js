import api from './api';

export const listGalleries = (libraryId) => api.get('/gallery', { params: { libraryId } });
export const getGalleryDetail = (id, libraryId) =>
  api.get(`/gallery/${id}`, { params: { libraryId } });
export const createGallery = (payload) => api.post('/gallery', payload);
export const addGalleryImages = (id, payload) => api.post(`/gallery/${id}/images`, payload);
export const deleteGallery = (id) => api.delete(`/gallery/${id}`);
