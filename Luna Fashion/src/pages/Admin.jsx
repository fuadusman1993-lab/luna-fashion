import { useState } from 'react';
import { auth, db, storage, isFirebaseConfigured } from '../services/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAppContext } from '../context/AppContext';
import { User, Settings, PackagePlus } from 'lucide-react';

export default function Admin() {
  const { t } = useAppContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('products');

  // Product Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [inStock, setInStock] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isFirebaseConfigured) {
      if (email === 'admin@lunafashion.com' && password === 'password') {
        setIsAuthenticated(true);
      } else {
        setError('Invalid credentials.');
      }
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setUploading(true);
    setSuccessMsg('');
    setError('');

    if (!isFirebaseConfigured) {
      setTimeout(() => {
        setUploading(false);
        setSuccessMsg('Product added magically! (Mock data only, connect Firebase to save it forever.)');
        setName(''); setPrice(''); setDescription(''); setImageFile(null);
      }, 1500);
      return;
    }

    if (!imageFile) {
      setError('Please select an image file first.');
      setUploading(false);
      return;
    }

    try {
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on('state_changed', 
        (snapshot) => {}, 
        (error) => {
          setError(error.message);
          setUploading(false);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          await addDoc(collection(db, "products"), {
            name,
            price: Number(price),
            currency: "ETB",
            description,
            imageUrl: downloadURL,
            inStock,
            createdAt: serverTimestamp()
          });

          setUploading(false);
          setSuccessMsg('Product added successfully!');
          setName(''); setPrice(''); setDescription(''); setImageFile(null);
        }
      );
    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-luna-black transition-colors duration-300 px-4 pt-10">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display text-luna-black dark:text-luna-white uppercase tracking-widest">{t('adminAccess')}</h2>
            <div className="w-10 h-0.5 bg-gold mx-auto mt-4"></div>
          </div>
          
          {!isFirebaseConfigured && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-400 text-sm leading-relaxed">
              <strong>Firebase not configured!</strong> <br/>
              Use <strong>admin@lunafashion.com</strong> and <strong>password</strong> to preview.
            </div>
          )}

          {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 text-sm text-center font-medium border border-red-200 dark:border-red-800">{error}</div>}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('emailDetails')}</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border-gray-300 dark:border-gray-700 bg-transparent dark:text-white border p-3 focus:ring-gold focus:border-gold outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('password')}</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border-gray-300 dark:border-gray-700 bg-transparent dark:text-white border p-3 focus:ring-gold focus:border-gold outline-none transition-colors" 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-luna-black dark:bg-gold text-white dark:text-black p-4 uppercase tracking-wider font-semibold hover:bg-gold transition-colors"
            >
              {t('login')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-luna-black transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex flex-col space-y-2">
          <div className="mb-8 px-4">
             <h1 className="text-3xl font-display text-luna-black dark:text-luna-white">{t('dashboard')}</h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('manageInventory')}</p>
          </div>
          
          <button 
             onClick={() => setActiveTab('products')}
             className={`flex items-center px-4 py-3 text-left transition-colors ${activeTab === 'products' ? 'bg-gold text-black font-semibold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
          >
             <PackagePlus className="w-5 h-5 mr-3" />
             {t('productsTab')}
          </button>
          
          <button 
             onClick={() => setActiveTab('settings')}
             className={`flex items-center px-4 py-3 text-left transition-colors ${activeTab === 'settings' ? 'bg-gold text-black font-semibold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
          >
             <Settings className="w-5 h-5 mr-3" />
             {t('settingsTab')}
          </button>

          <button 
            onClick={() => {
              if (isFirebaseConfigured) signOut(auth);
              setIsAuthenticated(false);
            }}
            className="flex items-center px-4 py-3 mt-auto text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <User className="w-5 h-5 mr-3" />
            {t('signOut')}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-8 transition-colors duration-300 relative">
          {!isFirebaseConfigured && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-400 text-sm">
               {t('previewModeInfo')}
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <h2 className="text-2xl font-display text-luna-black dark:text-luna-white mb-6 uppercase tracking-wider">{t('addNewProduct')}</h2>
              
              {successMsg && <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">{successMsg}</div>}
              {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">{error}</div>}

              <form onSubmit={handleCreateProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('productName')}</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full dark:text-white bg-transparent border-gray-300 dark:border-gray-700 border p-2 focus:ring-gold focus:border-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('price')}</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} required className="w-full dark:text-white bg-transparent border-gray-300 dark:border-gray-700 border p-2 focus:ring-gold focus:border-gold outline-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('description')}</label>
                  <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} required className="w-full dark:text-white bg-transparent border-gray-300 dark:border-gray-700 border p-2 focus:ring-gold focus:border-gold outline-none"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('image')}</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed hover:border-gold transition-colors cursor-pointer bg-gray-50 dark:bg-black/20 relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => setImageFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      required={!isFirebaseConfigured ? false : true}
                    />
                    <div className="space-y-1 text-center relative z-0">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                        <span className="relative font-medium text-gold">
                          {imageFile ? imageFile.name : t('uploadImage')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                   <input type="checkbox" id="inStock" checked={inStock} onChange={e => setInStock(e.target.checked)} className="w-4 h-4 text-gold cursor-pointer" />
                   <label htmlFor="inStock" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">{t('inStock')}</label>
                </div>

                <button type="submit" disabled={uploading} className="w-full bg-luna-black dark:bg-gold text-white dark:text-black p-3 uppercase tracking-wider font-semibold hover:bg-gold transition-colors disabled:opacity-50">
                  {uploading ? t('publishing') : t('publish')}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-display text-luna-black dark:text-luna-white mb-6 uppercase tracking-wider">{t('settingsTitle')}</h2>
              
              <div className="space-y-8">
                 <div className="border-b border-gray-200 dark:border-gray-800 pb-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gold mb-4">{t('changePassword')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <input type="password" placeholder="New Password" className="w-full dark:text-white bg-transparent border-gray-300 dark:border-gray-700 border p-2 focus:ring-gold outline-none" />
                       <input type="password" placeholder="Confirm Password" className="w-full dark:text-white bg-transparent border-gray-300 dark:border-gray-700 border p-2 focus:ring-gold outline-none" />
                    </div>
                    <button className="mt-4 px-6 py-2 border border-luna-black dark:border-gold hover:bg-luna-black hover:text-white dark:hover:bg-gold dark:hover:text-black transition-colors font-medium text-sm uppercase dark:text-gold text-black tracking-widest">{t('changePassword')}</button>
                 </div>

                 <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gold mb-4">{t('shopInfo')}</h3>
                    <div className="space-y-4">
                       <div>
                         <label className="block text-sm text-gray-500 mb-1">Contact Phone</label>
                         <input type="text" defaultValue="+251 97 779 9797" className="w-full md:w-1/2 dark:text-white bg-transparent border-gray-300 dark:border-gray-700 border p-2 focus:ring-gold outline-none" />
                       </div>
                       <button className="px-6 py-2 border border-luna-black dark:border-gold hover:bg-luna-black hover:text-white dark:hover:bg-gold dark:hover:text-black transition-colors font-medium text-sm uppercase dark:text-gold text-black tracking-widest">{t('saveSettings')}</button>
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
