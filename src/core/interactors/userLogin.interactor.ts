import User from '../entities/User';
import DynamoRepository from '../repositories/dynamo.repository';
import debug from 'debug';

const logger = debug('paw:userLogin.interactor');

const userLogin = (dynamoRepository: DynamoRepository) => async (user: User) => {
	try {
		await dynamoRepository.createInstance();
		const users = await dynamoRepository.readUser(user.email);
		if (users.ScannedCount === 1) {
			const dataUser = users.Items[0];
			if (user.password === dataUser.password) {
				if (dataUser.stateAccount) {
					return {
						body: {
							code: 1002,
							msg: `El usuario ha ingresado correctamente`,
						},
						statusCode: 200,
					};
				} else {
					return {
						body: { code: 2003, msg: `Verifique su cuenta para continuar` },
						statusCode: 400,
					};
				}
			} else {
				return {
					body: { code: 2002, msg: `Correo o contraseña incorrecto` },
					statusCode: 400,
				};
			}
		} else if (users.ScannedCount === 0) {
			return {
				body: { code: 2002, msg: `Correo o contraseña incorrecto` },
				statusCode: 400,
			};
		}
	} catch (error: any) {
		logger('[Error] %o', error);
		return {
			body: { code: 3002, msg: 'Error tecnico' },
			statusCode: 500,
		};
	}
};

export default userLogin;
