const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/guestbook', (req, res) => {
    const messages = JSON.parse(fs.readFileSync('messages.json'));
    res.json(messages);
});

app.get('/newmessage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'newmessage.html'));
});

app.post('/newmessage', (req, res) => {
    const { username, country, message } = req.body;
    if (!username || !country || !message) {
        res.status(400).send('All fields are required.');
        return;
    }
    const newMessage = { username, country, message };
    const messages = JSON.parse(fs.readFileSync('messages.json'));
    messages.push(newMessage);
    fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));
    res.redirect('/guestbook');
});

app.post('/ajaxmessage', (req, res) => {
    const { username, country, message } = req.body;
    if (!username || !country || !message) {
        res.status(400).send('All fields are required.');
        return;
    }
    const newMessage = { username, country, message };
    const messages = JSON.parse(fs.readFileSync('messages.json'));
    messages.push(newMessage);
    fs.writeFileSync('messages.json', JSON.stringify(messages, null, 2));
    res.json(messages);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
