"use strict"

const request = require('../lib/request.js');
const PORT = process.env.PORT || 80;

request({
    method: 'post',
    url: `http://localhost:${PORT}`,
    headers: {'Date': new Date().toUTCString()},
    qs: { a: 5, b: 6 },
    data: { c: 7, d: 8 }
}).then(data => {
	console.log(data);
}).catch(err => console.log(err.stack));

// request({
//     method: 'get',
//     url: 'http://www.baidu.com/',
//     headers: {
//     	'Accept': '*/*',
//     	'Accept-Encoding': 'identity'
//     }
// }).then(data => {
// 	console.log(data);
// }).catch(err => console.log(err.stack));
