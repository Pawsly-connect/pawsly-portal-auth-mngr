import User from "../entities/User";

interface UserRepository {
    saveUser(user: User): Promise<any>
}

export default UserRepository;
