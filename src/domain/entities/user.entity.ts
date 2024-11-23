import { CustomError } from '../index';

export interface UserEntityOptions {
  id:             string;
  name:           string;
  email:          string;
  emailValidated: boolean;
  password:       string;
  image?:         string | null;
  role:           Array<role>;
}

export type role = 'admin' | 'user';

/**
 * Clase representadora de una entidad de usuario
 */
export class UserEntity {
  // variables
  public readonly id             : UserEntityOptions['id'];
  public readonly name           : UserEntityOptions['name'];
  public readonly email          : UserEntityOptions['email'];
  public readonly emailValidated : UserEntityOptions['emailValidated'];
  public readonly password       : UserEntityOptions['password'];
  public readonly image          : UserEntityOptions['image'];
  public readonly role           : UserEntityOptions['role'];

  /**
   * Crear una nueva instancia de UserEntity
   * @param options UserEntityOptions
   */
  constructor(options: UserEntityOptions){
    this.id = options.id;
    this.name = options.name;
    this.email = options.email;
    this.emailValidated = options.emailValidated;
    this.password = options.password;
    this.image = options.image;
    this.role = options.role;
  }

  /**
   * Obtener una entidad de usuario a partir de un objeto
   * @param object {[key: string]: unknown}
   * @returns UserEntiry
   */
  public static fromObject(object: {[key: string]: unknown}): UserEntity {
    const { _id, id, name, email, emailValidated, password, image, role } = object;

    // id
    if(!_id && !id) throw CustomError.badRequest('Missing id');
    if((typeof _id !== 'string' && !id) || (typeof id !== 'string' && !_id)) throw CustomError.badRequest('Invalid name data type');

    // name
    if(!name) throw CustomError.badRequest('Missing name');
    if(typeof name !== 'string') throw CustomError.badRequest('Invalid name data type');

    // email
    if(!email) throw CustomError.badRequest('Missing email');
    if(typeof email !== 'string') throw CustomError.badRequest('Invalid email data type');

    // emailValidated
    if(emailValidated === undefined) throw CustomError.badRequest('Missing emailValidated');
    if(typeof emailValidated !== 'boolean') throw CustomError.badRequest('Invalid emailValidated data type');

    // password
    if(!password) throw CustomError.badRequest('Missing password');
    if(typeof password !== 'string') throw CustomError.badRequest('Invalid password data type');

    // image
    if((image !== undefined && image !== null) && typeof image !== 'string') throw CustomError.badRequest('Invalid image data type');

    // role
    if(!role) throw CustomError.badRequest('Missing role');
    if(typeof role !== 'object' || (role as Array<role>).length <= 0 ||  (!(role as Array<role>).includes('user') && !(role as Array<role>).includes('admin'))) throw CustomError.badRequest('Invalid role data type');

    return new UserEntity({
      id: `${_id ?? id}`,
      name,
      email,
      emailValidated,
      password,
      image,
      role: role as Array<role>,
    });
  }
}