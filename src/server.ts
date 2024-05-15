import http from 'http';
import app from './index';
import debug from "debug";
import { getEnv } from './utilities/configEnv';
import serverlessExpress from 'aws-serverless-express';

const isInLambda = !!process.env.LAMBDA_TASK_ROOT;
const logger = debug("paw:server");

if (isInLambda) {
    const serverless = serverlessExpress.createServer(app);
    exports.handler = (event: any, context: any) => serverlessExpress.proxy(serverless, event, context);
}else if(process.env.NODE_ENV === 'local'){
    const server = http.createServer(app);
    const port: any = Number(getEnv('PORT')) || 3000;

    app.set('port', port);

    server.listen(port);
    server.on('error', (error: any) => {
        logger(error);
        throw error;
    });
    server.on('listening', () => {
        logger(`listen on ${port}`);
    });
    module.exports = server;
}else{
    logger('Error executing as lambda.');
}
