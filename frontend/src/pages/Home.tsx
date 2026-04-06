import { Link } from "react-router-dom";
import { ArrowRight, Star, ShieldCheck, Clock } from "lucide-react";
import * as Icons from "lucide-react";
import { categories, services } from "../utils/data";
import { CategoryCard } from "../components/CategoryCard";
import { ServiceCard } from "../components/ServiceCard";
import { SearchBar } from "../components/SearchBar";
import repairImg from "../assets/leakage_repair.png";
import cleaningImg from "../assets/home_cleaning.png";
import beautyImg from "../assets/haircut_styling.png";

export default function Home() {
  const topServices = services.filter(s => s.rating >= 4.8).slice(0, 3);

  return (
    <div className="flex-grow bg-slate-50 pb-16">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Quality home services, <br/><span className="text-pink-300">on demand.</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl">
              Experienced, hand-picked professionals to service your home. Book trusted cleaners, plumbers, and beauty experts instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start w-full max-w-md">
              <SearchBar className="w-full" inputClassName="rounded-full py-4 text-gray-900 shadow-lg text-lg bg-white w-full" placeholder="Search for cleaning, repair..." />
            </div>
          </div>
          <div className="flex-1 hidden md:block">
            {/* Visual representation of services */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20 transform hover:-translate-y-2 transition-all">
                <Icons.Sparkles className="h-10 w-10 text-pink-300 mb-4" />
                <h3 className="font-bold text-xl mb-1">Deep Cleaning</h3>
                <p className="text-sm text-primary-200">Expert cleaners for your home</p>
              </div>
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20 transform hover:-translate-y-2 transition-all mt-8">
                <Icons.Wrench className="h-10 w-10 text-cyan-300 mb-4" />
                <h3 className="font-bold text-xl mb-1">Expert Repairs</h3>
                <p className="text-sm text-primary-200">AC, Appliances & more</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-4 flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Verified Professionals</h3>
              <p className="text-gray-500 text-sm">Every partner is background-checked and thoroughly trained.</p>
            </div>
            <div className="p-4 flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">On-Time Service</h3>
              <p className="text-gray-500 text-sm">We value your time. Our professionals arrive at your doorstep on time.</p>
            </div>
            <div className="p-4 flex flex-col items-center">
              <div className="bg-amber-100 p-3 rounded-full mb-4">
                <Star className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Top Rated</h3>
              <p className="text-gray-500 text-sm">Consistently rated highly by thousands of satisfied customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Offers & Discounts */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Offers & Discounts</h2>
              <p className="text-gray-500">Grab the best deals on top home services.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-pink-500 to-secondary rounded-2xl p-8 text-white flex flex-col justify-center relative overflow-hidden shadow-md transform hover:-translate-y-1 transition-all">
              <div className="relative z-10">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 inline-block">Limited Time</span>
                <h3 className="text-2xl font-bold mb-2">Get 20% Off on Beauty Services</h3>
                <p className="text-pink-100 mb-6 max-w-sm">Book your first at-home salon experience and enjoy a premium discount.</p>
                <Link to="/services?category=c1" className="bg-white text-secondary font-bold px-6 py-2 rounded-full inline-flex items-center gap-2 hover:bg-gray-50 transition-colors w-max">
                  Claim Offer <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <Icons.Sparkles className="absolute -right-4 -bottom-4 h-32 w-32 text-white/20" />
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white flex flex-col justify-center relative overflow-hidden shadow-md transform hover:-translate-y-1 transition-all">
              <div className="relative z-10">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 inline-block">New Users</span>
                <h3 className="text-2xl font-bold mb-2">₹500 Cashback on Deep Cleaning</h3>
                <p className="text-blue-100 mb-6 max-w-sm">Give your home the ultimate glow-up with our expert cleaners.</p>
                <Link to="/services?category=c3" className="bg-white text-indigo-600 font-bold px-6 py-2 rounded-full inline-flex items-center gap-2 hover:bg-gray-50 transition-colors w-max">
                  Book Now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <Icons.Droplets className="absolute -right-4 -bottom-4 h-32 w-32 text-white/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What do you need help with?</h2>
          <p className="text-gray-500">Select a category to explore our wide range of services.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
             <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Services at Your Doorstep */}
      <section className="py-16 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Services at Your Doorstep</h2>
            <p className="text-gray-500">Premium home services delivered by highly trained professionals.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/services?category=c2" className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all bg-white relative block w-full">
              <div className="h-64 overflow-hidden relative">
                <img src={repairImg} alt="Plumber fixing" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-1">Expert Repairs</h3>
                <p className="text-gray-200 text-sm">Quick and reliable fixes for your home appliances and plumbing.</p>
              </div>
            </Link>

            <Link to="/services?category=c3" className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all bg-white relative block w-full">
              <div className="h-64 overflow-hidden relative">
                <img src={cleaningImg} alt="Home Cleaning" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-1">Deep Home Cleaning</h3>
                <p className="text-gray-200 text-sm">Sparkling clean homes, inside and out. Vetted professionals.</p>
              </div>
            </Link>

            <Link to="/services?category=c1" className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all bg-white relative block w-full">
              <div className="h-64 overflow-hidden relative">
                <img src={beautyImg} alt="At home salon" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-1">Beauty & Wellness</h3>
                <p className="text-gray-200 text-sm">Relaxing salon services in the comfort of your own home.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Rated Services */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Rated Services</h2>
              <p className="text-gray-500">Our most popular and highly rated services.</p>
            </div>
            <Link to="/services" className="text-primary font-medium hover:underline hidden sm:block">View all</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topServices.map(service => (
               <ServiceCard key={service.serviceId} service={service} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
