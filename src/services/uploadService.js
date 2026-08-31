import api from './api';

// type: 'student_photo' | 'id_proof' | 'payment_screenshot' | 'gallery' | 'library_logo' | 'qr_code'
export const uploadFile = async (file, type) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post(`/uploads?type=${type}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.url; // ready to save straight into photoUrl / screenshotUrl / etc.
};

export const uploadMultipleFiles = async (files, type) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append('files', file));

  const { data } = await api.post(`/uploads/multiple?type=${type}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.urls;
};
