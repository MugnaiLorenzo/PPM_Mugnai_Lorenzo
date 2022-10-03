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
//FIREBASE
const firebaseAdmin = require("firebase-admin");
const {v4: uuidv4} = require('uuid');
let serviceAccount = require('./key.json');
const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
})
const storageRef = admin.storage().bucket(`gs://ppm-lorenzo-mugnai.appspot.com`);


io.on('connection', (sock) => {
    sock.on('private', (cod, name, length) => {
        if (waitingPlayerPrivate[cod] != null) {
            new game(waitingPlayerPrivate[cod], sock, userNamePrivate[cod], name, length);
            waitingPlayerPrivate[cod] = null;
            userNamePrivate[cod] = null;
        } else {
            waitingPlayerPrivate[cod] = sock;
            userNamePrivate[cod] = name;
            waitingPlayerPrivate[cod].emit('message', 'Aspettando un avversario');
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
            waitingPlayerPublic.emit('message', 'Aspettando un avversario');
        }
    });

    sock.on('message', (text) => {
        io.emit('message', text);
    });

    sock.on('readJson', () => {
        let rawdata = fs.readFileSync('client/quadri.json');
        let quadri = JSON.parse(rawdata);
        sock.emit('getData', quadri);
    });

    sock.on('uploadFile', (url, name, data, rect_x, rect_y, rect_w, rect_h, width, height, descr, title) => {
        console.log(url)
        let src
        // const base64Data = new Buffer.from(fReader.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const storage = storageRef.upload(url, {
            destination: name
        }).then(() => {
            const file = storageRef.file(name);
            file.getSignedUrl({
                action: 'read',
                expires: '03-25-2023'
            }).then(signedUrls => {
                src = signedUrls[0];
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