import api from './api';

export const lockSeat = (seatId) => api.post('/bookings/lock-seat', { seatId });
export const releaseSeat = (seatId) => api.post('/bookings/release-seat', { seatId });
export const createBooking = (payload) => api.post('/bookings', payload);
export const listBookings = (params) => api.get('/bookings', { params });
export const approveBooking = (id) => api.put(`/bookings/${id}/approve`);
export const rejectBooking = (id, payload) => api.put(`/bookings/${id}/reject`, payload);
