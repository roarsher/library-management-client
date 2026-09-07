import api from './api';

export const listAddOns = () => api.get('/add-ons');
export const createAddOn = (payload) => api.post('/add-ons', payload);
export const updateAddOn = (id, payload) => api.put(`/add-ons/${id}`, payload);
export const deleteAddOn = (id) => api.delete(`/add-ons/${id}`);
export const getAddOnById = (id) => api.get(`/add-ons/${id}`);