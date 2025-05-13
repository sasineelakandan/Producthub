import { IUserRepository } from "../interface/repositories/userRepository.interface";

export class UserRepository implements IUserRepository {
  
  getUserByEmail = async (email: string, password: string): Promise<any> => {
    try {
      if (email === process.env.ADMIN_NAME && password === process.env.ADMIN_PASSWORD) {
        return { success: true, isAdmin: true, message: "Admin authenticated" };
      } else {
        return { success: false, message: "Invalid credentials" };
      }
    } catch (error: any) {
      console.error("Error getting user by email:", error);
      throw new Error(error.message);
    }
  };
}