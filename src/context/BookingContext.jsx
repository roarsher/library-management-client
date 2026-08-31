 import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [hall, setHall] = useState(null);
  const [seat, setSeat] = useState(null);
  const [timeSlot, setTimeSlot] = useState(null);
  const [durationMonths, setDurationMonths] = useState(1);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  const reset = () => {
    setHall(null);
    setSeat(null);
    setTimeSlot(null);
    setDurationMonths(1);
    setStartDate(new Date().toISOString().slice(0, 10));
    setSelectedAddOns([]);
  };

  const toggleAddOn = (addOn) => {
    setSelectedAddOns((prev) =>
      prev.some((a) => a._id === addOn._id) ? prev.filter((a) => a._id !== addOn._id) : [...prev, addOn]
    );
  };

  return (
    <BookingContext.Provider
      value={{
        hall, setHall,
        seat, setSeat,
        timeSlot, setTimeSlot,
        durationMonths, setDurationMonths,
        startDate, setStartDate,
        selectedAddOns, toggleAddOn,
        reset,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);