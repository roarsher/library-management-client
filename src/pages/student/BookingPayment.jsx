 import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useBooking } from '../../context/BookingContext';
import * as bookingService from '../../services/bookingService';
import { calculateBookingPrice } from '../../utils/pricingUtils';
import BookingSteps from '../../components/booking/BookingSteps';
import ManualPaymentUpload from '../../components/payment/ManualPaymentUpload';

const BookingPayment = () => {
  const navigate = useNavigate();
  const { library } = useTenant();
  const { seat, hall, timeSlot, durationMonths, startDate, selectedAddOns, reset } = useBooking();

  const [booking, setBooking] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!seat || !timeSlot) {
      navigate('/book/seat');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seatPriceTotal = calculateBookingPrice(timeSlot?.monthlyPrice || 0, durationMonths, library);
  const addOnsMonthlyTotal = selectedAddOns.reduce((sum, a) => sum + a.pricePerMonth, 0);
  const addOnsTotal = addOnsMonthlyTotal * durationMonths;
  const grandTotal = seatPriceTotal + addOnsTotal;

  const handleCreateBooking = async () => {
    setError('');
    setCreating(true);
    try {
      const { data } = await bookingService.createBooking({
        seatId: seat._id,
        timeSlotId: timeSlot._id,
        durationMonths,
        startDate: new Date(startDate).toISOString(),
        addOnIds: selectedAddOns.map((a) => a._id),
      });
      setBooking(data.booking);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create booking');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <BookingSteps current="payment" />
      <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">Order Summary</h1>

      <div className="card mb-6">
        <div className="flex justify-between text-sm py-1.5">
          <span className="text-gray-600">Seat {seat?.seatNumber} · {hall?.name}</span>
          <span className="text-gray-800">{timeSlot?.label}</span>
        </div>
        {selectedAddOns.map((a) => (
          <div key={a._id} className="flex justify-between text-sm py-1.5">
            <span className="text-gray-600">{a.name}</span>
            <span className="text-gray-800">₹{a.pricePerMonth}/mo</span>
          </div>
        ))}
        <div className="flex justify-between text-sm py-1.5 border-t border-gray-100 mt-2 pt-2">
          <span className="text-gray-600">Duration</span>
          <span className="text-gray-800">{durationMonths} month(s)</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-800 border-t border-gray-100 mt-2 pt-2">
          <span>Total</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}

      {!booking ? (
        <button onClick={handleCreateBooking} disabled={creating} className="btn-primary w-full">
          {creating ? 'Requesting seat...' : 'Confirm Seat Request'}
        </button>
      ) : (
        <>
          <p className="text-sm text-gray-500 text-center mb-4">
            Seat requested — an admin will confirm shortly. Scan the QR below to pay, or pay later from your dashboard.
          </p>
          <ManualPaymentUpload
            bookingId={booking._id}
            amount={grandTotal}
            qrImageUrl={library?.qrPaymentImageUrl}
            onSubmitted={() => { reset(); navigate('/'); }}
          />
          <button
            onClick={() => { reset(); navigate('/'); }}
            className="text-xs text-gray-400 w-full text-center mt-3"
          >
            Pay later from my dashboard
          </button>
        </>
      )}
    </div>
  );
};

export default BookingPayment;