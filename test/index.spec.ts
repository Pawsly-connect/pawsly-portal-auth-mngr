import chai from 'chai';
import request from 'supertest';
import app from '../src/index';
import mocksRequest from './mocks/requests.mock';

const expect = chai.expect;

describe('Requests index', () => {
	it('404 Not found', () => {
		request(app)
			.post('/other/path')
			.send(mocksRequest.login)
			.expect(404)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res.status).to.equal(404);
				expect(res.body.code).to.equal(3004);
				expect(res.body.msg).to.equal('Route /other/path not found.');
			});
	});
	it('Desalting error', () => {
		request(app)
			.post('/V1/user/login')
			.set({ 'content-type': 'text/plain' })
			.send('avoid')
			.expect(500)
			.end((err, res) => {
				expect(err).to.be.null;
				expect(res.body.code).to.equal(3005);
				expect(res.body.msg).to.equal('Error obtaining valid request');
				expect(res.statusCode).to.equal(500);
			});
	});
});
