export function start() {
    let sock = io();
    sock.emit('readJson');
    sock.on('getData', (data) => {
        let quadri = data.quadri;
        for (let i = 0; i < quadri.length; i++) {
            let elem = document.createElement("img");
            elem.setAttribute("src", quadri[i].src);
            elem.setAttribute("alt", quadri[i].title);
            document.getElementById("placehere").appendChild(elem);
            let btn = document.createElement("button");
            btn.setAttribute("class", "btn_class");
            let i_elem = document.createElement("i");
            i_elem.setAttribute("class", "fa-sharp fa-solid fa-xmark");
            btn.appendChild(i_elem);
            btn.onclick = function () {
                if (confirm('Sicuro di volere eliminare questa immagine?' + i)) {
                    sock.emit('removeJson', i);
                    alert('Eliminata');
                    location.reload();
                }
            };
            document.getElementById("placehere").appendChild(btn);
        }
        let btn = document.createElement("button");
        btn.setAttribute("class", "btn_add");
        let i_elem = document.createElement("i");
        i_elem.setAttribute("class", "fa-solid fa-plus");
        btn.appendChild(i_elem);
        btn.onclick = function () {
            window.location.href = './aggiungi.html'
        };
        document.getElementById("placehere").appendChild(btn);
    });
}