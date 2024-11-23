import { Request, Response } from "express";
import { DTOS } from "../../domain";
import { AuthService } from "../services/auth.service";
import { UserEntity } from "../../domain/entities";
import { HandleErrors } from "../../domain";

export class AuthController {

  constructor(
    private readonly _authService: AuthService,
    private readonly _handleErrors: HandleErrors,
  ){}

  /**
   * Loguear un usuario
   * @param req Request
   * @param resp Response
   */
  public async loginUser(req: Request, resp: Response): Promise<void>{
    const [error, loginUserDto] = DTOS.LoginUserDto.create(req.body);
    if(error || loginUserDto === null) {
      resp.status(400).json({message: error ?? 'Bad request'});
      return;
    }
    // realizando las acciones respectivas
    this._authService.loginUser(loginUserDto)
      .then( (loginUserResponse: {user: UserEntity, token: string}) => {
        resp.json(loginUserResponse);
      })
      .catch( (error: unknown) => {
        this._handleErrors.resolve(resp, error);
      });
  }

  /**
   * Registrar un usuario
   * @param req Request
   * @param resp Response
   */
  public async registerUser(req: Request, resp: Response): Promise<void>{
    const [error, registerUserDto] = DTOS.RegisterUserDto.create(req.body);
    if(error || registerUserDto === null) {
      resp.status(400).json({message: error ?? 'Bad request'});
      return;
    }
    // realizando acciones
    this._authService.regiterUser(registerUserDto)
      .then( (registerUserResp: {user: UserEntity, token: string}) => {
        resp.json(registerUserResp);
      })
      .catch( (error: unknown) => {
        this._handleErrors.resolve(resp, error);
      });
  }

  /**
   * Validar email de usuario
   * @param req Request
   * @param resp Response
   */
  public async validateEmail(req: Request, resp: Response): Promise<void>{
    const { token } = req.params;
    if( !token ){
      resp.status(400).json({message: 'Bad request'});
      return;
    }
    // realizando acciones
    this._authService.validateEmail( token )
      .then( (message: string) => resp.json({ message }))
      .catch( (error: unknown) => this._handleErrors.resolve(resp, error));
  }
}