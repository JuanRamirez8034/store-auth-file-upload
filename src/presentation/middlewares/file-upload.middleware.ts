import { NextFunction, Request, Response } from "express";

/**
 * Middlewares para carga de archivos
 */
export class FileUploadMiddleware {

  /**
   * Verificar si existe archivo en la peticion y agregarlo al body
   * @param req Request
   * @param resp Response
   * @param next NextFunction
   * @returns Promise<void>
   */
  public static async cointainFiles(req: Request, resp: Response, next: NextFunction): Promise<void>{
    // existencia de archivos
    if( !req.files || Object.keys(req.files).length === 0 ) {
      resp.status(400).json({ message: 'file not available' });
      return;
    }
    // agregandolos al body
    req.body.files = ( !Array.isArray( req.files.file ) )  ? [req.files.file] : req.files.file;
    
    next();
  }

}