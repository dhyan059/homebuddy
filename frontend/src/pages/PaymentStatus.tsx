import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Send, X } from "lucide-react";
import { Modal } from "../components/Modal";
import { Timeline } from "../components/Timeline";

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const navigate = useNavigate();
  
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: 'pro', text: 'Hi! I will be there on time for your service.' }
  ]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatHistory([...chatHistory, { sender: 'user', text: chatMessage }]);
    setChatMessage("");
  };

  const isSuccess = status === "success";

  return (
    <div className="flex-grow flex items-center justify-center p-4 bg-slate-50 min-h-[calc(100vh-200px)]">
      <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.08)] max-w-lg w-full relative overflow-hidden">
        
        {/* Receipt Header Pattern */}
        <div className={`h-4 w-full ${isSuccess ? 'bg-green-500' : 'bg-red-500'} flex`}>
           {[...Array(20)].map((_, i) => (
              <div key={i} className="flex-1 h-full bg-white/20 rounded-b-full"></div>
           ))}
        </div>

        <div className="p-8 md:p-10 text-center border-b border-dashed border-gray-200">
          <div className="flex justify-center mb-6">
            {isSuccess ? (
              <div className="relative">
                 <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-60 scale-150" />
                 <div className="bg-green-500 rounded-full p-4 relative z-10 shadow-xl shadow-green-500/30">
                   <CheckCircle2 className="h-12 w-12 text-white" />
                 </div>
              </div>
            ) : (
              <div className="bg-red-50 text-red-500 rounded-full p-4 relative z-10 shadow-xl shadow-red-500/10">
                 <XCircle className="h-12 w-12" />
              </div>
            )}
          </div>

          <h1 className={`text-2xl font-black tracking-tight mb-2 ${isSuccess ? 'text-gray-900' : 'text-gray-900'}`}>
            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </h1>
          
          <p className="text-gray-500 font-medium text-[15px]">
            {isSuccess 
              ? 'Your booking is confirmed. A professional will be assigned to you shortly.' 
              : 'We could not process your payment at this time. Please try another payment method.'}
          </p>
        </div>

        {isSuccess && (
          <div className="px-8 py-6 bg-gray-50/50">
             <div className="flex justify-between items-center mb-4 text-sm">
                <span className="text-gray-500 font-medium">Transaction ID</span>
                <span className="font-bold font-mono text-gray-800">TXN{Math.floor(Math.random() * 900000000) + 100000000}</span>
             </div>
             <div className="flex justify-between items-center mb-4 text-sm">
                <span className="text-gray-500 font-medium">Date & Time</span>
                <span className="font-bold text-gray-800">{date || 'Today'} • {time || 'Now'}</span>
             </div>
             <div className="flex justify-between items-center mb-4 text-sm">
                <span className="text-gray-500 font-medium">Amount Paid</span>
                <span className="font-black text-lg text-gray-900">₹854.00</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Payment Mode</span>
                <span className="font-bold text-gray-800 uppercase">Secure Gateway</span>
             </div>
          </div>
        )}

        <div className="p-8 space-y-4">
          {isSuccess ? (
            <>
              <button 
                onClick={() => setTrackingModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold bg-gray-900 text-white shadow-md hover:shadow-lg hover:bg-gray-800 transition-all font-medium text-lg"
              >
                Track Live Order <ArrowRight className="h-5 w-5" />
              </button>
              <Link to="/profile" className="w-full flex justify-center items-center py-4 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm">
                View Orders
              </Link>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate(-1)}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold bg-gray-900 text-white shadow-md hover:bg-gray-800 transition-all"
              >
                <RotateCcw className="h-5 w-5" /> Try Again
              </button>
            </>
          )}
        </div>

        {/* Receipt Bottom Cutout Pattern */}
        <div className="h-3 w-full bg-slate-50 flex items-end">
           {[...Array(20)].map((_, i) => (
              <div key={i} className="flex-1 h-3 bg-white rounded-t-full relative -bottom-1"></div>
           ))}
        </div>
      </div>
      
      {/* Tracking Modal Component */}
      <Modal isOpen={trackingModalOpen} onClose={() => setTrackingModalOpen(false)} title="Live Order Tracking" maxWidth="max-w-2xl">
         {/* Live CSS Map Mockup Graphic injected here since it's "Assigned" or "In Progress" */}
         <div className="w-full h-48 bg-[#e8eaed] rounded-xl mb-6 relative overflow-hidden flex items-center justify-center border border-gray-200">
             {/* Map Grid Pattern */}
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#9ca3af 2px, transparent 2px), linear-gradient(90deg, #9ca3af 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
             {/* Route Line */}
             <svg className="absolute w-full h-full opacity-60 z-0" preserveAspectRatio="none">
                 <path d="M 50 150 C 150 150, 200 50, 350 80 S 500 150, 600 100" fill="transparent" stroke="#3b82f6" strokeWidth="8" strokeDasharray="12 12" className="animate-[dash_1s_linear_infinite]" />
             </svg>
             {/* Map Pins */}
             <div className="absolute left-[10%] top-[70%] text-gray-800 flex flex-col items-center">
                 <div className="bg-white px-2 py-0.5 rounded shadow text-[10px] font-bold mb-1">PRO</div>
                 <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-bounce"></div>
             </div>
             <div className="absolute right-[20%] top-[40%] text-gray-800 flex flex-col items-center">
                 <div className="bg-white px-2 py-0.5 rounded shadow text-[10px] font-bold mb-1">HOME</div>
                 <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-green-500/30">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                 </div>
             </div>
             {/* Overlay info box */}
             <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center z-10">
                 <div>
                    <div className="font-extrabold text-blue-800 text-sm">Booking Confirmed</div>
                    <div className="text-[10px] font-medium text-gray-500 mt-0.5">Share OTP on arrival</div>
                 </div>
                 <div className="bg-yellow-100 border border-yellow-200 px-3 py-1.5 rounded flex flex-col items-center">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-yellow-800 leading-none">Share OTP</span>
                    <span className="font-black text-yellow-900 tracking-widest text-lg leading-none mt-1">4021</span>
                 </div>
             </div>
         </div>

         <div className="flex gap-6 relative">
            <div className="w-1/2 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
              <Timeline currentStage="OnTheWay" />
            </div>

             <div className="w-1/2">
                {showChat ? (
                   <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[300px]">
                      <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                         <div className="font-bold flex items-center gap-2 text-gray-900">
                           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                           Mohammad
                         </div>
                         <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
                         {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                               <div className={`px-3 py-2 rounded-xl text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                 {msg.text}
                               </div>
                            </div>
                         ))}
                      </div>
                      <div className="flex gap-2 relative">
                         <input 
                           type="text" 
                           placeholder="Type a message..."
                           value={chatMessage}
                           onChange={e => setChatMessage(e.target.value)}
                           onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                           className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 text-sm"
                         />
                         <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"><Send className="w-4 h-4" /></button>
                      </div>
                   </div>
                ) : (
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm sticky top-0">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-md text-xs uppercase tracking-wide">Pro Assigned</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative">
                       <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Professional" className="w-16 h-16 rounded-full object-cover border-2 border-gray-100" />
                       <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-lg">Mohammad Ali</h4>
                      <div className="flex items-center gap-1 mt-0.5 text-sm">
                         <span className="text-yellow-500">★</span>
                         <span className="font-bold text-gray-800">4.92</span>
                         <span className="text-gray-400 font-medium">(1.2k jobs)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 text-sm text-gray-600 mb-6 font-medium">
                     <span className="bg-gray-100 px-2.5 py-1 rounded-full">Plumber</span>
                     <span className="bg-gray-100 px-2.5 py-1 rounded-full">Vaccinated</span>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2">
                       Call
                    </button>
                    <button onClick={() => setShowChat(true)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2">
                       Chat
                    </button>
                  </div>
                </div>
                )}
             </div>
         </div>
      </Modal>
    </div>
  );
}
