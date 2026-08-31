import React from 'react';

const StreakWidget = ({ student }) => {
  const current = student?.currentStreak || 0;
  const longest = student?.longestStreak || 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Study Streak</h3>
        <span className="text-2xl">🔥</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-brand">{current}</span>
        <span className="text-sm text-gray-500 mb-1">day{current === 1 ? '' : 's'} in a row</span>
      </div>
      <p className="text-xs text-gray-400 mt-2">Longest streak: {longest} days</p>
      {current === 0 && (
        <p className="text-xs text-gray-400 mt-1">Check in today to start a new streak.</p>
      )}
    </div>
  );
};

export default StreakWidget;
