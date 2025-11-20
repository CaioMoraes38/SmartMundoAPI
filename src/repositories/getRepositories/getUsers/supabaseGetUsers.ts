import { IGetUsersRepository } from "../../../controllers/getControllers/getUsers/protocols";
import { User } from "../../../models/user";
import { supabase } from "../../../database/supabase";

export class SupabaseUsersRepository implements IGetUsersRepository {
    async getUsers(): Promise<User[]> {
        const { data, error } = await supabase
            
            .from("app_users")
            .select("*");
        if (error) {
            console.error("Erro ao buscar usuários:", error);
            throw new Error("Erro ao buscar usuários no Supabase");
        }

        return data || [];
    }
}
