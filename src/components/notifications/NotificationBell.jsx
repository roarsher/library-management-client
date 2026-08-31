// client/src/components/notifications/NotificationBell.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as notificationService from '../../services/notificationService';
import { usePushNotifications } from '../../hooks/usePushNotifications';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { status: pushStatus, subscribe: subscribeToPush } = usePushNotifications();

  const load = () => {
    notificationService.getMyNotifications().then(({ data }) => setNotifications(data.notifications));
  };

  useEffect(() => {
    load();
    // Poll every 60s so new notifications (seat freed, leave approved, etc.)
    // show up without a full page refresh.
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleOpen = () => {
    setOpen((v) => !v);
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
      );
      await notificationService.markAsRead(notif._id).catch(() => {});
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={handleOpen} className="relative p-2 rounded-lg hover:bg-gray-100">
        <span className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 max-h-96 overflow-y-auto z-40">
          <div className="p-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">Notifications</p>
          </div>

          {pushStatus !== 'subscribed' && pushStatus !== 'unsupported' && (
            <div className="p-3 bg-brand/5 border-b border-gray-100 flex items-center justify-between gap-2">
              <p className="text-xs text-gray-600">Get notified even when the tab is closed</p>
              <button
                onClick={subscribeToPush}
                disabled={pushStatus === 'subscribing'}
                className="btn-primary text-xs px-2 py-1 whitespace-nowrap"
              >
                {pushStatus === 'subscribing' ? 'Enabling...' : 'Enable'}
              </button>
            </div>
          )}
          {pushStatus === 'denied' && (
            <p className="text-xs text-red-400 px-3 py-1">
              Notifications blocked — enable them in your browser settings.
            </p>
          )}
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => handleNotificationClick(n)}
                className={`w-full text-left px-3 py-2.5 border-b border-gray-50 hover:bg-gray-50 ${
                  !n.isRead ? 'bg-brand/5' : ''
                }`}
              >
                <p className="text-sm text-gray-800">{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-300 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
