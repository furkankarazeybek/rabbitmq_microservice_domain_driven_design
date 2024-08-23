import { ProductService } from '../domain/product/product-service';
import { ProductCategoryService } from '../domain/product-category/product-category-service';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ProductDto } from './productDto';



@injectable()
class ProductServiceHandler {

    private productService : ProductService;
    private productCategoryService : ProductCategoryService;
  
   
     constructor(
       @inject(TYPES.ProductService) productService: ProductService,
       @inject(TYPES.ProductCategoryService) productCategoryService: ProductCategoryService,
       
     ) {
       this.productService = productService;
       this.productCategoryService = productCategoryService;
     }

    async getProductList() {
        try {

          const products = await this.productService.getAllProducts();

          const categories = await this.productCategoryService.getAllProductCategories();

          const productsWithCategories =  ProductDto.getProductsWithCategories(products, categories);
      
          return productsWithCategories;

        } catch (error) {
          throw error;
        }
    }
      

    async getProductCategoriesList() {
        try {
            const productCategories = await this.productCategoryService.getAllProductCategories();
            return productCategories;
        } catch (error) {
            throw error;
        }
    }



    async addProduct (request: any) {
        try {
          console.log("add user role run");
          console.log("Request Body:", request);
    
    
          await this.productService.createProduct(
            request.productName,
            request.productCategoryId
          );
   
        }
   
       catch (error) {
         console.error("error is", error);
         throw new Error('Failed to login');
       }
       
      }

    async addProductCategory(request: any) {
     try {
       console.log("add user role run");
       console.log("Request Body:", request);
 
 
       await this.productCategoryService.createProductCategory(
         request.categoryName,
       );

     }

    catch (error) {
      console.error("error is", error);
      throw new Error('Failed to login');
    }
    
   }

   
  

}




export { ProductServiceHandler};
 