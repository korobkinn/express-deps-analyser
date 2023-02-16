import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import { analyzeFrameworkRouter } from './api/routes/framework-router';

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use('/api/v1/analyze/framework', analyzeFrameworkRouter);
app.listen(port, () => console.log(`Running on port ${port}`));