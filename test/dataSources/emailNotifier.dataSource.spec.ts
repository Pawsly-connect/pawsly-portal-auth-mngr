import chai from "chai";
import sinon from 'sinon';
import emailTemplates from 'swig-email-templates';
import mocksEmail from '../mocks/emailNotifier.mock';
import emailNotifier from '../../src/dataSources/emailNotifier.datasource';
import path from "path";

const expect = chai.expect;
const sandbox = sinon.createSandbox();

after(() => {
    sandbox.restore();
});

describe("Email notifier datasource", () => {
    const emailDatasource = new emailNotifier();
    const templates = new emailTemplates();
    const stubRenderTemplate = sandbox.stub(templates, "render");
    it('renderTemplate (success)', async () => {
        const template = path.join(__dirname, '../..', 'statics/verificationTemplate.html');
        stubRenderTemplate.returns(mocksEmail.renderSuccess);
        const res = await emailDatasource.renderTemplate(template, {});
        expect(res.subject).to.equal(null);
        expect(res.html).to.be.a("string");
    });
});
