import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as addOnService from '../../services/addOnService';
import { useBooking } from '../../context/BookingContext';
import BookingSteps from '../../components/booking/BookingSteps';
import Loader from '../../components/common/Loader';

const AddOns = () => {
  const navigate = useNavigate();
  const { seat, timeSlot, selectedAddOns, toggleAddOn } = useBooking();

  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!seat || !timeSlot) {
      navigate('/book/seat');
      return;
    }
    addOnService.listAddOns().then(({ data }) => {
      setAddOns(data.addOns);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <BookingSteps current="addons" />
      <h1 className="text-xl font-semibold text-gray-800 mb-1 text-center">
        🔥 Add More Study Hours?
      </h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        Optional extras — tap to add, tap again to remove.
      </p>

      {addOns.length === 0 ? (
        <p className="text-sm text-gray-400 text-center mb-8">
          No add-ons available right now.
        </p>
      ) : (
        <div className="space-y-2 mb-8">
          {addOns.map((addOn) => {
            const isSelected = selectedAddOns.some((a) => a._id === addOn._id);
            return (
              <button
                key={addOn._id}
                onClick={() => toggleAddOn(addOn)}
                className={`w-full text-left card flex items-center justify-between border-2 ${
                  isSelected ? 'border-brand' : 'border-transparent'
                }`}
              >
                <div>
                  <p className="font-medium text-gray-800">+ {addOn.name}</p>
                  {addOn.description && (
                    <p className="text-xs text-gray-400 mt-0.5">{addOn.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">
                    ₹{addOn.pricePerMonth}/mo
                  </span>
                  <span
                    className={`h-5 w-5 rounded-full border flex items-center justify-center text-xs ${
                      isSelected ? 'bg-brand border-brand text-white' : 'border-gray-300'
                    }`}
                  >
                    {isSelected ? '✓' : '+'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex justify-center gap-3">
        <button onClick={() => navigate('/book/payment')} className="btn-secondary px-6">
          Skip
        </button>
        <button onClick={() => navigate('/book/payment')} className="btn-primary px-8">
          Continue
        </button>
      </div>
    </div>
  );
};

export default AddOns;
