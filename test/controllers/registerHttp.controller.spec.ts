import chai from 'chai';
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

describe('Register controller', () => {
	const stubUserRegisterInteractor = sandbox.stub(interactor, 'userRegister');
	it('register [success(201)]', async () => {
		const response: any = {
			body: { code: 1001, msg: `Usuario guardado correctamente` },
			statusCode: 201,
		};
		stubUserRegisterInteractor.returns(response);
		request(app)
			.post('/V1/user/register')
			.set({ 'content-type': 'text/plain' })
			.send(mocksRequest.register)
			.expect(201)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res.body.code).to.equal(response.body.code);
				expect(res.body.msg).to.equal(response.body.msg);
				expect(res.statusCode).to.equal(response.statusCode);
			});
	});
});
