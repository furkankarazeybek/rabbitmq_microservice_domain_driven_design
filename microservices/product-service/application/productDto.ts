export class ProductDto {

    static getProductsWithCategories(products: any[], categories: any[] ): string[] {

        const categoryMap = new Map<string, { _id: string; categoryName: string }>();
        categories.forEach((category:any) => {
          categoryMap.set(category._id.toString(), { _id: category._id.toString(), categoryName: category.categoryName });
        });
    
        const productsWithCategory = products.map(product => {
          const categoryIdStr = product.productCategoryId.toString(); 
          return {
            ...product,
            productCategory: categoryMap.get(categoryIdStr) || null,
          };
        });

        return productsWithCategory;
    }


}