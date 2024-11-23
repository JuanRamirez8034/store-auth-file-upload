import { CategoryModel, ProductModel, UserModel } from "../index";
import { envs } from "../../config";
import { MongoDataBase } from "../mongo/mongo-database";
import { seedData } from "./data";

(async()=> {  
  try {
    if(envs.NODE_ENV !== 'development') throw 'The environment is not "development", action denied';
    // conectar base de datos
    await MongoDataBase.connect({
      url: envs.MONGO_URL,
      dbName: envs.MONGO_DB_NAME,
    });
    console.log('[++] Mongodb connected');
    // procesos de llenado de la base de datos
    await main();
    console.log('[++] DB filled');  
    // desconectar base de datos
    await MongoDataBase.disconect();
    console.log('[++] Mongodb disconnected');
  } catch (error) {
    console.log('[-] Fill DB failled');
    console.log(error);    
  }
})();


async function main() {
  // borrar datos
  console.log('[+] Clear DB');  
  await Promise.all([
    ProductModel.deleteMany(),
    CategoryModel.deleteMany(),
    UserModel.deleteMany(),
  ]);
  console.log('[+] DB cleaned');
  

  // llenar usuarios
  console.log('[+] Insert users');
  const users = await UserModel.insertMany(seedData.users);
  console.log('[+] Inserted users');


  // llenar categorias
  console.log('[+] Insert categories');  
  const categories = await CategoryModel.insertMany(
    seedData.categories.map( ctgry => ({
      ...ctgry,
      user: users[ betweenZeroAndNumber( users.length - 1 ) ]._id
    }))
  );
  console.log('[+] Inserted categories');

  
  // llenar productos
  console.log('[+] Insert products');
  const products = await ProductModel.insertMany(
    seedData.products.map( product => ({
      ...product,
      user: users[ betweenZeroAndNumber( users.length - 1 ) ]._id,
      category: categories[ betweenZeroAndNumber( categories.length - 1 ) ]._id,      
    }))
  );
  console.log('[+] Inserted products');

}

/**
 * Obtener un numero entre 0 y el valor n
 * @param n number
 * @returns number
 */
function betweenZeroAndNumber(n: number): number {
  return Math.floor( Math.random() * n);
}