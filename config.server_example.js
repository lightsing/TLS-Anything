'use strict';

const fs = require('fs');

const options = {
    server: {
        enable: true,
        listen: {
            address: '127.0.0.1',
            port: 1443
        },
        tlsOptions: {
            key: fs.readFileSync('/path/to/server/cert/key'),
            cert: fs.readFileSync('/path/to/server/cert'),
            requestCert: false,
            // ca: [ fs.readFileSync('/path/to/ca/cert') ]  // client cert verify
        },
        config: {
            whitelist: true,
            defaultHost: '172.18.1.3',
            addressList: ['127.0.0.1', '172.18.1.3'],
            portList: [80, 443, 573, 1080]
        }
    },
    client: {
        enable: false
    }
}

module.exports  = options;