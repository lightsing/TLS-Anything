'use strict';

const tls = require('tls');
const net = require('net');
const fs = require('fs');
const readline = require('readline');

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

const server = config.server;
var servers = {};

function check(socket, request, addr) {
    if (request.destroy) {
        if(servers[addr]) {
            servers[addr].server.close();
        }
        delete servers[addr];
        socket.emit('destory', {closed: true});
        return false;
    }
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

function startServer() {
    const income = net.createServer(server.tlsOptions, (socket) => {
        const data = readline.createInterface(socket, socket);
        data.on('line', (line) => { try {
            var request = JSON.parse(line);
            const addr = socket.remoteAddress + ':' + socket.remotePort;
            if (check(socket, request, addr)) {
                if (request.create) {
                    if(!servers[addr]) {
                        create({
                            isTLS: request.isTLS || false,
                            serverOptions: server.tlsOptions,
                            remote: {
                                host: request.host,
                                port: request.port,
                            }
                        }).then((res) =>{
                            res.dhost = request.host;
                            res.dport = request.port;
                            servers[addr] = res;
                            socket.emit('accept', res);
                    });} else {
                        socket.emit('accept', servers[addr]);
                    }
                }
            }
        } catch (ignore) {
            console.log(ignore);
            socket.emit('err', {err: 'Server cannot understand.'});
        }});
    
        socket.on('err', (err) => {
            socket.write(JSON.stringify(err) + '\n');
            socket.destroy();
        });
    
        socket.on('destroy', (msg) => {
            socket.write(JSON.stringify(msg)+ '\n');
            socket.destroy();
        });
    
        socket.on('accept', (res) => {
            socket.write(JSON.stringify({port:res.port}) + '\n');
        });
    });
    
    income.listen(config.server.listen);
}

module.exports = {
    startServer: startServer
}