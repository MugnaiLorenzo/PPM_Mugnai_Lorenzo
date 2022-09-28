import {Point} from "./point.js";
import {Hands_Class} from "./hands_Class.js";

let quadri;
let m = document.getElementById("mess1");
let mess = document.getElementById("mess");
let user;
let cod;
let sock = io();
let point = new Point()
let turno_label = document.getElementById("turno");
let descr_label = document.getElementById("descrizione");
let title_label = document.getElementById("tit");
let element;
let hands = new Hands_Class(sock);
writeTurn();


export function start() {
    user = sessionStorage.getItem("user");
    cod = sessionStorage.getItem("cod");
    document.getElementById("name1").innerHTML = user;
    if (cod === "") {
        document.getElementById("title_cod").innerHTML = "Partita <span>Pubblica</span>";
        conPublic();
    } else {
        document.getElementById("title_cod").innerHTML = "Codice: " + cod;
        conPrivate();
    }
}

const writeEvent = (text) => {
    m.style.display = "flex"
    mess.style.display = "flex"
    mess.innerHTML = text;
    sock.on('getData', (data) => {
        quadri = data.quadri;
    });
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
        hands.camera.stop();
        writeTurn();
        excute();
    })
}

function excute() {
    element = document.createElement("canvas");
    element.classList.add("can-img");
    element.id = "can_out";
    document.getElementById("output").appendChild(element);
    if (point.turno < point.length) {
        sock.emit('getImage', quadri[point.turno].src, point.turno);
        sock.on('img' + point.turno.toString(), (img_src) => {
            let img = document.createElement("img");
            img.setAttribute("src", img_src);
            img.setAttribute("alt", quadri[point.turno].title);
            let canvasElement = document.getElementById("can_out");
            let canvasCtx = canvasElement.getContext('2d');
            canvasElement.width = parseInt(getComputedStyle(canvasElement).width);
            canvasElement.height = (parseInt(getComputedStyle(canvasElement).width) / point.src[point.turno].width) * point.src[point.turno].height;
            canvasCtx.save();
            canvasCtx.beginPath();
            canvasCtx.translate(canvasElement.width, 0);
            canvasCtx.scale(-1, 1);
            img.onload = function () {
                canvasCtx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);
            }
            descr_label.innerHTML = point.src[point.turno].descrizione;
            title_label.innerHTML = "<span>" + point.src[point.turno].title + "</span>";
            setTimeout(function () {
                m.style.display = "none";
                mess.style.display = "none";
                hands.start(point.src[point.turno], canvasElement, canvasCtx);
            }, 2000);
        });
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
