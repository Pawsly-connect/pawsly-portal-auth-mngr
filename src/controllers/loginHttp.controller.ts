import interactor from "../core/interactors";
import { Response, Request } from 'express';

const loginController = async (request: Request, response: Response) => {
    const result = await interactor.userLogin(request.body);
    response.status(result.statusCode).json(result.body);
}

export default loginController;
