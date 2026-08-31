import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as studentService from '../../services/studentService';
import * as uploadService from '../../services/uploadService';

const AdmissionForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    dob: '',
    gender: '',
    bloodGroup: '',
    aadhaarNumber: '',
    address: '',
    qualification: '',
    preparingFor: '',
    fatherName: '',
    motherName: '',
    parentPhone: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [idProofFile, setIdProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      let photoUrl = '';
      let idProofUrl = '';

      if (photoFile) {
        setUploadProgress('Uploading photo...');
        photoUrl = await uploadService.uploadFile(photoFile, 'student_photo');
      }
      if (idProofFile) {
        setUploadProgress('Uploading ID proof...');
        idProofUrl = await uploadService.uploadFile(idProofFile, 'id_proof');
      }

      setUploadProgress('Submitting admission form...');
      await studentService.submitAdmissionForm({
        ...form,
        photoUrl,
        idProofUrl,
        parentDetails: {
          fatherName: form.fatherName,
          motherName: form.motherName,
          parentPhone: form.parentPhone,
        },
      });

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit admission form');
    } finally {
      setSubmitting(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-800 mb-1">Admission Form</h1>
        <p className="text-sm text-gray-500 mb-6">
          Complete this once — an admin will verify it before you can book a seat.
        </p>

        <form onSubmit={handleSubmit} className="card space-y-5">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Date of Birth</label>
              <input type="date" name="dob" required value={form.dob} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Gender</label>
              <select name="gender" required value={form.gender} onChange={handleChange} className="input-field">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Blood Group</label>
              <input name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="input-field" placeholder="e.g. O+" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Aadhaar Number</label>
              <input name="aadhaarNumber" required value={form.aadhaarNumber} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Address</label>
            <textarea name="address" required value={form.address} onChange={handleChange} className="input-field" rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Qualification</label>
              <input name="qualification" value={form.qualification} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Preparing For</label>
              <input name="preparingFor" value={form.preparingFor} onChange={handleChange} className="input-field" placeholder="e.g. UPSC" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Father's Name</label>
              <input name="fatherName" value={form.fatherName} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Mother's Name</label>
              <input name="motherName" value={form.motherName} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Parent Phone</label>
              <input name="parentPhone" value={form.parentPhone} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files[0])}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">ID Proof</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setIdProofFile(e.target.files[0])}
                className="input-field"
              />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? uploadProgress || 'Submitting...' : 'Submit Admission Form'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;
