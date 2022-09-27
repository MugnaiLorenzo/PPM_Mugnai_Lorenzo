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

const AWS = require('aws-sdk');
const ID = 'AKIAYWXBX2UPAF7WKRG3';
const SECRET = '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';
const BUCKET_NAME = 'ppm-mugnai-lorenzo';
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});
const params = {
    Bucket: BUCKET_NAME,
    CreateBucketConfiguration: {
        LocationConstraint: "eu-central-1"
    }
};

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

    sock.on('uploadFile', (fReader, name, data, src, rect_x, rect_y, rect_w, rect_h, width, height, descr, title) => {
        const base64Data = new Buffer.from(fReader.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const params = {
            Bucket: BUCKET_NAME,
            Key: name,
            Body: base64Data,
            ContentEncoding: 'base64'
        };
        s3.upload(params, function (err, data1) {
            if (err) {
                throw err;
            } else {
                data.quadri.push({src, rect_x, rect_y, rect_w, rect_h, width, height, descr, title});
                let json = JSON.stringify(data);
                fs.writeFile('client/quadri.json', json, 'utf8', function (err) {
                    if (err) {
                        throw err;
                    } else {
                        sock.emit('changePage');
                    }
                });
            }
        });
    });

    sock.on('removeJson', (index) => {
        fs.readFile('client/quadri.json', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                let obj = JSON.parse(data);
                console.log(obj.quadri[index].src)
                const params = {
                    Bucket: BUCKET_NAME,
                    Key: obj.quadri[index].src
                }
                try {
                    s3.deleteObject(params, function (err, data1) {
                        if (err) console.log(err, err.stack);
                        else console.log('delete', data1);
                    });
                    console.log("file deleted Successfully")
                } catch (err) {
                    console.log("ERROR in file Deleting : " + JSON.stringify(err))
                }
                obj.quadri.splice(index, 1);
                let json = JSON.stringify(obj);
                fs.writeFile('client/quadri.json', json, 'utf8', function (err) {
                    if (err) throw err;
                });
            }
        });
    })

    sock.on('getImage', (name, i) => {
        s3.getObject({
            Bucket: BUCKET_NAME,
            Key: name // path to the object you're looking for
        }).promise().then((img) => {
            let buf = Buffer.from(img.Body);
            let base64 = buf.toString('base64');
            sock.emit('img' + i.toString(), 'data:image/jpeg;base64,' + base64);
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