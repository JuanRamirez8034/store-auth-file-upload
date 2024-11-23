import { RegularExpression } from '../../../config';


abstract class RegisterUserDtoModel {
  public abstract readonly name    : string;
  public abstract readonly email   : string;
  public abstract readonly password: string;
}

/**
 * Clase representadora de un objeto de tranferencia de registro de usuario
 */
export class RegisterUserDto implements RegisterUserDtoModel {
  
  public name: string;
  public email: string;
  public password: string;

  private constructor( name: string, email: string, password: string ){
    this.name = name;
    this.email = email;
    this.password = password;
  }

  /**
   * Crear nuevo objeto de tranferrencia de registro de usurio (RegisterUserDto)
   * @param object {[key:string]: unknown}
   * @returns [string|null, RegisterUserDto|null]
   */
  public static create(object: {[key: string]: unknown}): [ string | null, RegisterUserDto | null] {
    const { name, email, password } = object;

    // name / nombre
    if(!name) return ['Name is undefined', null];
    if(typeof name !== 'string') return ['Name is not a string', null];
    if(name.trim().length <= 6) return ['Name is too short or invalid', null];

    // correo / email
    if(!email) return ['Email is undefined', null];
    if(typeof email !== 'string') return ['Email is not a string', null];
    if(!RegularExpression.email(email)) return ['Email is not valid format', null];

    // password / contraseña
    if(!password) return ['Password is undefined', null];
    if(typeof password !== 'string') return ['Password is not a string', null];
    if(!RegularExpression.password(password)) return ['Password is not valid format', null];


    return [null, new RegisterUserDto(name, email, password)];
  }

}