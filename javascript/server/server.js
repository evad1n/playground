import { createServer } from 'http';
import express from 'express';

const hostname = '127.0.0.1';
const port = 3001;

var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
	res.send('hello world');
});

app.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});