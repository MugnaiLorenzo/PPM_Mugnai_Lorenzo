function aggiungi() {
    const inputs = document.getElementById("my-form").elements;
    let titolo = inputs[0].value;
    let descrizione = inputs[1].value;
    let image = inputs[2].files[0];
    // console.log(titolo, descrizione, image);
    let data = inputs[2].files[0];
    let entry = inputs[2].files[0];
    // formData.append("photo", image);
    // fetch('E:/WebStormProject/Sito PPM/ppm-mugnai-lorenzo/image/opere/' + encodeURIComponent(entry.name), {
    fetch('./image/opere/' + encodeURIComponent(entry.name), {method: 'PUT', body: data});
    alert('your file has been uploaded');
    // let elem = document.createElement("img");
    // elem.setAttribute("src", image);
    // document.getElementById("place").appendChild(elem);
}