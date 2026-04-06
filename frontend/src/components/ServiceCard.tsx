import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Clock, ShoppingCart } from "lucide-react";
import { type Service, categories } from "../utils/data";
import { useCart } from "../CartContext";

interface ServiceCardProps {
  service: Service;
  showCategory?: boolean;
}

export function ServiceCard({ service, showCategory = false }: ServiceCardProps) {
  const category = categories.find(c => c.id === service.categoryId);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!localStorage.getItem("userName")) {
      setErrorMsg("To continue the process please login to the website.");
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    addToCart(service);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md hover:border-primary/20 transition-all h-full">
      {service.image && (
        <div className="w-full h-48 overflow-hidden relative group">
          <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/95 backdrop-blur shadow-sm text-green-700 px-2.5 py-1 rounded-lg text-xs font-bold">
            <Star className="h-3.5 w-3.5 fill-current" /> {service.rating}
          </div>
        </div>
      )}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/service/${service.serviceId}`} className="group relative">
            <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">{service.name}</h3>
          </Link>
          {!service.image && (
            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">
              <Star className="h-3 w-3 fill-current" /> {service.rating}
            </div>
          )}
        </div>
        
        {showCategory && category && (
          <div className="text-xs text-primary font-bold mb-4 uppercase tracking-wider">
            {category.name}
          </div>
        )}

        <p className="text-gray-500 text-sm mb-4 line-clamp-3">{service.description}</p>
        
        <div className="flex items-center gap-4 text-sm font-medium text-gray-700 mt-auto pt-4 border-t border-gray-50">
          <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-gray-400" /> {service.duration}</span>
          <span className="bg-gray-100 px-2 py-0.5 rounded font-bold">₹{service.price}</span>
        </div>
      </div>
      <div className="p-4 border-t border-gray-50 bg-gray-50 flex flex-col gap-3">
        {errorMsg && <div className="text-red-500 text-xs font-bold text-center animate-in fade-in">{errorMsg}</div>}
        <div className="flex gap-3">
          <Link to={`/service/${service.serviceId}`} className="flex-1 py-2.5 text-center text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition-colors text-sm">
            Details
          </Link>
          <button onClick={handleAddToCart} className="flex-[2] py-2.5 text-center bg-primary text-white font-bold rounded-lg hover:bg-primary-dark shadow-sm transition-all text-sm flex items-center justify-center gap-1.5 focus:ring-4 focus:ring-primary/20">
            <ShoppingCart className="h-4 w-4" /> Add Custom
          </button>
        </div>
      </div>
    </div>
  );
}
