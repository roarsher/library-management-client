import React, { useEffect, useState } from 'react';
import * as paymentService from '../../../services/paymentService';

const DueWidget = () => {
  const [due, setDue] = useState(null);

  useEffect(() => {
    paymentService.getMyDues().then(({ data }) => setDue(data));
  }, []);

  if (!due || due.totalDue === 0) return null; // nothing owed — don't clutter the dashboard

  return (
    <div className="card border-2 border-red-200 bg-red-50">
      <h3 className="font-semibold text-red-700 mb-1">Payment Due</h3>
      <p className="text-2xl font-bold text-red-700">₹{due.totalDue}</p>
      <p className="text-xs text-red-500 mt-1">Please clear your dues at the library counter.</p>
    </div>
  );
};

export default DueWidget;