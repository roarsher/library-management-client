import api from './api'


export const createRazorpayOrder = (bookingId) =>
  api.post('/payments/razorpay/create-order', { bookingId });
export const verifyRazorpayPayment = (payload) => api.post('/payments/razorpay/verify', payload);
export const submitManualPayment = (payload) => api.post('/payments/manual', payload);
export const getMyPaymentHistory = () => api.get('/payments/me');
 

 
export const listAllPayments = (params) => api.get('/payments', { params });
export const listPendingManualPayments = () => api.get('/payments/pending-manual');
export const verifyManualPayment = (id, payload) => api.put(`/payments/${id}/verify-manual`, payload);
export const listPaymentsDue = () => api.get('/payments/due');
export const recordPartialPayment = (payload) => api.post('/payments/record-partial', payload);
export const clearDue = (id, amountCleared) => api.put(`/payments/${id}/clear-due`, { amountCleared });
export const getMyDues = () => api.get('/payments/my-due');