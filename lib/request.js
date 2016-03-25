"use strict"

const net = require('net');
const utils = require('./utils.js');

module.exports = exports = request;

function submitHandler(options, client) {
    if (!(/^get|post$/i.test(options.method))) {
        throw new Error('only supported get and post methods!');
    }

    let urlObj = utils.parseUrl(options.url),
        method = (options['method'] || 'GET').toUpperCase(),
        headers = options['headers'] || null,
        qs = utils.stringify(options['qs']) || '',
        data = utils.stringify(options['data']) || '';

    let msgArr = [];

    msgArr.push(`${method} ${qs ? (urlObj['pathname'] + '?' + qs) : urlObj['pathname']} HTTP/1.1`);
    msgArr.push(`Host: ${urlObj.port === '80' ? urlObj['hostname'] : (urlObj['hostname'] + ':' + urlObj['port'])}`);
    msgArr.push('Accept: */*');
    msgArr.push('User-Agent: net-client/1.0.0');
    if (method === 'POST' && data) {
        msgArr.push('Content-Type: application/x-www-form-urlencoded');
        msgArr.push(`Content-Length: ${data.length}`);
    }
    for (let key in headers) {
        if (headers.hasOwnProperty(key)) {
            msgArr.push(`${key}: ${headers[key]}`);
        }
    }

    msgArr.push('');

    if (method === 'POST' && data) {
        msgArr.push(data);
    } else {
        msgArr.push('');
    }

    client.end(msgArr.join('\r\n'));
}

function request(options) {
    return new Promise((resolve, reject) => {
        let urlObj = utils.parseUrl(options['url']);
        let client = net.connect({
            port: urlObj['port'],
            host: urlObj['hostname']
        }, () => submitHandler(options, client));

        let chunks = [],
            resTxt = '',
            headerReceiveCompleted = false,
            timer = null;

        client.on('data', data => {
            chunks.push(data);
            resTxt = Buffer.concat(chunks).toString('utf8');
            if (resTxt.indexOf('\r\n\r\n') !== -1 && !headerReceiveCompleted) {
                headerReceiveCompleted = true;
                timer = setTimeout(() => resolve(utils.parseResTxt(resTxt)), 2000);
            }
        });

        client.on('end', () => {
            clearTimeout(timer);
            resolve(utils.parseResTxt(resTxt));
        });

        client.on('close', () => resolve(utils.parseResTxt(resTxt)));

        client.on('error', reject);
    });
}
