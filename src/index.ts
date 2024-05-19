import express from 'express';
import cors from 'cors';
import registerController from './controllers/registerHttp.controller';
import loginController from './controllers/loginHttp.controller';
import verificationController from './controllers/verificationHttp.controller';
import morgan from "morgan";
import debug from "debug";
import { decryptRequest } from './utilities/cipher';
import dotenv from 'dotenv';

dotenv.config();
const logger = debug("paw:index");
const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));
app.use(
	morgan('dev', {
		skip: (rq) => rq.url === 'health'
	})
);
app.use(cors({
	origin: process.env.HOST_FRONT,
	credentials: true
}));

const desalting = async (req: any, res: any, next: () => void) => {
	try {
		req.body = JSON.parse(await decryptRequest(req.body) as string);
		next();
	} catch (error: any) {
		logger("[Error] %o", error);
		return res.status(500).json({
			code: 3005,
			msg: `Error obtaining valid request`
		}).end();
	}
};

app.post('/V1/user/register', desalting, registerController);
app.post('/V1/user/login', desalting, loginController);
app.post('/V1/user/verification', desalting, verificationController);

app.use((req, res) => {
	return res.status(404).json({
		code: 3004,
		msg: `Route ${req.url} not found.`
	}).end();
});

export default app;
