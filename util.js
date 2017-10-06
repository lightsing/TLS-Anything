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
    return {
        'server': server,
        'port': port
    };
}

function check(socket, request) {
    request.host = request.host || config.server.config.defaultHost;
    if (!request.port) {
        socket.emit('err', {err: 'Port not set.'});
    }
    if (config.server.config.whitelist) {
        const addressAllow = config.server.config.addressList;
        const portAllow = config.server.config.portList;
        if (addressAllow.includes(request.host)
            && portAllow.includes(request.port)) {
            return true;
        } else {
            socket.emit('err', {err: 'Access Denied.'});
            return false;
        }
    } else {
        return true;
    }
}

module.exports = {
    create: create,
    check: check
}