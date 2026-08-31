// client/src/services/analyticsService.js
import api from './api';

export const getAttendanceHeatmap = () => api.get('/analytics/attendance-heatmap');
export const getSlotOccupancy = () => api.get('/analytics/slot-occupancy');
