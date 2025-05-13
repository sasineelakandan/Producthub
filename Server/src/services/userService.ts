import { IUserRepository } from "../interface/repositories/userRepository.interface";
import { IUserService } from "../interface/services/userService.interface";
import {
  UserSignupInput,
  UserSignupOutput,
} from "../interface/services/userService.types";


import { AppError } from "../utils/errors";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateJWT";

export class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }


  userLogin = async (
    email: string,
    password: string
  ): Promise<any> => {
    try {
      const user = await this.userRepository.getUserByEmail(email,password);

     
      const adminName = process.env.ADMIN_NAME ?? "admin";
      const accessToken = generateAccessToken(adminName, "admin");
      const refreshToken = generateRefreshToken(adminName, "admin");;

    return {
     ... user,
      accessToken,
      refreshToken
    }
    } catch (error: any) {
      console.log("Error in user service", error.message);
      throw new Error(error.message);
    }
  };
}
