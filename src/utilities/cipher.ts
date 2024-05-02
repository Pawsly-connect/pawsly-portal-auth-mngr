import cryptoNode from 'node:crypto';
import crypto from 'crypto';
import dotEnv from 'dotenv';
dotEnv.config();

const key = process.env.KEY_CIPHER as string;
const keySecret = process.env.KEY_AES as string;
const keyIv = process.env.KEY_IV as string;
const cipherMethod = 'aes-256-cbc';
const hashMethod = 'sha512';
const encryptionMethod = 'RSA-OAEP';

export function hashData(data: string) {
    const hash = cryptoNode.createHash(hashMethod);
    return hash.update(data).digest('hex');
}

export function encryptData(data: string) {
    const key = hashData(keySecret).substring(0, 32);
    const encryptionIV = hashData(keyIv).substring(0, 16);
    const cipher = cryptoNode.createCipheriv(cipherMethod, key, encryptionIV);
    return Buffer.from(
        cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
    ).toString('base64');
}

export function decryptData(encryptedData: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }) {
    const key = hashData(keySecret).substring(0, 32);
    const encryptionIV = hashData(keyIv).substring(0, 16);
    const buff = Buffer.from(encryptedData, 'base64');
    const decipher = cryptoNode.createDecipheriv(cipherMethod, key, encryptionIV);
    return (
        decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
        decipher.final('utf8')
    )
}

export async function decryptRequest(cipherText: string) {
    const keyPem = await importPrivateKey(key);
    const array: any = atob(cipherText).split(',');
    const message = new Uint8Array(array as ArrayBuffer);
    const decrypted = await crypto.subtle.decrypt(
        {
            name: encryptionMethod
        },
        keyPem,
        message
    );
    return new TextDecoder("utf-8").decode(decrypted);
}

function importPrivateKey(pem: string) {
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    const binaryDerString = atob(pemContents);
    const binaryDer = str2ab(binaryDerString);
    return crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        {
            name: encryptionMethod,
            length: 2048,
            hash: "SHA-256"
        },
        true,
        ["decrypt"]
    );
}

function str2ab(str: string) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
