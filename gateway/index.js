import express from 'express';
import { StatusCodes } from 'http-status-codes';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { authRouter, balanceRouter, userRouter } from './routes/index.js';

const app = express();

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

app.use(express.json());

app.use(morgan('combined'));

app.use('/', authRouter);
app.use('/user', userRouter);
app.use('/balance', balanceRouter);

app.get('/hello', (req, res) => {
	res.status(StatusCodes.OK).send({ message: 'hello world' });
});

app.listen(8080, () => {
	console.log('Gateway started at port 8080 ');
});
