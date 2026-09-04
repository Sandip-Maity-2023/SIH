import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useContext(CartContext);
  const navigate = useNavigate();
  const deliveryCharges = cartItems.length ? 250 : 0;
  const platformFee = cartItems.length ? 100 : 0;
  const discount = cartItems.length && subtotal > 1000 ? 200 : 0;
  const total = subtotal + deliveryCharges + platformFee - discount;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Cart</p>
          <h1 className="text-2xl font-black text-slate-950">Cart to Checkout</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="mb-4 text-sm text-slate-500">Your cart is empty.</p>
            <Link to="/marketplace" className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-black text-white">
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-black text-slate-950">{item.cropName || item.name}</h3>
                      <p className="text-xs text-slate-500">{item.farmerId?.name || item.farmer || 'Verified Farmer'}</p>
                      <p className="mt-1 text-sm font-bold text-emerald-700">Rs {item.pricePerKg}/kg</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                        className="h-10 w-24 rounded-md border border-slate-300 px-3 text-sm"
                      />
                      <span className="w-24 text-right text-sm font-black">Rs {(item.pricePerKg * item.quantity).toLocaleString()}</span>
                      <button onClick={() => removeFromCart(item.id)} className="rounded-md border border-red-200 px-3 py-2 text-xs font-bold text-red-700">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-black text-slate-950">Order Summary</h2>
              {[
                ['Sub Total', subtotal],
                ['Delivery Charges', deliveryCharges],
                ['Platform Fee', platformFee],
                ['Coupon Discount', -discount],
              ].map(([label, value]) => (
                <div key={label} className="mb-2 flex justify-between text-sm text-slate-600">
                  <span>{label}</span>
                  <b className="text-slate-900">Rs {Number(value).toLocaleString()}</b>
                </div>
              ))}
              <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-lg font-black">
                <span>Total</span>
                <span className="text-emerald-700">Rs {total.toLocaleString()}</span>
              </div>
              <button onClick={() => navigate('/checkout')} className="mt-5 w-full rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-black text-white">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
