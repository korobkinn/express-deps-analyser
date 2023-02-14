import express from 'express'

import api from './api';

const app = express();
const port = 5072;

app.use('/api/v1', api);
app.get('/', (request, response) => {
    response.send('Hello world!');
});

app.listen(port, () => console.log(`Running on port ${port}`));