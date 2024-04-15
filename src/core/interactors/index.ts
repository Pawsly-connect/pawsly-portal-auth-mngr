import EmailNotifier from "../../dataSources/emailNotifier.datasource";
import UserDynamo from "../../dataSources/userDynamo.datasource";
import userRegister from "./userRegister.interactor";
import userLogin from "./userLogin.interactor";

const userRepository = new UserDynamo();
const emailRepository = new EmailNotifier();

const interactors = {
    userRegister: userRegister(userRepository, emailRepository),
    userLogin: userLogin(userRepository)
}

export default interactors;
