"use strict";

const app = require('express')();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 80;

app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function(req, res){
	console.log(req.query);
	console.log(req.body);
	res.end();
});

app.post('/', function(req, res){
	console.log(req.query);
	console.log(req.body);
	res.end();
});
app.listen(PORT, () => {
	console.log(`server start on port: ${PORT}`);
});