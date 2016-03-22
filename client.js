"use strict"

const net = require('net');

let options = {
	port: 80,
	host: 'localhost'
};

let client = net.connect(options);

let chunks = [];

client.on('connect', () => {
	client.write('GET /?aa=5&bb=6 HTTP/1.1\r\n');
	client.write('User-Agent: tenterrain (4.4.5-1-ARCH; GNU/LINUX) Node/5.8.0\r\n');
	client.write('Accept: */*\r\n');
	client.write('Content-Length: 12\r\n');
	client.write('\r\n');
	client.write('hello world!');
	client.end();
});

client.on('data', (data) => {
	chunks.push(data);
});

client.on('end', () => {
	let resStr = Buffer.concat(chunks).toString('utf8');
	let resPacketMsg = resStr.split('\r\n').slice(1);
	console.log(resPacketMsg);

});