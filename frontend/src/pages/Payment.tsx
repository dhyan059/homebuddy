import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CreditCard, ShieldCheck, Wallet, Landmark, Banknote, Smartphone } from "lucide-react";
import { useCart } from "../CartContext";
import { Modal } from "../components/Modal";

const banks = [
  "State Bank of India (SBI)",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank"
];

export default function Payment() {
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const navigate = useNavigate();

  const { cart, subtotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [errorMessage, setErrorMessage] = useState("");

  // Input states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("");


  // Modal States
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [upiTimer, setUpiTimer] = useState(60);
  const [upiTxnId, setUpiTxnId] = useState("");

  // UPI Storage Listener for cross-tab success
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `upi_txn_${upiTxnId}` && e.newValue === 'success') {
         setUpiModalOpen(false);
         clearCart();
         navigate(`/payment-status?status=success&date=${encodeURIComponent(date || '')}&time=${encodeURIComponent(time || '')}`);
      }
    };
    
    if (upiModalOpen && upiTxnId) {
       window.addEventListener('storage', handleStorageChange);
    }
    
    return () => {
       window.removeEventListener('storage', handleStorageChange);
    };
  }, [upiModalOpen, upiTxnId, date, time, navigate, clearCart]);

  // NetBanking States
  const [netBankingModalOpen, setNetBankingModalOpen] = useState(false);
  const [nbUsername, setNbUsername] = useState("");
  const [nbPassword, setNbPassword] = useState("");
  const [nbStep, setNbStep] = useState<"login" | "amount" | "otp">("login");

  // UPI Timer side-effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (upiModalOpen && upiTimer > 0) {
      interval = setInterval(() => {
        setUpiTimer((prev) => prev - 1);
      }, 1000);
    } else if (upiModalOpen && upiTimer === 0) {
      setUpiModalOpen(false);
      navigate('/payment-status?status=fail');
    }
    return () => clearInterval(interval);
  }, [upiModalOpen, upiTimer, navigate]);

  if (cart.length === 0 || !date || !time) {
    return (
      <div className="flex-grow flex items-center justify-center p-8 bg-slate-50 min-h-[60vh]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid booking details</h2>
          <p className="text-gray-500 mb-6">Your cart is empty or the schedule details are missing.</p>
          <button onClick={() => navigate('/services')} className="bg-primary text-white font-bold w-full py-4 rounded-xl hover:bg-primary-dark transition-colors">Return to services</button>
        </div>
      </div>
    );
  }

  const handlePayment = () => {
    setErrorMessage("");
    setIsProcessing(true);
    
    // Evaluation Logic
    let isValid = false;

    if (paymentMethod === 'upi') {
      isValid = true;
    } else if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      const isCardValidLength = cleanCard.length === 12;
      const isCvvValidLength = cardCvv.length === 3;
      
      let isDateValid = false;
      const [mm, yy] = cardExpiry.split("/");
      if (mm && yy && mm.length === 2 && yy.length === 2) {
         const month = parseInt(mm, 10);
         const year = parseInt(yy, 10);
         
         // Above March 2026 means Year must be > 26 or Year == 26 and month > 3
         if (month >= 1 && month <= 12) {
            if (year > 26) {
               isDateValid = true;
            } else if (year === 26 && month > 3) {
               isDateValid = true;
            }
         }
      }

      isValid = isCardValidLength && isCvvValidLength && isDateValid;
      if (!isValid) {
        setErrorMessage("Invalid Card! Requires exactly 12 digits, 3-digit CVV, and expiry strictly after 03/26.");
      }
    } else if (paymentMethod === 'netbanking') {
      isValid = selectedBank.length > 0;
      if (!isValid) setErrorMessage("Please select a bank to proceed.");
    } else if (paymentMethod === 'cod') {
      isValid = true;
    }

    setTimeout(() => {
      setIsProcessing(false);
      
      if (!isValid) return; // Wait! Don't route to fail entirely on simple validation mistakes. Give them a chance to fix it.

      // If valid, branch by method
      if (paymentMethod === 'card') {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);
        console.log("Your OTP is: " + newOtp);
        setOtpError("");
        setOtpCode("");
        setOtpModalOpen(true);
      } else if (paymentMethod === 'netbanking') {
        setNbStep("login");
        setNbUsername("");
        setNbPassword("");
        setNetBankingModalOpen(true);
      } else if (paymentMethod === 'upi') {
        const txnId = `TXN${Math.floor(10000000 + Math.random() * 90000000)}`;
        setUpiTxnId(txnId);
        setUpiTimer(60);
        console.log(`[UPI Gateway] OPEN THIS LINK IN A NEW TAB: http://localhost:5173/upi-gateway?amount=${totalAmount}&txnId=${txnId}`);
        setUpiModalOpen(true);
      } else {
        // Direct Success for COD
        clearCart();
        navigate(`/payment-status?status=success&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`);
      }
    }, 1000); // reduced delay for snappier feedback
  };

  const handleVerifyOtp = () => {
    if (otpCode.length < 4) return;
    setIsVerifyingOtp(true);
    setOtpError("");
    setTimeout(() => {
      if (otpCode !== generatedOtp) {
        setOtpError("OTP is invalid");
        setIsVerifyingOtp(false);
        return;
      }
      setIsVerifyingOtp(false);
      setOtpModalOpen(false);
      setNetBankingModalOpen(false);
      clearCart();
      navigate(`/payment-status?status=success&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`);
    }, 2000);
  };

  const handleNbLogin = () => {
    if (!nbUsername || !nbPassword) return;
    setNbStep("amount");
    setTimeout(() => {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      console.log(`[${selectedBank}] Your NetBanking OTP is: ` + newOtp);
      setNbStep("otp");
      setOtpCode("");
    }, 2000);
  };

  const totalAmount = (subtotal * 1.18).toFixed(2);

  return (
    <div className="flex-grow bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Payment Options */}
        <div className="flex-1">
          <h1 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-2">
            Secure Checkout
          </h1>
          <p className="text-gray-500 mb-8 font-medium">Choose your preferred payment method below.</p>

          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-2 sm:p-4 mb-6">
            <div className="space-y-2">
            
            {/* Option 1 */}
            <label className={`block p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'upi' ? 'border-purple-500 bg-purple-50/30' : 'border-transparent hover:bg-gray-50'}`}>
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => {setPaymentMethod('upi'); setErrorMessage("");}} className="w-5 h-5 text-purple-600 focus:ring-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 font-bold text-lg text-gray-900">
                      <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Wallet className="h-5 w-5" /></div> UPI
                    </div>
                    <div className="flex gap-1 items-center">
                      <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-100 px-1 rounded">GPAY</span>
                      <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-100 px-1 rounded">PAYTM</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Pay securely using standard UPI gateway.</p>
                </div>
              </div>
            </label>

            {/* Option 2 */}
            <label className={`block p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50/30' : 'border-transparent hover:bg-gray-50'}`}>
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => {setPaymentMethod('card'); setErrorMessage("");}} className="w-5 h-5 text-blue-600 focus:ring-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-3 font-bold text-lg text-gray-900">
                       <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><CreditCard className="h-5 w-5" /></div> Credit / Debit Card
                     </div>
                     <div className="flex gap-1">
                        <div className="w-8 h-5 bg-gray-200 rounded text-[8px] font-black italic flex items-center justify-center text-white bg-blue-800">VISA</div>
                        <div className="w-8 h-5 bg-gray-200 rounded text-[8px] font-bold italic flex items-center justify-center text-red-500">MC</div>
                     </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Supports any Indian debit or credit card.</p>
                </div>
              </div>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${paymentMethod === 'card' ? 'max-h-[500px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>


                 <div className="space-y-4">
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Card Number" 
                        value={cardNumber}
                        maxLength={12}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-gray-50/50 focus:bg-white transition-all font-mono text-lg" 
                      />
                    </div>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        value={cardExpiry}
                        maxLength={5}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) val = val.slice(0,2) + '/' + val.slice(2);
                          setCardExpiry(val);
                        }}
                        className="w-1/2 px-4 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-gray-50/50 focus:bg-white transition-all font-mono" 
                      />
                      <input 
                        type="password" 
                        placeholder="CVV" 
                        value={cardCvv}
                        maxLength={3}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-1/2 px-4 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-gray-50/50 focus:bg-white transition-all font-mono" 
                      />
                    </div>
                  </div>
              </div>
            </label>

            {/* Option 3 */}
            <label className={`block p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'netbanking' ? 'border-indigo-500 bg-indigo-50/30' : 'border-transparent hover:bg-gray-50'}`}>
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={() => {setPaymentMethod('netbanking'); setErrorMessage("");}} className="w-5 h-5 text-indigo-600 focus:ring-indigo-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 font-bold text-lg text-gray-900">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Landmark className="h-5 w-5" /></div> Net Banking
                  </div>
                  <p className="text-sm text-gray-500 mt-2">All major Indian banks securely supported.</p>
                </div>
              </div>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${paymentMethod === 'netbanking' ? 'max-h-[200px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="space-y-3">
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none bg-white font-bold text-gray-700 transition-all cursor-pointer shadow-sm"
                    >
                      <option value="">Select your Bank</option>
                      {banks.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                  </div>
              </div>
            </label>

             {/* Option 4 */}
             <label className={`block p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-gray-50'}`}>
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => {setPaymentMethod('cod'); setErrorMessage("");}} className="w-5 h-5 text-primary focus:ring-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 font-bold text-lg text-gray-900">
                    <div className="bg-green-100 p-2 rounded-lg text-green-600"><Banknote className="h-5 w-5" /></div> Pay After Service (COD)
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Pay securely with Cash or Scanner after the work is successfully completed.</p>
                </div>
              </div>
            </label>
            </div>
          </div>

          {/* Secure Badges Overlay below payment methods */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="flex items-center gap-2 font-bold text-gray-500 tracking-tight"><ShieldCheck className="h-6 w-6"/> PCI DSS Compliant</div>
              <div className="flex items-center gap-2 font-bold text-gray-500 tracking-tight"><div className="font-extrabold italic border-2 border-gray-500 px-2 rounded-md">SSL</div> 256-bit Encryption</div>
              <div className="font-bold text-gray-500 tracking-tight">100% Safe Payments</div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden sticky top-24 transform transition-all hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] duration-500">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Order Summary</h2>
            </div>
            <div className="px-6 py-4">
               <div className="space-y-4 border-b border-gray-100 pb-6 mb-6">
                 {cart.map(item => (
                   <div key={item.serviceId} className="flex justify-between items-start group">
                      <div>
                        <div className="font-bold text-gray-900 text-[15px] group-hover:text-primary transition-colors">{item.name}</div>
                        <div className="text-xs text-gray-400 font-medium tracking-wide uppercase mt-1">1 Service</div>
                      </div>
                      <span className="font-black text-gray-900 tracking-tight">₹{item.price}</span>
                   </div>
                 ))}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[15px]">
                  <span className="text-gray-500 font-medium">Item Total</span>
                  <span className="font-bold text-gray-800">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[15px]">
                  <span className="text-gray-500 font-medium">Platform Fee</span>
                  <span className="font-bold text-gray-800 line-through text-gray-400">₹29</span> <span className="font-bold text-green-600 ml-[-50px]">FREE</span>
                </div>
                <div className="flex justify-between text-[15px]">
                  <span className="text-gray-500 font-medium flex items-center gap-1 hover:text-gray-700 cursor-pointer">
                    Taxes <span className="border border-gray-300 text-[9px] rounded-full w-3 h-3 flex items-center justify-center font-bold pb-0.5">i</span>
                  </span>
                  <span className="font-bold text-gray-800">₹{(subtotal * 0.18).toFixed(2)}</span>
                </div>
              </div>
              


            </div>
            
            {/* Split Totals like real apps */}
            <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500 font-medium mb-1">To Pay</div>
                <div className="font-black text-3xl tracking-tight text-gray-900">₹{totalAmount}</div>
              </div>
            </div>
            
            <div className="p-6 pt-2 bg-white">
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-100 animate-in fade-in">
                  {errorMessage}
                </div>
              )}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full relative overflow-hidden flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-lg transition-all focus:ring-4 outline-none ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : paymentMethod === 'card' ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 focus:ring-blue-500/30' : paymentMethod === 'netbanking' ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg focus:ring-indigo-500/30' : paymentMethod === 'upi' ? 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg focus:ring-purple-500/30' : 'bg-green-600 hover:bg-green-700 hover:shadow-lg focus:ring-green-500/30'}`}
              >
                {isProcessing ? 'Processing SECURELY...' : paymentMethod === 'cod' ? 'Place Booking' : `PAY ₹${totalAmount}`}
                {!isProcessing && <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                 <ShieldCheck className="h-3 w-3" />
                 Encrypted transaction
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-yellow-50 rounded-xl p-4 border border-yellow-100">
             <div className="font-bold text-yellow-800 text-sm mb-1">Scheduled for:</div>
             <div className="text-yellow-700 text-sm font-medium">{date} at {time}</div>
          </div>
        </div>

      </div>

      {/* OTP Verification Modal */}
      <Modal isOpen={otpModalOpen} onClose={() => setOtpModalOpen(false)} title="Security Verification">
        <div className="flex flex-col items-center text-center p-4">
          <div className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mb-6">
            <Smartphone className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-xl text-gray-900 mb-2">Enter OTP</h3>
          <p className="text-gray-500 text-sm mb-6">We've sent a secure One Time Password to your registered mobile number ending in ****210.</p>
          
          <input 
            type="text" 
            maxLength={6}
            value={otpCode}
            onChange={(e) => {
              setOtpCode(e.target.value.replace(/\D/g, ''));
              setOtpError("");
            }} // Numeric only
            placeholder="• • • • • •" 
            className={`w-full max-w-[200px] text-center tracking-widest text-2xl font-black px-4 py-3 rounded-lg border ${otpError ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-primary focus:ring-primary/20'} focus:ring-2 outline-none mb-4`} 
          />
          {otpError && <p className="text-red-500 text-sm font-bold mb-4">{otpError}</p>}
          
          <button
            onClick={handleVerifyOtp}
            disabled={otpCode.length < 4 || isVerifyingOtp}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md text-white text-lg ${
              (otpCode.length < 4 || isVerifyingOtp) ? 'bg-primary/60 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark hover:shadow-lg'
            }`}
          >
            {isVerifyingOtp ? 'Verifying...' : 'Verify & Pay'}
          </button>
          
          <p 
            className="text-primary font-bold text-sm mt-6 cursor-pointer hover:underline"
            onClick={() => {
              const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
              setGeneratedOtp(newOtp);
              console.log("Your new OTP is: " + newOtp);
              setOtpError("");
              setOtpCode("");
            }}
          >
            Resend OTP
          </p>
        </div>
      </Modal>

      {/* UPI Intent Modal */}
      <Modal isOpen={upiModalOpen} onClose={() => setUpiModalOpen(false)} title="Complete UPI Payment">
         <div className="flex flex-col items-center text-center p-4">
             <div className="w-20 h-20 relative flex items-center justify-center mb-6">
               {/* Animated Timer Border Visualization */}
               <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" 
                    stroke="#6d28d9" strokeWidth="6" 
                    strokeDasharray="283" 
                    strokeDashoffset={283 - (283 * (upiTimer / 60))}
                    className="transition-all duration-1000 ease-linear"
                  />
               </svg>
               <span className="absolute font-black text-2xl text-gray-800">{upiTimer}s</span>
             </div>

             <h3 className="font-bold text-xl text-gray-900 mb-2">Awaiting Payment</h3>
             <p className="text-gray-500 text-sm mb-4 px-4">
               A payment request of <strong>₹{totalAmount}</strong> has been generated! Check your console for the payment link and open it.
             </p>
             
             <div className="w-full mt-4 flex items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100">
               <div className="flex gap-3 items-center text-primary">
                 <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                 <span className="font-bold text-sm">Waiting for you to complete payment on the gateway...</span>
               </div>
             </div>
         </div>
      </Modal>

      {/* NetBanking Modal */}
      <Modal isOpen={netBankingModalOpen} onClose={() => setNetBankingModalOpen(false)} title={`${selectedBank} Secure Login`}>
        <div className="p-4 flex flex-col items-center text-center">
          <div className="bg-indigo-100 text-indigo-700 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Landmark className="h-8 w-8" />
          </div>

          {nbStep === "login" && (
            <div className="w-full space-y-4 animate-in fade-in">
              <h3 className="font-bold text-xl text-gray-900 mb-2">Login to NetBanking</h3>
              <input 
                type="text" 
                placeholder="User ID / Customer ID" 
                value={nbUsername}
                onChange={(e) => setNbUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none" 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={nbPassword}
                onChange={(e) => setNbPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none" 
              />
              <button
                onClick={handleNbLogin}
                disabled={!nbUsername || !nbPassword}
                className={`w-full py-3 mt-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md text-white text-lg ${
                  !nbUsername || !nbPassword ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                }`}
              >
                Login Securely
              </button>
            </div>
          )}

          {nbStep === "amount" && (
            <div className="w-full animate-in fade-in zoom-in duration-500">
               <div className="my-8">
                 <h2 className="text-3xl font-black text-green-600 mb-2">Login Successful!</h2>
                 <p className="text-gray-600 font-medium">Authorizing payment of</p>
                 <p className="text-4xl font-black text-gray-900 mt-2">₹{totalAmount}</p>
                 <p className="text-sm text-gray-500 mt-4 animate-pulse">Generating OTP securely in console...</p>
               </div>
            </div>
          )}

          {nbStep === "otp" && (
            <div className="w-full animate-in fade-in slide-in-from-right-4">
              <h3 className="font-bold text-xl text-gray-900 mb-2">Authorize Transaction</h3>
              <p className="text-gray-500 text-sm mb-6">Enter the OTP from your console output to confirm payment of ₹{totalAmount}</p>
              
              <input 
                type="text" 
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •" 
                className={`w-full max-w-[200px] mx-auto block text-center tracking-widest text-2xl font-black px-4 py-3 rounded-lg border ${otpError ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20'} focus:ring-2 outline-none mb-4`} 
              />
              {otpError && <p className="text-red-500 text-sm font-bold mb-4">{otpError}</p>}
              
              <button
                onClick={handleVerifyOtp}
                disabled={otpCode.length < 4 || isVerifyingOtp}
                className={`w-full py-4 mt-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md text-white text-lg ${
                  (otpCode.length < 4 || isVerifyingOtp) ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                }`}
              >
                {isVerifyingOtp ? 'Verifying...' : 'Pay ₹' + totalAmount}
              </button>
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
}
