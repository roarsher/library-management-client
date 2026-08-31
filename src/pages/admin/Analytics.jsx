// client/src/pages/admin/Analytics.jsx
import React, { useEffect, useState } from 'react';
import * as analyticsService from '../../services/analyticsService';
import Loader from '../../components/common/Loader';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const heatColor = (count, max) => {
  if (!count) return 'bg-gray-50';
  const intensity = Math.min(count / (max || 1), 1);
  if (intensity > 0.75) return 'bg-brand';
  if (intensity > 0.5) return 'bg-brand/70';
  if (intensity > 0.25) return 'bg-brand/40';
  return 'bg-brand/20';
};

const Analytics = () => {
  const [heatmap, setHeatmap] = useState([]);
  const [slotOccupancy, setSlotOccupancy] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsService.getAttendanceHeatmap(), analyticsService.getSlotOccupancy()]).then(
      ([heatmapRes, slotRes]) => {
        setHeatmap(heatmapRes.data.heatmap);
        setSlotOccupancy(slotRes.data.slotOccupancy);
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <Loader />;

  // Build a lookup: dayOfWeek (1-7) + hour -> count
  const countLookup = {};
  let maxCount = 0;
  heatmap.forEach((cell) => {
    const key = `${cell._id.dayOfWeek}-${cell._id.hour}`;
    countLookup[key] = cell.count;
    if (cell.count > maxCount) maxCount = cell.count;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">Analytics</h1>

      <div className="card mb-8 overflow-x-auto">
        <h2 className="font-semibold text-gray-800 mb-1">Attendance Heatmap</h2>
        <p className="text-xs text-gray-400 mb-4">Check-ins over the last 30 days, by day and hour</p>

        <div className="min-w-[700px]">
          <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-0.5 mb-1">
            <div />
            {HOURS.map((h) => (
              <div key={h} className="text-[9px] text-gray-400 text-center">
                {h}
              </div>
            ))}
          </div>
          {DAYS.map((day, dayIndex) => (
            <div key={day} className="grid grid-cols-[40px_repeat(24,1fr)] gap-0.5 mb-0.5">
              <div className="text-xs text-gray-500 flex items-center">{day}</div>
              {HOURS.map((h) => {
                const count = countLookup[`${dayIndex + 1}-${h}`] || 0;
                return (
                  <div
                    key={h}
                    title={`${count} check-in(s)`}
                    className={`aspect-square rounded-sm ${heatColor(count, maxCount)}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-800 mb-4">Slot Occupancy</h2>
        <div className="space-y-3">
          {slotOccupancy.map((slot) => (
            <div key={slot.timeSlotId}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">
                  {slot.label || `${slot.startTime}-${slot.endTime}`}
                </span>
                <span className="text-gray-500">{slot.occupancyRate}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand"
                  style={{ width: `${slot.occupancyRate}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{slot.insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
