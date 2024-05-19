import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import * as dotenv from 'dotenv';
import fs from 'fs';
import debug from "debug";

const logger = debug("paw:configEnv");

export function isNotLocalEnv() {
    return ["qa", "staging", "production"].includes(process.env.NODE_ENV as string)
}

function getParams(name: string, decrypted: boolean = false) {
    logger("Getting env values from parameter store");
    const client = new SSMClient({
        region: process.env.REGION
    });
    const input = {
        Name: name,
        WithDecryption: decrypted
    };
    const command = new GetParameterCommand(input);
    client.send(command).then((response) => {
        const parameters = JSON.parse(response.Parameter?.Value as string);
        logger("Parameters loaded: %o", parameters);
        return parameters;
    }).catch((err) => {
        throw new Error(err);
    }).finally(() => {
        client.destroy();
    });
}

export const loadEnv = () => {
    try {
        let envValues: { [key: string]: any } = {};
        if (isNotLocalEnv()) {
            envValues = getParams("secrets_auth_mngr") as any;
        } else {
            envValues = dotenv.parse(fs.readFileSync('.env'));
        }
        dotenv.populate(process.env as any, envValues, {override: true});
        logger("Variables de entorno cargadas");
    } catch (error) {
        logger("Error al cargar las variables de entorno: %o", error);
    }
}

export const getEnv = (key: string): string => {
    return process.env[key] || '';
}
