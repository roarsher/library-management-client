 import React, { useEffect, useState } from 'react';
import * as hallService from '../../services/hallService';
import * as seatService from '../../services/seatService';
import Loader from '../../components/common/Loader';

const ManageHalls = () => {
  const [halls, setHalls] = useState([]);
  const [activeHallId, setActiveHallId] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loadingHalls, setLoadingHalls] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(false);

  const [showHallForm, setShowHallForm] = useState(false);
  const [hallForm, setHallForm] = useState({ name: '', hallNumber: '' });

  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [genForm, setGenForm] = useState({ count: 80, startNumber: 1, prefix: '' });
  const [generating, setGenerating] = useState(false);

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seatBookings, setSeatBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const loadHalls = async () => {
    setLoadingHalls(true);
    try {
      const { data } = await hallService.listHalls();
      setHalls(data.halls);
      if (data.halls.length && !activeHallId) {
        setActiveHallId(data.halls[0]._id);
      }
    } finally {
      setLoadingHalls(false);
    }
  };

  const loadSeats = async (hallId) => {
    if (!hallId) return;
    setLoadingSeats(true);
    try {
      const { data } = await seatService.getSeatOccupancy(hallId);
      setSeats(data.seats);
    } finally {
      setLoadingSeats(false);
    }
  };

  useEffect(() => {
    loadHalls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadSeats(activeHallId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHallId]);

  const handleCreateHall = async (e) => {
    e.preventDefault();
    const { data } = await hallService.createHall({
      name: hallForm.name,
      hallNumber: Number(hallForm.hallNumber),
    });
    setHalls((prev) => [...prev, { ...data.hall, totalSeats: 0, bookedSeats: 0 }]);
    setActiveHallId(data.hall._id);
    setShowHallForm(false);
    setHallForm({ name: '', hallNumber: '' });
  };

  const handleGenerateSeats = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await seatService.bulkGenerateSeats({
        hallId: activeHallId,
        count: Number(genForm.count),
        startNumber: Number(genForm.startNumber),
        prefix: genForm.prefix,
      });
      await loadSeats(activeHallId);
      await loadHalls();
      setShowGenerateForm(false);
    } finally {
      setGenerating(false);
    }
  };

  const handleSeatClick = async (seat) => {
    setSelectedSeat(seat);
    setLoadingBookings(true);
    try {
      const { data } = await seatService.getSeatBookings(seat._id);
      setSeatBookings(data.bookings);
    } finally {
      setLoadingBookings(false);
    }
  };

  const activeHall = halls.find((h) => h._id === activeHallId);

  const seatColorClass = (seat) => {
  if (!seat.isActive) return 'bg-gray-100 text-gray-400 border-gray-200';
  if (seat.hasStudentOnLeave) return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
  if (seat.activeBookingsCount === 0) return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
  return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
};

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-gray-800">Halls & Seats</h1>
        <button onClick={() => setShowHallForm((v) => !v)} className="btn-primary text-sm">
          + New Hall
        </button>
      </div>

      {showHallForm && (
        <form onSubmit={handleCreateHall} className="card flex gap-3 items-end mb-5">
          <div className="flex-1">
            <label className="text-xs text-gray-500 block mb-1">Hall Name</label>
            <input
              required
              value={hallForm.name}
              onChange={(e) => setHallForm({ ...hallForm, name: e.target.value })}
              placeholder="e.g. Hall 1"
              className="input-field"
            />
          </div>
          <div className="w-32">
            <label className="text-xs text-gray-500 block mb-1">Hall Number</label>
            <input
              required
              type="number"
              value={hallForm.hallNumber}
              onChange={(e) => setHallForm({ ...hallForm, hallNumber: e.target.value })}
              className="input-field"
            />
          </div>
          <button type="submit" className="btn-primary text-sm">
            Create
          </button>
        </form>
      )}

      {loadingHalls ? (
        <Loader />
      ) : halls.length === 0 ? (
        <p className="text-sm text-gray-400">No halls yet — create one to get started.</p>
      ) : (
        <>
          <div className="flex gap-2 mb-5 border-b border-gray-100 overflow-x-auto">
            {halls.map((h) => (
              <button
                key={h._id}
                onClick={() => setActiveHallId(h._id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
                  activeHallId === h._id ? 'border-brand text-brand' : 'border-transparent text-gray-500'
                }`}
              >
                {h.name} ({h.totalSeats} seats)
              </button>
            ))}
          </div>

          {activeHall && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {seats.filter((s) => s.activeBookingsCount > 0).length} occupied / {seats.length} total seats
              </p>
              <button onClick={() => setShowGenerateForm((v) => !v)} className="btn-secondary text-sm">
                + Bulk Generate Seats
              </button>
            </div>
          )}

          {showGenerateForm && (
            <form onSubmit={handleGenerateSeats} className="card flex gap-3 items-end mb-5 flex-wrap">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Count</label>
                <input
                  type="number"
                  required
                  value={genForm.count}
                  onChange={(e) => setGenForm({ ...genForm, count: e.target.value })}
                  className="input-field w-24"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Start Number</label>
                <input
                  type="number"
                  required
                  value={genForm.startNumber}
                  onChange={(e) => setGenForm({ ...genForm, startNumber: e.target.value })}
                  className="input-field w-28"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Prefix (optional)</label>
                <input
                  value={genForm.prefix}
                  onChange={(e) => setGenForm({ ...genForm, prefix: e.target.value })}
                  placeholder="e.g. H1-"
                  className="input-field w-28"
                />
              </div>
              <button type="submit" disabled={generating} className="btn-primary text-sm">
                {generating ? 'Generating...' : 'Generate'}
              </button>
              <p className="text-xs text-gray-400 w-full">
                e.g. count 80, start 1 → generates seats "1" through "80" in this hall.
              </p>
            </form>
          )}

          {loadingSeats ? (
            <Loader label="Loading seats..." />
          ) : seats.length === 0 ? (
            <p className="text-sm text-gray-400">
              No seats in this hall yet — use "Bulk Generate Seats" above.
            </p>
          ) : (
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {seats.map((seat) => (
                <button
                  key={seat._id}
                  onClick={() => handleSeatClick(seat)}
                  className={`aspect-square rounded-lg border flex flex-col items-center justify-center text-xs font-medium transition-colors ${seatColorClass(seat)}`}
                  title={seat.isActive ? `${seat.activeBookingsCount} active booking(s)` : 'Disabled'}
                >
                  <span>{seat.seatNumber}</span>
                  {seat.activeBookingsCount > 0 && (
                    <span className="text-[10px] opacity-70">{seat.activeBookingsCount} shift{seat.activeBookingsCount > 1 ? 's' : ''}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded border bg-green-50 border-green-200" /> No bookings
            </span>
            <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border bg-purple-50 border-purple-200" /> Student on leave
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded border bg-amber-50 border-amber-200" /> Has active booking(s)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded border bg-gray-100 border-gray-200" /> Disabled
            </span>
          </div>
        </>
      )}

      {/* Seat detail modal */}
      {selectedSeat && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSeat(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Seat {selectedSeat.seatNumber}</h3>
              <button onClick={() => setSelectedSeat(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {loadingBookings ? (
              <Loader label="Loading bookings..." />
            ) : seatBookings.length === 0 ? (
              <p className="text-sm text-gray-400">No active bookings — this seat is fully free.</p>
            ) : (
              <div className="space-y-3">
                {seatBookings.map((b) => (
                  <div key={b._id} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{b.studentId?.userId?.name}</p>
                    <p className="text-xs text-gray-500">{b.timeSlotId?.label}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                      {' · '}
                      <span className="capitalize">{b.status.replace('_', ' ')}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHalls;