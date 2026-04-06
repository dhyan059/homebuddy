import { Link, useNavigate } from "react-router-dom";
import { Wrench, User, Calendar, ShoppingCart } from "lucide-react";
import { SearchBar } from "../components/SearchBar";
import { useCart } from "../CartContext";

export function Navbar() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8 flex-1">
            <Link to="/" className="flex flex-shrink-0 items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">HomeBuddy</span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md">
              <SearchBar className="w-full" inputClassName="rounded-full bg-gray-50 hover:bg-gray-100 text-sm focus:bg-white" />
            </div>
          </div>
          
          <div className="flex items-center space-x-6 ml-4">
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/services" className="text-gray-600 hover:text-primary transition-colors text-sm font-medium">
                Services
              </Link>
              <Link to="/services?category=c1" className="text-gray-600 hover:text-secondary transition-colors text-sm font-medium">
                Beauty
              </Link>
            </div>
            
            <div className="flex items-center space-x-4 md:border-l md:border-gray-100 md:pl-6">
              <button 
                onClick={() => {
                  if (!localStorage.getItem("userName")) {
                    alert("to continue the process please login to the website.");
                    navigate('/login');
                  } else {
                    navigate('/booking');
                  }
                }}
                className="relative text-gray-600 hover:text-primary transition-colors flex items-center bg-transparent border-none p-0 cursor-pointer"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>

              <Link to="/profile" className="text-gray-600 hover:text-primary transition-colors">
                <Calendar className="h-5 w-5" />
              </Link>
              
              <Link to="/login" className="flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full font-medium text-sm hover:bg-primary hover:text-white transition-all ml-2 whitespace-nowrap">
                <User className="h-4 w-4" />
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
