import React from 'react';

const RemainingDaysWidget = ({ booking }) => {
  if (!booking) return null;

  const endDate = new Date(booking.endDate);
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
  const isExpiringSoon = daysLeft <= 7;

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 mb-2">Membership</h3>
      <div className="flex items-end gap-2">
        <span className={`text-3xl font-bold ${isExpiringSoon ? 'text-red-500' : 'text-brand'}`}>
          {daysLeft}
        </span>
        <span className="text-sm text-gray-500 mb-1">days remaining</span>
      </div>
      <p className="text-xs text-gray-400 mt-1">Expires on {endDate.toDateString()}</p>
      {isExpiringSoon && (
        <button className="btn-primary text-xs mt-3 w-full">Renew Now</button>
      )}
    </div>
  );
};

export default RemainingDaysWidget;
