import User from "../entities/User";

interface UserRepository {
    read(email: string): Promise<any>,
    create(user: User): Promise<any>
}

export default UserRepository;
