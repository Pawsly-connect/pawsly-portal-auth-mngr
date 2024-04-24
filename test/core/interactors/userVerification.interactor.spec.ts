import chai from "chai";
import sinon from 'sinon';
import userVerification from '../../../src/core/interactors/userVerification.interactor';
import UserDynamo from "../../../src/dataSources/userDynamo.datasource";
import mocksDb from '../../mocks/dynamoDb.mock';

const expect = chai.expect;
const sandbox = sinon.createSandbox();

after(() => {
    sandbox.restore();
});

describe("user verification interactor", () => {
    const userRepository = new UserDynamo();
    const stubUserDynamoRead = sandbox.stub(userRepository, "read");
    const stubUserDynamoUpdate = sandbox.stub(userRepository, "update");
    let body: any = {
        "key": "NjM4MTkxMzZkYTE5NWU5YTI5MGJkYTY5NmVhNzAxNjU="
    };
    it('userVerification [1003] (Verificacion exitosa)', async () => {
        stubUserDynamoRead.returns(mocksDb.userReadedNotVerified);
        stubUserDynamoUpdate.returns(mocksDb.userUpdatedSuccess);
        const res = await userVerification(userRepository)(body);
        expect(res?.body.code).to.equal(1003);
        expect(res?.body.msg).to.equal('Cuenta verificada exitosamente');
        expect(res?.statusCode).to.equal(200);
    });
    it('userVerification [2004] (Verificacion ya realizada)', async () => {
        stubUserDynamoRead.returns(mocksDb.userReadedSuccess);
        const res = await userVerification(userRepository)(body);
        expect(res?.body.code).to.equal(2004);
        expect(res?.body.msg).to.equal('La cuenta ya ha sido verificada');
        expect(res?.statusCode).to.equal(400);
    });
    it('userVerification [2005] (Usuario no existe)', async () => {
        stubUserDynamoRead.returns(mocksDb.userReadedNotExist);
        const res = await userVerification(userRepository)(body);
        expect(res?.body.code).to.equal(2005);
        expect(res?.body.msg).to.equal('El usuario a verificar no existe');
        expect(res?.statusCode).to.equal(400);
    });
    it('userVerification [3003] (Error tecnico)', async () => {
        stubUserDynamoRead.rejects();
        const res = await userVerification(userRepository)(body);
        expect(res?.body.code).to.equal(3003);
        expect(res?.body.msg).to.equal('Error tecnico');
        expect(res?.statusCode).to.equal(500);
    });
});
