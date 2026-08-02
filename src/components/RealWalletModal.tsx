import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Zap, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface RealWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onBalanceUpdated: (newBalance: number) => void;
}

export const RealWalletModal: React.FC<RealWalletModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  onBalanceUpdated,
}) => {
  if (!isOpen) return null;

  const [selectedPlan, setSelectedPlan] = useState<{ amount: number; credits: number }>({
    amount: 100,
    credits: 100,
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const plans = [
    { amount: 100, credits: 100, label: 'Starter Pack', popular: false },
    { amount: 300, credits: 350, label: 'Pro Creator (+50 Free)', popular: true },
    { amount: 500, credits: 650, label: 'Enterprise (+150 Free)', popular: false },
  ];

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayNow = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay Gateway SDK failed to load. Please check your internet connection.');
      }

      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountInINR: selectedPlan.amount,
          credits: selectedPlan.credits,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to initiate payment order.');
      }

      const options = {
        key: orderData.keyId || 'rzp_test_sampleKey123',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Neural Market AI',
        description: `Wallet Add ${selectedPlan.credits} Credits`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              creditsToAdd: selectedPlan.credits,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            const updated = currentBalance + selectedPlan.credits;
            onBalanceUpdated(updated);
            setSuccessMsg(`Payment Successful! Added ${selectedPlan.credits} credits to your Wallet.`);
            setTimeout(() => {
              onClose();
              setSuccessMsg(null);
            }, 2000);
          } else {
            setErrorMsg('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'AI User',
          email: 'user@neuralmarket.ai',
          contact: '9999999999',
        },
        theme: {
          color: '#4F46E5',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setErrorMsg(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while opening checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#151517] border border-white/10 rounded-2xl p-6 text-white shadow-2xl space-y-6 font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Recharge Real Wallet</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-[#0A0A0A] border border-indigo-500/30 rounded-xl flex items-center justify-between">
          <span className="text-xs text-slate-400">Current Balance:</span>
          <span className="text-lg font-bold text-emerald-400 flex items-center gap-1">
            <Zap className="w-4 h-4 fill-emerald-400" /> {currentBalance} Credits
          </span>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300">Select Top-Up Amount (INR):</label>
          <div className="space-y-2">
            {plans.map((p) => (
              <div
                key={p.amount}
                onClick={() => setSelectedPlan(p)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedPlan.amount === p.amount
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-[#0A0A0A] border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">₹{p.amount} INR</span>
                    {p.popular && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                        Best Value
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{p.label}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-indigo-300">+{p.credits} Credits</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <button
          onClick={handlePayNow}
          disabled={loading}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <span>Pay ₹{selectedPlan.amount} via UPI / Card</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>
    </div>
  );
};
