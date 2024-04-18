const userCreatedSuccess: any = {
    '$metadata': {
        httpStatusCode: 200,
        requestId: 'a008f153-114b-460f-ab27-d1c707e5c765',
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0
    }
}

const userReadedSuccess: any = {
    '$metadata': {
        httpStatusCode: 200,
        requestId: '4375dd00-7401-4830-9047-fe2c782bb8f1',
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0
    },
    Count: 1,
    Items: [
        {
            name: 'User Tester',
            dateRegister: '2024-04-08T03:15:02.361Z',
            password: '592183b27945b115662e5a3c052d2c44a0afd65d',
            stateAccount: true,
            city: 'Bogota',
            email: 'test@mail.com',
            dateLastUpdate: ''
        }
    ],
    ScannedCount: 1
}

const userReadedNotVerified: any = {
    '$metadata': {
        httpStatusCode: 200,
        requestId: '4375dd00-7401-4830-9047-fe2c782bb8f1',
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0
    },
    Count: 1,
    Items: [
        {
            name: 'User Tester',
            dateRegister: '2024-04-08T03:15:02.361Z',
            password: '592183b27945b115662e5a3c052d2c44a0afd65d',
            stateAccount: false,
            city: 'Bogota',
            email: 'test@mail.com',
            dateLastUpdate: ''
        }
    ],
    ScannedCount: 1
}

const userReadedNotExist: any = {
    '$metadata': {
        httpStatusCode: 200,
        requestId: 'd4fa4a41-723c-43f5-a317-64f363cd9959',
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0
    },
    Count: 0,
    Items: [],
    ScannedCount: 0
}

const userUpdatedSuccess: any = {
    '$metadata': {
        httpStatusCode: 200,
        requestId: '3017f9f7-7ae0-48b1-a6ae-72f435297c1b',
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0
    }
}

export default {
    userCreatedSuccess: userCreatedSuccess,
    userReadedSuccess: userReadedSuccess,
    userReadedNotExist: userReadedNotExist,
    userReadedNotVerified: userReadedNotVerified,
    userUpdatedSuccess: userUpdatedSuccess
}
