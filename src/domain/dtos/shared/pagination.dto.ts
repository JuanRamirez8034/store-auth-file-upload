



abstract class PaginationDtoModel {
  abstract page  : number;
  abstract limit : number;
}

export class PaginationDto implements PaginationDtoModel {

  public readonly page  : number;
  public readonly limit : number;

  private constructor( page: number, limit: number) {
    this.page      = page;
    this.limit = limit;
  }

  /**
   * Crear nueva instancia de objeto de tranferencia para paginacion
   * @param object {[key: string]: unknown}
   * @returns [string | null, PaginationDto | null]
   */
  public static create(object: {[key: string]: unknown}): [string | null, PaginationDto | null]{
    const { page, limit } = object;

    let pageAsNumber  : number = 1;
    let limitAsNumber : number = 10;

    // page
    if( page ){
      pageAsNumber = Number(`${page}`);
      if( isNaN(pageAsNumber) || pageAsNumber <= 0 ) return ['The page number is not a valid number.', null];
    }

    // limit
    if( limit ){
      limitAsNumber = Number(`${limit}`);
      if( isNaN(limitAsNumber) || limitAsNumber <= 0 ) return ['The limit number is not a valid number.', null];
    }

    
    return [null, new PaginationDto(pageAsNumber, limitAsNumber)];
  }

}