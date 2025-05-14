'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProductImage, getProducts } from '../../service/productService';
import { FiHeart, FiShoppingCart, FiStar, FiChevronRight, FiShare2 } from 'react-icons/fi';
import Navbar from '../component/Navbar';


interface Product {
  Id: number;
  ItemName: string;
  Category: string;
  SellingPrice: number;
  ImagePath: string;
  CostOfGoods?: number;
  GSTApplicable?: boolean;
  OpeningStock?: number;
  OpeningStockDate?: string;
  SKU?: string;
  Rating?: number;
  Description?: string;
}

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('XS');
  const [quantity, setQuantity] = useState<number>(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [imageMap, setImageMap] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);

  const fetchImageWithToken = async (imagePath: string) => {
    const token = localStorage.getItem('token');
    if (!token) return '';

    try {
      const res = await getProductImage(token, imagePath);
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching image:', error);
      return '';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        setLoading(true);
        const items: Product[] = await getProducts(token);
        setRelatedProducts(items);

        const first = items[0];
        setProduct(first);

        const imageUrls: { [key: number]: string } = {};
        for (const item of items) {
          imageUrls[item.Id] = await fetchImageWithToken(item.ImagePath);
        }

        setImageMap(imageUrls);
        if (first) setSelectedImage(imageUrls[first.Id]);
      } catch (error) {
        console.error('Error fetching products or images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-700"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">No Products Available</h2>
        <p className="text-gray-600 mb-4">Add products to see them listed here</p>
        <Link href="/addproduct">
          <button className="bg-indigo-700 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition">
            Add Product
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT: Product Detail */}
          <div className="lg:w-1/2 w-full bg-white rounded-xl shadow-md p-6">
            <div className="relative">
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt="Main" 
                  className="w-full object-contain h-[400px] rounded-lg bg-gray-100" 
                />
              ) : (
                <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md">
                <FiShare2 className="text-gray-600 hover:text-indigo-700 cursor-pointer" />
              </div>
            </div>
            
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {selectedImage && (
                <div className="flex-shrink-0">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-20 h-20 object-contain cursor-pointer rounded border-2 border-indigo-500"
                    onClick={() => setSelectedImage(selectedImage)}
                  />
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{product.ItemName}</h2>
                  <p className="text-gray-500 capitalize">{product.Category}</p>
                </div>
                <div className="flex items-center bg-indigo-100 px-3 py-1 rounded-full">
                  <FiStar className="text-yellow-500 mr-1" />
                  <span className="font-medium">{product.Rating || '4.5'}</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-3xl font-bold text-indigo-700">₹{product.SellingPrice.toFixed(2)}</p>
                {product.CostOfGoods && (
                  <p className="text-sm text-gray-500">
                    <span className="line-through">₹{product.CostOfGoods.toFixed(2)}</span> 
                    <span className="ml-2 text-green-600">
                      {Math.round((1 - product.SellingPrice/product.CostOfGoods) * 100)}% OFF
                    </span>
                  </p>
                )}
              </div>

              {product.Description && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800">Description</h3>
                  <p className="text-gray-600 mt-1">{product.Description}</p>
                </div>
              )}

              <div className="mt-6">
                <h3 className="font-semibold text-gray-800">Size</h3>
             
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-800">Quantity</h3>
                <div className="flex items-center mt-2">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-l-lg flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <div className="w-12 h-10 border-t border-b border-gray-300 flex items-center justify-center">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-r-lg flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button className="bg-indigo-700 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition flex-1 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                  <FiShoppingCart />
                  <span>Add to Cart</span>
                </button>
                <button className="border border-indigo-700 text-indigo-700 px-6 py-3 rounded-lg hover:bg-indigo-50 transition flex items-center justify-center gap-2">
                  <FiHeart />
                  <span>Wishlist</span>
                </button>
              </div>

              
            </div>
          </div>

          {/* RIGHT: Related Products */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">You May Also Like</h3>
              <div className="grid sm:grid-cols-2 gap-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
                {relatedProducts.map((prod) => (
                  <div
                    key={prod.Id}
                    className="bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-all hover:shadow-md overflow-hidden group"
                  >
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      {imageMap[prod.Id] ? (
                        <img
                          src={imageMap[prod.Id]}
                          alt={prod.ItemName}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiHeart className="text-gray-400 hover:text-red-500 cursor-pointer" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-gray-800 truncate">{prod.ItemName}</h4>
                      <p className="text-indigo-700 font-semibold mt-1">₹{prod.SellingPrice.toFixed(2)}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center">
                          <FiStar className="text-yellow-400 text-sm" />
                          <span className="text-xs text-gray-600 ml-1">{prod.Rating || '4.5'}</span>
                        </div>
                        <button
                          onClick={() => {
                            setProduct(prod);
                            setSelectedImage(imageMap[prod.Id]);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-xs text-indigo-700 font-medium hover:underline"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}