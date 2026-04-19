const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.static('.'));

app.get('/api/aircraft', async (req, res) => {
    try {
        const username = process.env.OPENSKY_USER || 'nsmacit29';
        const password = process.env.OPENSKY_PASS || 'Kelkitli293429.';
        const response = await fetch('https://opensky-network.org/api/states/all?lamin=45&lomin=-15&lamax=63&lomax=15', {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.json({ states: [] });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running');
});