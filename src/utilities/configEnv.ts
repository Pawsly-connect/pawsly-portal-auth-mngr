import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import dotenv from 'dotenv';
import fs from 'fs';
import debug from "debug";

const logger = debug("paw:configEnv");
let envValues: { [key: string]: any } = {};

export function isNotLocalEnv() {
    return ["qa", "staging", "production"].includes(process.env.NODE_ENV as string)
}

async function getParams(name: string, decrypted: boolean = false) {
    const client = new SSMClient({
        region: process.env.REGION_AWS_LAMBDA
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

const loadEnv = async () => {
    if (isNotLocalEnv()) {
        const secret = await getParams("secrets_auth_mngr");
        envValues = {
            HOST_FRONT: process.env.HOST_FRONT || '',
            EMAIL_HOST: process.env.EMAIL_HOST || '',
            EMAIL_PORT: process.env.EMAIL_PORT || '',
            EMAIL_USER: secret.EMAIL_USER || '',
            EMAIL_PASSWORD: secret.EMAIL_PASSWORD || '',
            REGION_AWS_LAMBDA: process.env.REGION_AWS_LAMBDA || '',
            KEY_AES: secret.KEY_AES || '',
            KEY_IV: secret.KEY_IV || '',
            KEY_CIPHER: secret.KEY_CIPHER || '',
            DEBUG: process.env.DEBUG || '',
        }
    } else {
        envValues = dotenv.parse(fs.readFileSync('.env'));
    }
    logger("Env values loaded successfully");
}

export const getEnv = (key: string): string => {
    try {
        if(!Object.keys(envValues).length){
            loadEnv().then();
        }
        return envValues[key];
    } catch (error: any) {
        logger("Error getting env value: %o", error);
        throw { status: 500 };
    }
}
