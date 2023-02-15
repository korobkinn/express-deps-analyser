import express from 'express';
import bodyParser from 'body-parser'; 
import { analyzeFrameworkRouter } from './routes/';

const api = express();
api.use(bodyParser.json());
api.use('/analyze/framework', analyzeFrameworkRouter);


api.get('/', (req, res) => {
    res.send({
        message: 'Hello from the API',
    });
});


export default api;