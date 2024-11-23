

abstract class CreateCategoryDtoModel {
  abstract name       : string;
  abstract available  : boolean;
}

export class CreateCategoryDto implements CreateCategoryDtoModel {

  public readonly name      : string;
  public readonly available : boolean;

  private constructor( name: string, available: boolean ) {
    this.name      = name;
    this.available = available;
  }

  /**
   * Crear nueva instancia de objeto de tranferencia para crear categoria
   * @param object {[key: string]: unknown}
   * @returns [string | null, CreateCategoryDto | null]
   */
  public static create(object: {[key: string]: unknown}): [string | null, CreateCategoryDto | null]{
    const { name, available } = object;

    // verificando si existe el nombre
    if( !name || typeof name !== 'string' || name.trim() === '' ) return ['Name is missing', null];

    // verificando available 
    let availableAsBoolean : boolean = (available === 'true' || available === true);
    
    return [null, new CreateCategoryDto(name, availableAsBoolean)];
  }

}