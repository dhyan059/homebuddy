import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./layouts/Navbar";
import { Footer } from "./layouts/Footer";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import PaymentStatus from "./pages/PaymentStatus";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ServiceDetails from "./pages/ServiceDetails";
import ProfessionalLogin from "./pages/ProfessionalLogin";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import UpiGateway from "./pages/UpiGateway";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex flex-col">
           <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/service/:id" element={<ServiceDetails />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/professional-login" element={<ProfessionalLogin />} />
            <Route path="/professional-dashboard" element={<ProfessionalDashboard />} />
            <Route path="/upi-gateway" element={<UpiGateway />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
