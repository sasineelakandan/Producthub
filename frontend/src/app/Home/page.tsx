'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProductImage, getProducts } from '../../service/productService';

const Navbar = () => (
  <nav className="bg-white shadow p-4 flex justify-between items-center">
    <div className="text-xl font-bold">MyShop</div>
    <div className="flex gap-4 items-center">
      <Link href="/add-product">
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
          Add Product
        </button>
      </Link>
    </div>
  </nav>
);

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
}

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('XS');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [imageMap, setImageMap] = useState<{ [key: number]: string }>({});

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
        const items: Product[] = await getProducts(token);
        setRelatedProducts(items);

        const first = items[0];
        setProduct(first);

        const imageUrls: { [key: number]: string } = {};
        for (const item of items) {
          imageUrls[item.Id] = await fetchImageWithToken(item.ImagePath);
        }

        setImageMap(imageUrls);
        setSelectedImage(imageUrls[first.Id]);
      } catch (error) {
        console.error('Error fetching products or images:', error);
      }
    };

    fetchData();
  }, []);

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)] overflow-hidden">
          {/* LEFT: Product Detail */}
          <div className="lg:w-1/2 w-full bg-white rounded-xl shadow p-6 overflow-y-auto">
            {selectedImage ? (
              <img src={selectedImage} alt="Main" className="w-full object-contain h-[300px]" />
            ) : (
              <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <div className="flex gap-2 mt-4">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-16 h-16 object-contain cursor-pointer border border-black"
                  onClick={() => setSelectedImage(selectedImage)}
                />
              )}
            </div>
            <h2 className="text-2xl font-bold mt-4">{product.ItemName}</h2>
            <p className="text-gray-500">{product.Category}</p>
            <p className="text-xl font-semibold">₹{product.SellingPrice}</p>

            <div className="mt-3">
              <span className="font-medium">Size: </span>
              <div className="flex gap-2 mt-1">
                {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded ${
                      selectedSize === size ? 'bg-black text-white' : 'border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
                Add to cart
              </button>
              <button className="border px-6 py-2 rounded hover:bg-gray-200">❤️ Favorite</button>
            </div>

            <p className="text-sm text-gray-500 mt-3">
              Shipping* <br />
              To get accurate shipping information{' '}
              <a href="#" className="text-blue-500 underline">
                Edit Location
              </a>
            </p>
          </div>

          {/* RIGHT: Other Products */}
          <div className="lg:w-1/2 w-full overflow-y-auto pr-2">
            <h3 className="text-xl font-bold mb-4">Other Products</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-4">
              {relatedProducts.map((prod) => (
                <div
                  key={prod.Id}
                  className="bg-white shadow rounded p-4 hover:shadow-md transition"
                >
                  {imageMap[prod.Id] ? (
                    <img
                      src={imageMap[prod.Id]}
                      alt={prod.ItemName}
                      className="w-full h-[150px] object-contain"
                    />
                  ) : (
                    <div className="w-full h-[150px] bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
                  <h4 className="mt-2 font-medium">{prod.ItemName}</h4>
                  <p className="text-gray-500">₹{prod.SellingPrice}</p>
                  <button
                    onClick={() => {
                      setProduct(prod);
                      setSelectedImage(imageMap[prod.Id]);
                    }}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
