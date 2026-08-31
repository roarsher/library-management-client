import api from './api';

export const listHalls = () => api.get('/halls');
export const createHall = (payload) => api.post('/halls', payload);
export const updateHall = (id, payload) => api.put(`/halls/${id}`, payload);
export const deleteHall = (id) => api.delete(`/halls/${id}`);
