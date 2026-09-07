 // client/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TenantProvider, useTenant } from './context/TenantContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Loader from './components/common/Loader';
import GateQRDisplay from './pages/admin/GateQRDisplay';
import ScanAttendance from './pages/student/ScanAttendance';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/common/Footer';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

import CurrentlyOnLeave from './pages/admin/CurrentlyOnLeave';
import PaymentDue from './pages/admin/PaymentDue';

 
import ManageCoupons from './pages/admin/ManageCoupons';

import StudentDashboard from './pages/student/StudentDashboard';
import AdmissionForm from './pages/student/AdmissionForm';
import SeatSelection from './pages/student/SeatSelection';
import AddOns from './pages/student/AddOns';
import BookingPayment from './pages/student/BookingPayment';
import LeaveRequest from './pages/student/LeaveRequest';
import Profile from './pages/student/Profile';

import GalleryList from './pages/public/GalleryList';
import GalleryDetail from './pages/public/GalleryDetail';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBookings from './pages/admin/ManageBookings';
import ManageStudents from './pages/admin/ManageStudents';
import ManageHalls from './pages/admin/ManageHalls';
import ManageLeaves from './pages/admin/ManageLeaves';
import ManagePayments from './pages/admin/ManagePayments';
import ManageGallery from './pages/admin/ManageGallery';
import ManageBroadcast from './pages/admin/ManageBroadcast';
import Analytics from './pages/admin/Analytics';
import AddStudent from './pages/admin/AddStudent';
import LibrarySettings from './pages/admin/LibrarySettings';

import AttendanceTable from './pages/admin/AttendanceTable';
 
import Birthdays from './pages/admin/Birthdays';
 


// with your other admin routes:

// Waits for the tenant (library branding) to resolve before rendering
// anything else — every screen depends on knowing which library this is.
const TenantGate = ({ children }) => {
  const { loading, error } = useTenant();

  if (loading) return <Loader label="Loading library..." />;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-red-500 font-medium mb-2">Could not load this library</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }
  return children;
};

const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
    <Navbar />
    <div className="flex-1">{children}</div>
    <Footer />
  </div>
);

const StudentLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col pt-[7.5rem]">
    <Navbar />
    <div className="flex-1">{children}</div>
    <Footer />
  </div>
);

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
    <Navbar />
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </div>
  </div>
);

// "/" shows the public landing page to guests; logged-in users are sent
// straight to their own dashboard instead.
const RootRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <PublicLayout><Home /></PublicLayout>;
  if (user.role === 'admin' || user.role === 'superadmin') return <Navigate to="/admin" replace />;
  return <Navigate to="/dashboard" replace />;
};

const studentRoute = (element) => (
  <ProtectedRoute allowedRoles={['student']}>
    <StudentLayout>{element}</StudentLayout>
  </ProtectedRoute>
);

const adminRoute = (element) => (
  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
    <AdminLayout>{element}</AdminLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <TenantProvider>
      <TenantGate>
        <AuthProvider>
          <BookingProvider>
            <BrowserRouter>
              <Routes>
                {/* Public */}
                <Route path="/home" element={<PublicLayout><Home /></PublicLayout>} />
                <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
                <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
                <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
                <Route path="/gallery" element={<PublicLayout><GalleryList /></PublicLayout>} />
                <Route path="/gallery/:id" element={<PublicLayout><GalleryDetail /></PublicLayout>} />

                {/* Root — public landing for guests, redirects logged-in users to their dashboard */}
                <Route path="/" element={<RootRoute />} />

                {/* Student */}
                <Route path="/dashboard" element={studentRoute(<StudentDashboard />)} />
                <Route path="/students/admission" element={studentRoute(<AdmissionForm />)} />
                <Route path="/profile" element={studentRoute(<Profile />)} />
                <Route path="/leave" element={studentRoute(<LeaveRequest />)} />
                <Route path="/book/seat" element={studentRoute(<SeatSelection />)} />
                <Route path="/book/add-ons" element={studentRoute(<AddOns />)} />
                <Route path="/book/payment" element={studentRoute(<BookingPayment />)} />

                {/* Admin */}
                <Route path="/admin/birthdays" element={adminRoute(<Birthdays />)} />
                <Route path="/admin/attendance-today" element={adminRoute(<AttendanceTable />)} />
                <Route path="/admin/gate-display" element={adminRoute(<GateQRDisplay />)} />
                <Route path="/scan" element={studentRoute(<ScanAttendance />)} />
                <Route path="/admin" element={adminRoute(<AdminDashboard />)} />
                <Route path="/admin/bookings" element={adminRoute(<ManageBookings />)} />
                <Route path="/admin/students" element={adminRoute(<ManageStudents />)} />
                <Route path="/admin/halls" element={adminRoute(<ManageHalls />)} />
                <Route path="/admin/leaves" element={adminRoute(<ManageLeaves />)} />
                <Route path="/admin/payments" element={adminRoute(<ManagePayments />)} />
                <Route path="/admin/gallery" element={adminRoute(<ManageGallery />)} />
                <Route path="/admin/broadcast" element={adminRoute(<ManageBroadcast />)} />
                <Route path="/admin/analytics" element={adminRoute(<Analytics />)} />
                <Route path="/admin/students/add" element={adminRoute(<AddStudent />)} />
                <Route path="/admin/settings" element={adminRoute(<LibrarySettings />)} />
                <Route path="/admin/on-leave" element={adminRoute(<CurrentlyOnLeave />)} />
                <Route path="/admin/payment-due" element={adminRoute(<PaymentDue />)} />
                <Route path="/admin/coupons" element={adminRoute(<ManageCoupons />)} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </BookingProvider>
        </AuthProvider>
      </TenantGate>
    </TenantProvider>
  );
}

export default App;