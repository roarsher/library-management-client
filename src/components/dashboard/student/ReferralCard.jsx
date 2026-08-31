import React, { useEffect, useState } from 'react';
 import * as referralService from '../../../services/referralService';

const ReferralCard = () => {
  const [code, setCode] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    referralService.getMyReferralCode().then(({ data }) => setCode(data.referralCode));
    referralService.getMyReferrals().then(({ data }) => setReferrals(data.referrals));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completedCount = referrals.filter((r) => r.status === 'completed').length;

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 mb-1">Refer a Friend</h3>
      <p className="text-xs text-gray-500 mb-3">
        Share your code — you both get a discount when they join.
      </p>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-700">
          {code || '...'}
        </div>
        <button onClick={handleCopy} className="btn-secondary text-xs px-3">
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <p className="text-xs text-gray-400">
        {completedCount} friend{completedCount === 1 ? '' : 's'} joined using your code
      </p>
    </div>
  );
};

export default ReferralCard;
