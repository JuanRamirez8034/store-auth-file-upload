import { RegularExpression } from "../../../config";


abstract class LoginUserDtoModel {
  public abstract readonly email   : string;
  public abstract readonly password: string;
}

export class LoginUserDto implements LoginUserDtoModel {
  
  public email: string;
  public password: string;

  private constructor( email: string, password: string ){
    this.email = email;
    this.password = password;
  }


  /**
   * Crear nuevo objeto de tranferrencia de login de usurio (LoginUserDto)
   * @param object {[key:string]: unknown}
   * @returns [string|null, LoginUserDto|null]
   */
  public static create(object: {[key: string]: unknown}): [ string | null, LoginUserDto | null] {
    const { email, password } = object;

    // correo / email
    if(!email) return ['Email is undefined', null];
    if(typeof email !== 'string') return ['Email is not a string', null];
    if(!RegularExpression.email(email)) return ['Email is not valid format', null];

    // password / contraseña
    if(!password) return ['Password is undefined', null];
    if(typeof password !== 'string') return ['Password is not a string', null];
    if(!RegularExpression.password(password)) return ['Password is not valid format', null];


    return [null, new LoginUserDto( email, password)];
  }

}