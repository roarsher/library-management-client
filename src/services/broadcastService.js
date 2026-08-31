import api from './api';

export const sendWhatsAppBroadcast = (payload) => api.post('/broadcast/whatsapp', payload);
export const listBroadcasts = () => api.get('/broadcast');
