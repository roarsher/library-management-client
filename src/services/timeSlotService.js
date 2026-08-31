import api from './api';

export const listTimeSlots = () => api.get('/time-slots');
export const createTimeSlot = (payload) => api.post('/time-slots', payload);
export const seedDefaultTimeSlots = () => api.post('/time-slots/seed-defaults');