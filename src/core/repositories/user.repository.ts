import User from "../entities/User";

interface UserRepository {
    read(email: string): Promise<any>,
    create(user: User): Promise<any>,
    update(email: string): Promise<any>,
    delete(email: string): Promise<any>
}

export default UserRepository;
