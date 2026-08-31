 import React from 'react';

const STEPS = [
  { key: 'seat', label: 'Seat & Shift' },
  { key: 'addons', label: 'Add-ons' },
  { key: 'payment', label: 'Payment' },
];

const BookingSteps = ({ current }) => {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.key}>
          <div className="flex items-center gap-2">
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                i <= currentIndex ? 'bg-brand text-white' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-sm hidden sm:block ${i <= currentIndex ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && <div className="w-6 sm:w-10 h-px bg-gray-200" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BookingSteps;