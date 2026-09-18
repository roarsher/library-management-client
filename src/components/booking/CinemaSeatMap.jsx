 import React from 'react';

const STATUS_STYLE = {
  available: 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200 cursor-pointer',
  booked: 'bg-red-100 border-red-300 text-red-400 cursor-not-allowed',
  disabled: 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed',
};

const CinemaSeatMap = ({ seats, selectedSeatId, onSelectSeat, disabled }) => {
  // Group seats by tier first, then by row within each tier.
  // Tier is purely a visual/organizational label here — price comes
  // entirely from the selected shift (TimeSlot), same for every seat
  // regardless of tier.
  const tiers = {};
  seats.forEach((s) => {
    const tierKey = s.tier || 'General';
    if (!tiers[tierKey]) tiers[tierKey] = {};
    const rowKey = s.row || '—';
    if (!tiers[tierKey][rowKey]) tiers[tierKey][rowKey] = [];
    tiers[tierKey][rowKey].push(s);
  });

  // Preserve tier order as seats naturally appear (first-seen order),
  // rather than alphabetizing tier names.
  const tierOrder = [];
  seats.forEach((s) => {
    const t = s.tier || 'General';
    if (!tierOrder.includes(t)) tierOrder.push(t);
  });

  return (
    <div className="w-full">
      <div className="space-y-8">
        {tierOrder.map((tierName) => {
          const rows = tiers[tierName];
          const sortedRowKeys = Object.keys(rows).sort();
          Object.values(rows).forEach((r) => r.sort((a, b) => (a.column || 0) - (b.column || 0)));

          return (
            <div key={tierName}>
              <div className="text-center mb-3">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  {tierName}
                </span>
              </div>

              <div className="space-y-1.5 overflow-x-auto">
                {sortedRowKeys.map((rowKey) => {
                  const rowSeats = rows[rowKey];
                  const midpoint = Math.ceil(rowSeats.length / 2);
                  const leftHalf = rowSeats.slice(0, midpoint);
                  const rightHalf = rowSeats.slice(midpoint);

                  return (
                    <div key={rowKey} className="flex items-center justify-center gap-2">
                      <span className="text-xs text-gray-400 w-5 text-right">{rowKey}</span>
                      <div className="flex gap-1.5">
                        {leftHalf.map((s) => (
                          <SeatButton
                            key={s._id}
                            seat={s}
                            selectedSeatId={selectedSeatId}
                            onSelectSeat={onSelectSeat}
                            disabled={disabled}
                          />
                        ))}
                      </div>
                      <div className="w-6" />
                      <div className="flex gap-1.5">
                        {rightHalf.map((s) => (
                          <SeatButton
                            key={s._id}
                            seat={s}
                            selectedSeatId={selectedSeatId}
                            onSelectSeat={onSelectSeat}
                            disabled={disabled}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-8 mb-2 w-3/4 h-2 rounded-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      <p className="text-center text-xs text-gray-400 tracking-widest uppercase">Front of Room</p>

      <div className="flex gap-4 justify-center text-xs text-gray-500 mt-6">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-green-100 border border-green-300" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-red-100 border border-red-300" /> Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-brand" /> Selected
        </span>
      </div>
    </div>
  );
};

const SeatButton = ({ seat, selectedSeatId, onSelectSeat, disabled }) => (
  <button
    type="button"
    disabled={disabled || seat.status !== 'available'}
    onClick={() => onSelectSeat(seat)}
    title={`Seat ${seat.seatNumber}`}
    className={`h-7 w-7 rounded-t-md border text-[10px] font-medium flex items-center justify-center transition-colors ${
      selectedSeatId === seat._id ? 'bg-brand border-brand text-white' : STATUS_STYLE[seat.status]
    }`}
  >
    {seat.column}
  </button>
);

export default CinemaSeatMap;