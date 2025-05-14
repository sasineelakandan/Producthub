'use client';

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCategories, saveProduct, uploadImage } from '@/service/productService';
import Navbar from '../component/Navbar';
import {ProductFormData} from '../../types/index'


const AddProduct: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ProductFormData>({
    defaultValues: {
      IsInventory: true,
      GSTApplicable: true,
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productIdInput, setProductIdInput] = useState('');
  const [category,setcategory]=useState([])

  
  const sellingPrice = watch('SellingPrice') || 0;
  const costOfGoods = watch('CostOfGoods') || 0;
  const profit = sellingPrice - costOfGoods;
  const profitMargin = costOfGoods > 0 ? ((profit / costOfGoods) * 100).toFixed(2) : '0';
   useEffect(()=>{
    async function fetchcategory(){
      try{
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Authentication token not found!');
          return;
        }
        const response=await getCategories(token)
        setcategory(response.data)
      }catch(err){
        console.log(err)
      }
    }
    fetchcategory()
   },[])
  const handleImageUpload = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found!');
        return;
      }

      if (!imageFile) {
        toast.error('Please select an image to upload!');
        return;
      }

      if (!productIdInput) {
        toast.error('Please enter a product ID!');
        return;
      }

      const productId = parseInt(productIdInput);
      if (isNaN(productId)) {
        toast.error('Product ID must be a number');
        return;
      }

      setIsSubmitting(true);
      await uploadImage(token, imageFile, productId);
      toast.success('Image uploaded successfully!');
      
      // Reset image fields after upload
      setImageFile(null);
      setImageURL(null);
      setProductIdInput('');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Image upload failed!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
      setImageFile(file);
      setImageURL(URL.createObjectURL(file));
    }
  };

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found!');
        return;
      }

      setIsSubmitting(true);
      console.log(data)
      const response = await saveProduct(token, data);
      setProductIdInput(response.data.Data.Id)
      if (response) {
        toast.success('Product submitted successfully!');
        
        
        reset();
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error: any) {
      console.error('Submission Error:', error);
      toast.error(error?.response?.data?.message || 'Submission failed!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <div>
      <Navbar/>
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer position="top-right" autoClose={5000} />
      
      
      
     
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <h2 className="text-3xl font-bold">Add New Product</h2>
          <p className="opacity-90">Fill in the details below to add a new product to your inventory</p>
        </div>

        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Item Name *</label>
              <input
                {...register('ItemName', {
                  required: 'Item name is required',
                  minLength: {
                    value: 3,
                    message: 'Item name must be at least 3 characters',
                  },
                })}
                placeholder="e.g. Premium Wireless Headphones"
                className={`block w-full px-4 py-2 rounded-lg border ${
                  errors.ItemName ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
              {errors.ItemName && <p className="text-red-500 text-xs mt-1">{errors.ItemName.message}</p>}
            </div>

            {/* SKU */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">SKU *</label>
              <input
                type="number"
                {...register('SKU', {
                  required: 'SKU is required',
                  min: {
                    value: 1,
                    message: 'SKU must be a positive number',
                  },
                })}
                placeholder="e.g. 1001"
                className={`block w-full px-4 py-2 rounded-lg border ${
                  errors.SKU ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
              {errors.SKU && <p className="text-red-500 text-xs mt-1">{errors.SKU.message}</p>}
            </div>

            {/* Category */}
            <div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700">Category *</label>
  <select
    {...register('ItemCategoryId', { required: 'Category is required' })}
    className={`block w-full px-4 py-2 rounded-lg border ${
      errors.ItemCategoryId ? 'border-red-500' : 'border-gray-300'
    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
  >
    <option value="">Select a category</option>
    {category.map((cat:any) => (
      <option key={cat.Id} value={cat.Id}>
        {cat.Text}
      </option>
    ))}
  </select>
  {errors.ItemCategoryId && (
    <p className="text-red-500 text-xs mt-1">
      {errors.ItemCategoryId.message}
    </p>
  )}
</div>

            {/* Cost of Goods */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Cost of Goods *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  {...register('CostOfGoods', {
                    required: 'Cost is required',
                    min: {
                      value: 0.01,
                      message: 'Cost must be greater than 0',
                    },
                    valueAsNumber: true,
                  })}
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className={`block w-full pl-8 pr-4 py-2 rounded-lg border ${
                    errors.CostOfGoods ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
              </div>
              {errors.CostOfGoods && <p className="text-red-500 text-xs mt-1">{errors.CostOfGoods.message}</p>}
            </div>

            {/* Selling Price */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Selling Price *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  {...register('SellingPrice', {
                    required: 'Price is required',
                    min: {
                      value: 0.01,
                      message: 'Price must be greater than 0',
                    },
                    validate: (value) =>
                      value >= costOfGoods || 'Price should be greater than cost',
                    valueAsNumber: true,
                  })}
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className={`block w-full pl-8 pr-4 py-2 rounded-lg border ${
                    errors.SellingPrice ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
              </div>
              {errors.SellingPrice && <p className="text-red-500 text-xs mt-1">{errors.SellingPrice.message}</p>}
            </div>

            {/* Profit Display */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Profit</label>
              <div className="p-2 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${profit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Margin:</span>
                  <span className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {profitMargin}%
                  </span>
                </div>
              </div>
            </div>

            {/* Opening Stock */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Opening Stock *</label>
              <input
                {...register('OpeningStock', {
                  required: 'Opening stock is required',
                  min: {
                    value: 0,
                    message: 'Stock cannot be negative',
                  },
                  valueAsNumber: true,
                })}
                type="number"
                min="0"
                placeholder="e.g. 100"
                className={`block w-full px-4 py-2 rounded-lg border ${
                  errors.OpeningStock ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
              {errors.OpeningStock && <p className="text-red-500 text-xs mt-1">{errors.OpeningStock.message}</p>}
            </div>

            {/* Opening Stock Date */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Opening Stock Date *</label>
              <input
                {...register('OpeningStockDate', {
                  required: 'Date is required',
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return selectedDate >= today || 'Date must be today or in the future';
                  },
                })}
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className={`block w-full px-4 py-2 rounded-lg border ${
                  errors.OpeningStockDate ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
              {errors.OpeningStockDate && (
                <p className="text-red-500 text-xs mt-1">{errors.OpeningStockDate.message}</p>
              )}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6 justify-center">
            <label className="inline-flex items-center space-x-3 cursor-pointer">
              <div className="relative">
                <input
                  {...register('IsInventory')}
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
              <span className="text-gray-700 font-medium">Track Inventory</span>
            </label>

            <label className="inline-flex items-center space-x-3 cursor-pointer">
              <div className="relative">
                <input
                  {...register('GSTApplicable')}
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
              <span className="text-gray-700 font-medium">GST Applicable</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ${
                isSubmitting
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Add Product'}
            </button>
          </div>
        </div>
      </form>
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden mt-8 p-6">
        <h2 className="text-2xl font-bold mt-6">Upload Product Image</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product ID Input */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Product ID *</label>
            <input
              type="text"
              value={productIdInput}
              onChange={(e) => setProductIdInput(e.target.value)}
              placeholder="Enter product ID"
              className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          {/* Image Upload */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Product Image *</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <div className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
                  {imageFile ? 'Change Image' : 'Select Image'}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imageFile && (
                <span className="text-sm text-gray-600">{imageFile.name}</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Image Preview */}
        {imageURL && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Image Preview</h3>
            <div className="w-full max-w-md h-64 rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={imageURL} 
                alt="Preview" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}
        
        {/* Upload Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={isSubmitting || !imageFile || !productIdInput}
            className={`px-6 py-2 rounded-lg font-medium ${
              isSubmitting || !imageFile || !productIdInput
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isSubmitting ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AddProduct;