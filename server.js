const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.static('.'));

app.get('/api/aircraft', async (req, res) => {
    try {
        const response = await fetch('https://opensky-network.org/api/states/all?lamin=45&lomin=-15&lamax=63&lomax=15')
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.json({ states: [] });
    }
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});