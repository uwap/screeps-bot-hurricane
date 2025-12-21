
require('dotenv').config();
const fs = require('fs');
var https = require('https');

var data = {
    branch: 'hurricane',
    modules: {
        main: fs.readFileSync('./dist/screeps.js', 'utf-8').toString(),
    }
};

var req = https.request({
    hostname: 'screeps.com',
    port: 443,
    path: '/api/user/code',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Token': process.env.SCREEPS_API_TOKEN
    }
});

req.write(JSON.stringify(data));
req.end();
