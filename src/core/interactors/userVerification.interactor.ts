import DynamoRepository from "../repositories/dynamo.repository";
import { decryptData } from '../../utilities/cipher';
import debug from "debug";

const logger = debug("paw:userVerification.interactor");

const userVerification = (dynamoRepository: DynamoRepository) => async (body: any) => {
    try {
        await dynamoRepository.createInstance()
        const email = await decryptData(body.key);
        const users = await dynamoRepository.readUser(email);
        if (users.ScannedCount === 1) {
            const dataUser = users.Items[0];
            if(dataUser.stateAccount){
                return {
                    body: { code: 2004, msg: `La cuenta ya ha sido verificada` },
                    statusCode: 400
                }
            }else{
                await dynamoRepository.updateUser(email);
                return {
                    body: { code: 1003, msg: `Cuenta verificada exitosamente` },
                    statusCode: 200
                }
            }
        }else if(users.ScannedCount === 0){
            return {
                body: { code: 2005, msg: `El usuario a verificar no existe` },
                statusCode: 400
            }
        }
    } catch (error: any) {
        logger("[Error] %o", error);
        return {
            body: { code: 3003, msg: "Error tecnico" },
            statusCode: 500
        };
    }
};

export default userVerification;
