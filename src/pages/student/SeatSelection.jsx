 import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as hallService from '../../services/hallService';
import * as seatService from '../../services/seatService';
import * as timeSlotService from '../../services/timeSlotService';
import * as bookingService from '../../services/bookingService';
import { useBooking } from '../../context/BookingContext';
import BookingSteps from '../../components/booking/BookingSteps';
import Loader from '../../components/common/Loader';

const STATUS_STYLE = {
  available: 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200 cursor-pointer',
  booked: 'bg-red-100 border-red-300 text-red-400 cursor-not-allowed',
  disabled: 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed',
};

const SeatSelection = () => {
  const navigate = useNavigate();
  const { hall, setHall, seat, setSeat, timeSlot, setTimeSlot, durationMonths, setDurationMonths, startDate, setStartDate } = useBooking();

  const [halls, setHalls] = useState([]);
  const [activeHallId, setActiveHallId] = useState(hall?._id || null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loadingHalls, setLoadingHalls] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [locking, setLocking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    hallService.listHalls().then(({ data }) => {
      setHalls(data.halls);
      if (!activeHallId && data.halls.length) setActiveHallId(data.halls[0]._id);
      setLoadingHalls(false);
    });
    timeSlotService.listTimeSlots().then(({ data }) => {
      setTimeSlots(data.timeSlots);
      if (!timeSlot && data.timeSlots.length) setTimeSlot(data.timeSlots[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeHallId || !timeSlot) return;
    setLoadingSeats(true);
    seatService
      .getSeatGrid(activeHallId, { timeSlotId: timeSlot._id, startDate, durationMonths })
      .then(({ data }) => {
        setSeats(data.seats);
        setLoadingSeats(false);
      });
  }, [activeHallId, timeSlot, startDate, durationMonths]);

  const handleSelectSeat = async (clickedSeat) => {
    if (clickedSeat.status !== 'available') return;
    setError('');
    setLocking(true);
    try {
      if (seat && seat._id !== clickedSeat._id) {
        await bookingService.releaseSeat(seat._id).catch(() => {});
      }
      await bookingService.lockSeat(clickedSeat._id);
      setSeat(clickedSeat);
      setHall(halls.find((h) => h._id === activeHallId));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not hold this seat');
    } finally {
      setLocking(false);
    }
  };

  const handleContinue = () => {
    if (!seat) {
      setError('Select a seat to continue');
      return;
    }
    navigate('/book/add-ons'); // time-slot step is gone — shift already chosen above
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <BookingSteps current="seat" />
      <h1 className="text-xl font-semibold text-gray-800 mb-1 text-center">Choose Your Shift & Seat</h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        Seats are held for the duration of your booking.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <select
          value={timeSlot?._id || ''}
          onChange={(e) => { setTimeSlot(timeSlots.find((t) => t._id === e.target.value)); setSeat(null); }}
          className="input-field"
        >
          {timeSlots.map((t) => (
            <option key={t._id} value={t._id}>{t.label} — ₹{t.monthlyPrice}/mo</option>
          ))}
        </select>
        <select
          value={durationMonths}
          onChange={(e) => { setDurationMonths(Number(e.target.value)); setSeat(null); }}
          className="input-field"
        >
          <option value={1}>1 month</option>
          <option value={2}>2 months</option>
          <option value={3}>3 months</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => { setStartDate(e.target.value); setSeat(null); }}
          className="input-field"
        />
      </div>

      {loadingHalls ? (
        <Loader />
      ) : (
        <>
          <div className="flex gap-2 justify-center mb-6 flex-wrap">
            {halls.map((h) => (
              <button
                key={h._id}
                onClick={() => { setActiveHallId(h._id); setSeat(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  activeHallId === h._id ? 'bg-brand text-white border-brand' : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {h.name}
              </button>
            ))}
          </div>

          {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}

          {loadingSeats ? (
            <Loader label="Loading seats..." />
          ) : (
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-6">
              {seats.map((s) => (
                <button
                  key={s._id}
                  disabled={s.status !== 'available' || locking}
                  onClick={() => handleSelectSeat(s)}
                  className={`aspect-square rounded-lg border text-xs font-medium transition-colors ${
                    seat?._id === s._id ? 'bg-brand border-brand text-white' : STATUS_STYLE[s.status]
                  }`}
                >
                  {s.seatNumber}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-4 justify-center text-xs text-gray-500 mb-8">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-green-100 border border-green-300" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-red-100 border border-red-300" /> Booked (this shift)</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-brand" /> Selected</span>
          </div>

          <div className="flex justify-center">
            <button onClick={handleContinue} disabled={!seat} className="btn-primary px-8">
              Continue{seat ? ` with Seat ${seat.seatNumber}` : ''}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SeatSelection;