import EmailNotifier from "../../dataSources/emailNotifier.datasource";
import UserDynamo from "../../dataSources/userDynamo.datasource";
import userRegister from "./userRegister.interactor";

const userRepository = new UserDynamo();
const emailRepository = new EmailNotifier();

export default userRegister(userRepository, emailRepository);
