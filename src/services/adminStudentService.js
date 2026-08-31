import api from './api';

export const adminCreateStudent = (payload) => api.post('/students/admin-create', payload);