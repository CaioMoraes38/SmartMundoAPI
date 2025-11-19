import { User } from "../../../models/user";
import { HttpRequest, HttpResponse } from "../../generalProtocols";
import {
  CreateUserParams,
  ICreateUserController,
  ICreateUserRepository,
} from "./protocol";

export class CreateUserController implements ICreateUserController {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateUserParams>
  ): Promise<HttpResponse<User>> {
    try {
      if (!httpRequest.body) {
        return {
          statusCode: 400,
          body: "Por favor coloque o corpo da requisição",
        };
      }

      const user = await this.createUserRepository.createUser(httpRequest.body);

      return {
        statusCode: 200,
        body: user,
      };
    } catch (error) {
      console.error("ERRO NO CONTROLLER:", error);

      return {
        statusCode: 500,
        body: "Algo deu errado",
      };
    }
  }
}
