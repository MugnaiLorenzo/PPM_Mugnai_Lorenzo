let user
let cod
let sock
let img1 = new Image()
let out1
let old_out
let canvasCtx1
const src = ["f1.jpeg", "f2.jpg", "f3.jpg", "f4.jpg", "f5.jpeg", "f6.jpg", "f7.jpg"];
let i_turno = 0;
let turno_label = document.getElementById("turno");

let faceDetection
const writeEvent = (text) => {
    const parent = document.querySelector('#events');
    const el = document.createElement('li');
    el.innerHTML = text;
    parent.appendChild(el);
};

const addWinListeners = () => {
    sock.on('win', (message) => {
        alert(message);
        window.location.href = '../index.html'
    });
}

// onFrame1("./image/opere/" + src[i_turno]);
const addStartListeners = () => {
    sock.on('start', () => {
        if (i_turno < 7) {
            onFrame1("./image/opere/" + src[i_turno]);
        }
    });
}

const addUserListeners = () => {
    sock.on('user', (name) => {
        document.getElementById("name2").innerHTML = name;
    });
}

const addPuntListeners = () => {
    sock.on('punt', (p1, p2) => {
        document.getElementById("punt1").innerHTML = p1;
        document.getElementById("punt2").innerHTML = p2;
        addPuntListeners();
    });
}

function start() {
    user = sessionStorage.getItem("user");
    cod = sessionStorage.getItem("cod");
    document.getElementById("name1").innerHTML = user;
    if (cod === "") {
        title_cod = document.getElementById("title_cod").innerHTML = "Partita Publica "
        conPublic()
    } else {
        document.getElementById("title_cod").innerHTML = "Codice: " + cod
        conPrivate()
    }
}

function conPublic() {
    sock = io();
    sock.emit('public', user);
    sock.on('message', writeEvent);
    addUserListeners();
    addStartListeners();
    addPuntListeners();
    addWinListeners();
}

function conPrivate() {
    sock = io();
    sock.emit('private', cod, user);
    sock.on('message', writeEvent);
    addUserListeners();
    addStartListeners();
    addPuntListeners();
    addWinListeners();
}

function onResultsFace(results) {
    document.body.classList.add('loaded');
    canvasCtx1.save();
    canvasCtx1.clearRect(0, 0, out1.width, out1.height);
    canvasCtx1.drawImage(results.image, 0, 0, out1.width, out1.height);
    for (let i = 0; i < results.detections.length; i++) {
        if (results.detections.length > 0) {
            let cX = results.detections[i].boundingBox.xCenter * out1.width;
            let cY = results.detections[i].boundingBox.yCenter * out1.height;
            let w = results.detections[i].boundingBox.width * out1.width;
            let h = results.detections[i].boundingBox.height * out1.height;
            let x = cX - w / 2;
            let y = cY - h / 2;
            canvasCtx1.strokeRect(x, y, w, h);
            out1.addEventListener("click", function (e) {
                getCursorPosition(out1, e, x, y, w, h)
            })
        }
    }
    canvasCtx1.restore();
}

function getCursorPosition(canvas, event, x, y, w, h) {
    const rect = canvas.getBoundingClientRect();
    const x_c = event.clientX - rect.left;
    const y_c = event.clientY - rect.top;
    if (x_c > x && x_c < (w + x) && y_c > y && y_c < (h + y)) {
        sock.emit('point')
    }
}

async function onFrame1(src) {
    img1 = new Image();
    faceDetection = new FaceDetection({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.0/${file}`;
        }
    });
    faceDetection.setOptions({
        modelSelection: 0,
        minDetectionConfidence: 0.5
    });
    faceDetection.onResults(onResultsFace);
    if (old_out !== undefined) {
        document.getElementById("output").removeChild(old_out)
    }
    out1 = document.createElement("canvas");
    canvasCtx1 = out1.getContext('2d');
    old_out = out1;
    document.getElementById("output").appendChild(out1);
    writeTurn();
    img1.src = src;
    try {
        await faceDetection.send({image: img1});
        i_turno++;
    } catch (error) {
        onFrame1(src);
    }
}

function writeTurn() {
    turno_label.innerHTML = "Turno: " + i_turno;
}