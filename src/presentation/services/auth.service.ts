import { envs, Jwt, OneWayEncrypt } from "../../config";
import { UserModel } from "../../data";
import { CustomError, DTOS } from "../../domain";
import { UserEntity } from "../../domain/entities";
import { EmailService } from "./";


export class AuthService {

  constructor(
    private readonly oneWayEncrypt: OneWayEncrypt,
    private readonly jwtManager: Jwt,
    private readonly emailService: EmailService,
  ){}

  /**
   * Registrar nuevo usuario
   * @param registerUserDto DTOS.RegisterUserDto
   * @returns Promise<boolean>
   */
  public async regiterUser(registerUserDto: DTOS.RegisterUserDto): Promise<{user: UserEntity, token: string}>{
    // comprobar existencia del usuario
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if(existUser) throw CustomError.badRequest('Email already exist');

    // crear instancia del modelo de usuario
    const newUserModel = new UserModel(registerUserDto);
    // encriptar contrasena
    newUserModel.password = this.oneWayEncrypt.encrypt(newUserModel.password);
    // guardar usuario
    await newUserModel.save();

    // limpiar datos a retornar
    const { password:_, ...userEntity } = UserEntity.fromObject(newUserModel as {});

    // generar jwt
    const token = await this._generateAuthJwt({id: userEntity.id});

    // enviar correo de validacion
    await this._sendVerificationEmail( userEntity.email, userEntity.name );

    return {
      user: userEntity as UserEntity,
      token: token,
    };
  }

  /**
   * Loguear un usuario
   * @param loginUserDto DTOS.LoginUserDto
   * @returns Promise<{user: UserEntity, token: string}>
   */
  public async loginUser(loginUserDto: DTOS.LoginUserDto): Promise<{user: UserEntity, token: string}>{
    
    // validar existencia de usuario en la bdd
    const findUser = await UserModel.findOne({ email: loginUserDto.email });
    if(!findUser) throw CustomError.notFound('User not found');

    // comprobar coincidencia de claves
    const paswordMacth = this.oneWayEncrypt.comapre(loginUserDto.password, findUser.password);
    if(!paswordMacth) throw CustomError.unAuthorized('Email or password is incorrect');

    // limpiar datos a retornar
    const { password:_, ...userEntity } = UserEntity.fromObject(findUser as {});
    
    // generar jwt
    const token = await this._generateAuthJwt({id: userEntity.id});
    
    return {
      user: userEntity as UserEntity,
      token: token,
    };
  }

  /**
   * Realizar proceso de verificacion del correo a traves del token
   * @param token string
   * @returns Promise<string>
   */
  public async validateEmail(token: string): Promise<string> {

    // verificar el token
    const payloadToken = await this.jwtManager.validate( token );
    if( !payloadToken ) throw CustomError.unAuthorized('Invalid token');

    // verificar email
    const { email } = payloadToken as { email: string | undefined };
    if( !email || typeof payloadToken === 'string' ) throw CustomError.internal('Invalid email in token');

    // encontrar un usuario a traves del correo
    const findUser = await UserModel.findOne({ email });
    if( !findUser ) throw CustomError.badRequest('Invalid email from user');

    // actualizar verificacion del correo del usuario
    await findUser.updateOne({emailValidated: true});
    
    return 'Email successfully verified';
  }

  /**
   * Generar token de autenticacion
   * @param data { id: string }
   * @returns Promise<string>
   */
  private async _generateAuthJwt(data: { id: string }): Promise<string> {
    const jwtResult = await this.jwtManager.generate(data);
    if( !jwtResult ) throw CustomError.internal('Jwt generate error');
    return jwtResult;
  }

  /**
   * Enviar correro de confirmacion de email
   * @param email string
   * @param name string
   * @returns Promise<boolean>
   */
  private async _sendVerificationEmail(email: string, name: string): Promise<boolean>{
    // generar token de autenticacion
    const token : string | null = await this.jwtManager.generate({ email }, '30m');
    if( !token ) throw CustomError.internal('Jwt generate error');
    // generar url
    const url : string = `${ envs.WEB_SERVICE_URL }/auth/validate-email/${ token }`;
    // generar cuerpo del mensaje
    const htmlBody : string = `
      <h1>Hello, ${ name }!</h1>
      <p>This is an email sent from the authentication application that informs you to carry out the email verification process in our app, please click on the following link to carry out the verification:</p>
      <a href="${ url }" style="font-size: 1.4rem; font-weight: 900;" target="_blank">VERIFY YOUR EMAIL ✔</a>
    `;
    // enviando email
    return this.emailService.send({
      to: email,
      subject: 'Validate email',
      htmlBody,
    });
  }

}