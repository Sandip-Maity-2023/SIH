import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { createOrder } from '../../services/api';

const Checkout = () => {
  const { cartItems, subtotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    street: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const deliveryCharges = cartItems.length ? 250 : 0;
  const platformFee = cartItems.length ? 100 : 0;
  const discount = cartItems.length && subtotal > 1000 ? 200 : 0;
  const totalAmount = subtotal + deliveryCharges + platformFee - discount;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    if (!cartItems.length) {
      navigate('/marketplace');
      return;
    }

    const items = cartItems.map((item) => ({
      cropLotId: item._id || item.id,
      farmerId: item.farmerId?._id || item.farmerId,
      quantityKg: Number(item.quantity),
      pricePerKg: Number(item.pricePerKg),
      subtotal: Number(item.pricePerKg) * Number(item.quantity),
    }));

    try {
      setSaving(true);
      setError('');
      await createOrder({
        items,
        deliveryAddress: shippingInfo,
        totalAmount,
        transactionReference: `KR-PAY-${Date.now()}`,
      });
      clearCart();
      navigate('/buyer-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to store checkout order in database.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <form onSubmit={handlePlaceOrder} className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Checkout</p>
            <h1 className="text-2xl font-black text-slate-950">Address, Payment, Confirmation</h1>
          </div>

          {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-black text-slate-950">Delivery Address</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input name="street" required value={shippingInfo.street} onChange={handleChange} placeholder="Street / society / warehouse" className="h-11 rounded-md border border-slate-300 px-3 text-sm md:col-span-2" />
              <input name="city" required value={shippingInfo.city} onChange={handleChange} placeholder="City" className="h-11 rounded-md border border-slate-300 px-3 text-sm" />
              <input name="district" value={shippingInfo.district} onChange={handleChange} placeholder="District" className="h-11 rounded-md border border-slate-300 px-3 text-sm" />
              <input name="state" required value={shippingInfo.state} onChange={handleChange} placeholder="State" className="h-11 rounded-md border border-slate-300 px-3 text-sm" />
              <input name="pincode" required value={shippingInfo.pincode} onChange={handleChange} placeholder="Pincode" className="h-11 rounded-md border border-slate-300 px-3 text-sm" />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-black text-slate-950">Payment</h2>
            <label className="flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-3">
              <input type="radio" checked readOnly className="mt-1" />
              <span>
                <span className="block text-sm font-black text-slate-900">Krishi Escrow Protection</span>
                <span className="text-xs text-slate-600">Funds lock in escrow and release after delivery verification.</span>
              </span>
            </label>
          </div>
        </div>

        <div className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-black text-slate-950">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="mb-3 border-b border-slate-100 pb-3 text-sm">
              <div className="flex justify-between gap-3">
                <span>{item.cropName || item.name} x {item.quantity} kg</span>
                <b>Rs {(item.pricePerKg * item.quantity).toLocaleString()}</b>
              </div>
            </div>
          ))}
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between"><span>Delivery Charges</span><b>Rs {deliveryCharges}</b></div>
            <div className="flex justify-between"><span>Platform Fee</span><b>Rs {platformFee}</b></div>
            <div className="flex justify-between"><span>Coupon Discount</span><b>- Rs {discount}</b></div>
          </div>
          <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-lg font-black">
            <span>Total</span>
            <span className="text-emerald-700">Rs {totalAmount.toLocaleString()}</span>
          </div>
          <button disabled={saving || !cartItems.length} className="mt-5 w-full rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-black text-white disabled:opacity-60">
            {saving ? 'Storing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
