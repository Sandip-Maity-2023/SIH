import React, { useState, useEffect } from 'react';
import { Calendar, Truck, Clock, MapPin, CheckCircle, Navigation, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getDispatchSchedules,
  createDispatchSchedule,
  updateDispatchScheduleStatus,
} from '../../services/api';

const RouteScheduler = ({ onRouteScheduled }) => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Scheduled' | 'In-Transit' | 'Completed'
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [schedule, setSchedule] = useState({
    origin: '',
    destination: '',
    departureTime: '',
    vehicleType: 'Refrigerated Truck (10 Ton)',
    driverName: '',
    cargoWeight: '',
    tempControl: '4°C Cold Storage',
    notes: '',
  });

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const { data } = await getDispatchSchedules();
      const list = (data?.data || []).map((item) => ({
        ...item,
        id: item.scheduleId || item.id || item._id,
      }));
      setSchedules(list);
    } catch (err) {
      console.error('Failed to load dispatch schedules from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setErrorMsg('');

      const payload = {
        origin: schedule.origin,
        destination: schedule.destination,
        departureTime: schedule.departureTime || new Date().toISOString(),
        vehicleType: schedule.vehicleType,
        driverName: schedule.driverName || 'Assigned Driver',
        cargoWeight: schedule.cargoWeight || 'Standard Payload',
        tempControl: schedule.tempControl,
        notes: schedule.notes || '',
      };

      const { data } = await createDispatchSchedule(payload);
      const createdItem = {
        ...(data?.data || {}),
        id: data?.data?.scheduleId || data?.data?._id || `SCH-${Date.now()}`,
      };

      setSchedules((prev) => [createdItem, ...prev]);
      if (onRouteScheduled) onRouteScheduled(createdItem);

      setSuccessMsg(`Dispatch schedule ${createdItem.id || createdItem.scheduleId} created and saved successfully!`);
      setTimeout(() => setSuccessMsg(''), 5000);

      setSchedule({
        origin: '',
        destination: '',
        departureTime: '',
        vehicleType: 'Refrigerated Truck (10 Ton)',
        driverName: '',
        cargoWeight: '',
        tempControl: '4°C Cold Storage',
        notes: '',
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create dispatch schedule.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDispatchScheduleStatus(id, newStatus);
      setSchedules((prev) =>
        prev.map((item) => (item.id === id || item.scheduleId === id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      console.error('Failed to update trip status:', err);
      // Fallback local update
      setSchedules((prev) =>
        prev.map((item) => (item.id === id || item.scheduleId === id ? { ...item, status: newStatus } : item))
      );
    }
  };

  const filteredSchedules = schedules.filter((item) =>
    activeTab === 'All' ? true : item.status.toLowerCase() === activeTab.toLowerCase()
  );

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Logistics Fleet Management</span>
            <h1 className="text-2xl font-black text-slate-950">Dispatch & Route Scheduler</h1>
            <p className="text-xs text-slate-500">Plan and track agricultural freight dispatch schedules across farm clusters.</p>
          </div>

          <div className="flex items-center gap-2">
            {['All', 'Scheduled', 'In-Transit', 'Completed'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                  activeTab === tab ? 'bg-emerald-800 text-white shadow-sm' : 'bg-white text-slate-700 border hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-900 text-sm font-bold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-700" />
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Schedule Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-700" /> Create Dispatch Schedule
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Pickup Origin (Farm / Hub)</label>
                <input
                  type="text"
                  name="origin"
                  required
                  value={schedule.origin}
                  onChange={handleChange}
                  placeholder="e.g. Singur Farm Cluster, Hooghly"
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Delivery Destination</label>
                <input
                  type="text"
                  name="destination"
                  required
                  value={schedule.destination}
                  onChange={handleChange}
                  placeholder="e.g. Kolkata Wholesale Mandi"
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Departure Date & Time</label>
                  <input
                    type="datetime-local"
                    name="departureTime"
                    required
                    value={schedule.departureTime}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Vehicle Type</label>
                  <select
                    name="vehicleType"
                    value={schedule.vehicleType}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded text-xs bg-white focus:ring-emerald-500"
                  >
                    <option value="Refrigerated Truck (10 Ton)">Refrigerated Truck (10 Ton)</option>
                    <option value="Covered Container (5 Ton)">Covered Container (5 Ton)</option>
                    <option value="Open Pickup (2 Ton)">Open Pickup (2 Ton)</option>
                    <option value="Electric Mini Freight Van">Electric Mini Freight Van</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Assigned Driver</label>
                  <input
                    type="text"
                    name="driverName"
                    value={schedule.driverName}
                    onChange={handleChange}
                    placeholder="Driver name"
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Payload Weight / Crops</label>
                  <input
                    type="text"
                    name="cargoWeight"
                    value={schedule.cargoWeight}
                    onChange={handleChange}
                    placeholder="e.g. 5.0 Tons Tomatoes"
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Temperature & Climate Mode</label>
                <select
                  name="tempControl"
                  value={schedule.tempControl}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded text-xs bg-white focus:ring-emerald-500"
                >
                  <option value="4°C Cold Storage">4°C Perishable Cold Storage</option>
                  <option value="12°C Controlled Humidity">12°C Controlled Humidity</option>
                  <option value="Ambient Dry Storage">Ambient Dry Storage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Special Route Notes</label>
                <textarea
                  name="notes"
                  rows="2"
                  value={schedule.notes}
                  onChange={handleChange}
                  placeholder="e.g. Temperature monitoring active..."
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-emerald-500"
                />
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-emerald-800 text-white font-black rounded text-xs hover:bg-emerald-900 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving Schedule...
                  </>
                ) : (
                  '+ Schedule Dispatch Trip'
                )}
              </button>
            </form>
          </div>

          {/* Scheduled Trips Table List */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase flex items-center justify-between">
              <span>Active Scheduled Trips ({filteredSchedules.length})</span>
              <span className="text-xs text-slate-500 font-medium">Real-Time Dispatch Monitoring</span>
            </h2>

            {loading ? (
              <div className="p-12 text-center bg-white border rounded-lg text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-700" />
                <span>Loading dispatch schedules from database...</span>
              </div>
            ) : filteredSchedules.length === 0 ? (
              <div className="p-8 text-center bg-white border border-dashed rounded-lg text-slate-500 text-xs">
                No dispatch schedules found for "{activeTab}".
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSchedules.map((sch) => (
                  <div key={sch.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3 hover:border-emerald-300 transition">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-emerald-800">{sch.id}</span>
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <Truck className="h-3.5 w-3.5 text-emerald-700" /> {sch.vehicleType}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                        sch.status === 'In-Transit'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : sch.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-blue-100 text-blue-900 border border-blue-300'
                      }`}>
                        ● {sch.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-slate-900">Route:</div>
                          <div>{sch.origin} ➔ {sch.destination}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <Clock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-slate-900">Departure:</div>
                          <div>{new Date(sch.departureTime).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded text-xs text-slate-600">
                      <div>Driver: <strong className="text-slate-800">{sch.driverName}</strong></div>
                      <div>Payload: <strong className="text-slate-800">{sch.cargoWeight}</strong></div>
                      <div>Temp: <strong className="text-emerald-800 font-mono">{sch.tempControl}</strong></div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      {sch.status === 'Scheduled' && (
                        <button
                          type="button"
                          onClick={() => updateStatus(sch.id, 'In-Transit')}
                          className="px-3 py-1 bg-amber-600 text-white font-bold text-xs rounded hover:bg-amber-700"
                        >
                          Start Dispatch Trip
                        </button>
                      )}
                      {sch.status === 'In-Transit' && (
                        <button
                          type="button"
                          onClick={() => updateStatus(sch.id, 'Completed')}
                          className="px-3 py-1 bg-emerald-700 text-white font-bold text-xs rounded hover:bg-emerald-800"
                        >
                          Mark Delivery Complete
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => navigate('/logistics', { state: { origin: sch.origin, destination: sch.destination, id: sch.id } })}
                        className="px-3 py-1 bg-slate-800 text-white font-bold text-xs rounded hover:bg-slate-900 flex items-center gap-1 shadow-sm"
                      >
                        <Navigation className="h-3 w-3" /> Track on Map
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteScheduler;
