 import React from 'react';
import { MapPin, Clock } from 'lucide-react';

const formatTime = (d) =>
  d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

const AttendanceWidget = ({ records }) => {
  const recent = (records || []).slice(0, 5);

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 mb-3">Recent Attendance</h3>
      {recent.length === 0 ? (
        <p className="text-sm text-gray-400">No attendance records yet.</p>
      ) : (
        <div className="space-y-3">
          {recent.map((r) => (
            <div key={r._id} className="pb-3 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{formatDate(r.checkInAt)}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    r.checkOutAt ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-600'
                  }`}
                >
                  {r.checkOutAt ? `${r.durationMinutes ?? '—'} min` : 'In progress'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatTime(r.checkInAt)}
                  {r.checkOutAt && ` – ${formatTime(r.checkOutAt)}`}
                </span>
                {r.source && (
                  <span className={`px-1.5 py-0.5 rounded ${r.source === 'qr' ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-400'}`}>
                    {r.source}
                  </span>
                )}
              </div>

              {(r.checkInLocation?.lat != null || r.checkOutLocation?.lat != null) && (
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <MapPin size={11} />
                  {r.checkInLocation?.lat != null && (
                    <span>In: {r.checkInLocation.lat.toFixed(3)}, {r.checkInLocation.lng.toFixed(3)}</span>
                  )}
                  {r.checkOutLocation?.lat != null && (
                    <span>· Out: {r.checkOutLocation.lat.toFixed(3)}, {r.checkOutLocation.lng.toFixed(3)}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceWidget;