

export class RegularExpression {

  /**
   * Validar que el texto sea un email valido
   * @param text string
   * @returns boolean
   */
  public static email(text: string): boolean {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(text);
  }

  /**
   * Validar que el texto sea una contraseña valida
   * * Minimo 1 minuscula
   * * Minimo 1 mayuscula
   * * Minimo 1 numero
   * * Minimo 1 caracter especial
   * * Minomo 8 caracteres 
   * * Maximo 24 caracteres
   * 
   * @param text string
   * @returns boolean
   */
  public static password(text: string): boolean {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,24}$/;
    return regex.test(text);
  }

}