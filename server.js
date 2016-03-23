"use strict"

const http = require('http');
const util = require('util');
const url = require('url');
const server = http.createServer();
const PORT = process.env.PORT || 80;



server.on('request', (req, res) => {

	req.reqChunks = [];
    req.on('data', (data) => {
    	req.reqChunks.push(data);
    });

    req.on('end', () => {
        console.log(`request url: ${req.url}`);
        console.log(util.inspect(req.headers, { showHidden: true, depth: null, colors: true }));
        console.log(req.rawHeaders);

        let reqStr = Buffer.concat(req.reqChunks).toString('utf8');
        console.log(reqStr);
        res.writeHead(200, {'content-length': 12});
        res.end('hello world!');
    });
});

server.listen(PORT, () => {
    console.log(`server start on port: ${PORT}`);
});