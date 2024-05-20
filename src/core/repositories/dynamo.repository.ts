import User from '../entities/User';

interface UserRepository {
	readUser(email: string): Promise<any>;
	createUser(user: User): Promise<any>;
	updateUser(email: string): Promise<any>;
	deleteUser(email: string): Promise<any>;
	createInstance(): Promise<any>;
}

export default UserRepository;
