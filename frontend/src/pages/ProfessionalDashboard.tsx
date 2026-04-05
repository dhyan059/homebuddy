import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Clock, CalendarCheck, FileText, CheckCircle, MapPin, Star, LogOut } from "lucide-react";
import { StatusBadge, type StatusType } from "../components/StatusBadge";
import { Button } from "../components/Button";

// Dummy Data for Professional Dashboard
const openRequests = [
  {
    id: "REQ-101",
    service: "AC Service & Repair",
    customer: "Amit Kumar",
    location: "Sector 14, Gurgaon",
    time: "Today, 04:00 PM",
    amount: "₹850"
  },
  {
    id: "REQ-102",
    service: "AC Deep Cleaning",
    customer: "Priya Sharma",
    location: "DLF Phase 3, Gurgaon",
    time: "Tomorrow, 10:00 AM",
    amount: "₹1,200"
  }
];

const completedJobs = [
  {
    id: "JOB-091",
    service: "AC Repair",
    customer: "Rahul Verma",
    date: "12 Mar 2026",
    amount: "₹1,500",
    rating: 5,
    status: "Completed" as StatusType
  },
  {
    id: "JOB-088",
    service: "AC Installation",
    customer: "Sneha Gupta",
    date: "10 Mar 2026",
    amount: "₹2,000",
    rating: 4.8,
    status: "Completed" as StatusType
  }
];

export default function ProfessionalDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'requests' | 'history' | 'profile'>('requests');
  const [profName, setProfName] = useState("Demo Professional");
  const [profService, setProfService] = useState("AC Technician");

  useEffect(() => {
    // Check if professional is authenticated
    const isAuth = localStorage.getItem("professionalAuth");
    if (!isAuth) {
      navigate("/professional-login");
    }

    const storedName = localStorage.getItem("professionalName");
    const storedService = localStorage.getItem("professionalService");
    
    if (storedName) setProfName(storedName);
    if (storedService) setProfService(storedService);
    
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("professionalAuth");
    localStorage.removeItem("professionalName");
    localStorage.removeItem("professionalService");
    navigate("/");
  };

  const handleAcceptRequest = (id: string) => {
    alert(`Request ${id} accepted! It will now appear in your active schedule.`);
  };

  return (
    <div className="flex-grow bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden sticky top-24">
            <div className="flex flex-col items-center mb-6 border-b border-gray-100 pb-6">
              <div className="bg-blue-600 text-white w-24 h-24 rounded-full flex items-center justify-center mb-4 overflow-hidden text-3xl font-bold font-mono shadow-md shadow-blue-500/20">
                {profName.charAt(0)}
              </div>
              <h2 className="font-bold text-xl text-gray-900">{profName}</h2>
              <p className="text-primary font-semibold text-sm mt-1 mb-2">{profService}</p>
              <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                4.9 Rating
              </div>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('requests')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${activeTab === 'requests' ? 'font-bold bg-primary/10 text-primary' : 'font-semibold text-gray-600 hover:bg-gray-50'}`}
              >
                <CalendarCheck className="h-5 w-5" /> Open Requests
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${activeTab === 'history' ? 'font-bold bg-primary/10 text-primary' : 'font-semibold text-gray-600 hover:bg-gray-50'}`}
              >
                <FileText className="h-5 w-5" /> Job History
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${activeTab === 'profile' ? 'font-bold bg-primary/10 text-primary' : 'font-semibold text-gray-600 hover:bg-gray-50'}`}
              >
                <Briefcase className="h-5 w-5" /> Profile & Availability
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" /> Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          
          {/* OPEN REQUESTS SECTION */}
          {activeTab === 'requests' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Open Requests</h1>
              <p className="text-gray-500 mb-8">Jobs available in your area based on your skills.</p>
              
              <div className="space-y-4">
                {openRequests.map(req => (
                  <div key={req.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row gap-6 relative overflow-hidden group">
                     {/* Decorative line */}
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 group-hover:bg-primary transition-colors"></div>
                     
                     <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-xl text-gray-900">{req.service}</h3>
                          <span className="font-black text-xl text-gray-800 lg:hidden">{req.amount}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                             <CheckCircle className="h-4 w-4 text-green-500" /> 
                             Customer: <strong>{req.customer}</strong>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                             <MapPin className="h-4 w-4 text-primary" /> 
                             Location: <strong>{req.location}</strong>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                             <Clock className="h-4 w-4 text-orange-500" /> 
                             Time: <strong>{req.time}</strong>
                          </div>
                        </div>
                     </div>
                     
                     <div className="flex-shrink-0 flex flex-row lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 gap-4">
                        <span className="font-black text-2xl text-gray-800 hidden lg:block">{req.amount}</span>
                        <Button 
                          onClick={() => handleAcceptRequest(req.id)}
                          className="w-full lg:w-auto px-8"
                        >
                          Accept Job
                        </Button>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HISTORY SECTION */}
          {activeTab === 'history' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
               <h1 className="text-3xl font-bold text-gray-900 mb-8">Job History</h1>
               
               <div className="space-y-4">
                 {completedJobs.map(job => (
                   <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row gap-6 sm:items-center">
                     <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg text-gray-900">{job.service}</h3>
                          <StatusBadge status={job.status} />
                        </div>
                        <div className="text-sm text-gray-500 mb-2">ID: {job.id} • {job.date}</div>
                        <div className="text-sm text-gray-700">Customer: <span className="font-bold">{job.customer}</span></div>
                     </div>
                     <div className="flex flex-col sm:items-end gap-2 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6">
                        <span className="font-bold text-lg text-gray-800">{job.amount}</span>
                        <div className="flex items-center gap-1 text-sm font-bold text-yellow-600">
                           <Star className="h-4 w-4 fill-yellow-500" /> {job.rating} Rating
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* PROFILE & AVAILABILITY SECTION */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
               <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Details</h1>
               
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                 <h3 className="font-bold text-lg border-b border-gray-100 pb-3 mb-5">Professional Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                   <div>
                     <label className="block text-sm font-bold text-gray-500 mb-1">Full Name</label>
                     <div className="text-gray-900 font-medium">{profName}</div>
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-gray-500 mb-1">Primary Service</label>
                     <div className="text-gray-900 font-medium">{profService}</div>
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-gray-500 mb-1">Experience</label>
                     <div className="text-gray-900 font-medium">5+ Years</div>
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-gray-500 mb-1">Service Area</label>
                     <div className="text-gray-900 font-medium">Gurgaon, Haryana</div>
                   </div>
                 </div>
               </div>

               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                 <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-5">
                   <h3 className="font-bold text-lg">Weekly Availability</h3>
                   <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">Currently Available</span>
                 </div>
                 
                 <div className="space-y-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                      <div key={day} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                        <span className="font-medium text-gray-700 w-28">{day}</span>
                        <div className="bg-gray-100 px-4 py-1.5 rounded-lg text-sm font-medium text-gray-600 flex-grow text-center mx-4">
                          09:00 AM - 06:00 PM
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-2">
                        <span className="font-medium text-gray-700 w-28">Weekend</span>
                        <div className="bg-red-50 text-red-600 px-4 py-1.5 rounded-lg text-sm font-medium flex-grow text-center mx-4">
                          Unavailable
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                 </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
