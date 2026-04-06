import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, Phone, Lock, User } from "lucide-react";
import { FormLayout } from "../components/FormLayout";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`;
      localStorage.setItem("userName", formData.name);
      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userPhone", formData.phone);
      localStorage.setItem("userAvatar", avatarUrl);
      localStorage.setItem("isNewUser", "true");
      navigate("/profile");
    }, 1500);
  };

  return (
    <FormLayout 
      title="Create an Account" 
      subtitle="Join HomeBuddy to book reliable home services."
      icon={<UserPlus className="h-8 w-8 text-primary" />}
    >
      <form onSubmit={handleSignup} className="space-y-5">
        <Input
          label="Full Name"
          name="name"
          placeholder="e.g. Rahul Sharma"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          leftIcon={<User className="h-5 w-5" />}
        />
        
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          leftIcon={<Mail className="h-5 w-5" />}
        />
        
        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          placeholder="10 digit mobile number"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          leftIcon={<Phone className="h-5 w-5" />}
          maxLength={10}
        />
        
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Min. 6 characters"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          leftIcon={<Lock className="h-5 w-5" />}
        />

        <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
          Sign Up
        </Button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-gray-500">Already have an account? </span>
        <Link to="/login" className="text-primary font-bold hover:underline">
          Log In
        </Link>
      </div>
    </FormLayout>
  );
}
