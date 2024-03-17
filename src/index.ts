import express from 'express';
import bodyParser from 'body-parser';
import dotEnv from 'dotenv';
import cors from 'cors';
import registerController from './controllers/registerHttp.controller';
import debug from "debug";

dotEnv.config();
const PORT = 3000;
const logger = debug("paw:index");

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
	origin: process.env.HOST_FRONT,
	credentials: true
}));

app.post('/user/register', registerController);

app.listen(PORT, () => {
   logger(`server started at http://localhost:${PORT}`);
});
