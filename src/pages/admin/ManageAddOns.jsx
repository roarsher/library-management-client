import React, { useEffect, useState } from 'react';
import * as addOnService from '../../services/addOnService';
import Loader from '../../components/common/Loader';

const emptyForm = { name: '', description: '', pricePerMonth: '', unit: 'month' };

const ManageAddOns = () => {
  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await addOnService.listAddOns();
    setAddOns(data.addOns);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addOnService.createAddOn({ ...form, pricePerMonth: Number(form.pricePerMonth) });
      setForm(emptyForm);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (addOn) => {
    await addOnService.updateAddOn(addOn._id, { isActive: !addOn.isActive });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this add-on?')) return;
    await addOnService.deleteAddOn(id);
    load();
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">Add-Ons</h1>

      <form onSubmit={handleCreate} className="card mb-6 space-y-3">
        <h3 className="font-semibold text-gray-800">New Add-On</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name (e.g. Extra Hour - Morning/Evening)" className="input-field" />
          <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input-field">
            <option value="month">Flat rate / month</option>
            <option value="hour">Per hour / month</option>
          </select>
          <input required type="number" value={form.pricePerMonth} onChange={(e) => setForm({ ...form, pricePerMonth: e.target.value })} placeholder="Price (₹)" className="input-field" />
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" className="input-field" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary text-sm px-4 disabled:opacity-50">
          {saving ? 'Adding...' : 'Add'}
        </button>
      </form>

      <div className="space-y-2">
        {addOns.map((a) => (
          <div key={a._id} className="card flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">{a.name}</p>
              <p className="text-xs text-gray-400">
                ₹{a.pricePerMonth}{a.unit === 'hour' ? '/hr/mo' : '/mo'} · {a.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleToggleActive(a)} className="text-xs text-gray-500 hover:text-gray-700">
                {a.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => handleDelete(a._id)} className="text-xs text-red-400 hover:text-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageAddOns;