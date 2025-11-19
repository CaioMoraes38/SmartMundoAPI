import { User } from "../../../models/user"
import { HttpResponse } from "../../generalProtocols"

export interface IGetUsersController{
    handle():Promise<HttpResponse<User[]>>
}

export interface IGetUsersRepository{
    getUsers():Promise<User[]>
}