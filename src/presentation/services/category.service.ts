import { CategoryEntity } from '../../domain/entities/category.entity';
import { CustomError, DTOS } from "../../domain";
import { envs } from "../../config";
import { UserEntity } from "../../domain/entities";
import { CategoryModel } from "../../data";



export class CategoryService {

  // inyeccion de dependencias
  constructor(){ }

  /**
   * Crear una nueva categoria
   * @param createCategoryDto DTOS.CreateCategoryDto
   * @param user UserEntity
   * @returns Promise<CategoryEntity>
   */
  public async createCategory(createCategoryDto: DTOS.CreateCategoryDto, user: UserEntity): Promise<CategoryEntity>{
    
    // validar existencia de la categoria
    const findCategory = await CategoryModel.findOne({ name: createCategoryDto.name });
    if( findCategory ) throw CustomError.badRequest('Category already exist');

    // guardar la categoria
    const newCategory = new CategoryModel({ ...createCategoryDto, user: user.id });
    await newCategory.save();

    // todo: crear entity oara Category
    const categoryEntity = CategoryEntity.fromObject(newCategory as {});

    return categoryEntity;

  }

  /**
   * Obtener las categorias a traves de la paginacion
   * @param paginationDto DTOS.PaginationDto
   * @returns `Promise<DTOS.PaginationResponseDto<CategoryEntity[]>>`
   */
  public async getCategories(paginationDto: DTOS.PaginationDto): Promise<DTOS.PaginationResponseDto<CategoryEntity[]>> {

    // encontrar las categorias 
    const [findCategories, totalCount] = await Promise.all([
      CategoryModel.find()
        .skip( (paginationDto.page - 1) * paginationDto.limit )
        .limit( paginationDto.limit ),
      CategoryModel.countDocuments(),
    ]);
    // validando existencia de categorias
    if( !findCategories || findCategories.length === 0 ) throw CustomError.notFound('categories not found');

    // creando la data de respuesta
    const categoriesEntities: CategoryEntity[] = findCategories.map( categoryObject => CategoryEntity.fromObject(categoryObject as {}) );

    // objeto de configuracion de respuesta
    const dataResponse = {
      data: categoriesEntities,
      page: paginationDto.page,
      limit: paginationDto.limit,
      total: totalCount,
    };
    // direccion del endpoint
    const pathWebServiceEnpoint = `${ envs.WEB_SERVICE_URL }/category`

    // creando el objeto de configuracion
    const [error, paginationResponseDto] = DTOS.PaginationResponseDto.create<CategoryEntity[]>(dataResponse, pathWebServiceEnpoint);
    // realizando validacion
    if( error || !paginationDto ) throw new Error(`[create pagination response - get category] ${ error ?? 'unknown error' }`);

    return paginationResponseDto!;
  }

}