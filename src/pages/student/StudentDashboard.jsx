 import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as studentService from '../../services/studentService';
import * as bookingService from '../../services/bookingService';
import * as attendanceService from '../../services/attendanceService';
import * as paymentService from '../../services/paymentService';
import useRefetchOnFocus from '../../hooks/useRefetchOnFocus';
import ProfileCard from '../../components/dashboard/student/ProfileCard';
import StreakWidget from '../../components/dashboard/student/StreakWidget';
import MySeatWidget from '../../components/dashboard/student/MySeatWidget';
import RemainingDaysWidget from '../../components/dashboard/student/RemainingDaysWidget';
import AttendanceWidget from '../../components/dashboard/student/AttendanceWidget';
import PaymentHistoryWidget from '../../components/dashboard/student/PaymentHistoryWidget';
import ReferralCard from '../../components/dashboard/student/ReferralCard';
import StudyTimer from '../../components/timer/StudyTimer';
import TodoList from '../../components/todo/TodoList';
import Loader from '../../components/common/Loader';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async (isBackgroundRefresh = false) => {
    if (!isBackgroundRefresh) setLoading(true);
    try {
      const [profileRes, bookingsRes, attendanceRes, paymentsRes] = await Promise.all([
        studentService.getMyProfile(),
        bookingService.listBookings({ status: 'active' }),
        attendanceService.getMyAttendance(),
        paymentService.getMyPaymentHistory(),
      ]);

      setStudent(profileRes.data.student);
      setActiveBooking(bookingsRes.data.bookings?.[0] || null);
      setAttendance(attendanceRes.data.records || []);
      setPayments(paymentsRes.data.payments || []);
    } catch (err) {
      if (!isBackgroundRefresh) setError('Could not load your dashboard. Please refresh.');
    } finally {
      if (!isBackgroundRefresh) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Silently refetch (no loading spinner) when the tab regains focus,
  // or every 30s as a fallback — picks up a gate scan done on another
  // device or tab without the user needing to manually refresh.
  useRefetchOnFocus(() => loadDashboard(true), { pollMs: 30000 });

  if (loading) return <Loader label="Loading your dashboard..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-gray-800">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <button
          onClick={() => navigate('/scan')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <QrCode size={16} />
          Scan Gate QR
        </button>
      </div>

      {error && (
        <div className="mb-5 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {student?.admissionStatus !== 'verified' && (
        <div className="mb-5 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
          Your admission is <strong>{student?.admissionStatus}</strong>. Booking a seat will be
          available once an admin verifies your admission.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <ProfileCard student={student} user={user} />
        <StreakWidget student={student} />
        <RemainingDaysWidget booking={activeBooking} />

        <MySeatWidget booking={activeBooking} />
        <StudyTimer />
        <AttendanceWidget records={attendance} />

        <div className="md:col-span-2 lg:col-span-2">
          <TodoList />
        </div>
        <PaymentHistoryWidget payments={payments} />
        <ReferralCard />
      </div>
    </div>
  );
};

export default StudentDashboard;