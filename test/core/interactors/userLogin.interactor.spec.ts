import chai from "chai";
import sinon from 'sinon';
import userLogin from '../../../src/core/interactors/userLogin.interactor';
import User from '../../../src/core/entities/User';
import dynamoDb from "../../../src/dataSources/dynamoDb.datasource";
import mocksDb from '../../mocks/dynamoDb.mock';

const expect = chai.expect;
const sandbox = sinon.createSandbox();

after(() => {
    sandbox.restore();
});

describe("user login interactor", () => {
    const dynamoRepository = new dynamoDb();
    const stubDynamoRead = sandbox.stub(dynamoRepository, "readUser");
    let user: User = {
        "email": "test@mail.com",
        "password": "123abc.ABC",
        "name": "unit testing",
        "city": "Marte",
        "stateAccount": true,
        "dateRegister": new Date().toISOString(),
        "IsOwnerBussines": false,
        "dateLastUpdate": ""
    };
    it('userLogin [1002] (Ingreso exitoso)', async () => {
        stubDynamoRead.returns(mocksDb.userReadedSuccess);
        const res = await userLogin(dynamoRepository)(user);
        expect(res?.body.code).to.equal(1002);
        expect(res?.body.msg).to.equal('El usuario ha ingresado correctamente');
        expect(res?.statusCode).to.equal(200);
    });
    it('userLogin [2002] (Correo no existe)', async () => {
        stubDynamoRead.returns(mocksDb.userReadedNotExist);
        const res = await userLogin(dynamoRepository)(user);
        expect(res?.body.code).to.equal(2002);
        expect(res?.body.msg).to.equal('Correo o contraseña incorrecto');
        expect(res?.statusCode).to.equal(400);
    });
    it('userLogin [2002] (Contraseña incorrecta)', async () => {
        const lastPassword = user.password;
        user.password = "other_password";
        stubDynamoRead.returns(mocksDb.userReadedSuccess);
        const res = await userLogin(dynamoRepository)(user);
        expect(res?.body.code).to.equal(2002);
        expect(res?.body.msg).to.equal('Correo o contraseña incorrecto');
        expect(res?.statusCode).to.equal(400);
        user.password = lastPassword;
    });
    it('userLogin [2003] (Cuenta no verificada)', async () => {
        stubDynamoRead.returns(mocksDb.userReadedNotVerified);
        const res = await userLogin(dynamoRepository)(user);
        expect(res?.body.code).to.equal(2003);
        expect(res?.body.msg).to.equal('Verifique su cuenta para continuar');
        expect(res?.statusCode).to.equal(400);
    });
    it('userLogin [3002] (Error tecnico)', async () => {
        stubDynamoRead.rejects();
        const res = await userLogin(dynamoRepository)(user);
        expect(res?.body.code).to.equal(3002);
        expect(res?.body.msg).to.equal('Error tecnico');
        expect(res?.statusCode).to.equal(500);
    });
});
