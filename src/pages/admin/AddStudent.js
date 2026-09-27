 import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as hallService from '../../services/hallService';
import * as seatService from '../../services/seatService';
import * as timeSlotService from '../../services/timeSlotService';
import * as adminStudentService from '../../services/adminStudentService';
import * as uploadService from '../../services/uploadService';
import CinemaSeatMap from '../../components/booking/CinemaSeatMap';
import Loader from '../../components/common/Loader';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  dob: '',
  gender: 'male',
  bloodGroup: '',
  aadhaarNumber: '',
  address: '',
  qualification: '',
  preparingFor: '',
  fatherName: '',
  motherName: '',
  parentPhone: '',
  photoUrl: '',
  idProofUrl: '',
  durationMonths: 1,
  startDate: new Date().toISOString().slice(0, 10),
  paymentMethod: 'cash',
  amountPaid: '',
};

const AddStudent = () => {
  const navigate = useNavigate();

  const [halls, setHalls] = useState([]);
  const [activeHallId, setActiveHallId] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);

  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState('');

  const [loadingHalls, setLoadingHalls] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(false);

  const [form, setForm] = useState(emptyForm);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const [assignSeatNow, setAssignSeatNow] = useState(true);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingIdProof, setUploadingIdProof] = useState(false);

  useEffect(() => {
    hallService
      .listHalls()
      .then(({ data }) => {
        setHalls(data.halls);
        if (data.halls.length) setActiveHallId(data.halls[0]._id);
        setLoadingHalls(false);
      })
      .catch(() => {
        setLoadingHalls(false);
        setError('Could not load halls');
      });

    timeSlotService
      .listTimeSlots()
      .then(({ data }) => {
        setTimeSlots(data.timeSlots);
        if (data.timeSlots.length) setSelectedTimeSlotId(data.timeSlots[0]._id);
      })
      .catch(() => setError('Could not load time slots'));
  }, []);

  // Seats only fetch when actively assigning a seat — but shift/duration
  // themselves are always required regardless of this toggle.
  useEffect(() => {
    if (!assignSeatNow) {
      setSelectedSeat(null);
      return;
    }
    if (!activeHallId || !selectedTimeSlotId) return;

    setLoadingSeats(true);
    setSelectedSeat(null);

    seatService
      .getSeatGrid(activeHallId, {
        timeSlotId: selectedTimeSlotId,
        startDate: form.startDate,
        durationMonths: form.durationMonths,
      })
      .then(({ data }) => {
        setSeats(data.seats);
        setLoadingSeats(false);
      })
      .catch(() => {
        setLoadingSeats(false);
        setError('Could not load seats');
      });
  }, [activeHallId, selectedTimeSlotId, form.startDate, form.durationMonths, assignSeatNow]);

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploadingPhoto(true);
    try {
      const url = await uploadService.uploadFile(file, 'student_photo');
      updateField('photoUrl', url);
    } catch (err) {
      console.error('Photo upload failed:', err);
      setError('Could not upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleIdProofUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploadingIdProof(true);
    try {
      const url = await uploadService.uploadFile(file, 'id_proof');
      updateField('idProofUrl', url);
    } catch (err) {
      console.error('ID proof upload failed:', err);
      setError('Could not upload Aadhaar card');
    } finally {
      setUploadingIdProof(false);
    }
  };

  const selectedTimeSlot = timeSlots.find((t) => t._id === selectedTimeSlotId);
  const computedTotal = selectedTimeSlot ? selectedTimeSlot.monthlyPrice * form.durationMonths : 0;
  const paidAmount = form.amountPaid !== '' ? Number(form.amountPaid) : computedTotal;
  const dueAmount = Math.max(computedTotal - paidAmount, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedTimeSlotId) {
      return setError('Please select a shift');
    }
    if (assignSeatNow && !selectedSeat) {
      return setError('Please select a seat, or uncheck "Assign a seat now"');
    }
    if (!form.name || !form.email || !form.password || !form.phone) {
      return setError('Name, email, phone, and password are required');
    }

    setSubmitting(true);
    try {
      const { data } = await adminStudentService.adminCreateStudent({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        dob: form.dob,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        aadhaarNumber: form.aadhaarNumber,
        address: form.address,
        qualification: form.qualification,
        preparingFor: form.preparingFor,
        photoUrl: form.photoUrl,
        idProofUrl: form.idProofUrl,
        fatherName: form.fatherName,
        motherName: form.motherName,
        parentPhone: form.parentPhone,
        timeSlotId: selectedTimeSlotId,
        durationMonths: Number(form.durationMonths),
        startDate: form.startDate,
        paymentMethod: form.paymentMethod,
        amountPaid: form.amountPaid ? Number(form.amountPaid) : undefined,
        ...(assignSeatNow && { seatId: selectedSeat._id }),
      });

      setSuccess(data);
    } catch (err) {
      console.error('Add student failed:', err);
      setError(err.response?.data?.message || 'Could not add student');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 text-center">
        <div className="p-6 rounded-2xl bg-green-50 border border-green-200">
          <p className="text-green-700 font-medium mb-1">Student added successfully</p>
          <p className="text-sm text-green-600 mb-4">
            {success.user.name}
            {success.booking?.seatId?.seatNumber ? ` · Seat ${success.booking.seatId.seatNumber}` : ' · No fixed seat'}
            {success.booking?.timeSlotId?.label ? ` · ${success.booking.timeSlotId.label}` : ''}
            {success.payment?.dueAmount > 0 && ` · ₹${success.payment.dueAmount} due`}
          </p>
          {success.receiptUrl && (
            <a href={success.receiptUrl} target="_blank" rel="noreferrer" className="text-sm text-brand underline">
              View Receipt PDF
            </a>
          )}
        </div>
        <div className="flex gap-2 justify-center mt-5">
          <button
            onClick={() => {
              setSuccess(null);
              setForm({ ...emptyForm, startDate: new Date().toISOString().slice(0, 10) });
              setSelectedSeat(null);
              setAssignSeatNow(true);
            }}
            className="btn-secondary text-sm px-4"
          >
            Add Another
          </button>
          <button onClick={() => navigate('/admin/students')} className="btn-primary text-sm px-4">
            Go to Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Add Student</h1>
      <p className="text-sm text-gray-500 mb-6">
        Creates their login, profile, shift, and optionally a fixed seat — generates a fee receipt either way.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account & Profile */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3">Account & Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Full name" className="input-field" />
            <input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="Phone" className="input-field" />
            <input value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="Email" type="email" className="input-field" />
            <input value={form.password} onChange={(e) => updateField('password', e.target.value)} placeholder="Set a login password" className="input-field" />
            <input value={form.dob} onChange={(e) => updateField('dob', e.target.value)} type="date" className="input-field" />
            <select value={form.gender} onChange={(e) => updateField('gender', e.target.value)} className="input-field">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input value={form.bloodGroup} onChange={(e) => updateField('bloodGroup', e.target.value)} placeholder="Blood group" className="input-field" />
            <input value={form.aadhaarNumber} onChange={(e) => updateField('aadhaarNumber', e.target.value)} placeholder="Aadhaar number" className="input-field" />
            <input value={form.qualification} onChange={(e) => updateField('qualification', e.target.value)} placeholder="Qualification" className="input-field" />
            <input value={form.preparingFor} onChange={(e) => updateField('preparingFor', e.target.value)} placeholder="Preparing for (e.g. UPSC)" className="input-field" />
            <input value={form.address} onChange={(e) => updateField('address', e.target.value)} placeholder="Address" className="input-field sm:col-span-2" />
          </div>
        </div>

        {/* Parent Details */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3">Parent Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input value={form.fatherName} onChange={(e) => updateField('fatherName', e.target.value)} placeholder="Father's name" className="input-field" />
            <input value={form.motherName} onChange={(e) => updateField('motherName', e.target.value)} placeholder="Mother's name" className="input-field" />
            <input value={form.parentPhone} onChange={(e) => updateField('parentPhone', e.target.value)} placeholder="Parent phone" className="input-field" />
          </div>
        </div>

        {/* Photo & ID Proof */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3">Photo & ID Proof</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-2">Student Photo</label>
              <div className="flex items-center gap-3">
                {form.photoUrl ? (
                  <img src={form.photoUrl} alt="Student" className="h-16 w-16 rounded-lg object-cover border border-gray-200" />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">No photo</div>
                )}
                <label className="btn-secondary text-xs px-3 py-2 cursor-pointer">
                  {uploadingPhoto ? 'Uploading...' : 'Upload'}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploadingPhoto} className="hidden" />
                </label>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-2">Aadhaar Card</label>
              <div className="flex items-center gap-3">
                {form.idProofUrl ? (
                  <img src={form.idProofUrl} alt="ID Proof" className="h-16 w-16 rounded-lg object-cover border border-gray-200" />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">No file</div>
                )}
                <label className="btn-secondary text-xs px-3 py-2 cursor-pointer">
                  {uploadingIdProof ? 'Uploading...' : 'Upload'}
                  <input type="file" accept="image/*" onChange={handleIdProofUpload} disabled={uploadingIdProof} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Shift & Duration — ALWAYS shown, seat or no seat */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3">Shift & Duration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select value={selectedTimeSlotId} onChange={(e) => setSelectedTimeSlotId(e.target.value)} className="input-field">
              {timeSlots.map((t) => (
                <option key={t._id} value={t._id}>{t.label} — ₹{t.monthlyPrice}/mo</option>
              ))}
            </select>
            <select value={form.durationMonths} onChange={(e) => updateField('durationMonths', e.target.value)} className="input-field">
              <option value={1}>1 month</option>
              <option value={2}>2 months</option>
              <option value={3}>3 months</option>
            </select>
            <input value={form.startDate} onChange={(e) => updateField('startDate', e.target.value)} type="date" className="input-field" />
          </div>
        </div>

        {/* Assign seat toggle */}
        <div className="card">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={assignSeatNow}
              onChange={(e) => {
                setAssignSeatNow(e.target.checked);
                if (!e.target.checked) setSelectedSeat(null);
              }}
              className="h-4 w-4 accent-brand rounded"
            />
            <span className="text-sm font-medium text-gray-700">Assign a fixed seat now</span>
          </label>
          <p className="text-xs text-gray-400 mt-1 ml-7">
            Shift and payment above always apply. Uncheck this if the student doesn't have a fixed seat yet —
            a seat can be assigned later from the Student Sheet.
          </p>
        </div>

        {/* Select Seat — only when assigning a seat */}
        {assignSeatNow && (
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">Select Seat</h3>
            {loadingHalls ? (
              <Loader />
            ) : (
              <>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {halls.map((h) => (
                    <button
                      key={h._id}
                      type="button"
                      onClick={() => setActiveHallId(h._id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                        activeHallId === h._id ? 'bg-brand text-white border-brand' : 'bg-white text-gray-600 border-gray-200'
                      }`}
                    >
                      {h.name}
                    </button>
                  ))}
                </div>
                {loadingSeats ? (
                  <Loader label="Loading seats..." />
                ) : (
                  <CinemaSeatMap seats={seats} selectedSeatId={selectedSeat?._id} onSelectSeat={setSelectedSeat} />
                )}
                {selectedSeat && (
                  <p className="text-sm text-gray-500 mt-3">Selected: Seat {selectedSeat.seatNumber}</p>
                )}
              </>
            )}
          </div>
        )}

        {/* Payment — always shown, always priced from the shift */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3">Payment</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select value={form.paymentMethod} onChange={(e) => updateField('paymentMethod', e.target.value)} className="input-field">
              <option value="cash">Cash</option>
              <option value="manual_qr">Online (QR)</option>
            </select>
            <input
              value={form.amountPaid}
              onChange={(e) => updateField('amountPaid', e.target.value)}
              placeholder="Amount collected (₹) — leave blank for full price"
              type="number"
              className="input-field"
            />
          </div>

          {selectedTimeSlot && (
            <div className="mt-3 p-3 rounded-lg bg-gray-50 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Total ({form.durationMonths} mo)</span>
                <span>₹{computedTotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Paid</span>
                <span>₹{paidAmount}</span>
              </div>
              <div className={`flex justify-between font-medium ${dueAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                <span>Due</span>
                <span>₹{dueAmount}</span>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || uploadingPhoto || uploadingIdProof}
          className="btn-primary w-full py-2.5 disabled:opacity-50"
        >
          {submitting ? 'Adding student...' : assignSeatNow ? 'Add Student & Generate Receipt' : 'Add Student (No Fixed Seat)'}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;