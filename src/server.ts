import http from 'http';
import app from './index';
import debug from "debug";
import { loadEnv } from './utilities/configEnv';
import awsServerlessExpress from 'aws-serverless-express';

const isInLambda = !!process.env.LAMBDA_TASK_ROOT;
const logger = debug("paw:server");

const startLocalServer = () => {
    const server = http.createServer(app);
    const port: any = Number(process.env.PORT) || 3000;

    server.listen(port);
    server.on('error', (error: any) => {
        logger(error);
        throw error;
    });
    server.on('listening', () => {
        logger(`Server is listening on port ${port}`);
    });

    return server;
}

const startLambdaServer = async () => {
    const server = awsServerlessExpress.createServer(app);
    return server;
}

const startServer = async () => {
    await loadEnv();
    try {
        if (isInLambda) {
            return await startLambdaServer();
        } else {
            return startLocalServer();
        }
    } catch (error) {
        logger("Error starting server: %o", error);
        throw error;
    }
}

startServer();

export const handler = async (event: any, context: any) => {
    try {
        const server = await startServer();
        context.callbackWaitsForEmptyEventLoop = true;
        return awsServerlessExpress.proxy(server, event, context);
    } catch (error) {
        logger("Error handling request: %o", error);
        throw error;
    }
};
