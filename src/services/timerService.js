import api from './api';

export const getMyTimer = () => api.get('/timer/me');
export const startTimer = () => api.post('/timer/start');
export const pauseTimer = () => api.post('/timer/pause');
export const resetTimer = () => api.post('/timer/reset');