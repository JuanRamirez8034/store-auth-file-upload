import { Request, Response } from "express";
import { CustomError, HandleErrors } from "../../domain";
import { FileUploadService } from "../services/file-upload.service";


export class FileUploadController {

  constructor(
    private readonly _filerUploadService: FileUploadService,
    private readonly _hanldeErrors: HandleErrors,
  ){ }

  /**
   * Cargar un archivo
   * @param req Request
   * @param resp Response
   */
  public async uploadFile(req: Request, resp: Response): Promise<void>{
    // obteniendo los valores ya comprobados
    const file = req.body.files;
    const type = req.params.type;

    // comprobando que no sea un conjunto de archivos
    if( file.length !== 1 ){
      resp.status(400).json({ message: 'request not allowed, only change a one file' });
      return;
    }
    
    this._filerUploadService.uploadSingle( file[0], `uploads/${ type }` )
      .then( responseUpload => resp.status(201).json(responseUpload) )
      .catch( error => this._hanldeErrors.resolve(resp, error) );

  }

  /**
   * Cargar multiples archivos
   * @param req Request
   * @param resp Response
   */
  public async uploadMultipleFiles(req: Request, resp: Response): Promise<void>{
    // obteniendo los valores ya comprobados
    const files = req.body.files;
    const type = req.params.type;
    
    this._filerUploadService.uploadMultiple( files, `uploads/${ type }` )
      .then( responseUploads => resp.status(201).json(responseUploads) )
      .catch( error => this._hanldeErrors.resolve(resp, error) );
  }
}