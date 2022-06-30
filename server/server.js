const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const game = require('./game');

const app = express();
const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));
let PORT = process.env.PORT || 3000;


const server = http.createServer(app)

const io = socketio(server);

let waitingPlayerPrivate = {};
let userNamePrivate = {};
let waitingPlayerPublic = null;
let userNamePublic = null;

io.on('connection', (sock) => {
    sock.on('private',(cod, name) => {
        if (waitingPlayerPrivate[cod] != null){
            new game(waitingPlayerPrivate[cod], sock, userNamePrivate[cod], name);
            waitingPlayerPrivate[cod] = null;
            userNamePrivate[cod] = null;
        }else {
            waitingPlayerPrivate[cod] = sock;
            userNamePrivate[cod] = name;
            waitingPlayerPrivate[cod].emit('message', 'Waiting for an opponent');
        }
    });

    sock.on('public', (name) => {
        if (waitingPlayerPublic != null) {
            new game(waitingPlayerPublic, sock, userNamePublic, name);
            waitingPlayerPublic = null;
            userNamePublic = null;
        } else {
            waitingPlayerPublic = sock;
            userNamePublic = name;
            waitingPlayerPublic.emit('message', 'Waiting for an opponent');
        }
    });

    sock.on('message', (text) => {
        io.emit('message', text);
    });
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

server.listen(PORT, () => {
    console.log('RPS started on port '+PORT);
});