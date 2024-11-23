import { Request, Response, Router } from "express";
import { CategoryController } from "./controller";
import { HandleErrors } from "../../domain";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CategoryService } from '../services/category.service';


export class CategoryRoutes {

  private static readonly _controller: CategoryController = new CategoryController(new CategoryService(), new HandleErrors());

  public static get routes(): Router {

    const router = Router();

    router.get('/', (req: Request, resp: Response) => this._controller.getCategories(req, resp));
    router.post('/', [AuthMiddleware.validateToken], (req: Request, resp: Response) => this._controller.createCategory(req, resp));

    return router;
  }
}