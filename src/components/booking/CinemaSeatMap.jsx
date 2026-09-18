 import React from 'react';

const STATUS_STYLE = {
  available: 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200 cursor-pointer',
  booked: 'bg-red-100 border-red-300 text-red-400 cursor-not-allowed',
  disabled: 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed',
};

// A gap between two seats in the same row is encoded as a skipped column
// number (e.g. columns 5 then 7, skipping 6) rather than assumed from a
// 50/50 split — this correctly handles rows with uneven group sizes and
// rows with no gap at all.
const CinemaSeatMap = ({ seats, selectedSeatId, onSelectSeat, disabled }) => {
  const rows = {};
  seats.forEach((s) => {
    const rowKey = s.row || '—';
    if (!rows[rowKey]) rows[rowKey] = [];
    rows[rowKey].push(s);
  });
  Object.values(rows).forEach((r) => r.sort((a, b) => (a.column || 0) - (b.column || 0)));
  const sortedRowKeys = Object.keys(rows).sort();

  return (
    <div className="w-full">
      <div className="space-y-3 overflow-x-auto">
        {sortedRowKeys.map((rowKey) => {
          const rowSeats = rows[rowKey];

          return (
            <div key={rowKey} className="flex items-center justify-center gap-1">
              <span className="text-xs text-gray-400 w-5 text-right mr-1">{rowKey}</span>
              {rowSeats.map((s, i) => {
                const prev = rowSeats[i - 1];
                const hasGapBefore = prev && s.column - prev.column > 1;
                return (
                  <React.Fragment key={s._id}>
                    {hasGapBefore && <div className="w-6" />}
                    <SeatButton seat={s} selectedSeatId={selectedSeatId} onSelectSeat={onSelectSeat} disabled={disabled} />
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-8 mb-2 w-3/4 h-2 rounded-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      <p className="text-center text-xs text-gray-400 tracking-widest uppercase">Front of Room</p>

      <div className="flex gap-4 justify-center text-xs text-gray-500 mt-6">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-green-100 border border-green-300" /> Available</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-red-100 border border-red-300" /> Booked</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-brand" /> Selected</span>
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
    className={`h-7 w-9 rounded-t-md border text-[9px] font-medium flex items-center justify-center transition-colors ${
      selectedSeatId === seat._id ? 'bg-brand border-brand text-white' : STATUS_STYLE[seat.status]
    }`}
  >
    {seat.seatNumber}
  </button>
);

export default CinemaSeatMap;