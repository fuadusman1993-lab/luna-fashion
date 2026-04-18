import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Settings, Shield, Package, Heart, Tag } from 'lucide-react';

export default function Me() {
  const { t } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black px-4 py-6">
       <div className="flex items-center space-x-4 mb-8 pt-4">
          <div className="w-16 h-16 bg-gold/20 dark:bg-gold/10 text-gold rounded-full flex items-center justify-center font-display text-2xl font-bold">
             L
          </div>
          <div>
            <h2 className="text-xl font-bold text-luna-black dark:text-luna-white">My Account</h2>
            <p className="text-sm text-gray-500 font-medium">Welcome to Luna Fashion</p>
          </div>
       </div>

       <div className="bg-white dark:bg-gray-900 rounded-lg p-5 mb-6 shadow-sm border border-gray-100 dark:border-gray-800">
         <h3 className="font-semibold text-lg mb-4 text-luna-black dark:text-white">Orders & Returns</h3>
         <div className="grid grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
               <Package className="w-6 h-6 mb-2 text-gray-700 dark:text-gray-300" />
               <span className="text-xs text-gray-500">Unpaid</span>
            </div>
            <div className="flex flex-col items-center">
               <Package className="w-6 h-6 mb-2 text-gray-700 dark:text-gray-300" />
               <span className="text-xs text-gray-500">Processing</span>
            </div>
            <div className="flex flex-col items-center">
               <Package className="w-6 h-6 mb-2 text-gray-700 dark:text-gray-300" />
               <span className="text-xs text-gray-500">Shipped</span>
            </div>
            <div className="flex flex-col items-center">
               <Package className="w-6 h-6 mb-2 text-gray-700 dark:text-gray-300" />
               <span className="text-xs text-gray-500">Returns</span>
            </div>
         </div>
       </div>

       <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <Link to="/about" className="flex items-center py-4 px-5 border-b border-gray-100 dark:border-gray-800 text-luna-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition">
             <Heart className="w-5 h-5 mr-3 text-red-500" />
             <span className="font-medium text-sm text-gray-700 dark:text-gray-300">About Luna Fashion</span>
          </Link>
          <Link to="/contact" className="flex items-center py-4 px-5 border-b border-gray-100 dark:border-gray-800 text-luna-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition">
             <Tag className="w-5 h-5 mr-3 text-gold" />
             <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Contact & Support</span>
          </Link>
          
          <Link to="/admin" className="flex items-center py-4 px-5 bg-yellow-50 dark:bg-yellow-900/10 text-luna-black dark:text-white hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition">
             <Shield className="w-5 h-5 mr-3 text-gold" />
             <span className="font-medium text-sm text-yellow-800 dark:text-gold uppercase tracking-wider">Admin Dashboard</span>
          </Link>
          <div className="py-4 px-5 text-luna-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer flex items-center">
              <Settings className="w-5 h-5 mr-3 text-gray-500" />
              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">App Settings</span>
          </div>
       </div>
    </div>
  );
}
