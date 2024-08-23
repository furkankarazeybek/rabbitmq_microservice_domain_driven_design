import { inject, injectable } from "inversify";
import { ProductServiceHandler } from "../application/product";
import { TYPES } from "../types";

@injectable()
export class ApplicationStorage {
  private productServiceHandler: ProductServiceHandler;
  private applications: { [key: string]: any };

  

  constructor(
    @inject(TYPES.ProductServiceHandler) productServiceHandler: ProductServiceHandler
  ) {
    this.productServiceHandler = productServiceHandler;
    this.applications = {
      ProductServiceHandler: this.productServiceHandler,
    };
  }

  getApplication(applicationName: string): any {
    return this.applications[applicationName];
  }
}
