export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg inline-block">
              <span className="font-black text-white">HB</span>
            </div>
            HomeBuddy
          </h3>
          <p className="text-gray-400 text-sm">
            Your trusted partner for everyday home services. Professional, reliable, and on-demand.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Cleaning</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Plumbing</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Electrical</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Salon at Home</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Admin</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="/admin" className="hover:text-white transition-colors">Dashboard</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Partner with us</a></li>
            <li><a href="/professional-login" className="hover:text-white transition-colors text-primary font-semibold">Professional Support</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-sm text-gray-500 text-center">
        © 2026 HomeBuddy Technologies. All rights reserved.
      </div>
    </footer>
  );
}
