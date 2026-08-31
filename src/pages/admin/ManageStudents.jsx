 
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as bookingService from "../../services/bookingService";
import * as studentService from "../../services/studentService";
import { useTenant } from "../../context/TenantContext";
import Loader from "../../components/common/Loader";
import StudentCard from "../../components/cards/StudentCard";

const TABS = [
  { key: "active", label: "Active" },
  { key: "on_leave", label: "On Leave" },
];

const GENDERS = [
  { key: "all", label: "All" },
  { key: "male", label: "Male" },
  { key: "female", label: "Female" },
];

const ManageStudents = () => {
  const { library } = useTenant();

  const [tab, setTab] = useState("active");
  const [gender, setGender] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);

    try {
      const params = { status: tab };

      if (gender !== "all") {
        params.gender = gender;
      }

      const { data } = await bookingService.listBookings(params);

      setBookings(data.bookings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, gender]);

  const filtered = bookings.filter((b) =>
    b.studentId?.userId?.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleDelete = async (booking) => {
    const name =
      booking.studentId?.userId?.name || "this student";

    if (
      !window.confirm(
        `Permanently delete ${name}'s account and all their records? This cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(booking._id);

    try {
      await studentService.deleteStudent(
        booking.studentId._id
      );

      setBookings((prev) =>
        prev.filter((b) => b._id !== booking._id)
      );
    } catch (err) {
      window.alert(
        err.response?.data?.message ||
          "Could not delete student"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-gray-800">
          Students
        </h1>

        {/* Search + Add Student */}
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="input-field w-56"
          />

          <Link
            to="/admin/students/add"
            className="btn-primary text-sm px-4 py-2 whitespace-nowrap"
          >
            + Add Student
          </Link>
        </div>
      </div>

      {/* Tabs & Gender Filter */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">

        <div className="flex gap-2 border-b border-gray-100 flex-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                tab === t.key
                  ? "border-brand text-brand"
                  : "border-transparent text-gray-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5">
          {GENDERS.map((g) => (
            <button
              key={g.key}
              onClick={() => setGender(g.key)}
              className={`text-xs px-3 py-1.5 rounded-full border ${
                gender === g.key
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Students */}
      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400">
          No students in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((b) => {
            const s = b.studentId;

            const seatLabel = `Seat ${
              b.seatId?.seatNumber
            } · ${
              b.seatId?.hallId?.name ||
              `Hall ${b.seatId?.hallId?.hallNumber}`
            }`;

            const shiftLabel =
              b.timeSlotId?.label ||
              `${b.timeSlotId?.startTime}-${b.timeSlotId?.endTime}`;

            // Student's first name
            const firstName =
              s?.userId?.name?.split(" ")[0] || "";

            // WhatsApp pre-filled message
            const greeting = `Hi ${firstName}, this is ${
              library?.name || "Gyan Library"
            }. Your library fee is due for this month. Please complete the payment within the next ___ hours to avoid any late fees. Call or text us at +91 84059 09314 if you have any questions or concerns.

Thanks & Regards,
GYAN LIBRARY TEAM`;

            return (
              <div
                key={b._id}
                className="relative"
              >
                <StudentCard
                  name={s?.userId?.name}
                  detail={`${seatLabel} · ${shiftLabel}`}
                  image={s?.photoUrl}
                  phone={s?.userId?.phone}
                  whatsappMessage={greeting}
                />

                {/* Remove button */}
                <button
                  onClick={() => handleDelete(b)}
                  disabled={deletingId === b._id}
                  className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-600 bg-white/80 px-2 py-1 rounded disabled:opacity-50"
                >
                  {deletingId === b._id
                    ? "..."
                    : "Remove"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
  