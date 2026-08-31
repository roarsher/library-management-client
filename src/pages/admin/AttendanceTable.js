 import React, { useEffect, useState } from 'react';
import * as attendanceService from '../../services/attendanceService';

const formatTime = (d) => (d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—');
const formatLocation = (loc) => (loc?.lat != null ? `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}` : '—');
const todayStr = () => new Date().toISOString().slice(0, 10);

const AttendanceTable = () => {
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const { data } = await attendanceService.getTodayAttendance(selectedDate);
      setRecords(data.records);
    } catch {
      setError('Could not load attendance');
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Poll every 30s only when viewing today, so live check-ins show up automatically
    let interval;
    if (selectedDate === todayStr()) {
      interval = setInterval(() => load(false), 30000);
    }
    return () => interval && clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  if (loading) return <p className="text-sm text-gray-400">Loading attendance...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-semibold text-gray-800">
            {selectedDate === todayStr() ? "Today's Attendance" : `Attendance — ${selectedDate}`}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{records.length} records</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          max={todayStr()}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input-field text-sm w-auto"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <th className="px-5 py-2">Student</th>
              <th className="px-5 py-2">Check-in</th>
              <th className="px-5 py-2">Check-out</th>
              <th className="px-5 py-2">Duration</th>
              <th className="px-5 py-2">Location (in)</th>
              <th className="px-5 py-2">Streak</th>
              <th className="px-5 py-2">Source</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} className="border-b border-gray-50 last:border-0">
                <td className="px-5 py-2.5 font-medium text-gray-700">{r.studentId?.userId?.name || '—'}</td>
                <td className="px-5 py-2.5 text-gray-600">{formatTime(r.checkInAt)}</td>
                <td className="px-5 py-2.5 text-gray-600">{formatTime(r.checkOutAt)}</td>
                <td className="px-5 py-2.5 text-gray-600">
                  {r.durationMinutes != null ? `${r.durationMinutes} min` : 'In progress'}
                </td>
                <td className="px-5 py-2.5 text-gray-400 text-xs">{formatLocation(r.checkInLocation)}</td>
                <td className="px-5 py-2.5 text-gray-600">🔥 {r.studentId?.currentStreak ?? 0}</td>
                <td className="px-5 py-2.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.source === 'qr' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                    {r.source}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;