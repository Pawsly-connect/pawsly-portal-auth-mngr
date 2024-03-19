import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import debug from "debug";
import crypto from 'crypto-js';
import User from "../core/entities/User";
import userRepository from "../core/repositories/user.repository";

const logger = debug("paw:userDynamo.datasource");

class UserDynamo implements userRepository {

    public async saveUser(user: User): Promise<any> {
        user.stateAccount = false;
        user.dateRegister = new Date().toISOString();
        user.password = crypto.HmacSHA1(user.password, process.env.KEY_SHA1).toString();
        const users = await this.read(user);
        if (users.ScannedCount === 0) {
            const result = await this.create(user);
            if (result.$metadata.httpStatusCode === 200) {
                return {
                    body: { code: 1001, msg: `Usuario guardado correctamente` },
                    statusCode: 201
                }
            } else {
                return {
                    body: { code: 3002, msg: `Hubo un error al guardar el usuario: ${result}` },
                    statusCode: 500
                }
            }
        }else if (users.ScannedCount > 0) {
            return {
                body: { code: 2001, msg: `El usuario ya existe` },
                statusCode: 400
            };
        }
        return {
            body: { code: 3001, msg: `Error generico: ${users} - ${users.code}` },
            statusCode: 500
        };
    }

    private client() {
        const clientDynamoDB = new DynamoDBClient({
            region: process.env.AWS_REGION,
            endpoint: process.env.ENDPOINT_DYNAMODB
        });
        return DynamoDBDocumentClient.from(clientDynamoDB);
    }

    private async read(user: User) {
        const docClient = this.client();
        const params = {
            TableName: "users",
            KeyConditionExpression: "#email = :email",
            ExpressionAttributeNames: {
                "#email": "email"
            },
            ExpressionAttributeValues: { ":email": user.email }
        };
        try {
            const data = await docClient.send(new QueryCommand(params));
            logger('result: ' + JSON.stringify(data));
            return data;
        } catch (error) {
            logger("Error: ", error);
            return error;
        }
    }

    private async create(user: User) {
        const docClient = this.client();
        const params = {
            TableName: "users",
            Item: user,
        };
        try {
            const data = await docClient.send(new PutCommand(params));
            logger('result: ' + JSON.stringify(data));
            return data;
        } catch (error) {
            logger("Error: ", error);
            return error;
        }
    }
}

export default UserDynamo;
