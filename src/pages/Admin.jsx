import { useState } from 'react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if(email && password) {
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 pt-10">
        <div className="max-w-md w-full bg-white p-8 border border-gray-200 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display text-luna-black uppercase tracking-widest">Admin Access</h2>
            <div className="w-10 h-0.5 bg-gold mx-auto mt-4"></div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border-gray-300 border p-3 focus:ring-gold focus:border-gold outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border-gray-300 border p-3 focus:ring-gold focus:border-gold outline-none" 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-luna-black text-white p-4 uppercase tracking-wider font-semibold hover:bg-gold transition-colors"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl font-display text-luna-black">Dashboard</h1>
            <p className="text-gray-500 mt-2">Manage your inventory and products.</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="text-sm font-medium text-gray-500 hover:text-black border-b border-transparent hover:border-black transition-all"
          >
            Sign Out
          </button>
        </div>

        {/* Upload Form Mockup */}
        <div className="bg-white p-8 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-display mb-6">Add New Product</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input type="text" className="w-full border-gray-300 border p-2 focus:ring-gold focus:border-gold outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (ETB)</label>
                <input type="number" className="w-full border-gray-300 border p-2 focus:ring-gold focus:border-gold outline-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea rows="3" className="w-full border-gray-300 border p-2 focus:ring-gold focus:border-gold outline-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed hover:border-gold transition-colors cursor-pointer bg-gray-50">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <span className="relative font-medium text-gold hover:text-black">
                      Upload a file
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
               <input type="checkbox" id="inStock" className="w-4 h-4 text-gold cursor-pointer" defaultChecked />
               <label htmlFor="inStock" className="text-sm font-medium text-gray-700 cursor-pointer">In Stock</label>
            </div>

            <button type="button" className="w-full bg-luna-black text-white p-3 uppercase tracking-wider font-semibold hover:bg-gold transition-colors">
              Publish Product to Store
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
