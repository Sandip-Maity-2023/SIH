import React, { useCallback, useEffect, useState } from 'react';

const Payouts = () => {
  const [balance] = useState({
    availableBalance: 42500,
    inEscrow: 18000,
    totalWithdrawn: 145000
  });

  const [payoutHistory, setPayoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayouts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payouts');
      if (!response.ok) throw new Error('Failed to load payouts');
      const data = await response.json();
      setPayoutHistory(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      // Fallback demo data
      setPayoutHistory([
        { id: 'TXN-901', orderId: 'ORD-8821', amount: 24000, status: 'Completed', date: '2026-08-28', method: 'Direct Bank Transfer' },
        { id: 'TXN-854', orderId: 'ORD-8710', amount: 18500, status: 'Completed', date: '2026-08-15', method: 'UPI / Bank Transfer' },
        { id: 'TXN-792', orderId: 'ORD-8502', amount: 35000, status: 'Processing', date: '2026-09-02', method: 'Escrow Release' }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Earnings & Payouts</h1>
          <p className="text-sm text-gray-500">View escrow settlements and direct bank transfers from direct produce sales.</p>
        </div>

        {/* Summary Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-green-600">
            <p className="text-xs text-gray-500 font-semibold uppercase">Available for Withdrawal</p>
            <h2 className="text-2xl font-extrabold text-green-700 mt-1">₹{balance.availableBalance.toLocaleString()}</h2>
            <button className="mt-4 w-full py-1.5 bg-green-700 text-white text-xs font-semibold rounded hover:bg-green-800">
              Request Bank Transfer
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-amber-500">
            <p className="text-xs text-gray-500 font-semibold uppercase">Held in Escrow</p>
            <h2 className="text-2xl font-extrabold text-amber-600 mt-1">₹{balance.inEscrow.toLocaleString()}</h2>
            <p className="text-xs text-gray-400 mt-2">Released upon delivery verification</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-gray-400">
            <p className="text-xs text-gray-500 font-semibold uppercase">Total Settled Earnings</p>
            <h2 className="text-2xl font-extrabold text-gray-800 mt-1">₹{balance.totalWithdrawn.toLocaleString()}</h2>
            <p className="text-xs text-gray-400 mt-2">Lifetime revenue processed</p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-bold text-gray-800 text-base">Payout Transaction History</h3>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500 text-sm">Loading payout records...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs text-gray-700 uppercase border-b">
                  <tr>
                    <th className="px-6 py-3">Transaction ID</th>
                    <th className="px-6 py-3">Order Ref</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Transfer Method</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payoutHistory.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-800">{row.id}</td>
                      <td className="px-6 py-4 text-xs">{row.orderId}</td>
                      <td className="px-6 py-4 text-xs">{row.date}</td>
                      <td className="px-6 py-4 text-xs">{row.method}</td>
                      <td className="px-6 py-4 font-bold text-gray-800">₹{row.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                          row.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payouts;
