import { Request, Response, Router } from "express";
import { ProductController } from "./controller";
import { HandleErrors } from "../../domain";
import { ProductService } from "../services/product.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class ProductRoutes {

  private static readonly _controller: ProductController = new ProductController(new ProductService(), new HandleErrors());

  public static get routes(): Router {

    const router = Router();

    router.get('/', (req: Request, resp: Response) => this._controller.getProducts(req, resp));
    router.post('/', [AuthMiddleware.validateToken], (req: Request, resp: Response) => this._controller.createProduct(req, resp));

    return router;
  }
}