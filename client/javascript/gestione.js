export function start() {
    let sock = io();
    sock.emit('readJson');
    sock.on('getData', (data) => {
        let quadri = data.quadri;
        for (let i = 0; i < quadri.length; i++) {
            let div = document.createElement("div");
            div.setAttribute("class","opera");
            let elem = document.createElement("img");
            let text  = document.createElement("div");
            let content = document.createTextNode(quadri[i].title);
            text.appendChild(content);
            text.setAttribute("class","titoloOpera");
            elem.setAttribute("src", quadri[i].src);
            elem.setAttribute("alt", quadri[i].title);
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
            div.appendChild(text);
            div.appendChild(elem);
            div.appendChild(btn);
            document.getElementById("placehere").appendChild(div);
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