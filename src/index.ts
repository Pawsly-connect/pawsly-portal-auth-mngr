import express from 'express';
import bodyParser from 'body-parser';
import dotEnv from 'dotenv';
import cors from 'cors';
import registerController from './controllers/registerHttp.controller';
import loginController from './controllers/loginHttp.controller';
import debug from "debug";

dotEnv.config();
const logger = debug("paw:index");

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
	origin: process.env.HOST_FRONT,
	credentials: true
}));

app.post('/user/register', registerController);
app.post('/user/login', loginController);

app.use((req, res) => {
	return res.status(404).json({
		code: 3003,
		msg: `Route ${req.url} not found.`
	}).end();
})

export default app;
