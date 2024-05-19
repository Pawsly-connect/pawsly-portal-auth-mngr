import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import * as dotenv from 'dotenv';
import fs from 'fs';
import debug from "debug";

const logger = debug("paw:configEnv");

export function isNotLocalEnv() {
    return ["qa", "staging", "production"].includes(process.env.NODE_ENV as string)
}

async function getParams(name: string, decrypted: boolean = false) {
    const client = new SSMClient({
        region: process.env.REGION
    });
    try {
        const input = {
            Name: name,
            WithDecryption: decrypted
        };
        const command = new GetParameterCommand(input);
        const response = await client.send(command);
        return JSON.parse(response.Parameter?.Value as string);
    } catch (error: any) {
        throw new Error(error);
    } finally {
        client.destroy();
    }
}

export const loadEnv = async () => {
    let envValues: { [key: string]: any } = {};
    if (isNotLocalEnv()) {
        envValues = await getParams("secrets_auth_mngr");
    } else {
        envValues = dotenv.parse(fs.readFileSync('.env'));
    }
    dotenv.populate(process.env as any, envValues, {override: true});
}

export const getEnv = (key: string): any => {
    try{
        return process.env[key];
    } catch(err){
        logger("Error getting env value: %o", err);
        throw { status: 500 };
    };
}
