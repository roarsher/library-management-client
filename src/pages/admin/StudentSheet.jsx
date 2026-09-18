import React, { useEffect, useState } from 'react';
import * as studentService from '../../services/studentService';
import Loader from '../../components/common/Loader';
import StudentDetailModal from '../../components/admin/StudentDetailModal';

const StudentSheet = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await studentService.listStudents({}); // no status filter — everyone
      setStudents(data.students);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = students.filter(
    (s) =>
      s.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.userId?.phone?.includes(search) ||
      s.userId?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-gray-800">Student Sheet</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone, or email..."
          className="input-field w-64"
        />
      </div>

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400">No students found.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Gender</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-700">{s.userId?.name}</td>
                  <td className="px-5 py-3 text-gray-600">{s.userId?.phone}</td>
                  <td className="px-5 py-3 text-gray-500">{s.userId?.email}</td>
                  <td className="px-5 py-3 text-gray-500 capitalize">{s.gender}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setSelected(s)} className="text-xs text-brand hover:underline">
                      View / Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <StudentDetailModal
          student={selected}
          onClose={() => setSelected(null)}
          onSaved={() => {
            setSelected(null);
            load();
          }}
        />
      )}
    </div>
  );
};

export default StudentSheet;