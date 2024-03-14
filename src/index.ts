import express from 'express';
import bodyParser from 'body-parser';
import dotEnv from 'dotenv';
import cors from 'cors';
import registerController from './controllers/registerHttp.controller';

dotEnv.config();
const PORT = 3000;

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
	origin: process.env.HOST_FRONT,
	credentials: true
}));

app.post('user/register', registerController);

app.listen(PORT, () => {
  // console.log(`server started at http://localhost:${PORT}`);
});
