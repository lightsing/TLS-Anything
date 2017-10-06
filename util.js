'use strict';

const tls = require('tls');
const net = require('net');
const fs = require('fs');

const getPort = require('get-port');

const config = require('./config');

async function create(options) {
    const connect = net.createConnection;
    if (options.isTLS) {
        connect = tls.connect;
    }
    const server = tls.createServer(options.serverOptions, (from) => {
        var to = connect(options.remote);
        from.pipe(to);
        to.pipe(from);
    })

    const port = await getPort();
    
    server.listen(port);
}

module.exports = {
    create: create
}