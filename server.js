const express = require('express');

const app = express();

app.get('/', (req, res) => {
	res.send('hellooooo')
})

app.listen(3000);