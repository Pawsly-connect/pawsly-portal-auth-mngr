import chai from "chai";
import request from 'supertest';
import app from '../src/index';

const expect = chai.expect;

describe("Requests index", () => {
    it('404 Not found', () => {
        request(app).post('/other/path').send().expect(404).end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.equal(404);
            expect(res.body.code).to.equal(3003);
            expect(res.body.msg).to.equal("Route /other/path not found.");
        });
    });
});
