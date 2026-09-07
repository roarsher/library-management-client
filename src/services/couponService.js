import api from './api';

export const createCoupon = (payload) => api.post('/coupons', payload);
export const listCoupons = () => api.get('/coupons');
export const validateCoupon = (code) => api.get(`/coupons/validate/${code}`);