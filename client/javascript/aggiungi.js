function aggiungi() {
    let sock = io();
    const inputs = document.getElementById("my-form").elements;
    let titolo = inputs[0].value;
    let descrizione = inputs[1].value;
    let input = document.getElementById("picture");
    let url = "C:/Users/Lorenzo/Downloads/cat.jpg";
    let fReader = new FileReader();
    fReader.readAsDataURL(input.files[0]);
    fReader.onloadend = async function (event) {
        sock.emit('readJson');
        let name
        sock.on('getData', (data) => {
            console.log(data);
            name = "f" + (data.quadri.length + 1).toString() + "." + inputs[2].files[0].type.split("/")[1];

            console.log(name)
            // sock.emit('uploadFile', fReader.result, name);
        });
    }
}