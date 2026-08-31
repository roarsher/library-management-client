import React from 'react';

const ProfileCard = ({ student, user }) => {
  if (!student) return null;

  return (
    <div className="card flex items-center gap-4">
      {student.photoUrl ? (
        <img
          src={student.photoUrl}
          alt={user?.name}
          className="h-16 w-16 rounded-full object-cover border border-gray-100"
        />
      ) : (
        <div className="h-16 w-16 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xl font-semibold">
          {user?.name?.[0] || '?'}
        </div>
      )}
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-800 truncate">{user?.name}</h3>
        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
        <p className="text-sm text-gray-500">{student.preparingFor || 'Preparing for exams'}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
