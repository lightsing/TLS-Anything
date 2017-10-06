const tls = require('tls');
const net = require('net');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/Users/lightsing/.acme.sh/playground.sustc.us/playground.sustc.us.key'),
  cert: fs.readFileSync('/Users/lightsing/.acme.sh/playground.sustc.us/fullchain.cer'),
};

var server = tls.createServer(options, (from) => {
    var to = net.createConnection({
        host: '172.18.1.3',
        port: 80
    });
    from.pipe(to);
    to.pipe(from);
})

server.listen(8080, () => {
    console.log('server bound');
});