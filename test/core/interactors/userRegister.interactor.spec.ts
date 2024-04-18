import chai from "chai";
import sinon from 'sinon';
import userRegister from '../../../src/core/interactors/userRegister.interactor';
import User from '../../../src/core/entities/User';
import UserDynamo from "../../../src/dataSources/userDynamo.datasource";
import EmailNotifier from "../../../src/dataSources/emailNotifier.datasource";
import mocksDb from '../../mocks/dynamoDb.mock';
import mocksEmail from '../../mocks/emailNotifier.mock';

const expect = chai.expect;
const sandbox = sinon.createSandbox();

after(() => {
    sandbox.restore();
});

describe("user register interactor", () => {
    const userRepository = new UserDynamo();
    const emailRepository = new EmailNotifier();
    const stubUserDynamoRead = sandbox.stub(userRepository, "read");
    const stubUserDynamoCreate = sandbox.stub(userRepository, "create");
    const stubEmailNotifier = sandbox.stub(emailRepository, "sendEmail");
    const stubRenderTemplate = sandbox.stub(emailRepository, "renderTemplate");
    const user: User = {
        "email": "prueba@test.com",
        "password": "123abc.",
        "name": "unit testing",
        "city": "Marte",
        "stateAccount": true,
        "dateRegister": new Date().toISOString(),
        "IsOwnerBussines": false,
        "dateLastUpdate": ""
    };
    it('userRegister [1001] (Registro exitoso)', async () => {
        stubUserDynamoRead.returns(mocksDb.userReadedNotExist);
        stubUserDynamoCreate.returns(mocksDb.userCreatedSuccess);
        stubRenderTemplate.returns(mocksEmail.renderSuccess);
        stubEmailNotifier.returns(mocksEmail.sendEmailSuccess);
        const res = await userRegister(userRepository, emailRepository)(user);
        expect(res?.body.code).to.equal(1001);
        expect(res?.body.msg).to.equal('Usuario guardado correctamente');
        expect(res?.statusCode).to.equal(201);
    });
    it('userRegister [2001] (Usuario ya existe)', async () => {
        stubUserDynamoRead.returns(mocksDb.userReadedSuccess);
        const res = await userRegister(userRepository, emailRepository)(user);
        expect(res?.body.code).to.equal(2001);
        expect(res?.body.msg).to.equal('El usuario ya existe');
        expect(res?.statusCode).to.equal(400);
    });
    it('userRegister [3001] (Error tecnico)', async () => {
        stubUserDynamoRead.rejects();
        const res = await userRegister(userRepository, emailRepository)(user);
        expect(res?.body.code).to.equal(3001);
        expect(res?.statusCode).to.equal(500);
    });
});
