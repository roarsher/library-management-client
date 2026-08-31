import React from 'react';

const STYLES = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  pending_approval: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  verified: 'bg-green-50 text-green-700 border-green-200',
  active: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  on_leave: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-gray-100 text-gray-600 border-gray-200',
};

const LABELS = {
  pending_approval: 'Pending Approval',
  on_leave: 'On Leave',
};

const StatusBadge = ({ status }) => (
  <span
    className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${
      STYLES[status] || 'bg-gray-100 text-gray-600 border-gray-200'
    }`}
  >
    {LABELS[status] || status?.replace(/_/g, ' ')}
  </span>
);

export default StatusBadge;
