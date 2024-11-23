import { Request, Response } from "express";
import { DTOS, HandleErrors } from "../../domain";
import { CategoryService } from "../services/category.service";
import { CategoryEntity } from "../../domain/entities";


export class CategoryController {

  constructor(
    private readonly _categoryService: CategoryService,
    private readonly _handleErrors : HandleErrors,
  ){}

  /**
   * Obtener categorias
   * @param req Request
   * @param resp Response
   */
  public async getCategories(req: Request, resp: Response): Promise<void>{
    const [error, paginationDto] = DTOS.PaginationDto.create( req.query );

    // comprobacion de la informacion
    if( error || !paginationDto ){
      resp.json({ message: error ?? 'Bad request' });
      return;
    }
    
    // realizando acciones
    this._categoryService.getCategories(paginationDto)
      .then( (paginationData: DTOS.PaginationResponseDto<CategoryEntity[]>) => resp.json(paginationData) )
      .catch( error => this._handleErrors.resolve(resp, error));
  }

  /**
   * Guardar/Registrar nueva categoria
   * @param req Request
   * @param resp Response
   */
  public async createCategory(req: Request, resp: Response): Promise<void>{
    const [error, createCategoryDto] = DTOS.CreateCategoryDto.create( req.body );
    
    // comprobacion de la informacion
    if( error || !createCategoryDto ){
      resp.json({ message: error ?? 'Bad request' });
      return;
    }

    this._categoryService.createCategory(createCategoryDto, req.body.user)
      .then( categoryEntity => resp.status(201).json(categoryEntity) )
      .catch( error => this._handleErrors.resolve(resp, error) );
  }

}