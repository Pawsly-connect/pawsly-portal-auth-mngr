import cryptoNode from 'node:crypto';
import crypto from 'crypto';
import { getEnv } from './configEnv';

export function hashData(data: string) {
    try {
        const hashMethod = getEnv('HASH_METHOD');
        const hash = cryptoNode.createHash(hashMethod);
        return hash.update(data).digest('hex');
    } catch (error: any) {
        throw new Error(error);
    }
}

export function encryptData(data: string) {
    try {
        const cipherMethod = getEnv('CIPHER_METHOD');
        const keySecret = getEnv('KEY_AES');
        const keyIv = getEnv('KEY_IV');
        const key = hashData(keySecret).substring(0, 32);
        const encryptionIV = hashData(keyIv).substring(0, 16);
        const cipher = cryptoNode.createCipheriv(cipherMethod, key, encryptionIV);
        return Buffer.from(
            cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
        ).toString('base64');
    } catch (error:any) {
        throw new Error(error);
    }
}

export function decryptData(encryptedData: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }) {
    try {
        const cipherMethod = getEnv('CIPHER_METHOD');
        const keySecret = getEnv('KEY_AES');
        const keyIv = getEnv('KEY_IV');
        const key = hashData(keySecret).substring(0, 32);
        const encryptionIV = hashData(keyIv).substring(0, 16);
        const buff = Buffer.from(encryptedData, 'base64');
        const decipher = cryptoNode.createDecipheriv(cipherMethod, key, encryptionIV);
        return (
            decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
            decipher.final('utf8')
        )
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function decryptRequest(cipherText: string) {
    try {
        const encryptionMethod = getEnv('ENCRYPT_METHOD');
        const keyPem = getEnv('KEY_PEM');
        const keyPemImported = await importPrivateKey(keyPem, encryptionMethod);
        const array: any = atob(cipherText).split(',');
        const message = new Uint8Array(array as ArrayBuffer);
        const decrypted = await crypto.subtle.decrypt(
            {
                name: encryptionMethod
            },
            keyPemImported,
            message
        );
        return new TextDecoder("utf-8").decode(decrypted);
    } catch (error: any) {
        throw new Error(error);
    }
}

function importPrivateKey(pem: string, encryptMethod: string) {
    try {
        const binaryDerString = atob(pem.replace(/\*/g, ""));
        const binaryDer = str2ab(binaryDerString);
        return crypto.subtle.importKey(
            "pkcs8",
            binaryDer,
            {
                name: encryptMethod,
                length: 2048,
                hash: "SHA-256"
            },
            true,
            ["decrypt"]
        );
    } catch (error: any) {
        throw new Error(error);
    }
}

function str2ab(str: string) {
    try {
        const buf = new ArrayBuffer(str.length);
        const bufView = new Uint8Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    } catch (error: any) {
        throw new Error(error);
    }
}
