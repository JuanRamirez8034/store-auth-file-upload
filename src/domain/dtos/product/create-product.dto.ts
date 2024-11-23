import { Validators } from "../../../config";
import { UserEntity } from "../../entities";


abstract class CreateProductDtoModel {
  abstract name        : string;
  abstract description?: string;
  abstract price       : number;
  abstract available  ?: boolean;
  abstract stock      ?: number;
  abstract category    : string;
  abstract user        : string;
}

interface CreateProductDtoConfig extends CreateProductDtoModel {};

export class CreateProductDto implements CreateProductDtoModel {
  public readonly name        : string;
  public readonly description?: string;
  public readonly price       : number;
  public readonly available  ?: boolean;
  public readonly stock      ?: number;
  public readonly category    : string;
  public readonly user        : string;


  private constructor({name, description, price, available, stock, category, user}: CreateProductDtoConfig){
    this.name        = name;
    this.description = description;
    this.price       = price;
    this.available   = available;
    this.stock       = stock;
    this.category    = category;
    this.user        = user;
  }


  /**
   * Crear nueva instancia de objeto de tranferencia para crear producto
   * @param object {[key: string]: unknown}
   * @returns [string | null, CreateProductDto | null]
   */
  public static create(object: {[key: string]: unknown}): [string | null, CreateProductDto | null]{
    const {name, description, price, available, stock, category, user} = object;
    let userIdAsValid : string = '';

    // name
    if( !name || typeof name !== 'string' || name.trim() === '' ) return ['Name is missing', null];

    // description
    if( description !== undefined && typeof description !== 'string' ) return ['Description is not a string', null];

    // price
    if( !price ) return ['Price is missing', null];
    const priceAsNumber = Number(price);
    if( isNaN(priceAsNumber) ) return ['Price is not a number', null];

    // available
    let availableAsBoolean : boolean = ( available !== undefined && (available === true || available === 'true' ));

    // stock
    let stockAsNumber : number | undefined;
    if( stock !== undefined ){
      stockAsNumber = Number(stock);
      if( isNaN(stockAsNumber) ) return ['Stock is not a number', null];
    }

    // todo: Ver como implementar mejor la comprobacion de los object id
    // category
    if( typeof category !== 'string' ) return ['Category is not a valid format', null];
    if( !Validators.isMongoId(category) ) return ['Category is not a valid id', null];

    // user
    if( user instanceof UserEntity ){
      userIdAsValid = user.id;
    } else {
      if( typeof user !== 'string' ) return ['User is not a valid format', null];
      if( !Validators.isMongoId(user) ) return ['User is not a valid id', null];
      userIdAsValid = user;
    }

    const cpdto = new CreateProductDto({
      name,
      description,
      price: priceAsNumber,
      available: availableAsBoolean,
      stock: stockAsNumber,
      category,
      user: userIdAsValid,
    });

    return [null, cpdto];
  }
}