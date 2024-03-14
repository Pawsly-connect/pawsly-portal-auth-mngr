import User from "../core/entities/User";
import userRepository from "../core/repositories/user.repository";

class UserDynamo implements userRepository {
    public async saveUser(user: User): Promise<any> {
        // Guardar usuario en DB
        const table = await this.getTable();
        return table;
    }

    private async getTable() {
        return [1, 2]
    }
}

export default UserDynamo;
