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
        enable: true,
        tlsOptions: {
            // key: fs.readFileSync('/path/to/client/cert/key'),
            // cert: fs.readFileSync('/path/to/client/cert'),
            // ca: [ fs.readFileSync('/path/to/ca/cert') ]  // client cert verify
        },
        remotes: [
            {
                lhost: '127.0.0.1',  // listening host
                lport: 8080,         // listening port
                remote: '127.0.0.1', // relay host
                port: 1443,          // communicate port
                dhost: '172.18.1.3', // target host
                dport: 80            // target port
            }
        ]
    }
}

module.exports  = options;