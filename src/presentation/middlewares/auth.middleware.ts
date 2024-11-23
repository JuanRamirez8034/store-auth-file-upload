import { NextFunction, Request, Response } from "express";
import { CustomError, HandleErrors } from "../../domain";
import { envs, JWT } from "../../config";
import { UserEntity } from "../../domain/entities";
import { UserModel } from "../../data";

/**
 * Middlewares de authenticacion
 */
export class AuthMiddleware {

  /**
   * Validar existencia de token en la solicitud realizada
   * @param req Request
   * @param resp Response
   * @param next NextFunction
   */
  public static async validateToken(req: Request, resp: Response, next: NextFunction): Promise<void> {
    try {
      // comprobacion del token de autorizacion
      const authorization = req.header('Authorization');
      if( !authorization ) throw CustomError.unAuthorized('Authorization token is requiered');
      if( !authorization.startsWith('Bearer ') ) throw CustomError.unAuthorized('Authorization token is not a Bearer valid token');
      const token : string = authorization.split(' ')[1];
      const payload = await new JWT(envs.JWT_SEED).validate<{ id: string }>(token);
      if( !payload || payload.id === undefined ) throw CustomError.unAuthorized('Authorization token is not a Bearer valid token')
      
      // comprobacion del usuario
      const findUser = await UserModel.findOne({ _id: payload.id });
      if( !findUser ) throw CustomError.internal('Authorization from user is invalid');

      // todo: validar si el usuario esta verificado

      // asigando informacion del usuario a la solicitud
      req.body.user = UserEntity.fromObject( findUser as {} );
      
      next();
    } catch (error) {
      new HandleErrors().resolve(resp, error);
    }
  }
}