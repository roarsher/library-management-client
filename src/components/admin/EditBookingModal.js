 
import React, { useEffect, useState } from 'react';
import * as hallService from '../../services/hallService';
import * as seatService from '../../services/seatService';
import * as timeSlotService from '../../services/timeSlotService';
import * as bookingService from '../../services/bookingService';
import CinemaSeatMap from '../../components/booking/CinemaSeatMap';

const EditBookingModal = ({ booking, onClose, onSaved }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState(
    booking.timeSlotId?._id || ''
  );

  const [assignSeat, setAssignSeat] = useState(
    Boolean(booking.seatId)
  );

  const [halls, setHalls] = useState([]);
  const [activeHallId, setActiveHallId] = useState(
    booking.seatId?.hallId || null
  );

  const [seats, setSeats] = useState([]);
  const [selectedSeatId, setSelectedSeatId] = useState(
    booking.seatId?._id || null
  );

  const [loadingSeats, setLoadingSeats] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    timeSlotService
      .listTimeSlots()
      .then(({ data }) => setTimeSlots(data.timeSlots));

    hallService
      .listHalls()
      .then(({ data }) => {
        setHalls(data.halls);

        if (!activeHallId && data.halls.length) {
          setActiveHallId(data.halls[0]._id);
        }
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!assignSeat || !activeHallId || !selectedTimeSlotId) return;

    setLoadingSeats(true);

    seatService
      .getSeatGrid(activeHallId, {
        timeSlotId: selectedTimeSlotId,
        startDate: booking.startDate,
        durationMonths: booking.durationMonths,
      })
      .then(({ data }) => {
        setSeats(data.seats);
        setLoadingSeats(false);
      })
      .catch(() => {
        setLoadingSeats(false);
        setError('Could not load seats');
      });
  }, [
    assignSeat,
    activeHallId,
    selectedTimeSlotId,
    booking.startDate,
    booking.durationMonths,
  ]);

  const handleSave = async () => {
    setError('');
    setSaving(true);

    try {
      await bookingService.adminEditBooking(booking._id, {
        timeSlotId: selectedTimeSlotId,
        seatId: assignSeat ? selectedSeatId : null,
      });

      onSaved();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not save changes'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">
            Edit {booking.studentId?.userId?.name}'s Booking
          </h3>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-500 mb-3">
            {error}
          </p>
        )}

        <label className="text-xs text-gray-500 block mb-1">
          Shift
        </label>

        <select
          value={selectedTimeSlotId}
          onChange={(e) =>
            setSelectedTimeSlotId(e.target.value)
          }
          className="input-field w-full mb-4"
        >
          {timeSlots.map((t) => (
            <option key={t._id} value={t._id}>
              {t.label} — ₹{t.monthlyPrice}/mo
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 mb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={assignSeat}
            onChange={(e) =>
              setAssignSeat(e.target.checked)
            }
            className="h-4 w-4 accent-brand rounded"
          />

          <span className="text-sm text-gray-700">
            Assign a fixed seat
          </span>
        </label>

        {assignSeat && (
          <>
            <div className="flex gap-2 mb-3 flex-wrap">
              {halls.map((h) => (
                <button
                  key={h._id}
                  type="button"
                  onClick={() => {
                    setActiveHallId(h._id);
                    setSelectedSeatId(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    activeHallId === h._id
                      ? 'bg-brand text-white border-brand'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  {h.name}
                </button>
              ))}
            </div>

            {loadingSeats ? (
              <p className="text-sm text-gray-400 mb-4">
                Loading seats...
              </p>
            ) : (
              <div className="max-h-72 overflow-y-auto">
                <CinemaSeatMap
                  seats={seats}
                  selectedSeatId={selectedSeatId}
                  onSelectSeat={(s) =>
                    setSelectedSeatId(s._id)
                  }
                />
              </div>
            )}
          </>
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="btn-secondary text-sm px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;
 