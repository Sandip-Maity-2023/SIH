
import React, { useCallback, useEffect, useState } from 'react';
import { getUserOrders, releaseEscrow } from '../services/api';

const BuyerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpModal, setOtpModal] = useState({ open: false, orderId: null, otp: '' });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getUserOrders();
      setOrders(data.orders || data.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleReleaseEscrow = async (e) => {
    e.preventDefault();
    try {
      await releaseEscrow(otpModal.orderId, { otp: otpModal.otp });
      alert('Delivery verified! Escrow payment released to farmer.');
      setOtpModal({ open: false, orderId: null, otp: '' });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid delivery OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Bulk Buyer Escrow Dashboard</h1>

        {/* Dashboard Metric Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow border-l-4 border-emerald-500">
            <span className="text-xs text-gray-500 uppercase font-semibold">Total Orders</span>
            <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow border-l-4 border-amber-500">
            <span className="text-xs text-gray-500 uppercase font-semibold">Funds Locked in Escrow</span>
            <p className="text-2xl font-bold text-gray-800">
              ₹
              {orders
                .filter((o) => o.paymentDetails?.escrowStatus === 'LOCKED_IN_ESCROW')
                .reduce((acc, curr) => acc + curr.totalAmount, 0)}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow border-l-4 border-blue-500">
            <span className="text-xs text-gray-500 uppercase font-semibold">Completed Deliveries</span>
            <p className="text-2xl font-bold text-gray-800">
              {orders.filter((o) => o.orderStatus === 'DELIVERED').length}
            </p>
          </div>
        </div>

        {/* Active Orders Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-bold text-gray-800">Order Transactions & Escrow Status</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading procurement orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No active procurement orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase border-b">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Crop</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Total Price</th>
                    <th className="p-4">Escrow Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="p-4 font-mono text-xs">{order._id.substring(0, 8)}...</td>
                      <td className="p-4 font-semibold text-gray-800 capitalize">
                        {order.items?.[0]?.cropLotId?.cropName || 'Produce'}
                      </td>
                      <td className="p-4">{order.items?.reduce((sum, item) => sum + item.quantityKg, 0) || 0} kg</td>
                      <td className="p-4 font-bold">₹{order.totalAmount}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                            order.paymentDetails?.escrowStatus === 'RELEASED_TO_FARMER'
                              ? 'bg-green-100 text-green-800'
                              : order.paymentDetails?.escrowStatus === 'LOCKED_IN_ESCROW'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.paymentDetails?.escrowStatus || order.orderStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        {order.paymentDetails?.escrowStatus === 'LOCKED_IN_ESCROW' && (
                          <button
                            onClick={() =>
                              setOtpModal({ open: true, orderId: order._id, otp: '' })
                            }
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded transition"
                          >
                            Verify Delivery & Release
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* OTP Delivery Verification Modal */}
      {otpModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delivery Verification</h3>
            <p className="text-xs text-gray-600 mb-4">
              Enter the OTP provided by the delivery driver to unlock and transfer escrow funds to the farmer.
            </p>
            <form onSubmit={handleReleaseEscrow}>
              <input
                type="text"
                placeholder="Enter 4-digit OTP"
                value={otpModal.otp}
                onChange={(e) => setOtpModal({ ...otpModal, otp: e.target.value })}
                className="w-full border px-3 py-2 rounded mb-4 text-center text-lg tracking-widest outline-none"
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpModal({ open: false, orderId: null, otp: '' })}
                  className="flex-1 border py-2 rounded text-sm text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-2 rounded text-sm font-bold"
                >
                  Confirm Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
