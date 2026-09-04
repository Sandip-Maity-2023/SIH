import React, { useCallback, useEffect, useState } from 'react';
import { getUserOrders } from '../services/api';

const fallbackOrders = [
  ['KR-ORD-00240', 'Wheat, 5 qtl', 'PLACED', 'LOCKED_IN_ESCROW'],
  ['KR-ORD-00238', 'Tomato, 2 qtl', 'CONFIRMED', 'LOCKED_IN_ESCROW'],
  ['KR-ORD-00231', 'Wheat, 5 qtl', 'IN_TRANSIT', 'LOCKED_IN_ESCROW'],
  ['KR-ORD-00220', 'Wheat, 8 qtl', 'DELIVERED', 'RELEASED_TO_FARMER'],
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getUserOrders();
      setOrders(data.data || data.orders || []);
    } catch {
      setOrders(fallbackOrders.map(([id, crop, orderStatus, escrowStatus]) => ({ _id: id, crop, orderStatus, paymentDetails: { escrowStatus } })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Admin View</p>
          <h1 className="text-2xl font-black text-slate-950">Order Management</h1>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          {loading ? <div className="p-6 text-center text-sm text-slate-500">Loading orders...</div> : (
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                <tr>{['Order ID', 'Produce', 'Buyer', 'Status', 'Escrow', 'Action'].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-3 font-mono text-xs">{String(order._id).slice(0, 14)}</td>
                    <td className="px-4 py-3 font-bold">{order.crop || order.items?.[0]?.cropLotId?.cropName || 'Produce order'}</td>
                    <td className="px-4 py-3">{order.buyerId?.name || 'Buyer'}</td>
                    <td className="px-4 py-3">{order.orderStatus}</td>
                    <td className="px-4 py-3">{order.paymentDetails?.escrowStatus}</td>
                    <td className="px-4 py-3"><button className="rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white">Review</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
