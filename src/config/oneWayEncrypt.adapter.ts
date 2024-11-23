import { compareSync, genSaltSync, hashSync } from "bcryptjs";

export abstract class OneWayEncrypt {
  /**
   * Encriptar texto a traves de hash de una via
   * @param text string
   * @returns string
   */
  abstract encrypt(text: string) : string;

  /**
   * Comparar hashes de textos encriptados a traves de hash de una via
   * @param text string
   * @param hash string
   * @returns boolean
   */
  abstract comapre(text: string, hash: string): boolean;
}

export class BcryptJS implements OneWayEncrypt {

  /**
   * Encriptar texto a traves de hash de una via
   * @param text string
   * @returns string
   */
  public encrypt(text: string): string {
    const salt = genSaltSync();
    return hashSync(text, salt);
  }

  /**
   * Comparar hashes de textos encriptados a traves de hash de una via
   * @param text string
   * @param hash string
   * @returns boolean
   */
  comapre(text: string, hash: string): boolean {
    return compareSync(text, hash);
  }

}