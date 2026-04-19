const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.static('.'));

app.get('/api/aircraft', async (req, res) => {
    try {
        const apiKey = process.env.AVIATION_KEY || '417a465a608323db30604c135b20a570';
        const response = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_status=active&limit=100`);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.log('Error:', err);
        res.json({ data: [] });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running');
});