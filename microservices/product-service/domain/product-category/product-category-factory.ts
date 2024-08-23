import { injectable } from 'inversify';
import { IProductCategory } from './product-category-model';
import { ObjectId } from 'mongodb';

@injectable()
export class ProductCategoryFactory {

  createProductCategory(categoryName: string,): IProductCategory {
    return {
      _id: new ObjectId(), 
      categoryName: categoryName,
    } as IProductCategory;
  }
}
