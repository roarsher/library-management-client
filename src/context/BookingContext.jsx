import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [hall, setHall] = useState(null);
  const [seat, setSeat] = useState(null);
  const [timeSlot, setTimeSlot] = useState(null);
  const [durationMonths, setDurationMonths] = useState(1);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [selectedAddOns, setSelectedAddOns] = useState([]);

  // Stores quantity for each add-on
  // Example:
  // {
  //   "addOnId1": 2,
  //   "addOnId2": 1
  // }
  const [addOnQuantities, setAddOnQuantities] = useState({});

  const reset = () => {
    setHall(null);
    setSeat(null);
    setTimeSlot(null);
    setDurationMonths(1);
    setStartDate(
      new Date().toISOString().slice(0, 10)
    );
    setSelectedAddOns([]);

    // Reset add-on quantities
    setAddOnQuantities({});
  };

  const toggleAddOn = (addOn) => {
    setSelectedAddOns((prev) =>
      prev.some((a) => a._id === addOn._id)
        ? prev.filter((a) => a._id !== addOn._id)
        : [...prev, addOn]
    );

    // Hour-based add-ons support quantity.
    // Default quantity is 1.
    if (addOn.unit === 'hour') {
      setAddOnQuantities((prev) => ({
        ...prev,
        [addOn._id]: prev[addOn._id] || 1,
      }));
    }
  };

  // Change quantity of an add-on
  const setAddOnQuantity = (addOnId, quantity) => {
    setAddOnQuantities((prev) => ({
      ...prev,
      [addOnId]: Math.max(1, Number(quantity)),
    }));
  };

  return (
    <BookingContext.Provider
      value={{
        hall,
        setHall,

        seat,
        setSeat,

        timeSlot,
        setTimeSlot,

        durationMonths,
        setDurationMonths,

        startDate,
        setStartDate,

        selectedAddOns,
        toggleAddOn,

        // Add-on quantity state
        addOnQuantities,
        setAddOnQuantity,

        reset,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
 