import api from './api';

export const getMyLibrary = () => api.get('/libraries/me');
export const updateMyLibrary = (payload) => api.put('/libraries/me', payload);