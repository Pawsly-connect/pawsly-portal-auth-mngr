import userRegister from "../core/interactors";
import { Response, Request } from 'express';

const registerController = async (request: Request, response: Response) => {
    const result = await userRegister(request.body);
    response.status(result.statusCode).json(result.body);
}

export default registerController;
