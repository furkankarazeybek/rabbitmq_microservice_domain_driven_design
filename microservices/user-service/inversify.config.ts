import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { UserService } from "./domain/user/user-service";
import { RoleService } from "./domain/role/role-service";
import { UserRoleService } from "./domain/user-role/user-role-service";
import { UserRoleRepository } from "./domain/user-role/user-role-repository";
import { UserRepository } from "./domain/user/user-repository";
import { RoleRepository } from "./domain/role/role-repository";
import { UserFactory } from "./domain/user/user-factory";
import { UserRoleFactory } from "./domain/user-role/user-role-factory";
import { RoleFactory } from "./domain/role/role-factory";
import { UserServiceHandler } from "./application/user";
import { MessageListener } from "./message-listener";


const container = new Container();


// Services
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<RoleService>(TYPES.RoleService).to(RoleService);
container.bind<UserRoleService>(TYPES.UserRoleService).to(UserRoleService);


// Repositories
container.bind<UserRoleRepository>(TYPES.UserRoleRepository).to(UserRoleRepository);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<RoleRepository>(TYPES.RoleRepository).to(RoleRepository);


// Factories
container.bind<UserFactory>(TYPES.UserFactory).to(UserFactory);
container.bind<UserRoleFactory>(TYPES.UserRoleFactory).to(UserRoleFactory);
container.bind<RoleFactory>(TYPES.RoleFactory).to(RoleFactory);

// Handlers
container.bind<UserServiceHandler>(TYPES.UserServiceHandler).to(UserServiceHandler);

container.bind<MessageListener>(TYPES.MessageListener).to(MessageListener);


export default container;
