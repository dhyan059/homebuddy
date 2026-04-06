import { Clock, ShieldCheck, Tag, Trash2 } from "lucide-react";
import { type Service } from "../utils/data";

interface CartItemCardProps {
  service: Service;
}

export function CartItemCard({ service }: CartItemCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all relative">
       {/* Small remove button */}
       <button className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors group" title="Remove Item">
         <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
       </button>
       
       <div className="bg-gray-50 rounded-xl w-full md:w-32 h-32 flex items-center justify-center border border-gray-100 flex-shrink-0 relative overflow-hidden group">
         {service.image ? (
           <img src={service.image} alt={service.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
         ) : (
           <>
             <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(service.name)}&background=random&size=150`} alt={service.name} className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-sm scale-110" />
             <Tag className="h-10 w-10 text-primary relative z-10" />
           </>
         )}
       </div>
       <div className="flex-1 flex flex-col pr-8">
          <div className="flex justify-between items-start mb-2">
             <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
             <span className="text-xl text-primary font-black">₹{service.price}</span>
          </div>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{service.description}</p>
          <div className="mt-auto flex items-center gap-4 text-sm font-medium text-gray-700">
             <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-md">
                <Clock className="h-4 w-4 text-gray-500" /> {service.duration}
             </span>
             <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-md">
                <ShieldCheck className="h-4 w-4" /> Assured Quality
             </span>
          </div>
       </div>
    </div>
  );
}
