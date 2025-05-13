import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5000;

export const MONGO_URI = () => {
  if (!process.env.MONGO_URI) throw new Error("Mongo URI not found in env");
  return String(process.env.MONGO_URI);
};



export const FRONTEND_URL = () => {
  if (!process.env.FRONTEND_URL) return null;
  return String(process.env.FRONTEND_URL);
};

export const JWT_SECRET = () => {
  if (!process.env.JWT_KEY) throw new Error("JWT secret not found in env");
  return String(process.env.JWT_KEY);
};
