import api from './api';

export const listSeats = (hallId) => api.get('/seats', { params: { hallId } });
export const createSeat = (payload) => api.post('/seats', payload);
export const bulkGenerateSeats = (payload) => api.post('/seats/bulk-generate', payload);
export const toggleFavoriteSeat = (seatId) => api.put(`/seats/${seatId}/favorite`);
 export const getSeatOccupancy = (hallId) => api.get('/seats/occupancy', { params: { hallId } });
export const getSeatBookings = (seatId) => api.get(`/seats/${seatId}/bookings`);

export const getSeatGrid = (hallId, { timeSlotId, startDate, durationMonths } = {}) =>
  api.get('/seats', { params: { hallId, timeSlotId, startDate, durationMonths } });