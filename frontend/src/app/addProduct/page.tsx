'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import ReactImageMagnify from 'react-image-magnify';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { saveProduct, uploadImage } from '@/service/productService';

type ProductFormData = {
  Id: number;
  ItemCategoryId: number;
  SKU: number;
  ItemName: string;
  CostOfGoods: number;
  SellingPrice: number;
  OpeningStock: number;
  OpeningStockDate: string;
  IsInventory: boolean;
  GSTApplicable: boolean;
};

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
  
      setIsSubmitting(true);
  
     
      await uploadImage(token, imageFile);
  
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Image upload failed!');
    } finally {
      setIsSubmitting(false);
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
      console.log('Final data to be sent:', data);

      const response = await saveProduct(token, data);

      if (response) {
        toast.success('Product submitted successfully!');
        console.log('Submitted Data:', response.data);
        
        reset();
        setImageFile(null);
        setImageURL(null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
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

  const sellingPrice = watch('SellingPrice') || 0;
  const costOfGoods = watch('CostOfGoods') || 0;
  const profit = sellingPrice - costOfGoods;
  const profitMargin = costOfGoods > 0 ? ((profit / costOfGoods) * 100).toFixed(2) : '0';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer position="top-right" autoClose={5000} />
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <h2 className="text-3xl font-bold">Add New Product</h2>
          <p className="opacity-90">Fill in the details below to add a new product to your inventory</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Image Upload Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              {imageURL ? (
                <div className="w-full max-w-md h-96 rounded-lg shadow-md overflow-hidden border-2 border-gray-200 transition-all duration-300 group-hover:shadow-lg">
                  <div className="relative w-full h-full">
                    <ReactImageMagnify
                      {...{
                        smallImage: {
                          alt: 'Product preview',
                          isFluidWidth: true,
                          src: imageURL,
                        },
                        largeImage: {
                          src: imageURL,
                          width: 1200,
                          height: 1200,
                        },
                        enlargedImageContainerStyle: {
                          zIndex: 50,
                          backgroundColor: 'white',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        },
                        enlargedImageContainerDimensions: {
                          width: '150%',
                          height: '150%',
                        },
                        isHintEnabled: true,
                        hintTextMouse: 'Hover to zoom',
                        hintTextTouch: 'Touch to zoom',
                        shouldUsePositiveSpaceLens: true,
                        imageClassName: 'object-contain w-full h-full',
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black bg-opacity-20">
                      <span className="text-white text-sm bg-black bg-opacity-70 px-3 py-1 rounded-full">
                        Change Image
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-md h-96 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="mt-2 text-sm">Click to upload product image</span>
                </div>
              )}
              <label
                className="absolute inset-0 cursor-pointer"
                htmlFor="product-image"
              />
            </div>

            <input
              id="product-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <input type="hidden" {...register('Id')} />

            {imageURL && (
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-md transition-colors font-medium ${
                  isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                }`}
                
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  'Upload Image'
                )}
              </button>
            )}
          </div>

          {/* Input Fields Grid */}
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
                <option value="1">Electronics</option>
                <option value="2">Clothing</option>
                <option value="3">Home & Kitchen</option>
                <option value="4">Books</option>
                <option value="5">Other</option>
              </select>
              {errors.ItemCategoryId && <p className="text-red-500 text-xs mt-1">{errors.ItemCategoryId.message}</p>}
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
    </div>
  );
};

export default AddProduct;