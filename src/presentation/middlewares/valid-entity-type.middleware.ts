import { Request, Response, NextFunction } from "express";


export class ValidEntityTypeMiddleware {

  /**
   * Comprobar que el tipo de directorio a subir sea de una entidad permitida
   * @param req Request
   * @param resp Response
   * @param next NextFunction
   * @returns Function<void>
   */
  public static  isValid(availableTypes: Array<string>): (req: Request, resp: Response, next: NextFunction) => void {
    return (req: Request, resp: Response, next: NextFunction) => {
      const type : string = req.params.type ?? '';
      if( !availableTypes.includes( type ) ){
        resp.status(400).json({ message: `invalid type, only "${ availableTypes.join(', ') }" is allowed` });
        return;
      }
      next();
    };
  }

}