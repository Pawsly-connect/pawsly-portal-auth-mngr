import User from "../entities/User";
import UserRepository from "../repositories/user.repository";
import crypto from 'crypto-js';
import debug from "debug";

const logger = debug("paw:userLogin.interactor");

const userLogin = (userRepository: UserRepository) => async (user: User) => {
    try {
        const users = await userRepository.read(user.email);
        if (users.ScannedCount === 1) {
            const dataUser = users.Items[0];
            const passwordHASH = crypto.HmacSHA1(user.password, process.env.KEY_SHA1 as string).toString(crypto.enc.Hex);
            if(passwordHASH === dataUser.password){
                if(dataUser.stateAccount){
                    return {
                        body: { code: 1002, msg: `El usuario ha ingresado correctamente` },
                        statusCode: 200
                    }
                }else{
                    return {
                        body: { code: 2003, msg: `Verifique su cuenta para continuar` },
                        statusCode: 400
                    }
                }
            }else{
                return {
                    body: { code: 2002, msg: `Correo o contraseña incorrecto` },
                    statusCode: 400
                }
            }
        }else if(users.ScannedCount === 0){
            return {
                body: { code: 2002, msg: `Correo o contraseña incorrecto` },
                statusCode: 400
            }
        }
    } catch (error: any) {
        logger(error.message);
        return {
            body: { code: 3002, msg: "Error tecnico" },
            statusCode: 500
        };
    }
};

export default userLogin;
