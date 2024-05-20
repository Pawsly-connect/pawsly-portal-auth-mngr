import EmailNotifier from '../../dataSources/emailNotifier.datasource';
import DynamoDB from '../../dataSources/dynamoDb.datasource';
import userRegister from './userRegister.interactor';
import userLogin from './userLogin.interactor';
import userVerification from './userVerification.interactor';

const userRepository = new DynamoDB();
const emailRepository = new EmailNotifier();

const interactors = {
	userRegister: userRegister(userRepository, emailRepository),
	userLogin: userLogin(userRepository),
	userVerification: userVerification(userRepository),
};

export default interactors;
