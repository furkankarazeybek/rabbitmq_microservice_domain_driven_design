import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { UserServiceHandler } from "../application/user";

@injectable()
export class ApplicationStorage {
  private userServiceHandler: UserServiceHandler;
  private applications: { [key: string]: any };

  

  constructor(
    @inject(TYPES.UserServiceHandler) userServiceHandler: UserServiceHandler,
  ) {
    this.userServiceHandler = userServiceHandler;
    this.applications = {
      UserServiceHandler: this.userServiceHandler,
    };
  }

  getApplication(applicationName: string): any {
    return this.applications[applicationName];
  }
}
