import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { services, categories } from "../utils/data";
import { Star, Clock, ShieldCheck, ArrowRight, ArrowLeft, ShoppingCart } from "lucide-react";
import { useCart } from "../CartContext";

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const [errorMsg, setErrorMsg] = useState("");

  const service = services.find(s => s.serviceId === id);

  if (!service) {
    return (
      <div className="flex-grow flex items-center justify-center p-8 bg-slate-50 min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Service not found</h2>
          <button onClick={() => navigate('/services')} className="text-primary font-bold hover:underline">Return to services</button>
        </div>
      </div>
    );
  }

  const category = categories.find(c => c.id === service.categoryId);
  const isAdded = cart.some(item => item.serviceId === service.serviceId);

  return (
    <div className="flex-grow bg-slate-50 min-h-screen pb-16">
      {/* Hero Section */}
      <div className="bg-primary text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-[40vh] flex items-center">
        {service.image && (
          <div className="absolute inset-0 w-full h-full">
            <img src={service.image} alt={service.name} className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
          </div>
        )}
        {!service.image && (
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        )}
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-8 items-center">
           <div className="flex-1">
             <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary-200 hover:text-white mb-6 transition-colors">
               <ArrowLeft className="h-4 w-4" /> Back
             </button>
             {category && <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 inline-block">{category.name}</span>}
             <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{service.name}</h1>
             <div className="flex items-center gap-4 text-primary-100">
               <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
                  <Star className="h-4 w-4 fill-current" /> {service.rating}
               </div>
               <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {service.duration}</span>
             </div>
           </div>
           
           <div className="w-full md:w-96 bg-white rounded-2xl shadow-xl p-6 text-gray-900 border border-gray-100">
              <h3 className="font-bold text-lg mb-4 text-center border-b border-gray-100 pb-4">Booking Summary</h3>
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500">Price</span>
                <span className="text-3xl font-black text-primary">₹{service.price}</span>
              </div>
              <ul className="mb-6 space-y-3">
                 <li className="flex items-start gap-2 text-sm text-gray-600"><ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0" /> Verified Professionals</li>
                 <li className="flex items-start gap-2 text-sm text-gray-600"><ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0" /> 30-Day Service Guarantee</li>
              </ul>
              <button 
                onClick={() => {
                  if (!localStorage.getItem("userName")) {
                    setErrorMsg("To continue the process please login to the website.");
                    setTimeout(() => navigate('/login'), 2000);
                    return;
                  }
                  isAdded ? navigate('/booking') : addToCart(service);
                }} 
                className={`w-full py-4 text-center font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-lg flex items-center justify-center gap-2 focus:ring-4 focus:ring-primary/20 ${isAdded ? 'bg-secondary text-white' : 'bg-primary text-white hover:bg-primary-dark'}`}>
                {isAdded ? (
                  <>Proceed to Checkout <ArrowRight className="h-5 w-5" /></>
                ) : (
                  <><ShoppingCart className="h-5 w-5" /> Add to Cart</>
                )}
              </button>
              {errorMsg && <div className="mt-3 text-red-500 text-sm font-bold text-center animate-in fade-in">{errorMsg}</div>}
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl">
           <h2 className="text-2xl font-bold text-gray-900 mb-4">About this service</h2>
           <p className="text-gray-600 text-lg leading-relaxed mb-8">
             {service.description}
           </p>

           <h3 className="text-xl font-bold text-gray-900 mb-4 border-t border-gray-200 pt-8 mt-8">What our customers say</h3>
           <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                   <div className="flex justify-between items-start mb-2">
                     <h4 className="font-bold text-gray-900">Verified User</h4>
                     <div className="flex text-amber-400"><Star className="h-4 w-4 fill-current"/><Star className="h-4 w-4 fill-current"/><Star className="h-4 w-4 fill-current"/><Star className="h-4 w-4 fill-current"/><Star className="h-4 w-4 fill-current"/></div>
                   </div>
                   <p className="text-gray-600 text-sm italic">"Excellent service! The professional was very polite and did a fantastic job solving the issue quickly. Highly recommend!"</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
