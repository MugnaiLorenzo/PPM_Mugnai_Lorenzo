// import {Obj_class} from "./Obj_class.js";
// import {Face_class} from "./Face_class.js";
import {Point} from "./point.js";
import {Hands_Class} from "./hands_Class.js";

export function start() {
    user = sessionStorage.getItem("user");
    cod = sessionStorage.getItem("cod");
    document.getElementById("name1").innerHTML = user;
    if (cod === "") {
        document.getElementById("title_cod").innerHTML = "Partita Publica ";
        conPublic();
    } else {
        document.getElementById("title_cod").innerHTML = "Codice: " + cod;
        conPrivate();
    }
}

let user;
let cod;
let sock = io();
let point = new Point()
let turno_label = document.getElementById("turno");
let element;
let hands = new Hands_Class(sock);
writeTurn();

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

const addFinishTurnListeners = () => {
    sock.on('finishTurn', () => {
        document.getElementById("output").removeChild(element);
        point.setPoint();
        writeTurn();
        excute();
    })
}

function excute() {
    element = document.createElement("canvas");
    element.classList.add("can-img");
    element.id = "can_out";
    console.log(element)
    document.getElementById("output").appendChild(element);
    if (point.turno < point.length) {
        let canvasElement = document.getElementById("can_out");
        let canvasCtx = canvasElement.getContext('2d');
        let img = new Image();
        img.src = "./image/opere/" + point.src[point.turno].src;
        canvasElement.width = parseInt(getComputedStyle(canvasElement).width);
        canvasElement.height = (parseInt(getComputedStyle(canvasElement).width) / point.src[point.turno].width) * point.src[point.turno].height;
        console.log(parseInt(getComputedStyle(canvasElement).width), point.src[point.turno].width, canvasElement.height);
        canvasCtx.save();
        canvasCtx.beginPath();
        canvasCtx.translate(canvasElement.width, 0);
        canvasCtx.scale(-1, 1);
        img.onload = function () {
            canvasCtx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);
        }
        setTimeout(function () {
            hands.start(point.src[point.turno], canvasElement, canvasCtx);
        }, 2000);
        // if (point.src[point.turno][1] === "face") {
        //     let face_class = new Face_class(sock, point);
        //     writeTurn();
        //     face_class.onFrame("./image/opere/" + point.src[point.turno][0]);
        // } else {
        //     let obj_class = new Obj_class(3, "Chair", sock, point);
        //     writeTurn();
        //     obj_class.onFrame("./image/opere/" + point.src[point.turno][0]);
        // }
    }
}

const addStartListeners = () => {
    sock.on('start', () => {
        excute();
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

function writeTurn() {
    turno_label.innerHTML = "Turno: " + point.turno;
}

function conPublic() {
    sock.emit('public', user, point.length);
    sock.on('message', writeEvent);
    addUserListeners();
    addStartListeners();
    addPuntListeners();
    addWinListeners();
    addFinishTurnListeners();
}

function conPrivate() {
    sock.emit('private', cod, user, point.length);
    sock.on('message', writeEvent);
    addUserListeners();
    addStartListeners();
    addPuntListeners();
    addWinListeners();
    addFinishTurnListeners();
}
