function start() {
    document.getElementById("gioca").disabled = true;
    document.getElementById("giocaPrivato").disabled = true;
}

function control() {
    let user = document.getElementById("username").value;
    let cod = document.getElementById("cod").value;
    if (user !== "") {
        document.getElementById("gioca").disabled = false;
        if (cod !== "") {
            document.getElementById("giocaPrivato").disabled = false;
        } else {
            document.getElementById("giocaPrivato").disabled = true;
        }
    } else {
        document.getElementById("gioca").disabled = true;
        document.getElementById("giocaPrivato").disabled = true;
    }

}

function starPublic() {
    let user = document.getElementById("username").value;
    sessionStorage.setItem("user", user)
    sessionStorage.setItem("cod", "");
    window.location.href = './gioca.html'
}

function starPrivate() {
    let user = document.getElementById("username").value;
    let cod = document.getElementById("cod").value;
    sessionStorage.setItem("user", user)
    sessionStorage.setItem("cod", cod)
    window.location.href = './gioca.html'
}

