import { Router, Request, Response } from "express";
import { ImagesController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ValidEntityTypeMiddleware } from "../middlewares/valid-entity-type.middleware";


export class ImagesRoutes {

  private static readonly _controller: ImagesController = new ImagesController();

  public static get routes(): Router {
    const router = Router();
    router.get('/:type/:imageName', [AuthMiddleware.validateToken, ValidEntityTypeMiddleware.isValid(['user', 'product', 'category'])], (req: Request, resp: Response) => this._controller.getImage(req, resp));
    return router;
  };

}