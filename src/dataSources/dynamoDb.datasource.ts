import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import User from "../core/entities/User";
import dynamoDb from "../core/repositories/dynamo.repository";
import { isNotLocalEnv } from '../utilities/configEnv';
import debug from "debug";
import { getEnv } from "../utilities/configEnv";

const logger = debug("paw:dynamoDb");

class DynamoDB implements dynamoDb {

    private dynamoClient!: DynamoDBClient;
    private docClient!: DynamoDBDocumentClient;

    constructor(){
        let paramsDB = {
            region: getEnv('REGION_AWS_LAMBDA')
        }
        if(!isNotLocalEnv()){
            paramsDB["endpoint"] = getEnv('DYNAMO_ENDPOINT');
        }
        try {
            this.dynamoClient = new DynamoDBClient(paramsDB);
            this.docClient = DynamoDBDocumentClient.from(this.dynamoClient);
            logger("Connected to database successfully");
        } catch (error: any) {
            throw new Error(error);
        }
    }

    public async readUser(email: string): Promise<any> {
        try {
            const params = {
                TableName: "users",
                KeyConditionExpression: "#email = :email",
                ExpressionAttributeNames: {
                    "#email": "email"
                },
                ExpressionAttributeValues: { ":email": email }
            };
            const data: any = await this.docClient.send(new QueryCommand(params));
            if (data.$metadata.httpStatusCode >= 400) {
                throw new Error(data.toString());
            }
            return data;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    public async createUser(user: User): Promise<any> {
        try {
            const params = {
                TableName: "users",
                Item: user,
            };
            const data: any = await this.docClient.send(new PutCommand(params));
            if (data.$metadata.httpStatusCode >= 400) {
                throw new Error(data.toString());
            }
            return data;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    public async updateUser(email: string): Promise<any> {
        try {
            const params = {
                TableName: "users",
                Key: {
                    'email': email
                },
                UpdateExpression: "SET stateAccount = :stateAccount, dateLastUpdate = :dateLastUpdate",
                ExpressionAttributeValues: {
                    ":stateAccount": true,
                    ":dateLastUpdate": new Date().toISOString()
                }
            };
            const data: any = await this.docClient.send(new UpdateCommand(params));
            if (data.$metadata.httpStatusCode >= 400) {
                throw new Error(data.toString());
            }
            return data;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    public async deleteUser(email: string): Promise<any> {
        try {
            const params = {
                TableName: "users",
                Key: {
                    'email': email
                }
            };
            const data: any = await this.docClient.send(new DeleteCommand(params));
            if (data.$metadata.httpStatusCode >= 400) {
                throw new Error(data.toString());
            }
            return data;
        } catch (error: any) {
            throw new Error(error);
        }
    }
}

export default DynamoDB;
