import React, { useEffect, useState } from 'react';
import * as leaveService from '../../services/leaveService';
import { useTenant } from '../../context/TenantContext';
import Loader from '../../components/common/Loader';
import StudentCard from '../../components/cards/StudentCard';

const daysRemaining = (toDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(toDate);
  end.setHours(0, 0, 0, 0);
  return Math.round((end - today) / (1000 * 60 * 60 * 24));
};

const CurrentlyOnLeave = () => {
  const { library } = useTenant();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaveService.listCurrentlyOnLeave().then(({ data }) => {
      setLeaves(data.leaves);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Students on Leave</h1>
      <p className="text-sm text-gray-500 mb-6">{leaves.length} student(s) currently away</p>

      {leaves.length === 0 ? (
        <p className="text-sm text-gray-400">No students currently on leave.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {leaves.map((l) => {
            const remaining = daysRemaining(l.toDate);
            const firstName = l.studentId?.userId?.name?.split(' ')[0] || '';
            const message = `Hi ${firstName}, hope you're doing well — just checking in during your leave from ${library?.name || 'the library'}.`;

            return (
              <StudentCard
                key={l._id}
                name={l.studentId?.userId?.name}
                detail={`${new Date(l.fromDate).toDateString()} → ${new Date(l.toDate).toDateString()} · ${
                  remaining <= 0 ? 'Returning today' : `${remaining} day(s) left`
                }`}
                image={l.studentId?.photoUrl}
                phone={l.studentId?.userId?.phone}
                whatsappMessage={message}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CurrentlyOnLeave;