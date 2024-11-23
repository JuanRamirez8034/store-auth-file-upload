
abstract class PaginationResponseDtoModel<T> {
  abstract data  : T;
  abstract page  : number;
  abstract limit : number;
  abstract total : number | null;
  abstract next  : string | null;
  abstract prev  : string | null;
}

export interface PaginationResponseConfig<T> extends PaginationResponseDtoModel<T> { }


export class PaginationResponseDto<T> implements PaginationResponseDtoModel<T> {

  public readonly data  : T;
  public readonly page  : number;
  public readonly limit : number;
  public readonly total : number | null;
  public readonly next: string | null;
  public readonly prev: string | null;

  private constructor(consfig: PaginationResponseConfig<T>) {
    this.data  = consfig.data;
    this.limit = consfig.limit;
    this.next  = consfig.next;
    this.page  = consfig.page;
    this.prev  = consfig.prev;
    this.total = consfig.total;
  }

  /**
   * Crear nueva instancia de objeto de tranferencia para respuesta con paginacion
   * @param object `{[key: string]: unknown}`
   * @param webServiceEndPoint `string`
   * @returns `[string | null, PaginationResponseDto<T> | null]`
   */
  public static create<T>(object: {[key: string]: unknown}, webServiceEndPoint: string): [string | null, PaginationResponseDto<T> | null]{
    const { page, limit, data, total } = object;

    let pageAsNumber  : number = Number(page);
    let limitAsNumber : number = Number(limit);
    let totalAsNumber : number | null = (total === null) ? null : Number(total);
    // page
    if( isNaN(pageAsNumber) ) return ['page is not a number', null];
    // limit
    if( isNaN(limitAsNumber) ) return ['limit is not a number', null];
    // total
    if( totalAsNumber !== null &&  isNaN(totalAsNumber) ) return ['total is not a number', null];
    // data
    if( data === undefined ) return ['data is undefined', null];
    // creando rutas respectivas
    const next : string | null = `${ webServiceEndPoint }?page=${ pageAsNumber + 1 }&limit=${ limitAsNumber }`;
    const prev : string | null = (pageAsNumber - 1 > 0) ? `${ webServiceEndPoint }?page=${ pageAsNumber - 1}&limit=${ limit }` : null;
    
    return [
      null, 
      new PaginationResponseDto<T>({
        page: pageAsNumber, 
        limit: limitAsNumber,
        total: totalAsNumber,
        next, 
        prev, 
        data: data as T
      })
    ];
  }

}