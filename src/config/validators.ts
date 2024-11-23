import { isValidObjectId } from "mongoose";


export class Validators {

  /**
   * Verificar si el id proporcionado es valido para un id de object id
   * @param id string
   * @returns boolean
   */
  public static isMongoId(id: string): boolean {
    return isValidObjectId(id);
  }

}