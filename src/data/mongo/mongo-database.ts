import mongoose from "mongoose";

export interface MongoDbConnectOptions {
  url: string;
  dbName: string;
}


export class MongoDataBase {

  /**
   * Conecctarse a la base de datos de mongo
   * @param options MongoDbConnectOptions
   * @returns Promise<Boolean>
   */
  public static async connect(options: MongoDbConnectOptions) : Promise<boolean> {
    try {
      await mongoose.connect(
        options.url,
        { dbName: options.dbName }
      );
      return true;
    } catch (e) {
      console.error('Mongo db not connected');
      throw e;
    }
  }
  
  /**
   * Desconectar base de datos de mongo
   * @returns Promise<void>
   */
  public static async disconect(): Promise<void>{
    await mongoose.disconnect();
  }
}