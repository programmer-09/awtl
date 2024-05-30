const http = require('http');
const os = require('os');
const path = require('path');
const EventEmitter = require('events');

const hostname = '127.0.0.1';
const port = 3000;

// Create an event emitter
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

myEmitter.on('event', () => {
    console.log('An event occurred!');
});

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    // Emit the event
    myEmitter.emit('event');

    const osInfo = {
        platform: os.platform(),
        cpus: os.cpus(),
        freeMemory: os.freemem(),
        totalMemory: os.totalmem(),
        uptime: os.uptime()
    };

    const pathInfo = {
        dirname: __dirname,
        filename: __filename,
        basename: path.basename(__filename),
        extname: path.extname(__filename),
        joinExample: path.join(__dirname, 'test', 'example.txt')
    };

    res.end(JSON.stringify({ osInfo, pathInfo }, null, 2));
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
