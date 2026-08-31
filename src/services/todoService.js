 import api from './api';

export const getMyTodos = () => api.get('/todos/me');
export const createTodo = (payload) => api.post('/todos', payload);
export const updateTodo = (id, payload) => api.put(`/todos/${id}`, payload);
export const deleteTodo = (id) => api.delete(`/todos/${id}`);
export const reorderTodos = (orders) => api.put('/todos/reorder', { orders });
export const bulkUpdateTodos = (ids, action) => api.post('/todos/bulk', { ids, action });