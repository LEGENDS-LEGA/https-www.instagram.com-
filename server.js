const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.json());

app.post('/save-login', (req, res) => {
    const { username, password } = req.body;
    console.log('Received data:', { username, password });

    fs.readFile(path.join(__dirname, 'data.json'), 'utf-8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading data file:', err);
            return res.status(500).send('Error reading data file');
        }

        const jsonData = data ? JSON.parse(data) : [];
        jsonData.push({ username, password });
        console.log('Updated data:', jsonData);

        fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing to data file:', err);
                return res.status(500).send('Error writing to data file');
            }
            res.status(200).send('Data saved successfully');
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
