import { CustomError } from "../errors/custom-error";

export interface CategoryEntityOptions {
  id:        string;
  name:      string;
  available: boolean;
}

/**
 * Clase representadora de una entidad de categoria
 */
export class CategoryEntity {

  public id        : CategoryEntityOptions['id'];
  public name      : CategoryEntityOptions['name'];
  public available : CategoryEntityOptions['available'];

  /**
   * Crear una nueva instancia de Categoryntity
   * @param options CategoryEntityOptions
   */
  constructor(options: CategoryEntityOptions){
    this.id        = options.id;
    this.name      = options.name;
    this.available = options.available;
  }

  /**
   * Obtener una entidad de categoria a partir de un objeto
   * @param object {[key: string]: unknown}
   * @returns CategoryEntity
   */
  public static fromObject(object: {[key: string]: unknown}): CategoryEntity {
    const { _id, id, name, available } = object;

    // id
    if(!_id && !id) throw CustomError.badRequest('Missing id');
    if((typeof _id !== 'string' && !id) || (typeof id !== 'string' && !_id)) throw CustomError.badRequest('Invalid name data type');

    // name
    if(!name) throw CustomError.badRequest('Missing name');
    if(typeof name !== 'string') throw CustomError.badRequest('Invalid name data type');

    // available
    if(available === undefined) throw CustomError.badRequest('Missing available');
    if(typeof available !== 'boolean') throw CustomError.badRequest('Invalid available data type');
    
    return new CategoryEntity({
      id: `${id ?? _id}`,
      name,
      available,
    });
  }

}