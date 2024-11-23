import { Request, Response, Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { FileUploadController } from "./controller";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";
import { FileUploadService } from '../services/file-upload.service';
import { HandleErrors } from "../../domain";
import { UUID } from "../../config";
import { ValidEntityTypeMiddleware } from "../middlewares/valid-entity-type.middleware";


export class FileUploadRoutes {

  private static readonly _controller : FileUploadController = new FileUploadController( new FileUploadService( new UUID() ), new HandleErrors() );

  public static get routes(): Router {
    const router = Router();
    router.use(AuthMiddleware.validateToken);
    const FileUploadMiddlewareValidType = ValidEntityTypeMiddleware.isValid(['user', 'product', 'category']);
    router.post('/single/:type', [FileUploadMiddlewareValidType, FileUploadMiddleware.cointainFiles], (req: Request, resp: Response) => this._controller.uploadFile(req, resp));
    router.post('/multiple/:type', [FileUploadMiddlewareValidType, FileUploadMiddleware.cointainFiles], (req: Request, resp: Response) => this._controller.uploadMultipleFiles(req, resp));
    return router;
  }

}