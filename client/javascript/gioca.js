let user
let cod
let sock

const writeEvent = (text) => {
    const parent = document.querySelector('#events');
    const el = document.createElement('li');
    el.innerHTML = text;
    parent.appendChild(el);
};

const addButtonListeners = () => {
    ['rock', 'paper', 'scissors'].forEach((id) => {
        const button = document.getElementById(id);
        button.addEventListener('click', () => {
            sock.emit('turn', id);
        });
    });
};

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
    writeEvent('Welcome to RPS');
    sock = io();
    sock.emit('public', user);
    sock.on('message', writeEvent);
    addUserListeners();
    addPuntListeners();
    addButtonListeners();
}

function conPrivate() {
    writeEvent('Welcome to RPS');
    sock = io();
    sock.emit('private', cod, user);
    sock.on('message', writeEvent);
    addUserListeners();
    addPuntListeners();
    addButtonListeners();
}