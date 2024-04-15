import interactor from "../core/interactors";
import { Response, Request } from 'express';

const registerController = async (request: Request, response: Response) => {
    const result:any = await interactor.userRegister(request.body);
    return response.status(result.statusCode).json(result.body);
}

export default registerController;
