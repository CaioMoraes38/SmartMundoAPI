import { CreateUserParams, ICreateUserRepository } from "../../../controllers/createControllers/createUser/protocol";
import { User } from "../../../models/user";
import { supabase } from "../../../database/supabase";

export class SupabaseCreateUserRepository implements ICreateUserRepository {
  async createUser(params: CreateUserParams): Promise<User> {
    const { data, error } = await supabase
      .from("app_users")
      .insert({
        name: params.name,
        username: params.userName,
        password_hash: params.password,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar usuário:", error);
      throw new Error("Erro ao criar usuário no Supabase");
    }

    return data as User;
  }
}
