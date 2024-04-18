import interactor from "../core/interactors";
import { Response, Request } from 'express';

const verificationController = async (request: Request, response: Response) => {
    const result:any = await interactor.userVerification(request.body);
    return response.status(result.statusCode).json(result.body);
}

export default verificationController;
