"use strict"

const http = require('http');
const util = require('util');
const url = require('url');
const server = http.createServer();
const PORT = process.env.PORT || 80;

let chunks = [];

server.on('request', (req, res) => {

    req.on('data', (data) => {
    	chunks.push(data);
    });

    req.on('end', () => {
        console.log(`request url: ${req.url}`);
        console.log(util.inspect(req.headers, { showHidden: true, depth: null, colors: true }));
        console.log(req.rawHeaders);

        let reqStr = Buffer.concat(chunks).toString('utf8');
        console.log(reqStr);
        res.end();
    });
});

server.listen(PORT, () => {
    console.log(`server start on port: ${PORT}`);
});