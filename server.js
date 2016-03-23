"use strict"

const http = require('http');
const util = require('util');
const url = require('url');
const fs = require('fs');
const server = http.createServer();
const PORT = process.env.PORT || 80;



server.on('request', (req, res) => {

    res.writeHead(200, 'Ok');
    let stream = fs.createReadStream('index.html')
    stream.pipe(res);

    req.reqChunks = [];
    req.on('data', (data) => {
        req.reqChunks.push(data);
    });

    req.on('end', () => {
        console.log(`request url: ${req.url}`);
        console.log(req.headers);

        let reqStr = Buffer.concat(req.reqChunks).toString('utf8');
        console.log(reqStr);
    });
});

server.listen(PORT, () => {
    console.log(`server start on port: ${PORT}`);
});