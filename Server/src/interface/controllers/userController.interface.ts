import { Request } from "express";
import { ControllerResponse } from "./userController.types";

export interface IUserController {
  userLogin(httpRequest: Request): Promise<ControllerResponse>;
}
