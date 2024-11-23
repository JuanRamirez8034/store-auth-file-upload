import { Server as ServerType } from 'http';
import path from 'path';
import express, { Router, Express } from 'express';
import fileUpload from 'express-fileupload';

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}


export class Server {

  private readonly app = express();
  private serverListener: undefined | ServerType;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  
  
  async start() {
    

    //* Middlewares
    this.app.use( express.json() ); // raw
    this.app.use( express.urlencoded({ extended: true }) ); // x-www-form-urlencoded
    this.app.use( fileUpload({ limits: { fieldSize: 50 * 1024 * 1024 } }) );

    //* Public Folder
    this.app.use( express.static( this.publicPath ) );

    //* Routes
    this.app.use( this.routes );

    //* SPA /^\/(?!api).*/  <== Únicamente si no empieza con la palabra api
    this.app.get('*', (req, res) => {
      const indexPath = path.join( __dirname + `../../../${ this.publicPath }/index.html` );
      res.sendFile(indexPath);
    });
    

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${ this.port }`);
    });

  }

  public close() {
    this.serverListener?.close();
  }

  public get getServerApp(): Express{
    return this.app;
  }

}