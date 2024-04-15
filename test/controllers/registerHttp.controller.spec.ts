import chai from "chai";
import sinon from 'sinon';
import request from 'supertest';
import interactor from '../../src/core/interactors';
import app from '../../src/index';

const expect = chai.expect;
const sandbox = sinon.createSandbox();

after(() => {
    sandbox.restore();
});

describe("Register controller", () => {
    const stubUserRegisterInteractor = sandbox.stub(interactor, "userRegister");
    it('register [success(201)]', async () => {
        const response: any = {
            body: { code: 1001, msg: `Usuario guardado correctamente` },
            statusCode: 201
        }
        stubUserRegisterInteractor.returns(response);
        request(app).post('/user/register').send({
            "email": "test@mail.com",
            "password": "123abc.",
            "city": "Bogota",
            "name": "User Tester"
        }).expect(201).end((err, res) => {
            expect(err).to.be.null;
            expect(res.body.code).to.equal(response.body.code);
            expect(res.body.msg).to.equal(response.body.msg);
            expect(res.statusCode).to.equal(response.statusCode);
        });
    });
});
