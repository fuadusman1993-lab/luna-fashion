import { useState } from 'react';
import { auth, db, storage, isFirebaseConfigured } from '../services/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAppContext } from '../context/AppContext';
import { User, Settings, PackagePlus, ListTree, Pencil, Trash2, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { useProducts, addLocalProduct, updateLocalProduct, deleteLocalProduct } from '../hooks/useProducts';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  const { t } = useAppContext();
  const { products } = useProducts();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Product Form State
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Makhawar (ቶብ)');
  const [description, setDescription] = useState('');
  const [shippingTime, setShippingTime] = useState('Arrives in 1-2 days');
  const [imageFiles, setImageFiles] = useState([]);
  const [productColors, setProductColors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inStock, setInStock] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNewIn, setIsNewIn] = useState(false);
  const [isDeal, setIsDeal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');

  const addColorVariant = () => {
    setProductColors([...productColors, { name: '', hex: '#000000', file: null, imageUrl: null }]);
  };

  const updateColorVariant = (index, field, value) => {
    const newColors = [...productColors];
    newColors[index][field] = value;
    setProductColors(newColors);
  };

  const removeColorVariant = (index) => {
    setProductColors(productColors.filter((_, i) => i !== index));
  };

  // Native Client-Side Image Compressor for Mobile
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Strict max dimensions to save bandwidth (e.g. 1080px)
          const MAX_WIDTH = 1080;
          const MAX_HEIGHT = 1350;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Output highly optimized JPEG
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Fallback if compression fails
            }
          }, 'image/jpeg', 0.80); // 80% quality
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email;
      
      // List of allowed admin emails
      const ADMIN_EMAILS = ['admin@lunafashion.com']; 
      
      if (ADMIN_EMAILS.includes(userEmail)) {
        setIsAuthenticated(true);
      } else {
        await signOut(auth); // Sign them back out
        setError('Access denied: You do not have admin privileges.');
      }
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
           shippingTime,
           inStock,
           isBestseller,
           isNewIn,
           isDeal
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
         await Promise.all(imageFiles.map(async (originalFile) => {
            // Compress the image before uploading to avoid mobile timeouts
            let file = originalFile;
            try {
              if (originalFile.type.startsWith('image/')) {
                file = await compressImage(originalFile);
              }
            } catch (err) {
              console.warn("Image compression failed, using original", err);
            }

            const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            await new Promise((resolve, reject) => {
               uploadTask.on('state_changed', 
                 (snapshot) => {
                   const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                   setUploadProgress(Math.round(progress));
                 },
                 reject, 
                 async () => {
                   const url = await getDownloadURL(uploadTask.snapshot.ref);
                   downloadURLs.push(url);
                   resolve();
                 }
               );
            });
         }));
         defaultImageUrl = downloadURLs[0];
      }

      // Process colors if any exist
      let processedColors = [];
      if (productColors.length > 0) {
        processedColors = await Promise.all(productColors.map(async (colorObj) => {
          let imageUrl = colorObj.imageUrl; // keep existing if editing
          if (colorObj.file) {
            let fileToUpload = colorObj.file;
            try {
              if (fileToUpload.type.startsWith('image/')) {
                fileToUpload = await compressImage(fileToUpload);
              }
            } catch(e) { console.warn('Color image compression failed', e); }

            const storageRef = ref(storage, `products/color_${Date.now()}_${fileToUpload.name}`);
            const uploadTask = uploadBytesResumable(storageRef, fileToUpload);
            await new Promise((resolve, reject) => {
               uploadTask.on('state_changed', null, reject, async () => {
                 imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                 resolve();
               });
            });
          }
          return { name: colorObj.name, hex: colorObj.hex, imageUrl };
        }));
      }

      const payload = {
        name,
        category,
        price: Number(price),
        currency: "ETB",
        description,
        shippingTime,
        inStock,
        isBestseller,
        isNewIn,
        isDeal
      };

      if (downloadURLs.length > 0) {
        payload.imageUrl = defaultImageUrl;
        payload.images = downloadURLs;
      }
      
      if (processedColors.length > 0) {
        payload.colors = processedColors;
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
     setShippingTime(product.shippingTime || 'Arrives in 1-2 days');
     setInStock(product.inStock);
     setIsBestseller(product.isBestseller || false);
     setIsNewIn(product.isNewIn || false);
     setIsDeal(product.isDeal || false);
     setProductColors(product.colors || []);
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
     setEditId(null); setName(''); setPrice(''); setDescription(''); setCategory('Makhawar (ቶብ)'); setShippingTime('Arrives in 1-2 days'); setImageFiles([]); setProductColors([]);
     setIsBestseller(false); setIsNewIn(false); setIsDeal(false); setUploadProgress(0);
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
             <button onClick={() => navigate(-1)} className="flex items-center text-sm font-bold uppercase tracking-widest text-gold hover:text-black dark:hover:text-white transition-colors mb-4">
               <ArrowLeft className="w-4 h-4 mr-2" /> Back
             </button>
             <h1 className="text-3xl font-display text-luna-black dark:text-luna-white">{t('dashboard')}</h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('manageInventory')}</p>
          </div>
          
          <button 
             onClick={() => setActiveTab('overview')}
             className={`flex items-center px-4 py-3 text-left transition-colors ${activeTab === 'overview' ? 'bg-gold text-black font-semibold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
          >
             <LayoutDashboard className="w-5 h-5 mr-3" />
             Dashboard Overview
          </button>

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
          
          {/* Overview Dashboard Tab */}
          {activeTab === 'overview' && (
             <div>
               <h2 className="text-2xl font-display text-luna-black dark:text-luna-white uppercase tracking-wider mb-6">Store Overview</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Products</h3>
                    <p className="text-4xl font-display text-black dark:text-white">{products.length}</p>
                 </div>
                 <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">In Stock</h3>
                    <p className="text-4xl font-display text-green-600 dark:text-green-400">{products.filter(p => p.inStock).length}</p>
                 </div>
                 <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Sold Out</h3>
                    <p className="text-4xl font-display text-red-600 dark:text-red-400">{products.filter(p => !p.inStock).length}</p>
                 </div>
               </div>
               
               <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-black dark:text-white mb-4">Quick Actions</h3>
                  <div className="flex gap-4">
                     <button onClick={() => { setActiveTab('products'); resetForm(); }} className="bg-gold text-black px-6 py-3 font-bold uppercase tracking-wider text-sm hover:opacity-90 transition-opacity shadow-sm">Add New Product</button>
                     <button onClick={() => setActiveTab('manage')} className="border border-gold text-gold px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-gold hover:text-black transition-colors">Manage Catalog</button>
                  </div>
               </div>
             </div>
          )}

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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shipping Details</label>
                  <input type="text" value={shippingTime} onChange={e => setShippingTime(e.target.value)} placeholder="e.g. Arrives in 1-2 days" required className="w-full dark:text-white bg-transparent border-gray-300 dark:border-gray-700 border p-2 focus:ring-gold focus:border-gold outline-none" />
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
                      required={!isFirebaseConfigured && !editId ? false : (!editId && productColors.length === 0)}
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

                {/* Color Variant Builder */}
                <div className="border border-gray-200 dark:border-gray-800 p-4 rounded bg-gray-50 dark:bg-black/20">
                   <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Color Variants (Dynamic Images)</label>
                      <button type="button" onClick={addColorVariant} className="text-xs bg-gold text-black px-2 py-1 font-bold shadow-sm hover:scale-105 active:scale-95 transition-transform">+ Add Color</button>
                   </div>
                   {productColors.map((color, index) => (
                     <div key={index} className="flex flex-col md:flex-row gap-3 mb-3 p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111] items-center relative rounded">
                        <button type="button" onClick={() => removeColorVariant(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs w-5 h-5 flex items-center justify-center hover:bg-red-600 z-20">x</button>
                        <input type="text" placeholder="Color Name (e.g. Red)" value={color.name} onChange={e => updateColorVariant(index, 'name', e.target.value)} className="w-full md:w-1/3 bg-transparent border border-gray-300 dark:border-gray-700 p-2 text-sm dark:text-white outline-none focus:border-gold" required />
                        <div className="flex items-center space-x-2">
                           <input type="color" value={color.hex} onChange={e => updateColorVariant(index, 'hex', e.target.value)} className="w-10 h-10 cursor-pointer rounded overflow-hidden p-0 border-0" title="Pick Color Hex" />
                           <span className="text-xs text-gray-500 font-mono uppercase">{color.hex}</span>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 p-2 text-center text-xs relative cursor-pointer hover:border-gold transition-colors min-h-[40px] w-full">
                           <input type="file" accept="image/*" onChange={e => updateColorVariant(index, 'file', e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                           <span className="text-gray-500 font-bold">{color.file ? color.file.name : (color.imageUrl ? 'Image Attached ✓' : 'Upload Color Image')}</span>
                        </div>
                     </div>
                   ))}
                   {productColors.length === 0 && <p className="text-xs text-gray-500 italic mt-2">No color variants added. Customers will see default generic images.</p>}
                </div>

                <div className="flex flex-col space-y-3 p-4 bg-gray-50 dark:bg-[#151515] rounded border border-gray-200 dark:border-gray-800">
                   <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-1">Product Tags</h3>
                   <div className="flex items-center space-x-2">
                      <input type="checkbox" id="inStock" checked={inStock} onChange={e => setInStock(e.target.checked)} className="w-4 h-4 text-gold cursor-pointer" />
                      <label htmlFor="inStock" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">{t('inStock')}</label>
                   </div>
                   <div className="flex items-center space-x-2">
                      <input type="checkbox" id="isBestseller" checked={isBestseller} onChange={e => setIsBestseller(e.target.checked)} className="w-4 h-4 text-gold cursor-pointer" />
                      <label htmlFor="isBestseller" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Bestseller</label>
                   </div>
                   <div className="flex items-center space-x-2">
                      <input type="checkbox" id="isNewIn" checked={isNewIn} onChange={e => setIsNewIn(e.target.checked)} className="w-4 h-4 text-gold cursor-pointer" />
                      <label htmlFor="isNewIn" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">New In</label>
                   </div>
                   <div className="flex items-center space-x-2">
                      <input type="checkbox" id="isDeal" checked={isDeal} onChange={e => setIsDeal(e.target.checked)} className="w-4 h-4 text-gold cursor-pointer" />
                      <label htmlFor="isDeal" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Deals / Discounted</label>
                   </div>
                </div>

                <button type="submit" disabled={uploading} className="w-full bg-luna-black dark:bg-gold text-white dark:text-black p-3 uppercase tracking-wider font-bold hover:opacity-90 transition-opacity disabled:opacity-50 relative overflow-hidden">
                  {uploading && uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="absolute top-0 left-0 h-full bg-white/20 dark:bg-black/20 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  )}
                  <span className="relative z-10">
                    {uploading ? (uploadProgress > 0 ? `UPLOADING (${uploadProgress}%)` : t('publishing')) : (editId ? 'SAVE CHANGES' : t('publish'))}
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* Manage Products Tab */}
          {activeTab === 'manage' && (
            <div className="flex flex-col">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-display text-luna-black dark:text-luna-white uppercase tracking-wider">Manage Catalog</h2>
                 <input 
                   type="text" 
                   placeholder="Search items..." 
                   className="border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white px-3 py-2 w-[220px] outline-none focus:border-gold text-sm transition-colors"
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                 />
               </div>
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
                       {products
                         .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category?.toLowerCase().includes(searchQuery.toLowerCase()))
                         .slice(0, 50)
                         .map(p => (
                          <tr key={p.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                             <td className="px-4 py-3 flex items-center font-medium min-w-[200px]">
                                <div className="flex-shrink-0 w-10 h-10 mr-3">
                                   <img src={p.imageUrl} alt="" className="w-full h-full rounded object-cover border border-gray-300 dark:border-gray-700" />
                                </div>
                                <span className="truncate max-w-[150px]">{p.name}</span>
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
