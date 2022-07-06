const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const game = require('./game');
const app = express();
const clientPath = `${__dirname}/../client`;
app.use(express.static(clientPath));
let PORT = process.env.PORT || 3000;
const server = http.createServer(app)
const io = socketio(server);
let waitingPlayerPrivate = {};
let userNamePrivate = {};
let waitingPlayerPublic = null;
let userNamePublic = null;

io.on('connection', (sock) => {
    sock.on('private', (cod, name, length) => {
        if (waitingPlayerPrivate[cod] != null) {
            new game(waitingPlayerPrivate[cod], sock, userNamePrivate[cod], name, length);
            waitingPlayerPrivate[cod] = null;
            userNamePrivate[cod] = null;
        } else {
            waitingPlayerPrivate[cod] = sock;
            userNamePrivate[cod] = name;
            waitingPlayerPrivate[cod].emit('message', 'Waiting for an opponent');
        }
    });

    sock.on('public', (name, length) => {
        if (waitingPlayerPublic != null && waitingPlayerPublic !== sock) {
            new game(waitingPlayerPublic, sock, userNamePublic, name, length);
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

    sock.on("disconnect", () => {
        if (sock === waitingPlayerPublic) {
            waitingPlayerPublic = null;
        }
        if (Object.keys(waitingPlayerPrivate).length > 0) {
            for (const [key, value] of Object.entries(waitingPlayerPrivate)) {
                if (value === sock) {
                    waitingPlayerPrivate[key] = null
                }
            }
        }
    });
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

server.listen(PORT, () => {
    console.log('RPS started on port ' + PORT);
});