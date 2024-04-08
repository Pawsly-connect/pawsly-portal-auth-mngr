import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import debug from "debug";
import User from "../core/entities/User";
import userRepository from "../core/repositories/user.repository";
import { error } from "console";

const logger = debug("paw:userDynamo.datasource");

class UserDynamo implements userRepository {

    private client(){
        const clientDynamoDB = new DynamoDBClient({
            region: process.env.AWS_REGION,
            endpoint: process.env.ENDPOINT_DYNAMODB
        });
        return DynamoDBDocumentClient.from(clientDynamoDB);
    }

    public async read(email: string): Promise<any> {
        const docClient = this.client();
        const params = {
            TableName: "users",
            KeyConditionExpression: "#email = :email",
            ExpressionAttributeNames: {
                "#email": "email"
            },
            ExpressionAttributeValues: { ":email": email }
        };
        try {
            const data = await docClient.send(new QueryCommand(params));
            if(data.$metadata.httpStatusCode >= 400){throw new Error(data.toString())}
            return data;
        } catch (error) {
            throw new Error(error);
        }
    }

    public async create(user: User): Promise<any> {
        const docClient = this.client();
        const params = {
            TableName: "users",
            Item: user,
        };
        try {
            const data = await docClient.send(new PutCommand(params));
            if(data.$metadata.httpStatusCode >= 400){throw new Error(data.toString())}
            return data;
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default UserDynamo;
