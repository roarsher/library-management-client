// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import * as adminService from '../../services/adminService';
// import Loader from '../../components/common/Loader';

// const StatCard = ({ label, value, sub, highlight, linkTo }) => {
//   const content = (
//     <div className="card">
//       <p className="text-sm text-gray-500 mb-1">{label}</p>
//       <p className={`text-2xl font-bold ${highlight ? 'text-red-500' : 'text-gray-800'}`}>
//         {value}
//       </p>
//       {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
//     </div>
//   );
//   return linkTo ? <Link to={linkTo}>{content}</Link> : content;
// };

// const AdminDashboard = () => {
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     adminService
//       .getDashboardSummary()
//       .then(({ data }) => setSummary(data))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <Loader label="Loading dashboard..." />;
//   if (!summary) return null;

//   const occupancyRate = summary.totalSeats
//     ? Math.round((summary.bookedSeats / summary.totalSeats) * 100)
//     : 0;

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       <h1 className="text-xl font-semibold text-gray-800 mb-5">Admin Dashboard</h1>

//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <StatCard
//           label="Seat Occupancy"
//           value={`${occupancyRate}%`}
//           sub={`${summary.bookedSeats} of ${summary.totalSeats} booked`}
//         />
//         <StatCard label="Empty Seats" value={summary.emptySeats} linkTo="/admin/halls" />
//         <StatCard
//           label="Today's Attendance"
//           value={summary.todayAttendanceCount}
//           sub="check-ins today"
//         />
//         <StatCard
//           label="Month Revenue"
//           value={`₹${summary.monthToDateRevenue.toLocaleString()}`}
//           sub="verified payments, month-to-date"
//         />
//         <StatCard
//           label="Pending Bookings"
//           value={summary.pendingBookingRequests}
//           highlight={summary.pendingBookingRequests > 0}
//           linkTo="/admin/bookings"
//         />
//         <StatCard
//           label="Pending Leaves"
//           value={summary.pendingLeaveRequests}
//           highlight={summary.pendingLeaveRequests > 0}
//           linkTo="/admin/leaves"
//         />
//         <StatCard label="Students on Leave" value={summary.studentsOnLeave} />
//         <StatCard
//           label="Expiring This Week"
//           value={summary.expiringMemberships}
//           highlight={summary.expiringMemberships > 0}
//         />
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;








// client/src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';

const StatCard = ({ label, value, sub, highlight, linkTo }) => {
  const content = (
    <div className="card hover:border-brand/40 hover:shadow-md transition-all cursor-pointer h-full">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-red-500' : 'text-gray-800'}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
  // Every card links somewhere — Link wraps unconditionally now, no
  // dead-end cards on the dashboard.
  return <Link to={linkTo}>{content}</Link>;
};

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboardSummary()
      .then(({ data }) => setSummary(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;
  if (!summary) return null;

  const occupancyRate = summary.totalSeats
    ? Math.round((summary.bookedSeats / summary.totalSeats) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-5">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Seat Occupancy"
          value={`${occupancyRate}%`}
          sub={`${summary.bookedSeats} of ${summary.totalSeats} booked`}
          linkTo="/admin/halls"
        />
        <StatCard label="Empty Seats" value={summary.emptySeats} linkTo="/admin/halls" />
        <StatCard
          label="Today's Attendance"
          value={summary.todayAttendanceCount}
          sub="check-ins today"
          linkTo="/admin/attendance-today"
        />
        <StatCard
          label="Month Revenue"
          value={`₹${summary.monthToDateRevenue.toLocaleString()}`}
          sub="verified payments, month-to-date"
          linkTo="/admin/payments?tab=all&status=verified"
        />
        <StatCard
          label="Pending Bookings"
          value={summary.pendingBookingRequests}
          highlight={summary.pendingBookingRequests > 0}
          linkTo="/admin/bookings?tab=pending_approval"
        />
        <StatCard
          label="Pending Leaves"
          value={summary.pendingLeaveRequests}
          highlight={summary.pendingLeaveRequests > 0}
          linkTo="/admin/leaves"
        />
         <StatCard label="Students on Leave" value={summary.studentsOnLeave} linkTo="/admin/on-leave" />
 
        <StatCard
          label="Expiring This Week"
          value={summary.expiringMemberships}
          highlight={summary.expiringMemberships > 0}
          linkTo="/admin/bookings?tab=expiring"
        />
        <StatCard
  label="Payment Due"
  value={summary.paymentsDueCount}
  highlight={summary.paymentsDueCount > 0}
  linkTo="/admin/payment-due"
/>
<StatCard
  label="Birthdays This Week"
  value={summary.birthdaysThisWeek}
  highlight={summary.birthdaysThisWeek > 0}
  linkTo="/admin/birthdays"
/>
      </div>
    </div>
  );
};

export default AdminDashboard;