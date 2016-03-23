"use strict"

var request = require('./request.js');

request({
	method: 'get',
	url: 'http://localhost/aaa',
	qs: {a: 5, b: 6},
	data: {c: 7, d: 8},
	headers: {
		'user-agent': 'tenterrain (4.4.5-1-ARCH; GNU/LINUX) Node/5.8.0',
		'date': new Date().toUTCString()
	}
}).then(ret => {
    console.log(`status: ${ret.status}`);
    console.dir(`headers: ${ret.headers}`);
    console.log(`body: ${ret.body}`);
}).catch(err => console.log(err));