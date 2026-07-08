import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="hidden md:block bg-[#0c0c0c] text-white pt-16 pb-8 border-t border-white/10 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-1">
            <h2 className="font-serif italic font-bold text-[24px] tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] mb-4">
              Luna Fashion
            </h2>
            <p className="text-gray-400 text-[13px] leading-relaxed mb-6 font-light">
              Your destination for elegant fashion and timeless style. Experience luxury made accessible.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors text-white">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/luna_market2" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors text-white">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://t.me/luna_market11" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors text-white">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-bold text-[14px] uppercase tracking-widest mb-5">Shop</h3>
            <ul className="space-y-3 text-[13px] text-gray-400 font-light">
              <li><Link to="/shop?category=All" className="hover:text-[#D4AF37] transition-colors">All Collections</Link></li>
              <li><Link to="/shop?filter=New In" className="hover:text-[#D4AF37] transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?filter=Best" className="hover:text-[#D4AF37] transition-colors">Bestsellers</Link></li>
              <li><Link to="/shop?filter=Deals" className="hover:text-[#D4AF37] transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-span-1">
            <h3 className="font-bold text-[14px] uppercase tracking-widest mb-5">Customer Service</h3>
            <ul className="space-y-3 text-[13px] text-gray-400 font-light">
              <li><Link to="/contact" className="hover:text-[#D4AF37] transition-colors">Contact Us</Link></li>
              <li><span className="hover:text-[#D4AF37] transition-colors cursor-pointer">Shipping & Delivery</span></li>
              <li><span className="hover:text-[#D4AF37] transition-colors cursor-pointer">Returns & Refunds</span></li>
              <li><span className="hover:text-[#D4AF37] transition-colors cursor-pointer">FAQs</span></li>
            </ul>
          </div>

          {/* Information */}
          <div className="col-span-1">
            <h3 className="font-bold text-[14px] uppercase tracking-widest mb-5">Information</h3>
            <ul className="space-y-3 text-[13px] text-gray-400 font-light">
              <li><Link to="/about" className="hover:text-[#D4AF37] transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link></li>
              <li><span className="hover:text-[#D4AF37] transition-colors cursor-pointer">Terms & Conditions</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="font-bold text-[14px] uppercase tracking-widest mb-5">Newsletter</h3>
            <p className="text-[13px] text-gray-400 leading-relaxed mb-4 font-light">
              Subscribe to get updates on new collections and offers.
            </p>
            <form className="flex rounded-md overflow-hidden bg-white/10 p-1" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent border-none outline-none text-[13px] text-white px-3 py-2 w-full"
              />
              <button 
                type="submit" 
                className="bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-[11px] px-4 py-2 rounded shadow-md hover:bg-white transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between">
          <p className="text-[12px] text-gray-500">
            &copy; {new Date().getFullYear()} Luna Fashion. All rights reserved.
          </p>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <div className="w-10 h-6 bg-white rounded shadow flex items-center justify-center text-[10px] text-black font-bold">VISA</div>
            <div className="w-10 h-6 bg-white rounded shadow flex items-center justify-center text-[10px] text-black font-bold">MC</div>
            <div className="w-10 h-6 bg-white rounded shadow flex items-center justify-center text-[10px] text-black font-bold">PAYPAL</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
