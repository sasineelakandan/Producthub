import { Request } from "express";
import { IUserController } from "../interface/controllers/userController.interface";
import { ControllerResponse } from "../interface/controllers/userController.types";
import { IUserService } from "../interface/services/userService.interface";

export class UserController implements IUserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

 

  userLogin = async (httpRequest: Request): Promise<ControllerResponse> => {
    try {
      const { username, password } = httpRequest.body;
     console.log(username,password)
      const user = await this.userService.userLogin(username, password);
      const { accessToken, refreshToken } = user;

      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        body: user,
        accessToken,
        refreshToken,
      };
    } catch (e: any) {
      console.log(e);
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: e.statusCode || 500,
        body: {
          error: e.message,
        },
      };
    }
  };
}
