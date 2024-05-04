import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import User from "../core/entities/User";
import userRepository from "../core/repositories/user.repository";

class UserDynamo implements userRepository {

    private dynamoClient!: DynamoDBClient;
    private docClient!: DynamoDBDocumentClient;

    private client(){
        this.dynamoClient = new DynamoDBClient({
            region: process.env.REGION_AWS_LAMBDA
        });
        return DynamoDBDocumentClient.from(this.dynamoClient);
    }

    public async read(email: string): Promise<any> {
        try {
            this.docClient = this.client();
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
        } finally {
            this.dynamoClient.destroy();
            this.docClient.destroy();
        }
    }

    public async create(user: User): Promise<any> {
        try {
            this.docClient = this.client();
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
        } finally {
            this.dynamoClient.destroy();
            this.docClient.destroy();
        }
    }

    public async update(email: string): Promise<any> {
        try {
            this.docClient = this.client();
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
        } finally {
            this.dynamoClient.destroy();
            this.docClient.destroy();
        }
    }

    public async delete(email: string): Promise<any> {
        try {
            this.docClient = this.client();
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
        } finally {
            this.dynamoClient.destroy();
            this.docClient.destroy();
        }
    }
}

export default UserDynamo;
