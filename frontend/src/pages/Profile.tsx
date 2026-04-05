import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, FileText, Settings, Heart, MapPin, Search, Plus, LogOut, CheckCircle } from "lucide-react";
import { StatusBadge, type StatusType } from "../components/StatusBadge";
import { Modal } from "../components/Modal";
import { Timeline, type OrderStage } from "../components/Timeline";
import { services } from "../utils/data";
import { ServiceCard } from "../components/ServiceCard";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

// Mock Active and Past Orders
const activeOrders = [
  {
    id: "ORD-9821-XA",
    service: "AC Service & Repair",
    date: "Today, 03:00 PM",
    amount: "₹824.82",
    professional: "Mohammad Ali (⭐ 4.7)",
    status: "In Progress" as StatusType,
    stage: "InProgress" as OrderStage
  },
  {
    id: "ORD-4421-ZB",
    service: "Intense Home Cleaning",
    date: "Tomorrow, 09:00 AM",
    amount: "₹3538.82",
    professional: "Rahul Sharma (⭐ 4.8)",
    status: "Upcoming" as StatusType,
    stage: "Assigned" as OrderStage
  }
];

const pastOrders = [
  {
    id: "ORD-1120-CC",
    service: "Haircut & Styling",
    date: "12 Mar 2026, 11:00 AM",
    amount: "₹588.82",
    professional: "Anita Verma (⭐ 4.9)",
    status: "Completed" as StatusType
  },
  {
    id: "ORD-5544-DF",
    service: "Leakage Repair",
    date: "05 Feb 2026, 01:00 PM",
    amount: "₹352.82",
    professional: "Rahul Sharma (⭐ 4.8)",
    status: "Cancelled" as StatusType
  }
];

// Mock Initial Addresses
const initialAddresses = [
  {
    id: "1",
    label: "Home",
    houseNum: "4B",
    flatNum: "4B",
    landmark: "Signature Towers",
    street: "MG Road",
    city: "Gurgaon",
    pincode: "122002"
  },
  {
    id: "2",
    label: "Office",
    houseNum: "3",
    flatNum: "Floor 3",
    landmark: "Tech Park",
    street: "Cyber City",
    city: "Gurgaon",
    pincode: "122008"
  }
];

