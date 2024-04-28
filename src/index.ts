import express from 'express';
import dotEnv from 'dotenv';
import cors from 'cors';
import registerController from './controllers/registerHttp.controller';
import loginController from './controllers/loginHttp.controller';
import verificationController from './controllers/verificationHttp.controller';
import logger from "morgan";

dotEnv.config();

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	logger('dev', {
		skip: (rq) => rq.url === 'health'
	})
);
app.use(cors({
	origin: process.env.HOST_FRONT,
	credentials: true
}));

app.post('/V1/user/register', registerController);
app.post('/V1/user/login', loginController);
app.post('/V1/user/verification', verificationController);

app.use((req, res) => {
	return res.status(404).json({
		code: 3003,
		msg: `Route ${req.url} not found.`
	}).end();
})

export default app;
