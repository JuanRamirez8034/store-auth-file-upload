import { CategoryEntity } from '../../domain/entities/category.entity';
import { CustomError, DTOS } from "../../domain";
import { envs } from "../../config";
import { ProductModel } from '../../data';



export class ProductService {

  // inyeccion de dependencias
  constructor(){ }

  /**
   * Crear un nuevo producto
   * @param createProductDto DTOS.CreateProductDto
   * @returns Promise<{}>
   */
  public async createProduct(createProductDto: DTOS.CreateProductDto): Promise<{}>{
    
    // validar existencia del producto
    const productMatch = await ProductModel.findOne({ name: createProductDto.name });
    if ( productMatch ) throw CustomError.badRequest('Product already exist');

    // guardar el producto
    const newProduct = new ProductModel(createProductDto);
    const product = await (await newProduct.save()).toObject();

    return {...product};

  }

  /**
   * Obtener los productos a traves de la paginacion
   * @param paginationDto DTOS.PaginationDto
   * @returns `Promise<DTOS.PaginationResponseDto<{}[]>>`
   */
  public async getCategories(paginationDto: DTOS.PaginationDto): Promise<DTOS.PaginationResponseDto<{}[]>> {

    // encontrar las categorias 
    const [findProducts, totalCount] = await Promise.all([
      ProductModel.find()
        .skip( (paginationDto.page - 1) * paginationDto.limit )
        .limit( paginationDto.limit )
        .populate('user', 'id name')
        .populate('category', 'id name available'),
      ProductModel.countDocuments(),
    ]);
    // validando existencia de categorias
    if( !findProducts || findProducts.length === 0 ) throw CustomError.notFound('categories not found');

    // objeto de configuracion de respuesta
    const dataResponse = {
      data: findProducts,
      page: paginationDto.page,
      limit: paginationDto.limit,
      total: totalCount,
    };
    // direccion del endpoint
    const pathWebServiceEnpoint = `${ envs.WEB_SERVICE_URL }/product`

    // creando el objeto de configuracion
    const [error, paginationResponseDto] = DTOS.PaginationResponseDto.create<CategoryEntity[]>(dataResponse, pathWebServiceEnpoint);
    // realizando validacion
    if( error || !paginationDto ) throw new Error(`[create pagination response - get product] ${ error ?? 'unknown error' }`);

    return paginationResponseDto!;
  }

}