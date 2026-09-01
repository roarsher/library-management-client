import React, { useEffect, useState } from 'react';
import * as studentService from '../../services/studentService';
import Loader from '../../components/common/Loader';
import StudentCard from '../../components/cards/StudentCard';

const daysUntilBirthday = (dob) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const birth = new Date(dob);
  const thisYear = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  let diff = Math.round((thisYear - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) diff += 365;
  return diff;
};

const formatBirthday = (dob) => {
  const birth = new Date(dob);
  return birth.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
};

const Birthdays = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.listBirthdaysThisWeek().then(({ data }) => {
      setStudents(data.students);
      setLoading(false);
    });
  }, []);

  const sorted = [...students].sort((a, b) => daysUntilBirthday(a.dob) - daysUntilBirthday(b.dob));

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Birthdays This Week</h1>
      <p className="text-sm text-gray-500 mb-6">{students.length} student(s) celebrating soon</p>

      {sorted.length === 0 ? (
        <p className="text-sm text-gray-400">No birthdays in the next 7 days.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sorted.map((s) => {
            const days = daysUntilBirthday(s.dob);
            const greeting = `Happy Birthday, ${s.userId?.name?.split(' ')[0]}! 🎉 Wishing you a wonderful year ahead.`;

            return (
              <div key={s._id} className="relative">
                <StudentCard
                  name={s.userId?.name}
                  detail={`${formatBirthday(s.dob)} · ${days === 0 ? 'Today!' : `in ${days} day${days > 1 ? 's' : ''}`}`}
                  image={s.photoUrl}
                  phone={s.userId?.phone}
                  whatsappMessage={greeting}
                />
                {days === 0 && (
                  <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-600 font-medium">
                    🎂 Today
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Birthdays;