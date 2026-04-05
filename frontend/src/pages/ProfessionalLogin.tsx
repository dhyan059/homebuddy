import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Briefcase, Mail } from "lucide-react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export default function ProfessionalLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    service: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("professionalAuth", "true");
      if (!isLogin) {
         localStorage.setItem("professionalName", formData.name);
         localStorage.setItem("professionalService", formData.service);
      }
      navigate('/professional-dashboard');
    }, 1500);
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-primary/5 p-8 text-center border-b border-gray-100">
            <div className="mx-auto bg-primary w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">
              {isLogin ? "Professional Portal" : "Join as Professional"}
            </h2>
            <p className="text-gray-500 mt-2 text-sm font-medium">
              {isLogin ? "Log in to manage your bookings and schedule" : "Partner with HomeBuddy and grow your business"}
            </p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      label=""
                      placeholder="Full Name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="pl-12 bg-gray-50 focus:bg-white"
                      containerClassName="!mt-0"
                    />
                  </div>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      label=""
                      placeholder="Primary Service (e.g. Plumbing)"
                      type="text"
                      required
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                      className="pl-12 bg-gray-50 focus:bg-white"
                      containerClassName="!mt-0"
                    />
                  </div>
                </>
              )}
              
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  label=""
                  placeholder="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-12 bg-gray-50 focus:bg-white"
                  containerClassName="!mt-0"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  label=""
                  placeholder="Password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-12 bg-gray-50 focus:bg-white"
                  containerClassName="!mt-0"
                />
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                    <span className="text-sm text-gray-600 font-medium">Remember me</span>
                  </label>
                  <a href="#" className="text-sm font-bold text-primary hover:underline">Forgot password?</a>
                </div>
              )}

              <Button type="submit" fullWidth isLoading={isLoading} className="mt-2 py-3">
                {isLogin ? 'Log In to Dashboard' : 'Create Professional Account'}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-gray-500">
                {isLogin ? "Don't have a professional account? " : "Already a partner? "}
              </span>
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold text-primary hover:underline ml-1"
              >
                {isLogin ? 'Apply Now' : 'Log In'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
