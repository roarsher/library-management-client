import React from 'react';

const MySeatWidget = ({ booking }) => {
  if (!booking) {
    return (
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-2">My Seat</h3>
        <p className="text-sm text-gray-400">No active booking yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 mb-3">My Seat</h3>
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-lg bg-brand/10 text-brand flex items-center justify-center font-bold text-lg">
          {booking.seatId?.seatNumber}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">
            {booking.seatId?.hallId?.name || `Hall ${booking.seatId?.hallId?.hallNumber}`}
          </p>
          <p className="text-xs text-gray-500">
            {booking.timeSlotId?.startTime} - {booking.timeSlotId?.endTime}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MySeatWidget;
