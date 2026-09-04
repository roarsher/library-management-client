import React, { useEffect, useState } from 'react';
import * as paymentService from '../../services/paymentService';
import { useTenant } from '../../context/TenantContext';
import Loader from '../../components/common/Loader';
import StudentCard from '../../components/cards/StudentCard';

const PaymentDue = () => {
  const { library } = useTenant();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentService.listPaymentsDue().then(({ data }) => {
      setPayments(data.payments);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Payment Due</h1>
      <p className="text-sm text-gray-500 mb-6">{payments.length} pending payment(s)</p>

      {payments.length === 0 ? (
        <p className="text-sm text-gray-400">No outstanding payments.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {payments.map((p) => {
            const firstName = p.studentId?.userId?.name?.split(' ')[0] || '';
            const message = `Hi ${firstName}, this is a reminder that your payment of ₹${p.amount} at ${library?.name || 'the library'} is still pending.`;

            return (
              <StudentCard
                key={p._id}
                name={p.studentId?.userId?.name}
                detail={`₹${p.amount} · ${p.status} · ${p.method}`}
                image={p.studentId?.photoUrl}
                phone={p.studentId?.userId?.phone}
                whatsappMessage={message}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentDue;