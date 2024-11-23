import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { CategoryRoutes } from './category/routes';
import { ProductRoutes } from './product/routes';
import { FileUploadRoutes } from './file-upload/routes';
import { ImagesRoutes } from './images/routes';



export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/api/v1/auth', AuthRoutes.routes );
    router.use('/api/v1/category', CategoryRoutes.routes );
    router.use('/api/v1/product', ProductRoutes.routes );
    router.use('/api/v1/upload', FileUploadRoutes.routes );
    router.use('/api/v1/image', ImagesRoutes.routes);

    return router;
  }


}

