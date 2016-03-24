"use strict"

const net = require('net');
const utils = require('../lib/utils');
const PORT = process.env.PORT || 80;

const server = net.createServer({
    allowHalfOpen: true
}, connect => {
    connect.write('HTTP/1.1 200 0k\r\n');
    connect.write('Transfer-Encoding: chunked\r\n');
    connect.write('\r\n');
    connect.write('6\r\n');
    connect.write('hello \r\n');
    connect.write('6\r\n');
    setTimeout(() => {
        connect.write('world!\r\n');
        connect.write('0\r\n');
        connect.end();
    }, 1000);

    let chunks = [];
    
    connect.on('data', (data) => {
        chunks.push(data);
    });

    connect.on('end', () => {
        console.log(utils.parseResTxt(Buffer.concat(chunks).toString('utf8')));
    });
});

server.listen(PORT, () => console.log(`server start on port: ${PORT}`));

// const http = require('http');
// const fs = require('fs');
// const path = require('path');
// const PORT = process.env.PORT || 80;

// const server = http.createServer((req, res) => {
//     // res.writeHead(200, 'Ok');
//     // let stream = fs.createReadStream('static/index.html');
//     // stream.pipe(res);

//     res.writeHead(200, 'Ok', {'Transfer-Encoding': 'chunked'});
//     res.write('\r\n');
//     res.write('6\r\n');
//     res.write('hello \r\n');
//     res.write('6\r\n');
//     setTimeout(() => {
//         res.write('world!\r\n');
//         res.write('0\r\n');
//         res.end();
//     }, 500);

//     let chunks = [];
//     req.on('data', data => {
//         chunks.push(data);
//     });

//     req.on('end', () => {
//         console.log(req.url);
//         console.log(req.headers);
//         console.log(Buffer.concat(chunks).toString('utf8'));
//     });
// });

// server.listen(PORT, () => console.log(`server start on port: ${PORT}`));