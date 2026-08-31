import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as studentService from '../../services/studentService';
import * as uploadService from '../../services/uploadService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';

const Profile = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await studentService.getMyProfile();
      setStudent(data.student);
      setForm({
        address: data.student.address,
        qualification: data.student.qualification,
        preparingFor: data.student.preparingFor,
        bloodGroup: data.student.bloodGroup,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let photoUrl = student.photoUrl;
      if (photoFile) {
        photoUrl = await uploadService.uploadFile(photoFile, 'student_photo');
      }
      await studentService.updateMyProfile({ ...form, photoUrl });
      await load();
      setEditing(false);
      setPhotoFile(null);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (!student) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">My Profile</h1>

      <div className="card">
        <div className="flex items-center gap-4 mb-5">
          {student.photoUrl ? (
            <img src={student.photoUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xl font-semibold">
              {user?.name?.[0]}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="mt-1">
              <StatusBadge status={student.admissionStatus} />
            </div>
          </div>
        </div>

        {!editing ? (
          <div className="space-y-2 text-sm">
            <Row label="Address" value={student.address} />
            <Row label="Qualification" value={student.qualification} />
            <Row label="Preparing For" value={student.preparingFor} />
            <Row label="Blood Group" value={student.bloodGroup} />
            <button onClick={() => setEditing(true)} className="btn-secondary text-sm mt-4">
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
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
              <label className="text-sm text-gray-600 mb-1 block">Address</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="input-field"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Qualification</label>
              <input
                value={form.qualification || ''}
                onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Preparing For</label>
              <input
                value={form.preparingFor || ''}
                onChange={(e) => setForm({ ...form, preparingFor: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Blood Group</label>
              <input
                value={form.bloodGroup || ''}
                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex justify-between py-1">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-800">{value || '—'}</span>
  </div>
);

export default Profile;