export default function Profile() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'orders' | 'favorites' | 'addresses' | 'settings'>('orders');
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [userName, setUserName] = useState("Demo User");
  const [userAvatar, setUserAvatar] = useState("");

  const [addresses, setAddresses] = useState(initialAddresses);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Address Form State
  const [addrForm, setAddrForm] = useState({
    label: "",
    houseNum: "",
    flatNum: "",
    landmark: "",
    street: "",
    city: "",
    pincode: ""
  });
  const [addrError, setAddrError] = useState("");

  // Settings State
  const [settingsName, setSettingsName] = useState(userName);
  const [settingsEmail, setSettingsEmail] = useState("demo.user@example.com");
  const [settingsPhone, setSettingsPhone] = useState("9876543210");
  const [settingsDOB, setSettingsDOB] = useState("1990-01-01");
  const [settingsGender, setSettingsGender] = useState("male");
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Security State
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerify, setOtpVerify] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ oldPass: '', newPass: '' });
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedAvatar = localStorage.getItem("userAvatar");
    if (storedName) {
      setUserName(storedName);
      setSettingsName(storedName);
    }
    if (storedAvatar) setUserAvatar(storedAvatar);
  }, []);

  // Tracking Modal State
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrderStage, setSelectedOrderStage] = useState<OrderStage>("Requested");
  const [selectedOrderDate, setSelectedOrderDate] = useState<string>("");

  const favoriteServices = services.slice(0, 2);

  const openTracking = (stage: OrderStage, date: string) => {
    setSelectedOrderStage(stage);
    setSelectedOrderDate(date);
    setTrackingModalOpen(true);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrForm.label.trim() || !addrForm.houseNum.trim() || !addrForm.street.trim() || !addrForm.city.trim() || !addrForm.pincode.trim()) {
      setAddrError("All fields are required");
      return;
    }

    if (editingAddressId) {
      setAddresses(prev => prev.map(a => a.id === editingAddressId ? { ...a, ...addrForm } : a));
    } else {
      setAddresses(prev => [...prev, { id: Date.now().toString(), ...addrForm }]);
    }
    setAddressModalOpen(false);
    setAddrForm({ label: "", houseNum: "", flatNum: "", landmark: "", street: "", city: "", pincode: "" });
    setEditingAddressId(null);
  };

  const openAddressModal = (addr?: any) => {
    setAddrError("");
    if (addr) {
      setAddrForm({ ...addr });
      setEditingAddressId(addr.id);
    } else {
      setAddrForm({ label: "", houseNum: "", flatNum: "", landmark: "", street: "", city: "", pincode: "" });
      setEditingAddressId(null);
    }
    setAddressModalOpen(true);
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setTimeout(() => {
      setSettingsLoading(false);
      setUserName(settingsName);
      localStorage.setItem("userName", settingsName);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    }, 1000);
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    alert("OTP sent to your email and mobile number (1234)");
  };

  const handleVerifyOtp = () => {
    if (otpVerify === "1234") {
      setOtpVerified(true);
      setOtpSent(false);
      alert("Verification successful!");
    } else {
      alert("Invalid OTP");
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(true);
    setPasswordForm({ oldPass: '', newPass: '' });
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="flex-grow bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <div className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden sticky top-24">
            <div className="flex flex-col items-center mb-6 border-b border-gray-100 pb-6">
              <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                {userAvatar ? (
                  <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-primary" />
                )}
              </div>
              <h2 className="font-bold text-xl text-gray-900">{userName}</h2>
              <p className="text-gray-500 text-sm mt-1">+91 9876543210</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setActiveSection('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${activeSection === 'orders' ? 'font-bold bg-primary/10 text-primary' : 'font-semibold text-gray-600 hover:bg-gray-50'}`}
              >
                <FileText className="h-5 w-5" /> My Orders
              </button>
              <button
                onClick={() => setActiveSection('favorites')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${activeSection === 'favorites' ? 'font-bold bg-primary/10 text-primary' : 'font-semibold text-gray-600 hover:bg-gray-50'}`}
              >
                <Heart className="h-5 w-5" /> Favorites
              </button>
              <button
                onClick={() => setActiveSection('addresses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${activeSection === 'addresses' ? 'font-bold bg-primary/10 text-primary' : 'font-semibold text-gray-600 hover:bg-gray-50'}`}
              >
                <MapPin className="h-5 w-5" /> Saved Addresses
              </button>
              <button
                onClick={() => setActiveSection('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${activeSection === 'settings' ? 'font-bold bg-primary/10 text-primary' : 'font-semibold text-gray-600 hover:bg-gray-50'}`}
              >
                <Settings className="h-5 w-5" /> Account Settings
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => {
                  localStorage.removeItem("userName");
                  localStorage.removeItem("userAvatar");
                  navigate('/');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" /> Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">

          {/* ORDERS SECTION */}
          {activeSection === 'orders' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
                <div className="flex border-b border-gray-100">
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`flex-1 py-4 font-bold text-sm ${activeTab === 'active' ? 'text-primary border-b-2 border-primary bg-primary/5 rounded-tl-2xl' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                  >
                    Active Bookings ({activeOrders.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-4 font-bold text-sm ${activeTab === 'history' ? 'text-primary border-b-2 border-primary bg-primary/5 rounded-tr-2xl' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                  >
                    Order History
                  </button>
                </div>

                <div className="p-6">
                  {activeOrders.length === 0 && pastOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">No Orders Yet</h3>
                      <p className="text-gray-500 mb-6">You haven't placed any orders. Browse our services to book your first service!</p>
                      <Button onClick={() => navigate('/services')} className="px-8 py-2.5">Explore Services</Button>
                    </div>
                  ) : (
                    <>
                      <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          label=""
                          type="text"
                          placeholder="Search orders by service or ID..."
                          containerClassName="!mt-0"
                          className="pl-12 bg-gray-50"
                        />
                      </div>

                      <div className="space-y-4">
                        {activeTab === 'active' ? (
                          activeOrders.map(order => (
                            <div key={order.id} className="border border-gray-200 rounded-xl p-5 hover:border-primary/30 transition-colors flex flex-col md:flex-row gap-6 md:items-center">
                              <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-bold text-lg text-gray-900">{order.service}</h3>
                                  <StatusBadge status={order.status} />
                                </div>
                                <div className="text-sm text-gray-500 mb-1">ID: {order.id} • {order.date}</div>
                                <div className="text-sm text-gray-700 font-medium py-2">
                                  Pro: <span className="font-bold">{order.professional}</span>
                                </div>
                              </div>
                              <div className="flex-shrink-0 flex flex-col items-end gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                <span className="font-black text-xl text-gray-800">{order.amount}</span>
                                <Button
                                  onClick={() => openTracking(order.stage, order.date)}
                                  className="!py-2.5 !px-6 text-sm"
                                >
                                  Track Order
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          pastOrders.map(order => (
                            <div key={order.id} className="border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row gap-6 md:items-center">
                              <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-bold text-lg text-gray-900">{order.service}</h3>
                                  <StatusBadge status={order.status} />
                                </div>
                                <div className="text-sm text-gray-500 mb-1">ID: {order.id} • {order.date}</div>
                                <div className="text-sm text-gray-700 font-medium py-2">
                                  Pro: <span className="font-bold">{order.professional}</span>
                                </div>
                              </div>
                              <div className="flex-shrink-0 flex flex-col items-end gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                <span className="font-bold text-lg text-gray-800">{order.amount}</span>
                                {order.status === 'Completed' ? (
                                  <Button variant="secondary" className="!bg-gray-100 !text-gray-800 hover:!bg-gray-200 !py-2.5 !px-6 text-sm">
                                    Rate Experience
                                  </Button>
                                ) : null}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* FAVORITES SECTION */}
          {activeSection === 'favorites' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Favorites</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {favoriteServices.map(service => (
                  <ServiceCard key={service.serviceId} service={service} showCategory />
                ))}
              </div>
            </div>
          )}

          {/* ADDRESSES SECTION */}
          {activeSection === 'addresses' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Saved Addresses</h1>
                <Button
                  onClick={() => openAddressModal()}
                  className="!py-2.5 !px-4 text-sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add New
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.length === 0 ? (
                  <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-500">
                    No saved addresses found. Click "Add New" to add one.
                  </div>
                ) : addresses.map(addr => (
                  <div key={addr.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">{addr.label}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mt-2">{userName}</h3>
                    <p className="text-gray-600 text-sm mt-1 mb-4">
                      {addr.houseNum}, {addr.flatNum ? `${addr.flatNum}, ` : ''}
                      {addr.street}, {addr.landmark ? `${addr.landmark}, ` : ''}
                      {addr.city} - {addr.pincode}
                    </p>
                    <div className="flex gap-3 mt-auto">
                      <button onClick={() => openAddressModal(addr)} className="text-sm font-bold text-primary hover:underline">Edit</button>
                      <button onClick={() => deleteAddress(addr.id)} className="text-sm font-bold text-red-500 hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS SECTION */}
          {activeSection === 'settings' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

              {settingsSuccess && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium flex items-start gap-3 mb-6">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>Settings updated successfully!</div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
                <form onSubmit={handleSaveSettings}>
                  <h3 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-2">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={settingsName}
                      onChange={(e) => setSettingsName(e.target.value)}
                      required
                    />
                    <Input
                      label="Phone Number"
                      value={settingsPhone}
                      onChange={(e) => setSettingsPhone(e.target.value)}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={settingsEmail}
                      onChange={(e) => setSettingsEmail(e.target.value)}
                      required
                    />
                    <Input
                      label="Date of Birth"
                      type="date"
                      value={settingsDOB}
                      onChange={(e) => setSettingsDOB(e.target.value)}
                      required
                    />
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                      <select
                        value={settingsGender}
                        onChange={(e) => setSettingsGender(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-gray-50 focus:bg-white transition-all bg-no-repeat"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                  <Button type="submit" isLoading={settingsLoading} className="mt-6">
                    Save Changes
                  </Button>
                </form>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 pb-2">Security Settings</h3>

                  <div className="space-y-6">
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-2">Update Email or Mobile</h4>
                      <p className="text-sm text-gray-500 mb-4">To update your contact details, please verify via OTP.</p>

                      {!otpSent && !otpVerified && (
                        <Button variant="secondary" onClick={handleSendOtp} className="text-sm py-2">
                          Generate OTP
                        </Button>
                      )}

                      {otpSent && !otpVerified && (
                        <div className="flex items-end gap-3 mt-3">
                          <Input
                            label="Enter OTP"
                            placeholder="1234"
                            value={otpVerify}
                            onChange={(e) => setOtpVerify(e.target.value)}
                            containerClassName="flex-1 !mb-0"
                          />
                          <Button onClick={handleVerifyOtp} className="py-3 px-6 h-[50px]">Verify</Button>
                        </div>
                      )}

                      {otpVerified && (
                        <p className="text-green-600 font-bold text-sm flex items-center gap-2 mt-2">
                          <CheckCircle className="h-4 w-4" /> Identity Verified. You can now save your new contact details.
                        </p>
                      )}
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-4">Change Password</h4>
                      {passwordSuccess && (
                        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm font-medium flex items-start gap-2 mb-4">
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /> Password changed!
                        </div>
                      )}
                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <Input
                          label="Old Password"
                          type="password"
                          required
                          value={passwordForm.oldPass}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, oldPass: e.target.value }))}
                        />
                        <Input
                          label="New Password"
                          type="password"
                          required
                          value={passwordForm.newPass}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, newPass: e.target.value }))}
                        />
                        <Button type="submit" className="text-sm py-2.5">Update Password</Button>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-2">Preferences</h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded" />
                    <span className="font-medium text-gray-700">Receive WhatsApp notifications for order updates</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer mt-3">
                    <input type="checkbox" className="w-5 h-5 text-primary rounded" />
                    <span className="font-medium text-gray-700">Receive promotional emails and offers</span>
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <Modal isOpen={trackingModalOpen} onClose={() => setTrackingModalOpen(false)} title="Live Order Tracking">
        <div className="mb-6 flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Order Information</h3>
            <p className="text-primary font-bold text-sm mt-1 flex items-center gap-1.5 bg-primary/10 w-fit px-2 py-0.5 rounded uppercase tracking-wider">
              📅 Scheduled for: {selectedOrderDate}
            </p>
          </div>
          <StatusBadge status="In Progress" />
        </div>

        <Timeline currentStage={selectedOrderStage} />

        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-4">
          <div className="bg-blue-600 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center font-bold flex-shrink-0">
            {activeOrders[0]?.professional.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-blue-900">Contact Professional</h4>
            <p className="text-sm text-blue-800 mt-1">If you need immediate assistance, call {activeOrders[0]?.professional.split(' ')[0]} at +91 99****6789.</p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={addressModalOpen} onClose={() => setAddressModalOpen(false)} title={editingAddressId ? "Edit Address" : "Add New Address"}>
        <form onSubmit={handleAddressSubmit} className="space-y-4">
          {addrError && <div className="text-red-500 text-sm font-bold">{addrError}</div>}
          <Input
            label="Address Label"
            placeholder="e.g. Home, Office, Other"
            value={addrForm.label}
            onChange={(e) => setAddrForm(prev => ({ ...prev, label: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="House Number"
              placeholder="e.g. 4B"
              required
              value={addrForm.houseNum}
              onChange={(e) => setAddrForm(prev => ({ ...prev, houseNum: e.target.value }))}
            />
            <Input
              label="Flat Number"
              placeholder="Optional"
              value={addrForm.flatNum}
              onChange={(e) => setAddrForm(prev => ({ ...prev, flatNum: e.target.value }))}
            />
            <Input
              label="Street"
              placeholder="Street Name"
              required
              value={addrForm.street}
              onChange={(e) => setAddrForm(prev => ({ ...prev, street: e.target.value }))}
              containerClassName="col-span-2"
            />
            <Input
              label="Landmark"
              placeholder="Near..."
              value={addrForm.landmark}
              onChange={(e) => setAddrForm(prev => ({ ...prev, landmark: e.target.value }))}
              containerClassName="col-span-2"
            />
            <Input
              label="City"
              required
              value={addrForm.city}
              onChange={(e) => setAddrForm(prev => ({ ...prev, city: e.target.value }))}
            />
            <Input
              label="Pincode"
              required
              value={addrForm.pincode}
              onChange={(e) => setAddrForm(prev => ({ ...prev, pincode: e.target.value }))}
            />
          </div>
          <Button type="submit" fullWidth>
            {editingAddressId ? "Save Changes" : "Save Address"}
          </Button>
        </form>
      </Modal>

    </div>
  );
}
