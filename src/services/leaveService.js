import api from './api';

export const submitLeaveRequest = (payload) => api.post('/leaves', payload);
export const listLeaveRequests = (params) => api.get('/leaves', { params });
export const approveLeaveRequest = (id) => api.put(`/leaves/${id}/approve`);
export const rejectLeaveRequest = (id) => api.put(`/leaves/${id}/reject`);
export const listCurrentlyOnLeave = () => api.get('/leaves/on-leave');