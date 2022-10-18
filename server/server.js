"use strict";
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const game = require('./game');
const app = express();
const clientPath = `${__dirname}/../client`;
const fs = require('fs');
app.use(express.static(clientPath));
let PORT = process.env.PORT || 3000;
const server = http.createServer(app)
const io = socketio(server);
let waitingPlayerPrivate = {};
let userNamePrivate = {};
let waitingPlayerPublic = null;
let userNamePublic = null;
let waiting = false;
let g;

io.on('connection', (sock) => {
    sock.on('private', (cod, name, length) => {
        if (waitingPlayerPrivate[cod] != null) {
            g = new game(waitingPlayerPrivate[cod], sock, userNamePrivate[cod], name, length);
            waitingPlayerPrivate[cod] = null;
            userNamePrivate[cod] = null;
        } else {
            waitingPlayerPrivate[cod] = sock;
            userNamePrivate[cod] = name;
            waitingPlayerPrivate[cod].emit('wait', 'Aspettando un avversario');
        }
    });

    sock.on('public', (name, length) => {
        if (waitingPlayerPublic != null && waitingPlayerPublic !== sock) {
            g = new game(waitingPlayerPublic, sock, userNamePublic, name, length);
            waitingPlayerPublic = null;
            userNamePublic = null;
        } else {
            waitingPlayerPublic = sock;
            userNamePublic = name;
            waitingPlayerPublic.emit('wait', 'Aspettando un avversario');
        }
    });

    sock.on('waitingFinish', () => {
        if (waiting === false) {
            waiting = true;
        } else {
            waiting = false;
            g.sendready();
        }
    })

    sock.on('readJson', () => {
        let rawdata = fs.readFileSync('client/quadri.json');
        let quadri = JSON.parse(rawdata);
        sock.emit('getData', quadri);
    });

    sock.on('uploadJson', (src, data, rect_x, rect_y, rect_w, rect_h, width, height, descr, title) => {
        data.quadri.push({src, rect_x, rect_y, rect_w, rect_h, width, height, descr, title});
        let json = JSON.stringify(data);
        fs.writeFile('client/quadri.json', json, 'utf8', function (err) {
            if (err) {
                throw err;
            } else {
                sock.emit('changePage');
            }
        });
    });

    sock.on('removeJson', (index) => {
        fs.readFile('client/quadri.json', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                let obj = JSON.parse(data);
                obj.quadri.splice(index, 1);
                let json = JSON.stringify(obj);
                fs.writeFile('client/quadri.json', json, 'utf8', function (err) {
                    if (err) throw err;
                });
            }
        });
    })

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