import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Building2 } from "lucide-react";
import { Button } from "../components/Button";

export default function UpiGateway() {
  const [searchParams] = useSearchParams();
  const amount = searchParams.get("amount") || "0.00";
  const txnId = searchParams.get("txnId") || "TXNUNKNOWN";
  
  const [pin, setPin] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePinSubmit = () => {
    if (pin.length < 4) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      // Cross-tab communication to tell Payment.tsx that this transaction succeeded
      localStorage.setItem(`upi_txn_${txnId}`, "success");
    }, 1500);
  };

  const handleKeyPress = (digit: string) => {
    if (pin.length < 6) {
       setPin(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center transform transition-all scale-100 animate-in zoom-in duration-300">
           <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
              <ShieldCheck className="h-10 w-10 text-white" />
           </div>
           <h2 className="text-2xl font-black text-gray-900 mb-2">Payment Successful</h2>
           <p className="text-gray-500 mb-6">₹{amount} paid to HomeBuddy securely.</p>
           
           <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-600 mb-8 font-mono">
              <p>Txn ID: {txnId}</p>
           </div>
           
           <p className="font-bold text-green-700">You may safely close this tab and return to the HomeBuddy application.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col sm:justify-center items-center font-sans">
      <div className="w-full sm:max-w-sm bg-white sm:rounded-3xl shadow-2xl overflow-hidden min-h-screen sm:min-h-0 flex flex-col">
          
          {/* Header */}
          <div className="bg-primary px-4 py-4 flex items-center gap-4 text-white">
             <ArrowLeft className="h-6 w-6 cursor-pointer opacity-80" />
             <div>
                <h1 className="font-bold text-lg leading-tight">Paying HomeBuddy</h1>
                <p className="text-primary-100 text-xs">Verified Merchant</p>
             </div>
          </div>

          {/* Amount Display */}
          <div className="p-8 flex flex-col items-center bg-gray-50 flex-grow relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
             
             <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-md mb-4 z-10 border border-gray-100">
                 <Building2 className="h-8 w-8 text-primary" />
             </div>
             <p className="text-gray-500 text-sm mb-1 z-10">Amount to pay</p>
             <h2 className="text-4xl font-black text-gray-900 z-10 tracking-tight">₹{amount}</h2>
             
             <div className="mt-8 w-full bg-white border border-gray-200 rounded-2xl p-4 z-10">
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Enter 4 or 6 digit UPI PIN</p>
                 <div className="flex justify-center gap-2 mb-2">
                    {[...Array(6)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-4 h-4 rounded-full transition-all ${
                          i < pin.length ? 'bg-black scale-100' : 'bg-gray-200 scale-75'
                        }`}
                      />
                    ))}
                 </div>
             </div>
          </div>

          {/* Keypad */}
          <div className="bg-white p-4 pb-8 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
             <div className="grid grid-cols-3 gap-3">
                 {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button 
                      key={num} 
                      onClick={() => handleKeyPress(num.toString())}
                      className="py-4 text-2xl font-medium text-gray-800 hover:bg-gray-50 rounded-xl active:bg-gray-100 transition-colors"
                    >
                      {num}
                    </button>
                 ))}
                 <button className="py-4 opacity-0 cursor-default"></button>
                 <button 
                    onClick={() => handleKeyPress("0")}
                    className="py-4 text-2xl font-medium text-gray-800 hover:bg-gray-50 rounded-xl active:bg-gray-100 transition-colors"
                 >
                    0
                 </button>
                 <button 
                    onClick={handleBackspace}
                    className="py-4 flex justify-center items-center text-gray-600 hover:bg-gray-50 rounded-xl active:bg-gray-100 transition-colors"
                 >
                    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.16667 18.3333L1.66667 10L9.16667 1.66666H26.6667V18.3333H9.16667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14.1667 6.66666L20.8333 13.3333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20.8333 6.66666L14.1667 13.3333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                 </button>
             </div>
             
             <div className="mt-4 pt-4 border-t border-gray-100">
               <Button 
                  onClick={handlePinSubmit} 
                  fullWidth 
                  isLoading={isProcessing}
                  className="py-4 text-lg font-bold shadow-lg shadow-primary/20"
                  disabled={pin.length < 4}
               >
                  {isProcessing ? 'Processing' : 'Securely Pay'}
               </Button>
             </div>
          </div>
      </div>
    </div>
  );
}
