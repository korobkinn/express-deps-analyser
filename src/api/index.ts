import express from 'express';
import { analyzeFrameworkRouter } from './routes/';

const api = express();

api.get('/', (req, res) => {
    res.send({
        message: 'Hello from the API',
    });
});
api.use('/analyze/framework', analyzeFrameworkRouter);

export default api;