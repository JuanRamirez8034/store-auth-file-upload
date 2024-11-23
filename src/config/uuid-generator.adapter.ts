import { v4 as uuidV4 } from "uuid";

/**
 * Representacion de la estructura del adaptador generador de uuid
 */
export abstract class UUIDGenerator {
  /**
   * Generar id basado en uuid
   * @returns void
   */
  abstract generate(): string;
}

export class UUID implements UUIDGenerator {

  /**
   * Generar uuid
   * @returns string
   */
  public generate(): string {
    return uuidV4();
  }

}