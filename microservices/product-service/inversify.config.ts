import "reflect-metadata";
import { Container } from "inversify";
import { ProductService } from "./domain/product/product-service";
import { TYPES } from "./types";
import { ProductCategoryService } from "./domain/product-category/product-category-service";
import { ProductRepository } from "./domain/product/product-repository";
import { ProductCategoryRepository } from "./domain/product-category/product-category-repository";
import { ProductFactory } from "./domain/product/product-factory";
import { ProductCategoryFactory } from "./domain/product-category/product-category-factory";
import { ProductServiceHandler } from "./application/product";
import { MessageListener } from "./message-listener";



const container = new Container();


// Services
container.bind<ProductService>(TYPES.ProductService).to(ProductService);
container.bind<ProductCategoryService>(TYPES.ProductCategoryService).to(ProductCategoryService);


// Repositories
container.bind<ProductRepository>(TYPES.ProductRepository).to(ProductRepository);
container.bind<ProductCategoryRepository>(TYPES.ProductCategoryRepository).to(ProductCategoryRepository);


// Factories
container.bind<ProductFactory>(TYPES.ProductFactory).to(ProductFactory);
container.bind<ProductCategoryFactory>(TYPES.ProductCategoryFactory).to(ProductCategoryFactory);


// Handlers
container.bind<ProductServiceHandler>(TYPES.ProductServiceHandler).to(ProductServiceHandler);

container.bind<MessageListener>(TYPES.MessageListener).to(MessageListener);




export default container;