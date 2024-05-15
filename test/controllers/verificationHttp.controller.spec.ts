import chai from "chai";
import sinon from 'sinon';
import request from 'supertest';
import interactor from '../../src/core/interactors';
import app from '../../src/index';
import mocksRequest from '../mocks/requests.mock';

const expect = chai.expect;
const sandbox = sinon.createSandbox();

after(() => {
    sandbox.restore();
});

describe("Verification controller", () => {
    const stubUserVerificationInteractor = sandbox.stub(interactor, "userVerification");
    it('verification [success(200)]', async () => {
        const response: any = {
            body: { code: 1003, msg: `Cuenta verificada exitosamente` },
            statusCode: 200
        }
        stubUserVerificationInteractor.returns(response);
        request(app).post('/V1/user/verification').set({ "content-type": "text/plain" }).send(mocksRequest.verification).expect(200).end((err, res) => {
            expect(err).to.be.null;
            expect(res.body.code).to.equal(response.body.code);
            expect(res.body.msg).to.equal(response.body.msg);
            expect(res.statusCode).to.equal(response.statusCode);
        });
    });
});
