import interactor from "../core/interactors";
import { Response, Request } from 'express';

const loginController = async (request: Request, response: Response) => {
    const result:any = await interactor.userLogin(JSON.parse(request.body));
    return response.status(result.statusCode).json(result.body);
}

export default loginController;
