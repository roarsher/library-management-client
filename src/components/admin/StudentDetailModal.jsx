 
import React, { useEffect, useState } from 'react';
import * as studentService from '../../services/studentService';
import * as bookingService from '../../services/bookingService';
import * as timeSlotService from '../../services/timeSlotService';
import * as hallService from '../../services/hallService';
import * as seatService from '../../services/seatService';
import * as uploadService from '../../services/uploadService';

const StudentDetailModal = ({ student, onClose, onSaved }) => {
  const [form, setForm] = useState({
    dob: student.dob ? student.dob.slice(0, 10) : '',
    gender: student.gender || '',
    bloodGroup: student.bloodGroup || '',
    aadhaarNumber: student.aadhaarNumber || '',
    address: student.address || '',
    qualification: student.qualification || '',
    preparingFor: student.preparingFor || '',
    fatherName: student.parentDetails?.fatherName || '',
    motherName: student.parentDetails?.motherName || '',
    parentPhone: student.parentDetails?.parentPhone || '',
    photoUrl: student.photoUrl || '',
    idProofUrl: student.idProofUrl || '',
  });

  const [booking, setBooking] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState('');
  const [assignSeat, setAssignSeat] = useState(false);
  const [halls, setHalls] = useState([]);
  const [activeHallId, setActiveHallId] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingIdProof, setUploadingIdProof] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      bookingService.listBookings({
        studentId: student._id,
        status: 'active',
      }),
      timeSlotService.listTimeSlots(),
      hallService.listHalls(),
    ]).then(([bookingRes, slotRes, hallRes]) => {
      const activeBooking = bookingRes.data.bookings?.[0] || null;

      setBooking(activeBooking);
      setTimeSlots(slotRes.data.timeSlots);
      setHalls(hallRes.data.halls);

      if (activeBooking) {
        setSelectedTimeSlotId(activeBooking.timeSlotId?._id || '');
        setAssignSeat(Boolean(activeBooking.seatId));
        setSelectedSeatId(activeBooking.seatId?._id || null);
        setActiveHallId(
          activeBooking.seatId?.hallId || hallRes.data.halls[0]?._id
        );
      } else if (hallRes.data.halls.length) {
        setActiveHallId(hallRes.data.halls[0]._id);
      }

      setLoadingBooking(false);
    });
  }, [student._id]);

  useEffect(() => {
    if (!assignSeat || !activeHallId || !selectedTimeSlotId || !booking) {
      return;
    }

    setLoadingSeats(true);

    seatService
      .getSeatGrid(activeHallId, {
        timeSlotId: selectedTimeSlotId,
        startDate: booking.startDate,
        durationMonths: booking.durationMonths,
      })
      .then(({ data }) => {
        setSeats(data.seats);
        setLoadingSeats(false);
      });
  }, [assignSeat, activeHallId, selectedTimeSlotId, booking]);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);

    try {
      const url = await uploadService.uploadFile(file, 'student_photo');
      updateField('photoUrl', url);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Aadhaar / ID proof upload
  const handleIdProofUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIdProof(true);

    try {
      const url = await uploadService.uploadFile(file, 'id_proof');
      updateField('idProofUrl', url);
    } finally {
      setUploadingIdProof(false);
    }
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);

    try {
      // 1. Save profile fields
      await studentService.updateStudent(student._id, {
        dob: form.dob,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        aadhaarNumber: form.aadhaarNumber,
        address: form.address,
        qualification: form.qualification,
        preparingFor: form.preparingFor,
        photoUrl: form.photoUrl,
        idProofUrl: form.idProofUrl,
        parentDetails: {
          fatherName: form.fatherName,
          motherName: form.motherName,
          parentPhone: form.parentPhone,
        },
      });

      // 2. Save seat/shift changes, if there's an active booking to edit
      if (booking) {
        await bookingService.adminEditBooking(booking._id, {
          timeSlotId: selectedTimeSlotId,
          seatId: assignSeat ? selectedSeatId : null,
        });
      }

      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full p-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">
            {student.userId?.name}
          </h3>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        {/* Photo & ID Proof */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          {/* Photo */}
          <div>
            <label className="text-xs text-gray-500 block mb-2">
              Photo
            </label>

            <div className="flex items-center gap-3">
              {form.photoUrl ? (
                <img
                  src={form.photoUrl}
                  alt=""
                  className="h-16 w-16 rounded-full object-cover border border-gray-200 cursor-pointer"
                  onClick={() =>
                    window.open(form.photoUrl, '_blank')
                  }
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  {student.userId?.name?.[0]}
                </div>
              )}

              <label className="btn-secondary text-xs px-3 py-2 cursor-pointer">
                {uploadingPhoto ? '...' : 'Change'}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Aadhaar Card */}
          <div>
            <label className="text-xs text-gray-500 block mb-2">
              Aadhaar Card
            </label>

            <div className="flex items-center gap-3">
              {form.idProofUrl ? (
                <img
                  src={form.idProofUrl}
                  alt=""
                  className="h-16 w-16 rounded-lg object-cover border border-gray-200 cursor-pointer"
                  onClick={() =>
                    window.open(form.idProofUrl, '_blank')
                  }
                />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 text-center px-1">
                  No file
                </div>
              )}

              <label className="btn-secondary text-xs px-3 py-2 cursor-pointer">
                {uploadingIdProof ? '...' : 'Change'}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIdProofUpload}
                  disabled={uploadingIdProof}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Profile fields */}
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Profile
        </h4>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={form.dob}
              onChange={(e) => updateField('dob', e.target.value)}
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Gender
            </label>
            <select
              value={form.gender}
              onChange={(e) => updateField('gender', e.target.value)}
              className="input-field w-full"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Blood Group
            </label>
            <input
              value={form.bloodGroup}
              onChange={(e) => updateField('bloodGroup', e.target.value)}
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Aadhaar Number
            </label>
            <input
              value={form.aadhaarNumber}
              onChange={(e) =>
                updateField('aadhaarNumber', e.target.value)
              }
              className="input-field w-full"
            />
          </div>

          <div className="col-span-2">
            <label className="text-xs text-gray-500 block mb-1">
              Address
            </label>
            <textarea
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
              rows={2}
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Qualification
            </label>
            <input
              value={form.qualification}
              onChange={(e) =>
                updateField('qualification', e.target.value)
              }
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Preparing For
            </label>
            <input
              value={form.preparingFor}
              onChange={(e) =>
                updateField('preparingFor', e.target.value)
              }
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Father's Name
            </label>
            <input
              value={form.fatherName}
              onChange={(e) =>
                updateField('fatherName', e.target.value)
              }
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Mother's Name
            </label>
            <input
              value={form.motherName}
              onChange={(e) =>
                updateField('motherName', e.target.value)
              }
              className="input-field w-full"
            />
          </div>

          <div className="col-span-2">
            <label className="text-xs text-gray-500 block mb-1">
              Parent Phone
            </label>
            <input
              value={form.parentPhone}
              onChange={(e) =>
                updateField('parentPhone', e.target.value)
              }
              className="input-field w-full"
            />
          </div>
        </div>

        {/* Seat/shift */}
        {loadingBooking ? (
          <p className="text-sm text-gray-400">
            Loading booking info...
          </p>
        ) : !booking ? (
          <p className="text-sm text-gray-400 italic">
            No active booking for this student.
          </p>
        ) : (
          <>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Seat & Shift
            </h4>

            <select
              value={selectedTimeSlotId}
              onChange={(e) => setSelectedTimeSlotId(e.target.value)}
              className="input-field w-full mb-3"
            >
              {timeSlots.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.label} — ₹{t.monthlyPrice}/mo
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={assignSeat}
                onChange={(e) => setAssignSeat(e.target.checked)}
                className="h-4 w-4 accent-brand rounded"
              />
              <span className="text-sm text-gray-700">
                Assign a fixed seat
              </span>
            </label>

            {assignSeat && (
              <>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {halls.map((h) => (
                    <button
                      key={h._id}
                      type="button"
                      onClick={() => {
                        setActiveHallId(h._id);
                        setSelectedSeatId(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                        activeHallId === h._id
                          ? 'bg-brand text-white border-brand'
                          : 'bg-white text-gray-600 border-gray-200'
                      }`}
                    >
                      {h.name}
                    </button>
                  ))}
                </div>

                {loadingSeats ? (
                  <p className="text-sm text-gray-400 mb-4">
                    Loading seats...
                  </p>
                ) : (
                  <div className="grid grid-cols-8 gap-1.5 mb-4 max-h-40 overflow-y-auto">
                    {seats.map((s) => (
                      <button
                        key={s._id}
                        type="button"
                        disabled={
                          s.status !== 'available' &&
                          s._id !== booking.seatId?._id
                        }
                        onClick={() => setSelectedSeatId(s._id)}
                        className={`aspect-square rounded-md border text-xs font-medium ${
                          selectedSeatId === s._id
                            ? 'bg-brand border-brand text-white'
                            : s.status === 'available' ||
                              s._id === booking.seatId?._id
                            ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                            : 'bg-red-50 border-red-200 text-red-300 cursor-not-allowed'
                        }`}
                      >
                        {s.seatNumber}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        <div className="flex gap-2 justify-end mt-4">
          <button
            onClick={onClose}
            className="btn-secondary text-sm px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
 