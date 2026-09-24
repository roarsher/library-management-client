 
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
      const { data } = await studentService.listStudents({});
      setStudents(data.students);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();

    return (
      s.userId?.name?.toLowerCase().includes(q) ||
      s.userId?.phone?.includes(search) ||
      s.userId?.email?.toLowerCase().includes(q) ||
      s.parentDetails?.parentPhone?.includes(search) ||
      s.parentDetails?.fatherName?.toLowerCase().includes(q) ||
      s.address?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-gray-800">
          Student Sheet
        </h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone, parent, address..."
          className="input-field w-72"
        />
      </div>

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400">
          No students found.
        </p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[1400px]">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">

                {/* NEW */}
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Aadhaar</th>

                <th className="px-4 py-3">Reg. No.</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">DOB</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Blood Group</th>
                <th className="px-4 py-3">Father's Name</th>
                <th className="px-4 py-3">Mother's Name</th>
                <th className="px-4 py-3">Parent Phone</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Qualification</th>
                <th className="px-4 py-3">Preparing For</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s._id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50"
                >

                  {/* Photo */}
                  <td className="px-4 py-3">
                    {s.photoUrl ? (
                      <img
                        src={s.photoUrl}
                        alt=""
                        className="h-9 w-9 rounded-full object-cover cursor-pointer border border-gray-200"
                        onClick={() =>
                          window.open(s.photoUrl, '_blank')
                        }
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                        {s.userId?.name?.[0]}
                      </div>
                    )}
                  </td>

                  {/* Aadhaar / ID Proof */}
                  <td className="px-4 py-3">
                    {s.idProofUrl ? (
                      <img
                        src={s.idProofUrl}
                        alt=""
                        className="h-9 w-9 rounded object-cover cursor-pointer border border-gray-200"
                        onClick={() =>
                          window.open(s.idProofUrl, '_blank')
                        }
                      />
                    ) : (
                      <span className="text-xs text-gray-300">
                        —
                      </span>
                    )}
                  </td>
                  {/* Registration Number */}
<td className="px-4 py-3 text-gray-500 whitespace-nowrap">
  {s.registrationNumber || '—'}
</td>

{/* Due */}
<td className="px-4 py-3 whitespace-nowrap">
  {s.totalDue > 0 ? (
    <span className="text-red-600 font-medium">
      ₹{s.totalDue}
    </span>
  ) : (
    <span className="text-green-600 text-xs">
      Clear
    </span>
  )}
</td>

                  {/* Existing columns */}
                  <td className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">
                    {s.userId?.name}
                  </td>

                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {s.userId?.phone || '—'}
                  </td>

                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {s.userId?.email || '—'}
                  </td>

                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {s.dob
                      ? new Date(s.dob).toLocaleDateString()
                      : '—'}
                  </td>

                  <td className="px-4 py-3 text-gray-500 capitalize">
                    {s.gender || '—'}
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {s.bloodGroup || '—'}
                  </td>

                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {s.parentDetails?.fatherName || '—'}
                  </td>

                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {s.parentDetails?.motherName || '—'}
                  </td>

                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {s.parentDetails?.parentPhone || '—'}
                  </td>

                  <td
                    className="px-4 py-3 text-gray-500 max-w-[200px] truncate"
                    title={s.address}
                  >
                    {s.address || '—'}
                  </td>

                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {s.qualification || '—'}
                  </td>

                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {s.preparingFor || '—'}
                  </td>

                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelected(s)}
                      className="text-xs text-brand hover:underline"
                    >
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
 