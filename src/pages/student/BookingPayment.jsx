 import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useBooking } from '../../context/BookingContext';
import * as bookingService from '../../services/bookingService';
import * as couponService from '../../services/couponService';
import { calculateBookingPrice } from '../../utils/pricingUtils';
import BookingSteps from '../../components/booking/BookingSteps';
import ManualPaymentUpload from '../../components/payment/ManualPaymentUpload';

const BookingPayment = () => {
  const navigate = useNavigate();
  const { library } = useTenant();

  const {
    seat,
    hall,
    timeSlot,
    durationMonths,
    startDate,
    selectedAddOns,
    addOnQuantities,
    reset,
  } = useBooking();

  const [booking, setBooking] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  useEffect(() => {
    if (!seat || !timeSlot) {
      navigate('/book/seat');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------
  // PRICE CALCULATIONS
  // --------------------------------------------------

  // Seat price before coupon discount
  const seatPriceBeforeDiscount = timeSlot?.monthlyPrice
    ? timeSlot.monthlyPrice * durationMonths
    : 0;

  // Seat price after coupon discount
  const seatPriceTotal = calculateBookingPrice(
    timeSlot?.monthlyPrice || 0,
    durationMonths,
    library,
    couponDiscount
  );

  // Actual discount amount
  const seatDiscountAmount =
    seatPriceBeforeDiscount - seatPriceTotal;

  // Add-ons monthly total with quantities
  const addOnsMonthlyTotal = selectedAddOns.reduce(
    (sum, a) =>
      sum +
      a.pricePerMonth * (addOnQuantities?.[a._id] || 1),
    0
  );

  // Add-ons total for selected duration
  const addOnsTotal =
    addOnsMonthlyTotal * durationMonths;

  // Final booking total
  const grandTotal =
    seatPriceTotal + addOnsTotal;

  // --------------------------------------------------
  // APPLY COUPON
  // --------------------------------------------------

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setCheckingCoupon(true);
    setCouponError('');

    try {
      const { data } =
        await couponService.validateCoupon(
          couponCode.trim()
        );

      setCouponDiscount(data.discountPercent);
    } catch (err) {
      setCouponDiscount(0);
      setCouponError(
        err.response?.data?.message ||
          'Invalid coupon'
      );
    } finally {
      setCheckingCoupon(false);
    }
  };

  // --------------------------------------------------
  // CREATE BOOKING
  // --------------------------------------------------

  const handleCreateBooking = async () => {
    setError('');
    setCreating(true);

    try {
      const { data } =
        await bookingService.createBooking({
          seatId: seat._id,
          timeSlotId: timeSlot._id,
          durationMonths,
          startDate: new Date(
            startDate
          ).toISOString(),

          // Selected add-ons
          addOnIds: selectedAddOns.map(
            (a) => a._id
          ),

          // Add-on quantities
          addOnQuantities,

          // Send coupon only when successfully applied
          couponCode: couponDiscount
            ? couponCode.trim()
            : undefined,
        });

      setBooking(data.booking);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not create booking'
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <BookingSteps current="payment" />

      <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Order Summary
      </h1>

      {/* --------------------------------------------
          ORDER SUMMARY
      --------------------------------------------- */}
      <div className="card mb-6">
        {/* Seat */}
        <div className="flex justify-between text-sm py-1.5">
          <span className="text-gray-600">
            Seat {seat?.seatNumber} · {hall?.name}
          </span>

          <span className="text-gray-800">
            {timeSlot?.label}
          </span>
        </div>

        {/* Add-ons */}
        {selectedAddOns.map((a) => {
          const qty =
            addOnQuantities?.[a._id] || 1;

          return (
            <div
              key={a._id}
              className="flex justify-between text-sm py-1.5"
            >
              <span className="text-gray-600">
                {a.name}
                {a.unit === 'hour'
                  ? ` × ${qty}hr`
                  : ''}
              </span>

              <span className="text-gray-800">
                ₹{a.pricePerMonth * qty}/mo
              </span>
            </div>
          );
        })}

        {/* Duration */}
        <div className="flex justify-between text-sm py-1.5 border-t border-gray-100 mt-2 pt-2">
          <span className="text-gray-600">
            Duration
          </span>

          <span className="text-gray-800">
            {durationMonths} month(s)
          </span>
        </div>

        {/* Coupon */}
        <div className="border-t border-gray-100 mt-3 pt-3">
          <div className="flex gap-2 mb-4">
            <input
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
                setCouponDiscount(0);
                setCouponError('');
              }}
              placeholder="Have a coupon code?"
              className="input-field flex-1 text-sm"
              disabled={
                checkingCoupon || !!booking
              }
            />

            <button
              onClick={handleApplyCoupon}
              disabled={
                checkingCoupon ||
                !couponCode.trim() ||
                !!booking
              }
              className="btn-secondary text-sm px-4"
            >
              {checkingCoupon
                ? 'Checking...'
                : 'Apply'}
            </button>
          </div>

          {couponDiscount > 0 && (
            <p className="text-xs text-green-600 mb-2">
              {couponDiscount}% discount applied
            </p>
          )}

          {couponError && (
            <p className="text-xs text-red-500 mb-2">
              {couponError}
            </p>
          )}
        </div>

        {/* Coupon Discount */}
        {seatDiscountAmount > 0 && (
          <div className="flex justify-between text-sm py-1.5 text-green-600">
            <span>
              Coupon discount ({couponDiscount}%)
            </span>

            <span>
              −₹{seatDiscountAmount}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between font-semibold text-gray-800 border-t border-gray-100 mt-2 pt-2">
          <span>Total</span>

          <span>
            ₹{grandTotal}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 text-center mb-4">
          {error}
        </p>
      )}

      {/* --------------------------------------------
          CREATE BOOKING / PAYMENT
      --------------------------------------------- */}

      {!booking ? (
        <button
          onClick={handleCreateBooking}
          disabled={creating}
          className="btn-primary w-full"
        >
          {creating
            ? 'Requesting seat...'
            : 'Confirm Seat Request'}
        </button>
      ) : (
        <>
          <p className="text-sm text-gray-500 text-center mb-4">
            Seat requested — an admin will confirm
            shortly. Scan the QR below to pay, or pay
            later from your dashboard.
          </p>

          <ManualPaymentUpload
            bookingId={booking._id}
            amount={grandTotal}
            qrImageUrl={library?.qrPaymentImageUrl}
            onSubmitted={() => {
              reset();
              navigate('/');
            }}
          />

          <button
            onClick={() => {
              reset();
              navigate('/');
            }}
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