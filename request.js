"use strict"
const net = require('net');
const parseUrl = require('url');
const querystring = require('querystring');

module.exports = exports = request;

function parseHeaders(headersArr){
    let headers = {};

    for(let i = 0; i < headersArr.length; ++i){
        let header = headersArr[i].split(':');
        headers[header[0]] = header[1].trim();
    }

    return headers;
}


function request(options) {

    return new Promise((resolve, reject) => {
        let method = (options.method || 'GET').toUpperCase(),
            url = options.url || 'http://localhost/',
            qs = options.qs || null,
            data = options.data || null,
            headers = options.headers || null;

        if (method !== 'GET' && method !== 'POST') {
            reject(new Error('only supported get and post methods!'));
        }

        let urlObj = parseUrl.parse(url);
        let queryStr = querystring.stringify(qs);
        let bodyStr = querystring.stringify(data);

        let client = net.connect({
            port: urlObj.port,
            host: urlObj.hostname
        });

        if (method === 'GET') {
            client.write(`${method} ${urlObj.pathname}${queryStr ? ('?' + queryStr) : ''} HTTP/1.1\r\n`);
            bodyStr && client.write(`content-length: ${bodyStr.length}\r\n`);
        } else {
            client.write(`${method} ${urlObj.pathname} HTTP/1.1\r\n`);
            client.write('content-type: application/x-www-form-urlencoded\r\n');
            queryStr && bodyStr ? 
            client.write(`content-length: ${queryStr.length + bodyStr.length + 1}\r\n`) :
            client.write(`content-length: ${queryStr.length + bodyStr.length}\r\n`);
        }
        for (let key in headers) {
            if (headers.hasOwnProperty(key)) {
                client.write(`${key.toLowerCase()}: ${headers[key]}\r\n`);
            }
        }
        client.write('\r\n');
        if(method === 'GET'){
        	bodyStr && client.write(bodyStr);
        } else {
        	bodyStr && client.write(queryStr ? `${queryStr}&${bodyStr}` : bodyStr);
        }
        client.end();

        let chunks = [];
        client.on('data', data => {
        	chunks.push(data);
        });
        client.on('end', () => {
        	let resTxt = Buffer.concat(chunks).toString('utf8');
        	let resTxtArr = resTxt.split('\r\n\r\n'),
        		resHeadersTxt = resTxtArr[0],
        		resBodyTxt = resTxtArr[1];

        	let resHeadersArr = resHeadersTxt.split('\r\n');
        	let status = resHeadersArr.splice(0, 1)[0];
        	let resHeaders = parseHeaders(resHeadersArr);
        	
        	resolve({
        		status: status,
        		headers: JSON.stringify(resHeaders),
        		body: resBodyTxt
        	});

        });
    });
}



// let options = {
//  port: 3000,
//  host: 'localhost'
// };

// let client = net.connect(options);

// let chunks = [];

// client.on('connect', () => {
//  client.write('GET /?aa=5&bb=6 HTTP/1.1\r\n');
//  client.write('User-Agent: tenterrain (4.4.5-1-ARCH; GNU/LINUX) Node/5.8.0\r\n');
//  client.write('Accept: */*\r\n');
//  client.write('Content-Length: 12\r\n');
//  client.write('\r\n');
//  client.write('hello world!');
//  client.end();
// });

// client.on('data', (data) => {
//  chunks.push(data);
// });

// client.on('end', () => {
//  let resStr = Buffer.concat(chunks).toString('utf8');
//  let resPacketMsg = resStr.split('\r\n').slice(1);
//  console.log(resPacketMsg);

// });