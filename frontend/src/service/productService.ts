
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_ADMIN_BACKEND_URL

const getAuthHeader = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


export const getProducts = async (token: string) => {
  const res = await axios.get(`${API_BASE}/api/Item/GetItems`, getAuthHeader(token));
  return res.data;
};


export const getProductImage = async (token: string, imagePath: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_BACKEND_URL}/api/Item/GetItemImage?img=${imagePath}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    })
  return res;
};


export const getCategories = async (token: string) => {
  const res = await axios.get(`${API_BASE}/api/Item/GetItemCategories`, getAuthHeader(token));
  return res.data;
};


// export const saveProduct = async (token: string, productData: any) => {
//   const res = await axios.post(`${API_BASE}/api/Item/Save`, productData, getAuthHeader(token));
//   return res.data;
// };


// export const uploadImage = async (token: string, imageFile: File) => {
//   const formData = new FormData();
//   formData.append('image', imageFile);

//   const res = await axios.post(`${API_BASE}/api/Item/UploadImage`, formData, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'multipart/form-data',
//     },
//   });
//   return res.data;
// };
