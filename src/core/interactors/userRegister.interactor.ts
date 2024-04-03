import User from "../entities/User";
import EmailRepository from "../repositories/email.repository";
import UserRepository from "../repositories/user.repository";

const userRegister = (userRepository: UserRepository, emailRepository: EmailRepository) => async (user: User) => {
    const response = await userRepository.saveUser(user);
    // await emailRepository.sendConfirmationEmail(user.email);
    return response;
};

export default userRegister;
