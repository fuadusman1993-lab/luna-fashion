import { useState, useEffect } from 'react';
import { auth, db, storage, isFirebaseConfigured } from '../services/firebase';
import { signInWithEmailAndPassword, signOut, EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword } from 'firebase/auth';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, where, getDocs, Timestamp, writeBatch } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAppContext } from '../context/AppContext';
import { User, Settings, PackagePlus, ListTree, Pencil, Trash2, LayoutDashboard, ArrowLeft, Image as ImageIcon, Shield, BarChart2, Users } from 'lucide-react';
import { useProducts, addLocalProduct, updateLocalProduct, deleteLocalProduct } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const navigate = useNavigate();
  const { t } = useAppContext();
  const { isAdmin, setAdminPin } = useAuth();
  const { products } = useProducts();
  const { categories } = useCategories();
  const [activeTab, setActiveTab] = useState('overview');

  // Analytics State
  const [activeUsers, setActiveUsers] = useState(0);
  const [dailyVisits, setDailyVisits] = useState(0);
  const [weeklyVisits, setWeeklyVisits] = useState(0);
  const [topPages, setTopPages] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const fetchAnalytics = async () => {
    if (!isFirebaseConfigured) return;
    setAnalyticsLoading(true);
    try {
      const now = new Date();
      const activeThreshold = new Date(now.getTime() - 150000);
      const activeQ = query(collection(db, 'active_sessions'), where('lastActive', '>=', Timestamp.fromDate(activeThreshold)));
      const activeSnap = await getDocs(activeQ);
      setActiveUsers(activeSnap.size);

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const todayQ = query(collection(db, 'page_visits'), where('timestamp', '>=', Timestamp.fromDate(startOfDay)));
      const todaySnap = await getDocs(todayQ);
      setDailyVisits(todaySnap.size);

      const startOfWeek = new Date();
      startOfWeek.setDate(now.getDate() - 7);
      const weekQ = query(collection(db, 'page_visits'), where('timestamp', '>=', Timestamp.fromDate(startOfWeek)));
      const weekSnap = await getDocs(weekQ);
      setWeeklyVisits(weekSnap.size);

      const pageCounts = {};
      weekSnap.forEach(doc => {
        const path = doc.data().path || 'Unknown';
        pageCounts[path] = (pageCounts[path] || 0) + 1;
      });
      const top = Object.keys(pageCounts).map(path => ({ path, count: pageCounts[path] }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);
      setTopPages(top);
    } catch (err) {
      console.warn("Analytics fetch error:", err);
    }
    setAnalyticsLoading(false);
  };

  const resetAnalyticsStats = async () => {
    if (!window.confirm("Are you sure you want to permanently delete all page visits? This will reset the counters to 0.")) return;
    setAnalyticsLoading(true);
    try {
      const snap = await getDocs(collection(db, 'page_visits'));
      const batch = writeBatch(db);
      snap.forEach(document => {
        batch.delete(document.ref);
      });
      await batch.commit();
      
      // Reset local state
      setDailyVisits(0);
      setWeeklyVisits(0);
      setTopPages([]);
      alert("Analytics successfully reset to 0.");
    } catch (err) {
      console.error("Failed to reset analytics:", err);
      alert("Error resetting analytics.");
    }
    setAnalyticsLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
      const interval = setInterval(fetchAnalytics, 30000); // refresh every 30s while viewing
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPin, setNewPin] = useState('');
  const [secSuccess, setSecSuccess] = useState('');
  const [secError, setSecError] = useState('');
  const [secLoading, setSecLoading] = useState(false);

  // Route Guard
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Category Form State
  const [catEditId, setCatEditId] = useState(null);
  const [catName, setCatName] = useState('');
  const [catOrder, setCatOrder] = useState('');
  const [catImageFile, setCatImageFile] = useState(null);
  const [catUploading, setCatUploading] = useState(false);
  const [catUploadProgress, setCatUploadProgress] = useState(0);
  const [catSuccessMsg, setCatSuccessMsg] = useState('');
  const [catErrorMsg, setCatErrorMsg] = useState('');

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

  const PREDEFINED_COLORS = [
    { name: 'Original (As Shown)', hex: '#f5f5f5' },
    { name: 'Black', hex: '#0a0a0a' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Mocha', hex: '#6b4c3a' },
    { name: 'Ivory', hex: '#f8f5f0' },
    { name: 'Gold', hex: '#D4AF37' },
    { name: 'Silver', hex: '#C0C0C0' },
    { name: 'Red', hex: '#ef4444' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Green', hex: '#22c55e' },
    { name: 'Pink', hex: '#ec4899' },
    { name: 'Navy', hex: '#1e3a8a' }
  ];

  const addColorVariant = () => {
    setProductColors([...productColors, { name: PREDEFINED_COLORS[0].name, hex: PREDEFINED_COLORS[0].hex, file: null, imageUrl: null }]);
  };

  const handleColorSelect = (index, selectedName) => {
    const selectedColor = PREDEFINED_COLORS.find(c => c.name === selectedName);
    const newColors = [...productColors];
    newColors[index].name = selectedColor.name;
    newColors[index].hex = selectedColor.hex;
    setProductColors(newColors);
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

  const resetCatForm = () => {
    setCatEditId(null);
    setCatName('');
    setCatOrder('');
    setCatImageFile(null);
    setCatUploadProgress(0);
  };

  const handleEditCategoryPrep = (cat) => {
    setCatEditId(cat.id);
    setCatName(cat.name);
    setCatOrder(cat.order);
    setCatImageFile(null);
    window.scrollTo(0, 0);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Delete this category permanently?")) {
      if (isFirebaseConfigured) {
        await deleteDoc(doc(db, "categories", id));
      }
    }
  };

  const handleCreateOrUpdateCategory = async (e) => {
    e.preventDefault();
    setCatUploading(true);
    setCatSuccessMsg('');
    setCatErrorMsg('');

    if (!isFirebaseConfigured) {
      setCatErrorMsg('Database not configured.');
      setCatUploading(false);
      return;
    }

    if (!catImageFile && !catEditId) {
      setCatErrorMsg('Please select an image file first.');
      setCatUploading(false);
      return;
    }

    try {
      let imageUrl = null;
      if (catImageFile) {
        let file = catImageFile;
        try {
          if (catImageFile.type.startsWith('image/')) {
            file = await compressImage(catImageFile);
          }
        } catch (err) {
          console.warn("Image compression failed, using original", err);
        }

        const storageRef = ref(storage, `categories/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setCatUploadProgress(Math.round(progress));
            },
            reject, 
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      const payload = {
        name: catName,
        order: Number(catOrder)
      };

      if (imageUrl) {
        payload.imageUrl = imageUrl;
      }

      if (catEditId) {
        await updateDoc(doc(db, "categories", catEditId), payload);
        setCatSuccessMsg('Category updated successfully!');
      } else {
        await addDoc(collection(db, "categories"), payload);
        setCatSuccessMsg('Category added successfully!');
      }

      setCatUploading(false);
      resetCatForm();
    } catch (err) {
      setCatErrorMsg(err.message);
      setCatUploading(false);
    }
  };

  const handleSecurityUpdate = async (e) => {
    e.preventDefault();
    setSecSuccess('');
    setSecError('');
    setSecLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user.");

      if (!currentPassword) {
         throw new Error("Current Password is required to make security changes.");
      }

      // Re-authenticate
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update Email
      if (newEmail && newEmail !== user.email) {
        await updateEmail(user, newEmail);
      }

      // Update Password
      if (newPassword) {
        if (newPassword.length < 6) throw new Error("Password must be at least 6 characters.");
        await updatePassword(user, newPassword);
      }

      // Update PIN
      if (newPin) {
        if (newPin.length !== 4 || isNaN(Number(newPin))) throw new Error("PIN must be exactly 4 digits.");
        await updateDoc(doc(db, "users", user.uid), { adminPin: newPin });
        if (setAdminPin) setAdminPin(newPin);
      }

      setSecSuccess("Security credentials updated successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setNewPin('');
    } catch (err) {
      setSecError(err.message);
    }
    setSecLoading(false);
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

  if (!isAdmin) {
    return null; // Redirecting...
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
             onClick={() => { setActiveTab('products'); resetForm(); }}
             className={`flex items-center px-4 py-3 text-left transition-colors ${activeTab === 'products' ? 'bg-gold text-black font-semibold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
          >
             <PackagePlus className="w-5 h-5 mr-3" />
             {t('addNewProduct')}
          </button>

          <button 
             onClick={() => { setActiveTab('manage'); resetForm(); }}
             className={`flex items-center px-4 py-3 text-left transition-colors ${activeTab === 'manage' ? 'bg-gold text-black font-semibold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
          >
             <ListTree className="w-5 h-5 mr-3" />
             Manage Catalog
          </button>
          
          <button 
             onClick={() => { setActiveTab('categories'); resetCatForm(); }}
             className={`flex items-center px-4 py-3 text-left transition-colors ${activeTab === 'categories' ? 'bg-gold text-black font-semibold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
          >
             <ImageIcon className="w-5 h-5 mr-3" />
             Home Categories
          </button>
          


          <button 
             onClick={() => setActiveTab('security')}
             className={`flex items-center px-4 py-3 text-left transition-colors ${activeTab === 'security' ? 'bg-gold text-black font-semibold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
          >
             <Shield className="w-5 h-5 mr-3" />
             Security Settings
          </button>

          <button 
             onClick={() => setActiveTab('analytics')}
             className={`flex items-center px-4 py-3 text-left transition-colors ${activeTab === 'analytics' ? 'bg-gold text-black font-semibold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
          >
             <BarChart2 className="w-5 h-5 mr-3" />
             App Analytics
          </button>

          <button 
            onClick={() => {
              navigate('/');
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
                        
                        <div className="w-full md:w-1/3 flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full border border-gray-300 shadow-inner flex-shrink-0" style={{ backgroundColor: color.hex }}></div>
                           <select 
                              value={color.name} 
                              onChange={e => handleColorSelect(index, e.target.value)} 
                              className="w-full bg-transparent border border-gray-300 dark:border-gray-700 p-2 text-sm dark:text-white outline-none focus:border-gold appearance-none cursor-pointer"
                           >
                              {PREDEFINED_COLORS.map(pc => (
                                 <option key={pc.name} value={pc.name} className="text-black">{pc.name}</option>
                              ))}
                           </select>
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

          {activeTab === 'categories' && (
            <div className="flex flex-col">
               <h2 className="text-2xl font-display text-luna-black dark:text-luna-white uppercase tracking-wider mb-6">Home Categories</h2>
               
               {/* Category Form */}
               <div className="bg-gray-50 dark:bg-[#151515] p-6 rounded border border-gray-200 dark:border-gray-800 mb-8">
                 <h3 className="text-lg font-bold text-black dark:text-white mb-4">{catEditId ? 'Edit Category' : 'Add New Category'}</h3>
                 {catSuccessMsg && <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 text-sm">{catSuccessMsg}</div>}
                 {catErrorMsg && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 text-sm">{catErrorMsg}</div>}
                 
                 <form onSubmit={handleCreateOrUpdateCategory} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Name</label>
                         <input type="text" value={catName} onChange={e => setCatName(e.target.value)} required className="w-full dark:text-white bg-transparent border-gray-300 dark:border-gray-700 border p-2 focus:ring-gold focus:border-gold outline-none" placeholder="e.g. Makhawar" />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Order</label>
                         <input type="number" value={catOrder} onChange={e => setCatOrder(e.target.value)} required className="w-full dark:text-white bg-transparent border-gray-300 dark:border-gray-700 border p-2 focus:ring-gold focus:border-gold outline-none" placeholder="e.g. 1" />
                       </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{catEditId ? 'Update Image (Optional)' : 'Category Image'}</label>
                      <input type="file" accept="image/*" onChange={e => setCatImageFile(e.target.files[0])} required={!catEditId} className="w-full dark:text-white bg-transparent border border-dashed border-gray-300 dark:border-gray-700 p-2 cursor-pointer focus:border-gold" />
                    </div>
                    
                    <div className="flex gap-3">
                       <button type="submit" disabled={catUploading} className="flex-1 bg-luna-black dark:bg-gold text-white dark:text-black p-3 uppercase tracking-wider font-bold hover:opacity-90 transition-opacity disabled:opacity-50 relative overflow-hidden">
                         {catUploading && catUploadProgress > 0 && catUploadProgress < 100 && (
                           <div className="absolute top-0 left-0 h-full bg-white/20 dark:bg-black/20 transition-all duration-300" style={{ width: `${catUploadProgress}%` }}></div>
                         )}
                         <span className="relative z-10">
                           {catUploading ? (catUploadProgress > 0 ? `UPLOADING (${catUploadProgress}%)` : 'PUBLISHING...') : (catEditId ? 'UPDATE CATEGORY' : 'ADD CATEGORY')}
                         </span>
                       </button>
                       {catEditId && (
                          <button type="button" onClick={resetCatForm} className="px-4 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                       )}
                    </div>
                 </form>
               </div>

               <h3 className="text-lg font-bold text-black dark:text-white mb-4">Existing Categories</h3>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300 border-collapse">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white uppercase font-bold text-xs">
                       <tr>
                         <th className="px-4 py-3">Order</th>
                         <th className="px-4 py-3">Image</th>
                         <th className="px-4 py-3">Name</th>
                         <th className="px-4 py-3 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody>
                       {categories.map(cat => (
                          <tr key={cat.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                             <td className="px-4 py-3 font-bold">{cat.order}</td>
                             <td className="px-4 py-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm flex-shrink-0">
                                   {cat.imageUrl ? <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">No Img</div>}
                                </div>
                             </td>
                             <td className="px-4 py-3 font-medium">{cat.name}</td>
                             <td className="px-4 py-3 text-right">
                                <button onClick={() => handleEditCategoryPrep(cat)} className="text-gold p-1 hover:bg-gold/20 mr-2 rounded">
                                   <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 p-1 hover:bg-red-500/20 rounded">
                                   <Trash2 className="w-4 h-4" />
                                </button>
                             </td>
                          </tr>
                       ))}
                       {categories.length === 0 && (
                          <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-500">No home categories found.</td></tr>
                       )}
                    </tbody>
                 </table>
               </div>
            </div>
          )}



          {activeTab === 'security' && (
             <div>
               <h2 className="text-2xl font-display text-luna-black dark:text-luna-white mb-6 uppercase tracking-wider">Security Settings</h2>
               
               <div className="bg-gray-50 dark:bg-[#151515] p-6 rounded border border-gray-200 dark:border-gray-800 max-w-2xl">
                 {secSuccess && <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 font-medium">{secSuccess}</div>}
                 {secError && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 font-medium">{secError}</div>}
                 
                 <form onSubmit={handleSecurityUpdate} className="space-y-6">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 p-4 rounded mb-6">
                       <p className="text-sm text-yellow-800 dark:text-yellow-500 font-bold uppercase tracking-wider mb-2">Re-Authentication Required</p>
                       <p className="text-xs text-yellow-700 dark:text-yellow-600 mb-3">To update your security settings, you must provide your current password.</p>
                       <input 
                         type="password" 
                         value={currentPassword} 
                         onChange={e => setCurrentPassword(e.target.value)} 
                         required 
                         placeholder="Current Password" 
                         className="w-full dark:text-white bg-white dark:bg-black border-gray-300 dark:border-gray-700 border p-2 focus:ring-gold focus:border-gold outline-none" 
                       />
                    </div>

                    <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Update Email Address</label>
                         <input 
                           type="email" 
                           value={newEmail} 
                           onChange={e => setNewEmail(e.target.value)} 
                           placeholder="Enter new email" 
                           className="w-full dark:text-white bg-transparent border-gray-300 dark:border-gray-700 border p-2 focus:ring-gold focus:border-gold outline-none" 
                         />
                       </div>
                       
                       <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Update Password</label>
                         <input 
                           type="password" 
                           value={newPassword} 
                           onChange={e => setNewPassword(e.target.value)} 
                           placeholder="Enter new password (min 6 characters)" 
                           className="w-full dark:text-white bg-transparent border-gray-300 dark:border-gray-700 border p-2 focus:ring-gold focus:border-gold outline-none" 
                         />
                       </div>

                       <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Update Admin PIN</label>
                         <input 
                           type="text" 
                           maxLength={4}
                           value={newPin} 
                           onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))} 
                           placeholder="Enter new 4-digit PIN" 
                           className="w-full dark:text-white bg-transparent border-gray-300 dark:border-gray-700 border p-2 focus:ring-gold focus:border-gold outline-none" 
                         />
                         <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Used to access this dashboard from the Settings app page.</p>
                       </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={secLoading} 
                      className="w-full bg-luna-black dark:bg-gold text-white dark:text-black p-3 uppercase tracking-wider font-bold hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
                    >
                      {secLoading ? 'UPDATING SECURITY...' : 'SAVE SECURITY CHANGES'}
                    </button>
                 </form>
               </div>
             </div>
          )}

          {/* App Analytics Tab */}
          {activeTab === 'analytics' && (
             <div>
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-display text-luna-black dark:text-luna-white uppercase tracking-wider">Live Analytics</h2>
                 <div className="flex gap-2">
                   <button onClick={resetAnalyticsStats} className="text-[10px] font-bold uppercase border border-red-500 text-red-500 px-3 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                     Reset Stats
                   </button>
                   <button onClick={fetchAnalytics} className="text-[10px] font-bold uppercase border border-gray-300 dark:border-gray-700 px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                     Refresh
                   </button>
                 </div>
               </div>
               
               {analyticsLoading ? (
                  <p className="text-sm text-gray-500">Loading live data...</p>
               ) : (
                 <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 p-6 rounded-lg border border-green-200 dark:border-green-800/50 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-sm">
                        <Users className="w-12 h-12 text-green-500 mb-2 opacity-10 absolute -bottom-2 -right-2" />
                        <h3 className="text-xs font-bold text-green-700 dark:text-green-500 uppercase tracking-widest mb-1">Active Users Now</h3>
                        <p className="text-5xl font-display text-green-600 dark:text-green-400 font-bold flex items-center justify-center gap-3">
                           {activeUsers > 0 && <span className="w-4 h-4 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>}
                           {activeUsers}
                        </p>
                     </div>
                     <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center shadow-sm">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Visits Today</h3>
                        <p className="text-4xl font-display text-black dark:text-white">{dailyVisits}</p>
                     </div>
                     <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center shadow-sm">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Visits This Week</h3>
                        <p className="text-4xl font-display text-black dark:text-white">{weeklyVisits}</p>
                     </div>
                   </div>

                   <div className="bg-gray-50 dark:bg-[#151515] p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                     <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center">
                       <BarChart2 className="w-5 h-5 mr-2 text-gold" />
                       Top Visited Pages (Last 7 Days)
                     </h3>
                     {topPages.length > 0 ? (
                       <ul className="space-y-3">
                         {topPages.map((page, idx) => (
                           <li key={idx} className="flex justify-between items-center p-4 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-lg shadow-sm hover:border-gold/50 transition-colors">
                             <span className="font-medium text-gray-800 dark:text-gray-200">{page.path === '/' ? '/ (Home)' : page.path}</span>
                             <span className="bg-gold/20 border border-gold/30 text-gold font-bold px-3 py-1 rounded text-xs tracking-wider">{page.count} visits</span>
                           </li>
                         ))}
                       </ul>
                     ) : (
                       <p className="text-sm text-gray-500 p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded text-center">No page visit data available yet. Data will populate as users browse the app.</p>
                     )}
                   </div>
                 </div>
               )}
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
