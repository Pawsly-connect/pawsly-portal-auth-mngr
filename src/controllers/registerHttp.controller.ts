import userRegister from "../core/interactors";
import { Response, Request } from 'express';

const registerController = async (request: Request, response: Response) => {
    const { body } = request;
    const { user } = body;

    await userRegister(user);

    response.json();
}

export default registerController;
