import User from "../entities/User";
import EmailRepository from "../repositories/email.repository";
import UserRepository from "../repositories/user.repository";
import * as path from 'path';
import debug from "debug";
import { encryptData } from '../../utilities/cipher';

const logger = debug("paw:userRegister.interactor");

const userRegister = (userRepository: UserRepository, emailRepository: EmailRepository) => async (user: User) => {
    try {
        user.stateAccount = false;
        user.dateRegister = new Date().toISOString();
        user.dateLastUpdate = "";
        user.IsOwnerBussines = false;
        const users = await userRepository.read(user.email);
        if (users.ScannedCount === 0) {
            await userRepository.create(user);
            const template = path.join(__dirname, '../../..', 'statics/verificationTemplate.html');
            const dataTemplate = {
                name: user.name,
                key: encryptData(user.email),
                base_url: process.env.HOST_FRONT
            };
            const rendered = await emailRepository.renderTemplate(template, dataTemplate);
            const payloadEmail = {
                from: 'Pawsly <pawsly.connect@gmail.com>',
                to: [user.email],
                subject: 'Confirma tu cuenta en Pawsly',
                html: rendered.html
            };
            await emailRepository.sendEmail(payloadEmail);
            return {
                body: { code: 1001, msg: `Usuario guardado correctamente` },
                statusCode: 201
            }
        }else if (users.ScannedCount > 0) {
            return {
                body: { code: 2001, msg: `El usuario ya existe` },
                statusCode: 400
            };
        }
    } catch (error: any) {
        logger(error.message);
        return {
            body: { code: 3001, msg: "Error tecnico" },
            statusCode: 500
        };
    }
};

export default userRegister;
