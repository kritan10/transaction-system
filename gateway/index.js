import express from 'express';
import { StatusCodes } from 'http-status-codes';
import morgan from 'morgan';
import { authRouter } from './routes/auth.js';
import { userRouter } from './routes/user.js';
import dotenv from 'dotenv';

const app = express();

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

app.use(express.json());

app.use(morgan('combined'));

app.use('/', authRouter);
app.use('/user', userRouter);

app.get('/hello', (req, res) => {
	res.status(StatusCodes.OK).send({ message: 'hello world' });
});

app.listen(8080, () => {
	console.log('Gateway started at port 8080 ');
});
