// client/src/services/pushService.js
import api from './api';

export const getVapidPublicKey = () => api.get('/push/vapid-public-key');
export const saveSubscription = (subscription) => api.post('/push/subscribe', subscription);
export const removeSubscription = (endpoint) => api.post('/push/unsubscribe', { endpoint });
