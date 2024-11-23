import { CustomError } from "../../domain";
import { existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import { UUIDGenerator } from "../../config";
import type { UploadedFile } from "express-fileupload";


export class FileUploadService {


  constructor(
    private readonly _uuid: UUIDGenerator,
  ){ }

  /**
   * Cargar un solo archivo
   * @param file UploadFile
   * @param folder string = 'uploads
   * @param validExtensions string[]
   * @param checkDir boolean = true
   * @returns string
   */
  public async uploadSingle(file: UploadedFile, folder: string = 'uploads', validExtensions: Array<string> = ['png', 'jpg', 'jpeg', 'gift', 'mp4'], checkDir: boolean = true): Promise<string> {
    // validando extensiones
    const extension = file.mimetype.split('/').at(1);
    if( !extension || !validExtensions.includes( extension ) ) throw CustomError.badRequest(`"${ extension }" format is not valid, only "${ validExtensions.join(', ') }" is allowed`);
    // validar directorio
    const destinationDir = resolve(__dirname, '../../../', folder);
    if( checkDir ) this._checkFolderDir(destinationDir);
    // mover el archivo
    const fileName = `${ this._uuid.generate() }.${ extension }`;
    file.mv(`${ destinationDir }/${ fileName }`);
    
    return fileName;
  }

  /**
   * Cargar multiples archivos
   * @param files UploadedFile[]
   * @param folder string = 'uploads'
   * @param validExtensions string[]
   * @returns Primise<string[]>
   */
  public async uploadMultiple(files: Array<UploadedFile>, folder: string = 'uploads', validExtensions: Array<string> = ['png', 'jpg', 'jpeg', 'gift']): Promise<Array<string>> {
    const fileNames = await Promise.all(
      files.map( (file:UploadedFile, i: number) => this.uploadSingle(file, folder, validExtensions, (i === 0)) )
    );

    return fileNames;
  }

  /**
   * Comprobar si existe el directorio y crearlo en caso de no existir
   * @param dir string
   * @returns void
   */
  private _checkFolderDir(dir: string): void{
    if( existsSync(dir) ) return;
    mkdirSync(dir, {recursive: true});
  }

}