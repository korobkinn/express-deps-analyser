import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import { analyzeFramework } from './api/controllers/analyze-framework';

dotenv.config();
export const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/api/v1/analyze/framework', analyzeFramework);
export const server = app.listen(port, () => console.log(`Running on port ${port}`));