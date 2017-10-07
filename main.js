'use strict';

const tls = require('tls');
const net = require('net');
const readline = require('readline');

const util = require('./util');
const config = require('./config');

if (config.server.enable) {
    util.startServer();
}

if (config.client.enable) {
    util.startClient();
}
