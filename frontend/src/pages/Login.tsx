import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn, Phone, Mail, Lock, CheckCircle } from "lucide-react";
import { FormLayout } from "../components/FormLayout";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  
  // Password state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // OTP state
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message);
      // Clear location state so it doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const doLogin = (name: string) => {
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
    localStorage.setItem("userName", name);
    localStorage.setItem("userAvatar", avatarUrl);
    localStorage.setItem("isNewUser", "false");
    navigate('/profile');
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || password.length < 6) {
      setPasswordError("Invalid email or password.");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Mock validation
      if (email === "demo.user@example.com" && password === "123456") {
         doLogin("Demo User");
      } else {
         doLogin(email.split('@')[0]); // login with fake name
      }
    }, 1500);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp(newOtp);
        console.log("Your OTP is: " + newOtp);
        setOtpError("");
        setOtp("");
        setOtpSent(true);
      }, 1000);
    } else {
      setOtpError("Enter a valid 10-digit number");
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      doLogin("Guest User");
    } else {
      setOtpError("OTP is invalid");
    }
  };

  return (
    <FormLayout 
      title="Welcome Back" 
      subtitle="Login to your account to book services."
      icon={<LogIn className="h-8 w-8 text-primary" />}
    >
      {message && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium mb-6 text-center border border-green-100">
          {message}
        </div>
      )}

      {/* Tabs */}
      {!otpSent && (
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button 
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginMethod === 'password' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setLoginMethod('password'); setPasswordError(""); }}
          >
            Email & Password
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginMethod === 'otp' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setLoginMethod('otp'); setOtpError(""); }}
          >
            Login via OTP
          </button>
        </div>
      )}

      {/* Forms */}
      {loginMethod === 'password' ? (
        <form onSubmit={handlePasswordLogin} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setPasswordError(""); }}
            placeholder="you@example.com"
            leftIcon={<Mail className="h-5 w-5" />}
          />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-bold text-gray-700">Password</label>
              <Link to="/forgot-password" className="text-sm font-bold text-primary hover:underline" tabIndex={-1}>
                Forgot Password?
              </Link>
            </div>
            <Input
              label=""
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
              placeholder="••••••••"
              error={passwordError}
              leftIcon={<Lock className="h-5 w-5" />}
              containerClassName="!mt-0"
            />
          </div>
          
          <Button type="submit" fullWidth isLoading={isLoading}>
            Login to Account
          </Button>
        </form>
      ) : (
        /* OTP Flow */
        !otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setOtpError(""); }}
              placeholder="e.g. 9876543210"
              error={otpError}
              leftIcon={<Phone className="h-5 w-5" />}
              maxLength={10}
            />
            <Button type="submit" fullWidth isLoading={isLoading}>
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium flex items-start gap-3 mb-2">
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                We've sent a 4-digit code to +91 {phone}. 
                <br/><span className="text-xs opacity-80">(Check your browser console!)</span>
              </div>
            </div>
            <Input
              label="Enter OTP"
              type="text"
              value={otp}
              onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError(""); }}
              error={otpError}
              placeholder="• • • •"
              maxLength={4}
              className="text-center tracking-[1em] text-xl font-bold"
            />
            <Button type="submit" fullWidth>
              Verify & Login
            </Button>
            <button 
              type="button"
              className="w-full text-center text-sm font-bold text-primary hover:underline"
              onClick={() => {
                const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
                setGeneratedOtp(newOtp);
                console.log("Your new OTP is: " + newOtp);
                setOtpError("");
                setOtp("");
              }}
            >
              Resend OTP
            </button>
            <button 
              type="button"
              className="w-full text-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mt-2"
              onClick={() => { setOtpSent(false); setOtp(""); }}
            >
              Change Phone Number
            </button>
          </form>
        )
      )}

      <div className="mt-8 text-center text-sm">
        <span className="text-gray-500">Don't have an account? </span>
        <Link to="/signup" className="text-primary font-bold hover:underline">
          Sign Up
        </Link>
      </div>

    </FormLayout>
  );
}
