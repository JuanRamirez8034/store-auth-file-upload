import { Request, Response } from "express";
import { existsSync } from "fs";
import { join } from "path";


export class ImagesController {

  constructor( ){ }

  /**
   * Obtener una imagen
   * @param req Request
   * @param resp Response
   * @returns Promise<void>
   */
  public async getImage(req: Request, resp: Response): Promise<void>{
    const domainType : string | undefined = req.params.type;
    const imageName : string | undefined = req.params.imageName;
    const dirFile = join(__dirname, '../../../', 'uploads', domainType, imageName);

    if( !domainType || !imageName || !existsSync(dirFile) ){
      resp.status(404).json({ message: 'image not found' });
      return;
    }

    resp.sendFile( dirFile );

  }

}