import { Router } from "express";
import { expressCallback } from "../utils/expressCallback";
import { UserController } from "../controllers/userController";
import { UserRepository } from "../repositories/userRepository";
import { UserService } from "../services/userService";

import { loginValidator } from "../middlewares/validators/loginValidator";

const router = Router();

const repository = new UserRepository();

const service = new UserService(repository);

const controller = new UserController(service);



router
  .route("/getAccess")
  .post( expressCallback(controller.userLogin));

export default router;
