"use strict"

exports.parseUrl = parseUrl;
exports.stringify = stringify;
exports.parseResTxt = parseResTxt;

function parseUrl(url) {
    if (!(/^http:\/\/.+/i.test(url))) {
        throw new Error('url format error, must start with "http://" !');
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

function parseResTxt(resTxt){
    if(!resTxt || typeof resTxt !== 'string'){
        throw new Error('parseResTxt argument must be a string and not empty!');
    }

    let resObj = {
        status: {},
        headers: {},
        body: ''
    };

    let resTxtArr = resTxt.trim().split('\r\n\r\n'),
        headerArr = resTxtArr[0].split('\r\n'),
        bodyTxt = resTxtArr[1],
        statusArr = headerArr.splice(0, 1)[0].split(' ');

    resObj['status']['code'] = statusArr[1];
    resObj['status']['message'] = statusArr[2];

    for(let i = 0, len = headerArr.length; i < len; ++i){
        let header = headerArr[i].split(':');
        resObj['headers'][header[0]] = header[1].trim();
    }

    resObj['body'] = bodyTxt;

    return resObj;
}
