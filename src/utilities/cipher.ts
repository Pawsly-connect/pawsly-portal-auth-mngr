import crypto from 'crypto';
import dotEnv from 'dotenv';
dotEnv.config();

const keySecret = process.env.KEY_AES as string;
const keyIv = process.env.KEY_IV as string;
const encryptionMethod = 'aes-256-cbc';
const hashMethod = 'sha512';

export function hashData(data: string) {
    const hash = crypto.createHash(hashMethod);
    return hash.update(data).digest('hex');
}

export function encryptData(data: string) {
    const key = hashData(keySecret).substring(0, 32);
    const encryptionIV = hashData(keyIv).substring(0, 16);
    const cipher = crypto.createCipheriv(encryptionMethod, key, encryptionIV);
    return Buffer.from(
        cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
    ).toString('base64');
}

export function decryptData(encryptedData) {
    const key = hashData(keySecret).substring(0, 32);
    const encryptionIV = hashData(keyIv).substring(0, 16);
    const buff = Buffer.from(encryptedData, 'base64')
    const decipher = crypto.createDecipheriv(encryptionMethod, key, encryptionIV)
    return (
        decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
        decipher.final('utf8')
    )
}
