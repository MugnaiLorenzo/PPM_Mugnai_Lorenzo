import {Point} from "./point.js";
import {Hands_Class} from "./hands_Class.js";

let quadri;
let display_messaggio_waiting = document.getElementById("display_waiting");
let mess_waiting = document.getElementById("mess_waiting");
let mess_win = document.getElementById("mess_win");
let mess_finish = document.getElementById("mess_finish");
let user;
let cod;
let point
let sock = io();

let turno_label = document.getElementById("turno");
let descr_label = document.getElementById("descrizione");
let title_label = document.getElementById("tit");
let element;
let hands = new Hands_Class(sock);

export function start() {
    sock.emit('readJson')
    sock.on('getData', (data) => {
        quadri = data.quadri;
        point = new Point(data);
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
        writeTurn();
    });
}

const addWinListeners = () => {
    sock.on('win', (message) => {
        display_messaggio_waiting.style.display = "none";
        mess_waiting.style.display = "none";
        mess_win.style.display = "none";
        mess_finish.style.display = "flex"
        let html_mesage = "<div class='text-finish'>" + message + "</div>";
        html_mesage += "<button class='win-button' onclick='module.fine()'>Avanti</button>";
        mess_finish.innerHTML = html_mesage;
    });
}

function excute() {
    element = document.createElement("canvas");
    element.classList.add("can-img");
    element.id = "can_out";
    document.getElementById("output").appendChild(element);
    if (point.turno < point.length) {
        let img = document.createElement("img");
        img.setAttribute("src", quadri[point.turno].src);
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
            display_messaggio_waiting.style.display = "none";
            mess_waiting.style.display = "none";
            mess_win.style.display = "none";
            hands.start(point.src[point.turno], canvasElement, canvasCtx, quadri[point.turno].src, point.turno);
        }, 2000);
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

const addWaitingListeners = () => {
    sock.on('wait', (text) => {
        display_messaggio_waiting.style.display = "flex"
        mess_waiting.style.display = "flex"
        mess_waiting.innerHTML = text;
    });
}

const addMessageWinListeners = () => {
    sock.on('message_win', (text) => {
        hands.camera.stop();
        mess_win.style.display = "flex"
        let html_mesage = "<div class='text-win'><span>" + text + "</span><br><br>" + quadri[point.turno].descr_accurata + "</div>";
        html_mesage += "<button class='win-button' onclick='module.avanti()'>Avanti</button>";
        mess_win.innerHTML = html_mesage;
        point.setPoint();
        writeTurn();
    });
}

export function avanti() {
    display_messaggio_waiting.style.display = "flex";
    mess_waiting.style.display = "flex";
    mess_waiting.innerHTML = "Aspettando l'avversario";
    mess_win.style.display = "none";
    sock.emit('waitingFinish');
    sock.on('ready', () => {
        display_messaggio_waiting.style.display = "none";
        mess_waiting.style.display = "none";
        document.getElementById("output").removeChild(element);
        excute();
    });
}

export function fine(){
    window.location.href = '../index.html'
}

function writeTurn() {
    turno_label.innerHTML = "Turno: " + point.turno;
}

function conPublic() {
    sock.emit('public', user, point.length);
    addWaitingListeners();
    addMessageWinListeners();
    addUserListeners();
    addStartListeners();
    addPuntListeners();
    addWinListeners();
}

function conPrivate() {
    sock.emit('private', cod, user, point.length);
    addWaitingListeners();
    addMessageWinListeners();
    addUserListeners();
    addStartListeners();
    addPuntListeners();
    addWinListeners();
}
