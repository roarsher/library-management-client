 import React, { useEffect, useState } from 'react';
import * as paymentService from '../../services/paymentService';
import { useTenant } from '../../context/TenantContext';
import Loader from '../../components/common/Loader';
import StudentCard from '../../components/cards/StudentCard';

const PaymentDue = () => {
  const { library } = useTenant();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearingId, setClearingId] = useState(null);
  const [clearAmount, setClearAmount] = useState({});

  const load = async () => {
    const { data } = await paymentService.listPaymentsDue();
    setPayments(data.payments);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleClear = async (paymentId) => {
    const amount = clearAmount[paymentId];
    if (!amount) return;
    setClearingId(paymentId);
    try {
      await paymentService.clearDue(paymentId, Number(amount));
      await load();
    } finally {
      setClearingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Payment Due</h1>
      <p className="text-sm text-gray-500 mb-6">{payments.length} student(s) with outstanding balance</p>

      {payments.length === 0 ? (
        <p className="text-sm text-gray-400">No outstanding dues.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {payments.map((p) => {
            const firstName = p.studentId?.userId?.name?.split(' ')[0] || '';
            const message = `Hi ${firstName}, this is a reminder that ₹${p.dueAmount} is still due at ${library?.name || 'the library'}.`;

            return (
              <div key={p._id} className="space-y-2">
                <StudentCard
                  name={p.studentId?.userId?.name}
                  detail={`Paid ₹${p.amount} · Due ₹${p.dueAmount}`}
                  image={p.studentId?.photoUrl}
                  phone={p.studentId?.userId?.phone}
                  whatsappMessage={message}
                />
                <div className="flex gap-2 pl-1">
                  <input
                    type="number"
                    placeholder="Amount collected"
                    value={clearAmount[p._id] || ''}
                    onChange={(e) => setClearAmount((prev) => ({ ...prev, [p._id]: e.target.value }))}
                    className="input-field text-sm flex-1"
                  />
                  <button
                    onClick={() => handleClear(p._id)}
                    disabled={clearingId === p._id}
                    className="btn-primary text-xs px-3 disabled:opacity-50"
                  >
                    {clearingId === p._id ? 'Saving...' : 'Record Payment'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentDue;