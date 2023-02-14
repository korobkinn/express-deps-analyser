import dotenv from 'dotenv';
import express from 'express';

import api from './api';

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use('/api/v1', api);
app.get('/', (request, response) => {
    response.send('Hello world!');
});

app.listen(port, () => console.log(`Running on port ${port}`));