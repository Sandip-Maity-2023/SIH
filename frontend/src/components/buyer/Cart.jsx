import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { Trash2, ArrowRight, ShieldCheck, ShoppingBag, Zap } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useContext(CartContext);
  const navigate = useNavigate();
  const deliveryCharges = cartItems.length ? 250 : 0;
  const platformFee = cartItems.length ? 100 : 0;
  const discount = cartItems.length && subtotal > 1000 ? 200 : 0;
  const total = subtotal + deliveryCharges + platformFee - discount;

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-1 text-xs font-black text-amber-500 uppercase tracking-widest">
              <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> Blinkit Quick Checkout
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950">My Direct Produce Basket</h1>
          </div>
          <span className="rounded-full bg-emerald-100 text-emerald-900 font-black text-xs px-3 py-1">
            {cartItems.length} Items Selected
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h2 className="text-lg font-black text-slate-900">Your produce basket is empty</h2>
            <p className="mb-5 text-xs font-semibold text-slate-500">Explore fresh farm listings at direct mandi prices.</p>
            <Link to="/marketplace" className="rounded-xl bg-[#0C831F] hover:bg-emerald-800 px-6 py-3 text-xs font-black text-white shadow-md inline-block">
              Browse Marketplace Items
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-300 transition">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {item.category || 'Produce'}
                      </span>
                      <h3 className="font-black text-slate-900 text-base mt-1">{item.cropName || item.name}</h3>
                      <p className="text-xs text-slate-500">Kisan: {item.farmerId?.name || item.farmer || 'Verified Farmer'}</p>
                      <p className="mt-1 text-sm font-black text-emerald-700">₹{item.pricePerKg} <span className="text-xs text-slate-500 font-normal">/kg</span></p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0">
                      <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1 border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-500 px-2">Qty (kg):</span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                          className="h-8 w-16 rounded-lg border border-slate-300 bg-white px-2 text-center text-xs font-black"
                        />
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block leading-none">Subtotal</span>
                        <span className="text-sm font-black text-slate-900">₹{(item.pricePerKg * item.quantity).toLocaleString()}</span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-base font-black text-slate-950 border-b pb-3 uppercase tracking-wider">Bill Summary</h2>
              <div className="space-y-2 text-xs font-bold text-slate-600">
                <div className="flex justify-between"><span>Produce Subtotal</span><b className="text-slate-900">₹{subtotal.toLocaleString()}</b></div>
                <div className="flex justify-between"><span>Cold-Chain Delivery</span><b className="text-slate-900">₹{deliveryCharges}</b></div>
                <div className="flex justify-between"><span>Platform Escrow Fee</span><b className="text-slate-900">₹{platformFee}</b></div>
                <div className="flex justify-between text-emerald-700"><span>Direct Mandi Discount</span><b>- ₹{discount}</b></div>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-black text-slate-950">
                <span>To Pay</span>
                <span className="text-emerald-700">₹{total.toLocaleString()}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full rounded-xl bg-[#0C831F] hover:bg-emerald-800 py-3 text-xs font-black text-white transition shadow-md flex items-center justify-center gap-2"
              >
                PROCEED TO CHECKOUT <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1 text-center">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" /> Funds protected by Krishi Escrow Guarantee
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
