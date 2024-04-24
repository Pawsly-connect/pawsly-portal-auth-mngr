import chai from "chai";
import sinon from 'sinon';
import userLogin from '../../../src/core/interactors/userLogin.interactor';
import User from '../../../src/core/entities/User';
import UserDynamo from "../../../src/dataSources/userDynamo.datasource";
import mocksDb from '../../mocks/dynamoDb.mock';

const expect = chai.expect;
const sandbox = sinon.createSandbox();

after(() => {
    sandbox.restore();
});

describe("user login interactor", () => {
    const userRepository = new UserDynamo();
    const stubUserDynamoRead = sandbox.stub(userRepository, "read");
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
        stubUserDynamoRead.returns(mocksDb.userReadedSuccess);
        const res = await userLogin(userRepository)(user);
        expect(res?.body.code).to.equal(1002);
        expect(res?.body.msg).to.equal('El usuario ha ingresado correctamente');
        expect(res?.statusCode).to.equal(200);
    });
    it('userLogin [2002] (Correo no existe)', async () => {
        stubUserDynamoRead.returns(mocksDb.userReadedNotExist);
        const res = await userLogin(userRepository)(user);
        expect(res?.body.code).to.equal(2002);
        expect(res?.body.msg).to.equal('Correo o contraseña incorrecto');
        expect(res?.statusCode).to.equal(400);
    });
    it('userLogin [2002] (Contraseña incorrecta)', async () => {
        const lastPassword = user.password;
        user.password = "other_password";
        stubUserDynamoRead.returns(mocksDb.userReadedSuccess);
        const res = await userLogin(userRepository)(user);
        expect(res?.body.code).to.equal(2002);
        expect(res?.body.msg).to.equal('Correo o contraseña incorrecto');
        expect(res?.statusCode).to.equal(400);
        user.password = lastPassword;
    });
    it('userLogin [2003] (Cuenta no verificada)', async () => {
        stubUserDynamoRead.returns(mocksDb.userReadedNotVerified);
        const res = await userLogin(userRepository)(user);
        expect(res?.body.code).to.equal(2003);
        expect(res?.body.msg).to.equal('Verifique su cuenta para continuar');
        expect(res?.statusCode).to.equal(400);
    });
    it('userLogin [3002] (Error tecnico)', async () => {
        stubUserDynamoRead.rejects();
        const res = await userLogin(userRepository)(user);
        expect(res?.body.code).to.equal(3002);
        expect(res?.body.msg).to.equal('Error tecnico');
        expect(res?.statusCode).to.equal(500);
    });
});
