import { User } from "../../../models/user";
import { HttpRequest, HttpResponse } from "../../generalProtocols";

export interface ICreateUserController {
  handle(httpRequest: HttpRequest<CreateUserParams>): Promise<HttpResponse<User>>;
}

export interface CreateUserParams {
  name: string;
  userName: string;
  password: string;
}

export interface ICreateUserRepository {
  createUser(params: CreateUserParams): Promise<User>;
}
