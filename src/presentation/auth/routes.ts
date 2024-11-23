import { Request, Response, Router } from 'express';
import { AuthController } from './controller';
import { AuthService } from '../services/auth.service';
import { HandleErrors } from '../../domain';
import { BcryptJS, envs, JWT } from '../../config';
import { EmailService } from '../services';




export class AuthRoutes {

  private static readonly _emailService: EmailService = new EmailService(
    { 
      service: envs.MAILER_SERVICE, 
      auth: { user: envs.MAILER_EMAIL, pass: envs.MAILER_SECRET_KEY, } 
    },
    envs.MAILER_SEND_EMAIL,
  );
  private static readonly _bcrypt: BcryptJS = new BcryptJS();
  private static readonly _jwt: JWT = new JWT(envs.JWT_SEED);
  private static readonly _authService: AuthService = new AuthService(this._bcrypt, this._jwt, this._emailService);
  private static readonly _controller: AuthController = new AuthController(this._authService, new HandleErrors());

  static get routes(): Router {

    const router = Router();
    
    router.post('/login', (req: Request, resp: Response) => this._controller.loginUser(req, resp) );
    router.post('/register', (req: Request, resp: Response) => this._controller.registerUser(req, resp) );
    router.get('/validate-email/:token', (req: Request, resp: Response) => this._controller.validateEmail(req, resp) );
    
    return router;
  }


}

