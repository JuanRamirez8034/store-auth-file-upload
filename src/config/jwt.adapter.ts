import { sign as jwtSing, verify as jwtVerify } from "jsonwebtoken";


/**
 * Modelo abstracto de la clase representadora del manejador de jwt
 */
export abstract class Jwt {
  /**
   * Generar JWT con informacion respectiva
   * @param payload string | object | Buffer
   * @param duration string
   * @returns Promise<string | null>
   */
  abstract generate(payload: string | object | Buffer, duration?: string): Promise<string | null>;

  /**
   * Validar si un jwt es valido
   * @param token string
   * @returns Promise<null | T>
   */
  abstract validate<T>(token: string): Promise<null | T>;
}

export class JWT implements Jwt {
  
  /**
   * Nueva instancia de manejador de JWT
   * @param seed string
   */
  constructor(
    private readonly seed : string,
  ){}

  /**
   * Generar JWT con informacion respectiva
   * @param payload string | object | Buffer
   * @param duration string
   * @returns Promise<string | null>
   */
  public async generate(payload: string | object | Buffer, duration: string = '2h'): Promise<string | null> {
    return new Promise( (resolve, _) => {
      jwtSing(payload, this.seed, { expiresIn: duration }, (error, encodeToken) => {
        if( error || !encodeToken ) return resolve(null);
        resolve(encodeToken);
      });
    });
  }
  
  /**
   * Validar si un jwt es valido
   * @param token string
   * @returns Promise<null | T>
   */
  public async validate<T>(token: string): Promise<null | T> {
    return new Promise( (resolve, _) => {
      jwtVerify(token, this.seed, (error, decodeToken) => {
        if( error || !decodeToken ) return resolve(null);
        resolve(decodeToken as T);
      });
    });
  }

}