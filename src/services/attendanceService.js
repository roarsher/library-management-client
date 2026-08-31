 import api from './api';

export const checkIn = () => api.post('/attendance/check-in');
export const checkOut = () => api.post('/attendance/check-out');
export const getMyAttendance = () => api.get('/attendance/me');
export const getTodayAttendance = (date) => api.get('/attendance/today', { params: date ? { date } : {} });
export const getGateToken = (purpose) => api.get('/attendance/gate-token', { params: { purpose } });
export const scanAttendance = (payload) => api.post('/attendance/scan', payload);

 