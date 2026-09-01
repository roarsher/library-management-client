import api from './api';

export const submitAdmissionForm = (payload) => api.post('/students/admission', payload);
export const getMyProfile = () => api.get('/students/me');
export const updateMyProfile = (payload) => api.put('/students/me', payload);
export const listStudents = (params) => api.get('/students', { params });
export const verifyAdmission = (id, payload) => api.put(`/students/${id}/verify`, payload);
export const updateStudent = (id, payload) => api.put(`/students/${id}`, payload);
export const deleteStudent = (id) => api.delete(`/students/${id}`);
export const listBirthdaysThisWeek = () => api.get('/students/birthdays-this-week');