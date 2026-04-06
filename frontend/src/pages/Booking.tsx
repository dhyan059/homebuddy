import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stepper } from "../components/Stepper";
import { CartItemCard } from "../components/CartItemCard";
import { DatePicker } from "../components/DatePicker";
import { useCart } from "../CartContext";
import { ArrowRight, ArrowLeft, MapPin, Calendar as CalendarIcon, Clock, ShoppingBag, Plus } from "lucide-react";
import { Modal } from "../components/Modal";

export default function Booking() {
  const { cart, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Cart", "Schedule", "Address", "Summary"];

  // Booking details state
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  
  // Custom Address Logic
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newFlat, setNewFlat] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("Gurgaon");
  const [newState, setNewState] = useState("");
  const [newPincode, setNewPincode] = useState("");
  const [newType, setNewType] = useState<"Home" | "Office" | "Other">("Home");

  if (cart.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 bg-slate-50 min-h-[60vh]">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-sm border border-gray-100">
          <div className="bg-gray-50 flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Please add some services to your cart before proceeding to checkout.</p>
          <button onClick={() => navigate('/services')} className="bg-primary text-white font-bold w-full py-4 rounded-xl hover:bg-primary-dark transition-colors">
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  const isNewUser = localStorage.getItem("isNewUser") === "true";
  const [addresses, setAddresses] = useState(isNewUser ? [] : [
    { id: 1, type: "Home", name: "Demo User", address: "Flat 4B, Signature Towers, MG Road, Gurgaon, 122002" },
    { id: 2, type: "Office", name: "Demo User", address: "Floor 3, Tech Park, Cyber City, Gurgaon, 122008" }
  ]);

  const handleSaveAddress = () => {
     if (!newFlat.trim() || !newStreet.trim() || !newCity.trim() || !newState.trim() || !newPincode.trim()) return;
     const newId = Date.now();
     setAddresses([
       { id: newId, type: newType, name: "Demo User", address: `${newFlat}, ${newStreet}, ${newCity}, ${newState} - ${newPincode}` },
       ...addresses
     ]);
     setSelectedAddress(newId);
     setAddModalOpen(false);
     setNewFlat("");
     setNewStreet("");
     setNewCity("Gurgaon");
     setNewState("");
     setNewPincode("");
     setNewType("Home");
  };

  const handleNext = () => {
    if (currentStep === 1 && (!selectedDate || !selectedSlot)) return;
    if (currentStep === 2 && selectedAddress === null) return;
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      // Final step: Proceed to payment
      const addrDetails = addresses.find(a => a.id === selectedAddress)?.address || '';
      navigate(`/payment?date=${selectedDate}&time=${selectedSlot}&address=${encodeURIComponent(addrDetails)}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    } else {
      navigate('/services');
    }
  };

  return (
    <div className="flex-grow bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto mb-16 px-4 sm:px-8">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1">
          
          {/* STEP 0: CART */}
          {currentStep === 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">{totalItems} {totalItems === 1 ? 'Item' : 'Items'}</span>
              </div>
              <div className="space-y-4">
                {cart.map(service => (
                  <CartItemCard key={service.serviceId} service={service} />
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: SCHEDULE */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
               <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <CalendarIcon className="h-6 w-6 text-primary" /> Pick a Schedule
               </h1>
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                  <DatePicker onSelect={(date, slot) => {
                    setSelectedDate(date);
                    setSelectedSlot(slot);
                  }} />
               </div>
            </div>
          )}

          {/* STEP 2: ADDRESS */}
          {currentStep === 2 && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <MapPin className="h-6 w-6 text-primary" /> Service Location
               </h1>

               {/* Interactive OpenStreetMap iframe */}
               <div className="w-full h-80 bg-gray-200 rounded-2xl mb-8 relative overflow-hidden border border-gray-300 shadow-inner group">
                  <iframe 
                    title="Real Location Map"
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="yes" 
                    src={`https://maps.google.com/maps?&hl=en&q=${encodeURIComponent(addresses.find(a => a.id === selectedAddress)?.address || 'Gurgaon, India')}&t=&z=14&ie=UTF8&iwloc=B&output=embed`} 
                    style={{ border: 0 }}
                  ></iframe>
               </div>

               <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-800">Saved Addresses</h3>
                <button 
                  onClick={() => setAddModalOpen(true)}
                  className="bg-primary/10 text-primary font-bold px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2 text-sm"
                >
                  <Plus className="h-4 w-4" /> Add Coordinates
                </button>
               </div>

               <div className="space-y-4 mb-6">
                 {addresses.length === 0 ? (
                   <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100 text-gray-500">
                     No saved addresses. Please add an address to continue.
                   </div>
                 ) : (
                   addresses.map((addr) => (
                     <label key={addr.id} className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                       <div className="mt-1">
                          <input type="radio" name="address" checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="w-5 h-5 text-primary" />
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-0.5 rounded uppercase">{addr.type}</span>
                             <span className="font-bold text-gray-900">{addr.name}</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{addr.address}</p>
                       </div>
                     </label>
                   ))
                 )}
               </div>
             </div>
          )}

          {/* STEP 3: SUMMARY */}
          {currentStep === 3 && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
               <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 Checkout Summary
               </h1>

               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                  <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                     <div className="bg-primary/10 p-3 rounded-lg"><Clock className="h-6 w-6 text-primary" /></div>
                     <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase">Schedule</h3>
                        <p className="font-bold text-gray-900">{selectedDate} • {selectedSlot}</p>
                     </div>
                  </div>
                  <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                     <div className="bg-primary/10 p-3 rounded-lg"><MapPin className="h-6 w-6 text-primary" /></div>
                     <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase">Service Location</h3>
                        <p className="font-bold text-gray-900">{addresses.find(a => a.id === selectedAddress)?.type}</p>
                        <p className="text-sm text-gray-600 truncate max-w-sm">{addresses.find(a => a.id === selectedAddress)?.address}</p>
                     </div>
                  </div>
                  <div className="p-6 bg-gray-50">
                     <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Cart Items ({totalItems})</h3>
                     <div className="space-y-3">
                       {cart.map(service => (
                         <CartItemCard key={service.serviceId} service={service} />
                       ))}
                     </div>
                  </div>
               </div>
             </div>
          )}

        </div>

        {/* Floating Sidebar Actions */}
        <div className="w-full lg:w-80 flex-shrink-0">
           <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-lg border-b border-gray-100 pb-4 mb-4">Pricing Details</h3>
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-500">Service total ({totalItems} items)</span>
                <span className="font-bold text-gray-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between py-2 text-sm border-b border-gray-100 pb-4">
                <span className="text-gray-500">Taxes & Fees (18% GST)</span>
                <span className="font-bold text-gray-800">₹{(subtotal * 0.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-4 text-lg font-black text-gray-900">
                <span>Total Amount</span>
                <span>₹{(subtotal * 1.18).toFixed(2)}</span>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <button 
                  onClick={handleNext}
                  disabled={(currentStep === 1 && (!selectedDate || !selectedSlot)) || (currentStep === 2 && selectedAddress === null)}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all focus:ring-4 focus:ring-primary/20 ${
                    ((currentStep === 1 && (!selectedDate || !selectedSlot)) || (currentStep === 2 && selectedAddress === null)) 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg'
                  }`}
                >
                  {currentStep === steps.length - 1 ? 'Proceed to Payment' : 'Continue'} <ArrowRight className="h-5 w-5" />
                </button>
                
                {currentStep > 0 && (
                  <button 
                    onClick={handleBack}
                    className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" /> Back
                  </button>
                )}
              </div>
           </div>
        </div>

      </div>

      {/* Add Address Modal Component */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add New Address">
         <div className="space-y-4">
            {/* Interactive Map Mockup */}
            <div className="w-full h-48 bg-gray-100 rounded-xl relative overflow-hidden border border-gray-300 group cursor-crosshair">
               <iframe 
                 title="Drag Map"
                 width="100%" 
                 height="100%" 
                 frameBorder="0" 
                 scrolling="yes" 
                 src={`https://maps.google.com/maps?&hl=en&q=${encodeURIComponent((newStreet ? newStreet + ', ' : '') + (newCity || 'Gurgaon') + ', India')}&t=&z=14&ie=UTF8&iwloc=B&output=embed`} 
                 style={{ border: 0, opacity: 0.95 }}
                 className="transition-opacity"
               ></iframe>
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="bg-primary text-white p-1.5 rounded-full shadow-2xl relative -top-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)]">
                    <MapPin className="w-6 h-6 fill-primary" />
                 </div>
               </div>
               <div className="absolute top-1/2 left-1/2 -mt-1 -ml-1 w-2 h-2 bg-black/30 rounded-full blur-[2px] pointer-events-none"></div>
               <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 flex justify-between items-center shadow-sm pointer-events-none">
                  <span>GPS Location Mode</span>
                  <span className="text-primary truncate max-w-[150px]">{newCity || 'Location'}</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div className="col-span-2">
                 <label className="block text-sm font-bold text-gray-700 mb-1">Flat / House No. / Building</label>
                 <input 
                   type="text" 
                   placeholder="e.g. Flat 101, B Block" 
                   value={newFlat}
                   onChange={(e) => setNewFlat(e.target.value)}
                   className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                 />
               </div>
               <div className="col-span-2">
                 <label className="block text-sm font-bold text-gray-700 mb-1">Street / Area</label>
                 <input 
                   type="text" 
                   placeholder="e.g. Sector 14, MG Road" 
                   value={newStreet}
                   onChange={(e) => setNewStreet(e.target.value)}
                   className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                 />
               </div>
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                 <input 
                   type="text" 
                   placeholder="e.g. Gurgaon" 
                   value={newCity}
                   onChange={(e) => setNewCity(e.target.value)}
                   className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                 />
               </div>
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1">State</label>
                 <input 
                   type="text" 
                   placeholder="e.g. Haryana" 
                   value={newState}
                   onChange={(e) => setNewState(e.target.value)}
                   className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                 />
               </div>
               <div className="col-span-2">
                 <label className="block text-sm font-bold text-gray-700 mb-1">Pincode</label>
                 <input 
                   type="text" 
                   placeholder="e.g. 122002" 
                   value={newPincode}
                   maxLength={6}
                   onChange={(e) => setNewPincode(e.target.value.replace(/\D/g, ''))}
                   className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                 />
               </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 mt-1">Save Address As</label>
              <div className="flex gap-2">
                {["Home", "Office", "Other"].map(type => (
                  <button 
                    key={type}
                    onClick={() => setNewType(type as any)}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-sm transition-all border ${
                      newType === type ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleSaveAddress}
              disabled={!newFlat.trim() || !newStreet.trim() || !newCity.trim() || !newState.trim() || !newPincode.trim()}
              className={`w-full py-3 mt-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-white text-lg border-2 ${
                !newFlat.trim() || !newStreet.trim() || !newCity.trim() || !newState.trim() || !newPincode.trim() ? 'bg-primary/50 border-transparent cursor-not-allowed text-white/80' : 'bg-primary border-primary hover:bg-primary-dark shadow-md hover:shadow-lg'
              }`}
            >
              Save Address
            </button>
         </div>
      </Modal>

    </div>
  );
}
