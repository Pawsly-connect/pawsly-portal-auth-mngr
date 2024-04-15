import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import debug from "debug";
import User from "../core/entities/User";
import userRepository from "../core/repositories/user.repository";

const logger = debug("paw:userDynamo.datasource");

class UserDynamo implements userRepository {

    private client(){
        const dynamoClient = new DynamoDBClient({
            endpoint: process.env.DYNAMO_ENDPOINT,
            region: process.env.AWS_DEFAULT_REGION
        });
        return DynamoDBDocumentClient.from(dynamoClient);
    }

    public async read(email: string): Promise<any> {
        try {
            const docClient = this.client();
            const params = {
                TableName: "users",
                KeyConditionExpression: "#email = :email",
                ExpressionAttributeNames: {
                    "#email": "email"
                },
                ExpressionAttributeValues: { ":email": email }
            };
            const data: any = await docClient.send(new QueryCommand(params));
            if (data.$metadata.httpStatusCode >= 400) {
                logger(data.toString());
                throw new Error(data.toString());
            }
            return data;
        } catch (error: any) {
            logger(error);
            throw new Error(error);
        } finally {
            // this.clientDynamoDB.destroy();
        }
    }

    public async create(user: User): Promise<any> {
        try {
            const docClient = this.client();
            const params = {
                TableName: "users",
                Item: user,
            };
            const data: any = await docClient.send(new PutCommand(params));
            if (data.$metadata.httpStatusCode >= 400) {
                logger(data.toString());
                throw new Error(data.toString());
            }
            return data;
        } catch (error: any) {
            logger(error);
            throw new Error(error);
        } finally {
            // this.clientDynamoDB.destroy();
        }
    }

    public async update(email: string): Promise<any> {
        try {
            const docClient = this.client();
            const params = {
                TableName: "users",
                Key: {
                    'email': email,
                },
                UpdateExpression: "set stateAccount = :stateAccount",
                ExpressionAttributeValues: {
                    ":stateAccount": true,
                }
            };
            const data: any = await docClient.send(new UpdateCommand(params));
            if (data.$metadata.httpStatusCode >= 400) {
                logger(data.toString());
                throw new Error(data.toString());
            }
            return data;
        } catch (error: any) {
            logger(error);
            throw new Error(error);
        } finally {
            // this.clientDynamoDB.destroy();
        }
    }

    public async delete(email: string): Promise<any> {
        try {
            const docClient = this.client();
            const params = {
                TableName: "users",
                Key: {
                    'email': email,
                }
            };
            const data: any = await docClient.send(new DeleteCommand(params));
            if (data.$metadata.httpStatusCode >= 400) {
                logger(data.toString());
                throw new Error(data.toString());
            }
            return data;
        } catch (error: any) {
            logger(error);
            throw new Error(error);
        } finally {
            // this.clientDynamoDB.destroy();
        }
    }
}

export default UserDynamo;
