import { Request, Response } from "express";
import { DTOS, HandleErrors } from "../../domain";
import { ProductService } from "../services/product.service";


export class ProductController {

  constructor(
    private readonly _productService: ProductService,
    private readonly _handleErrors : HandleErrors,
  ){}

  /**
   * Obtener categorias
   * @param req Request
   * @param resp Response
   */
  public async getProducts(req: Request, resp: Response): Promise<void>{
    const [error, paginationDto] = DTOS.PaginationDto.create( req.query );

    // comprobacion de la informacion
    if( error || !paginationDto ){
      resp.json({ message: error ?? 'Bad request' });
      return;
    }

    this._productService.getCategories(paginationDto)
      .then( products => resp.json(products) )
      .catch( error => this._handleErrors.resolve(resp, error));
  }

  /**
   * Guardar/Registrar nuevo producto
   * @param req Request
   * @param resp Response
   */
  public async createProduct(req: Request, resp: Response): Promise<void>{
    const [error, createProductDto] = DTOS.CreateProductDto.create( { ...req.body, user: req.body.user.id } );
    
    // comprobacion de la informacion
    if( error || !createProductDto ){
      resp.json({ message: error ?? 'Bad request' });
      return;
    }

    this._productService.createProduct( createProductDto )
      .then( product => resp.status(201).json(product) )
      .catch( error => this._handleErrors.resolve(resp, error) );
  }
}