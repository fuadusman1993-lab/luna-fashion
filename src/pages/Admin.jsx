import { useState } from 'react';
import { auth, db, storage, isFirebaseConfigured } from '../services/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAppContext } from '../context/AppContext';
import { User, Settings, PackagePlus, ListTree, Pencil, Trash2 } from 'lucide-react';
import { useProducts, addLocalProduct, updateLocalProduct, deleteLocalProduct } from '../hooks/useProducts';

export default function Admin() {
  const { t } = useAppContext();
  const { products } = useProducts();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('products');

  // Product Form State
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Makhawar (ቶብ)');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
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

  const handleCreateOrUpdateProduct = async (e) => {
    e.preventDefault();
    setUploading(true);
    setSuccessMsg('');
    setError('');

    if (!isFirebaseConfigured) {
      setTimeout(() => {
        const localUrls = imageFiles.map(file => URL.createObjectURL(file));
        const payload = {
           name,
           category,
           price: Number(price),
           currency: "ETB",
           description,
           inStock
        };
        if (localUrls.length > 0) {
           payload.imageUrl = localUrls[0];
           payload.images = localUrls;
        }

        if (editId) {
           updateLocalProduct(editId, payload);
           setSuccessMsg(`Product updated! (Preview mode)`);
        } else {
           addLocalProduct(payload);
           setSuccessMsg(`Product added to ${category}! (Preview mode)`);
        }
        
        setUploading(false);
        resetForm();
      }, 500);
      return;
    }

    if (imageFiles.length === 0 && !editId) {
      setError('Please select an image file first.');
      setUploading(false);
      return;
    }

    try {
      let downloadURLs = [];
      let defaultImageUrl = null;
      
      if (imageFiles.length > 0) {
         await Promise.all(imageFiles.map(async (file) => {
            const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            await new Promise((resolve, reject) => {
               uploadTask.on('state_changed', null, reject, async () => {
                  const url = await getDownloadURL(uploadTask.snapshot.ref);
                  downloadURLs.push(url);
                  resolve();
               });
            });
         }));
         defaultImageUrl = downloadURLs[0];
      }

      const payload = {
        name,
        category,
        price: Number(price),
        currency: "ETB",
        description,
        inStock
      };

      if (downloadURLs.length > 0) {
        payload.imageUrl = defaultImageUrl;
        payload.images = downloadURLs;
      }

      if (editId) {
         await updateDoc(doc(db, "products", editId), payload);
         setSuccessMsg('Product updated successfully!');
      } else {
         payload.createdAt = serverTimestamp();
         await addDoc(collection(db, "products"), payload);
         setSuccessMsg('Product added successfully!');
      }

      setUploading(false);
      resetForm();
    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  };

  const handleEditPrep = (product) => {
     setEditId(product.id);
     setName(product.name);
     setPrice(product.price);
     setCategory(product.category || 'Makhawar (ቶብ)');
     setDescription(product.description || '');
     setInStock(product.inStock);
     setActiveTab('products');
  };

  const handleDeleteProduct = async (id) => {
     if (window.confirm("Delete this product permanently?")) {
        if (!isFirebaseConfigured) {
           deleteLocalProduct(id);
           return;
        }
        await deleteDoc(doc(db, "products", id));
     }
  };

  const resetForm = () => {
     setEditId(null); setName(''); setPrice(''); setDescription(''); setCategory('Makhawar (ቶብ)'); setImageFiles([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-luna-black transition-colors duration-300 px-4 pt-10">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl p-8 rounded-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display text-luna-black dark:text-luna-white uppercase tracking-widest">{t('adminAccess')}</h2>
            <div className="w-10 h-0.5 bg-gold mx-auto mt-4"></div>
          </div>
          
          {!isFirebaseConfigured && (
            <div className="mb-6 p-4 bg-[#111] border border-gold/30 text-gold text-xs leading-relaxed text-center">
              <strong>Preview DB Active</strong> <br/>
              Use <strong>admin@lunafashion.com</strong> | <strong>password</strong>
            </div>
          )}

          {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 text-sm text-center font-medium border border-red-200 dark:border-red-800">{error}</div>}
          
          <form onSubmit={handleLogin} className="space-y-6">
             <input 
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border-gray-300 dark:border-gray-700 bg-transparent dark:text-white border p-3 focus:ring-gold focus:border-gold outline-none transition-colors" 
              />
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border-gray-300 dark:border-gray-700 bg-transparent dark:text-white border p-3 focus:ring-gold focus:border-gold outline-none transition-colors" 
              />
            <button type="submit" className="w-full bg-luna-black dark:bg-gold text-white dark:text-black p-4 uppercase tracking-wider font-bold hover:opacity-90 transition-opacity">
              {t('login')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-luna-black transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
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
             {editId ? 'Edit Product' : t('addNewProduct')}
          </button>

          <button 
             onClick={() => { setActiveTab('manage'); resetForm(); }}
             className={`flex items-center px-4 py-3 text-left transition-colors ${activeTab === 'manage' ? 'bg-gold text-black font-semibold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
          >
             <ListTree className="w-5 h-5 mr-3" />
             Manage Catalog
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
        <div className="flex-1 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 shadow-sm p-8 transition-colors duration-300 relative">
          
          {/* Upload / Edit Tab */}
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-display text-luna-black dark:text-luna-white uppercase tracking-wider">
                    {editId ? 'Edit Product Mode' : t('addNewProduct')}
                 </h2>
                 {editId && <button onClick={resetForm} className="text-xs font-bold uppercase text-red-500 border border-red-500 px-3 py-1">Cancel Edit</button>}
              </div>
              
              {successMsg && <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">{successMsg}</div>}
              {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">{error}</div>}

              <form onSubmit={handleCreateOrUpdateProduct} className="space-y-6">
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
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                   <select 
                     value={category} 
                     onChange={e => setCategory(e.target.value)}
                     className="w-full dark:text-white bg-transparent border-gray-300 dark:border-gray-700 border p-2 focus:ring-gold focus:border-gold outline-none appearance-none cursor-pointer"
                   >
                      <option className="text-black" value="Makhawar (ቶብ)">Makhawar (ቶብ)</option>
                      <option className="text-black" value="Abaya">Abaya</option>
                      <option className="text-black" value="Dria">Dria</option>
                      <option className="text-black" value="Dresses (ቀሚስ)">Dresses (ቀሚስ)</option>
                      <option className="text-black" value="Makeup">Makeup</option>
                      <option className="text-black" value="Shoes">Shoes</option>
                   </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('description')}</label>
                  <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} required className="w-full dark:text-white bg-transparent border-gray-300 dark:border-gray-700 border p-2 focus:ring-gold focus:border-gold outline-none"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{editId ? 'Add New Images (Optional)' : t('image')}</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed hover:border-gold transition-colors cursor-pointer bg-gray-50 dark:bg-black/20 relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={e => setImageFiles(Array.from(e.target.files).slice(0, 3))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      required={!isFirebaseConfigured && !editId ? false : (!editId)}
                    />
                    <div className="space-y-1 text-center relative z-0">
                      <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                        <span className="relative font-bold text-gold">
                          {imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : (editId ? 'Click to browse new image(s)' : t('uploadImage'))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                   <input type="checkbox" id="inStock" checked={inStock} onChange={e => setInStock(e.target.checked)} className="w-4 h-4 text-gold cursor-pointer" />
                   <label htmlFor="inStock" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">{t('inStock')}</label>
                </div>

                <button type="submit" disabled={uploading} className="w-full bg-luna-black dark:bg-gold text-white dark:text-black p-3 uppercase tracking-wider font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
                  {uploading ? t('publishing') : (editId ? 'SAVE CHANGES' : t('publish'))}
                </button>
              </form>
            </div>
          )}

          {/* Manage Products Tab */}
          {activeTab === 'manage' && (
            <div>
               <h2 className="text-2xl font-display text-luna-black dark:text-luna-white mb-6 uppercase tracking-wider">Manage Catalog</h2>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white uppercase font-bold text-xs">
                       <tr>
                         <th className="px-4 py-3">Product</th>
                         <th className="px-4 py-3">Price</th>
                         <th className="px-4 py-3">Category</th>
                         <th className="px-4 py-3">Status</th>
                         <th className="px-4 py-3 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody>
                       {products.map(p => (
                          <tr key={p.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                             <td className="px-4 py-3 flex items-center font-medium">
                                <img src={p.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover mr-3 border border-gray-300 dark:border-gray-700" />
                                {p.name}
                             </td>
                             <td className="px-4 py-3 font-bold">{p.price} ETB</td>
                             <td className="px-4 py-3">{p.category || 'Makhawar (ቶብ)'}</td>
                             <td className="px-4 py-3">
                                {p.inStock ? <span className="text-green-500 font-bold text-[10px] bg-green-500/10 px-2 py-1 rounded">IN STOCK</span> : <span className="text-red-500 font-bold text-[10px] bg-red-500/10 px-2 py-1 rounded">SOLD OUT</span>}
                             </td>
                             <td className="px-4 py-3 text-right">
                                <button onClick={() => handleEditPrep(p)} className="text-gold p-1 hover:bg-gold/20 mr-2 rounded">
                                   <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 p-1 hover:bg-red-500/20 rounded">
                                   <Trash2 className="w-4 h-4" />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
                 {products.length === 0 && <p className="text-center py-10 text-gray-500">No products found.</p>}
               </div>
            </div>
          )}

          {activeTab === 'settings' && (
             <div>
               <h2 className="text-2xl font-display text-luna-black dark:text-luna-white mb-6 uppercase tracking-wider">{t('settingsTitle')}</h2>
               {/* Setting blocks... */}
               <p className="text-gray-500">Security preferences are managed via Firebase.</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
