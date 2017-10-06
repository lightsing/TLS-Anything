'use strict';

const fs = require('fs');

const options = {
    server: {
        isServer: true,
        address: '127.0.0.1',
        tlsOptions: {
            key: fs.readFileSync('/path/to/server/cert/key'),
            cert: fs.readFileSync('/path/to/server/cert'),
            requestCert: false,
            // ca: [ fs.readFileSync('/path/to/ca/cert') ]  // client cert verify
        },
        port: {
            whitelist: true,
            portList: [80, 443, 573, 1080]
        }
    },
    client: {
        isClient: false
    }
}

module.exports  = options;