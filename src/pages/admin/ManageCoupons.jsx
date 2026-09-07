import React, { useEffect, useState } from 'react';
import * as couponService from '../../services/couponService';
import Loader from '../../components/common/Loader';

const DISCOUNTS = [10, 15, 20, 25];

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);

  const load = async () => {
    const { data } = await couponService.listCoupons();
    setCoupons(data.coupons);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleGenerate = async (discountPercent) => {
    setGenerating(discountPercent);
    try {
      await couponService.createCoupon({ discountPercent });
      await load();
    } finally {
      setGenerating(null);
    }
  };

  if (loading) return <Loader />;

  const unused = coupons.filter((c) => !c.usedBy);
  const used = coupons.filter((c) => c.usedBy);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Discount Coupons</h1>
      <p className="text-sm text-gray-500 mb-6">
        Generate a code and share it privately with a student — it applies automatically at checkout.
      </p>

      <div className="flex gap-2 mb-8 flex-wrap">
        {DISCOUNTS.map((d) => (
          <button
            key={d}
            onClick={() => handleGenerate(d)}
            disabled={generating === d}
            className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
          >
            {generating === d ? 'Generating...' : `Generate ${d}% Coupon`}
          </button>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-gray-700 mb-3">Unused ({unused.length})</h2>
      {unused.length === 0 ? (
        <p className="text-sm text-gray-400 mb-6">No unused coupons.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {unused.map((c) => (
            <div key={c._id} className="card text-center">
              <p className="font-mono text-lg font-bold text-brand tracking-wider">{c.code}</p>
              <p className="text-xs text-gray-400 mt-1">{c.discountPercent}% off</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-sm font-semibold text-gray-700 mb-3">Used ({used.length})</h2>
      {used.length === 0 ? (
        <p className="text-sm text-gray-400">No coupons redeemed yet.</p>
      ) : (
        <div className="space-y-2">
          {used.map((c) => (
            <div key={c._id} className="card flex items-center justify-between">
              <div>
                <p className="font-mono text-sm text-gray-500">{c.code}</p>
                <p className="text-xs text-gray-400">{c.discountPercent}% · used by {c.usedBy?.userId?.name}</p>
              </div>
              <p className="text-xs text-gray-400">{new Date(c.usedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCoupons;