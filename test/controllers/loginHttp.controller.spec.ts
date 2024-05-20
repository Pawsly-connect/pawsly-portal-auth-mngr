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

describe('login controller', () => {
	const stubUserLoginInteractor = sandbox.stub(interactor, 'userLogin');
	it('login [success (200)]', async () => {
		const response: any = {
			body: { code: 1002, msg: `El usuario ha ingresado correctamente` },
			statusCode: 200,
		};
		stubUserLoginInteractor.returns(response);
		request(app)
			.post('/V1/user/login')
			.set({ 'content-type': 'text/plain' })
			.send(mocksRequest.login)
			.expect(200)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res.body.code).to.equal(1002);
				expect(res.body.msg).to.equal('El usuario ha ingresado correctamente');
				expect(res.statusCode).to.equal(200);
			});
	});
});
