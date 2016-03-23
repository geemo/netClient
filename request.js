"use strict"
const net = require('net');

function parseUrl(url) {
    if (!(/^http:\/\/.+/i.test(url))) {
        throw new Error('url format error, must with "http://" begin!');
    }

    let urlObj = {};

    url = url.replace(/^http:\/\//i, '');

    let parseArr = url.match(/([\w\.]+):?(\d{2,})?(\/[\w\/\.\u4e00-\u9fa5]*)?/);
    urlObj.hostname = parseArr[1];
    urlObj.port = parseArr[2] || '80'
    urlObj.pathname = parseArr[3] || '/';

    return urlObj;
}

function stringify(jsonObj) {
    if (!jsonObj || typeof jsonObj !== 'object' || jsonObj instanceof Array) {
        throw new Error('stringify argument must be a json object!');
    }

    let jsonArr = [];

    for (let key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
            jsonArr.push(key + '=' + jsonObj[key]);
        }
    }

    return jsonArr.join('&');
}

function submitHandler(options, client) {
    if (!(/^get|post$/i.test(options.method))) {
        throw new Error('only supported get and post methods!');
    }

    let urlObj = parseUrl(options.url),
        method = (options['method'] || 'GET').toUpperCase(),
        headers = options['headers'] || null,
        qs = stringify(options['qs']) || '',
        data = stringify(options['data']) || '';

    let msgArr = [];

    msgArr.push(`${method} ${method === 'GET' ? (urlObj['pathname'] + '?' + qs) : urlObj['pathname']} HTTP/1.1`);
    msgArr.push(`Host: ${urlObj.port === '80' ? urlObj['hostname'] : (urlObj['hostname'] + ':' + urlObj['port'])}`);
    msgArr.push('Accept: */*');
    msgArr.push('Connection: keep-alive');
    msgArr.push('Content-Type: application/x-www-form-urlencoded');
    msgArr.push(`Content-Length: ${qs && data ? (qs['length'] + data['length'] + 1) : (qs['length'] + data['length'])}`);
    for (let key in headers) {
        if (headers.hasOwnProperty(key)) {
            msgArr.push(`${key}: ${headers[key]}`);
        }
    }

    msgArr.push('');

    if (method === 'GET') {
        data && msgArr.push(data);
    } else {
        (qs || data) && msgArr.push(`${qs && data ? (qs + '&' + data) : (qs + data)}`);
    }

    client.write(msgArr.join('\r\n'));
}

// console.log(stringify({a: 5, b: 5}));
// console.log(parseUrl('http://localhost:3000/asdf'));

function request(options) {
    return new Promise((resolve, reject) => {
        let urlObj = parseUrl(options['url']);
        let client = net.connect({
            port: urlObj['port'],
            host: urlObj['hostname']
        }, () => {
            submitHandler(options, client);

            let chunks = [],
                headerReceiveCompleted = false,
                timer = null;

            client.on('data', data => {
                chunks.push(data);
                let str = Buffer.concat(chunks).toString('utf8');
                if (str.indexOf('\r\n\r\n') !== -1 && !headerReceiveCompleted) {
                    headerReceiveCompleted = true;
                    timer = setTimeout(() => {
                        resolve(str);

                    }, 2000);
                }
                client.end();
            });

            client.on('end', () => {
                clearTimeout(timer);
                resolve(Buffer.concat(chunks).toString('utf8'));
            });

            client.on('close', () => {
                resolve(Buffer.concat(chunks).toString('utf8'));
            });

            client.on('error', reject);
        });
    });
}

request({
    method: 'post',
    url: 'http://localhost:3000',
    qs: {a: 5, b: 6},
    data: {c: 7, d: 8}
}).then(data => {
    console.log(data);
}).catch(err => console.log(err.stack))


// "use strict"
// const net = require('net');
// const parseUrl = require('url');
// const querystring = require('querystring');

// module.exports = exports = request;

// function parseHeaders(headersmsgArr) {
//     let headers = {};

//     for (let i = 0; i < headersArr.length; ++i) {
//         let header = headersArr[i].split(':');
//         headers[header[0]] = header[1].trim();
//     }

//     return headers;
// }


// function request(options) {

//     return new Promise((resolve, reject) => {
//         let method = (options.method || 'GET').toUpperCase(),
//             url = options.url || 'http://localhost/',
//             qs = options.qs || null,
//             data = options.data || null,
//             headers = options.headers || null;

//         if (method !== 'GET' && method !== 'POST') {
//             reject(new Error('only supported get and post methods!'));
//         }

//         let urlObj = parseUrl.parse(url);
//         let queryStr = querystring.stringify(qs);
//         let bodyStr = querystring.stringify(data);

//         let client = net.connect({
//             port: urlObj.port || 80,
//             host: urlObj.hostname
//         }, () => {
//             if (method === 'GET') {
//                 client.write(`${method} ${urlObj.pathname}${queryStr ? ('?' + queryStr) : ''} HTTP/1.1\r\n`);
//                 bodyStr && client.write(`content-length: ${bodyStr.length}\r\n`);
//             } else {
//                 client.write(`${method} ${urlObj.pathname} HTTP/1.1\r\n`);
//                 client.write('content-type: application/x-www-form-urlencoded\r\n');
//                 queryStr && bodyStr ?
//                     client.write(`content-length: ${queryStr.length + bodyStr.length + 1}\r\n`) :
//                     client.write(`content-length: ${queryStr.length + bodyStr.length}\r\n`);
//             }

//             for (let key in headers) {
//                 if (headers.hasOwnProperty(key)) {
//                     client.write(`${key.toLowerCase()}: ${headers[key]}\r\n`);
//                 }
//             }
//             client.write('\r\n');
//             if (method === 'GET') {
//                 bodyStr && client.write(bodyStr);
//             } else {
//                 bodyStr && client.write(queryStr ? `${queryStr}&${bodyStr}` : bodyStr);
//             }
//         });

//         let chunks = [];
//         client.on('data', data => {
//             chunks.push(data);

//             console.log('data');
//             client.end();
//         });
//         client.on('end', () => {

//             // let resTxt = Buffer.concat(chunks).toString('utf8');
//             // let resTxtArr = resTxt.split('\r\n\r\n'),
//             //  resHeadersTxt = resTxtArr[0],
//             //  resBodyTxt = resTxtArr[1];

//             // let resHeadersArr = resHeadersTxt.split('\r\n');
//             // let status = resHeadersArr.splice(0, 1)[0];
//             // let resHeaders = parseHeaders(resHeadersArr);

//             // resolve({
//             //  status: status,
//             //  headers: JSON.stringify(resHeaders),
//             //  body: resBodyTxt
//             // });

//             console.log('end');

//         });
//         client.on('error', reject);
//         client.on('close', () => {

//         });

//     });
// }
