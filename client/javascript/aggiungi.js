let image_natural_width = 0;
let image_natural_heigth = 0;
let last_mousex = 0;
let last_mousey = 0;
let width_canvas, height_canvas;
let width_image, height_image;
let activate = false;

function aggiungi() {
    let sock = io();
    const inputs = document.getElementById("my-form").elements;
    let titolo = inputs[0].value;
    let descrizione = inputs[1].value;
    let descrizione_accurata = inputs[2].value;
    let input = document.getElementById("picture");
    sock.emit('readJson');
    sock.on('getData', (data) => {
        let name = "f" + (data.quadri.length + 1).toString() + "." + inputs[3].files[0].type.split("/")[1];
        if (height_canvas < 0) {
            height_canvas = height_canvas * -1;
            last_mousey = last_mousey - height_canvas;
        }
        if (width_canvas < 0) {
            width_canvas = width_canvas * -1;
            last_mousex = last_mousex - width_canvas;
        }
        console.log(width_image, height_image, last_mousex, last_mousey, width_canvas, height_canvas)
        let last_natural_mousex = Math.round(last_mousex * (image_natural_width / width_image));
        let last_natural_mousey = Math.round(last_mousey * (image_natural_heigth / height_image));
        let width_natural_canvas = Math.round(width_canvas * (image_natural_width / width_image));
        let height_natural_canvas = Math.round(height_canvas * (image_natural_heigth / height_image));
        const firebaseConfig = {
            apiKey: "AIzaSyCCJQoKp1zX9EybdgZKH2aufYYuYarF29k",
            authDomain: "ppm-lorenzo-mugnai.firebaseapp.com",
            projectId: "ppm-lorenzo-mugnai",
            storageBucket: "ppm-lorenzo-mugnai.appspot.com",
            messagingSenderId: "715545495743",
            appId: "1:715545495743:web:bad5226af78183f5481e0a",
            measurementId: "G-FJP0L3PXNX"
        };
        Object.defineProperty(input.files[0], 'name', {
            writable: true,
            value: name
        });
        firebase.initializeApp(firebaseConfig);
        let storageRef = firebase.storage().ref(input.files[0].name);
        storageRef.put(input.files[0]).then((snapshot) => {
            let url = snapshot.downloadURL;
            sock.emit('uploadJson', url, data, last_natural_mousex, last_natural_mousey, width_natural_canvas, height_natural_canvas, image_natural_width, image_natural_heigth, descrizione, descrizione_accurata, titolo);
            sock.on('changePage', () => {
                window.location.href = './gestione.html';
            })
        });
    });
}

function change() {
    if (activate === false) {
        activate = true;
        window.addEventListener('resize', function (event) {
            change();
        }, true);
    }
    let input = document.getElementById("picture");
    let fReader = new FileReader();
    fReader.readAsDataURL(input.files[0]);
    fReader.onloadend = async function (event) {
        const image = new Image();
        image.src = fReader.result;
        let canvas = document.getElementById('place');
        let context = canvas.getContext('2d');
        image.onload = () => {
            width_image = document.getElementById('descrizione').offsetWidth;
            height_image = (width_image / image.naturalWidth) * image.naturalHeight;
            image_natural_width = image.naturalWidth;
            image_natural_heigth = image.naturalHeight;
            context.canvas.width = width_image;
            context.canvas.height = height_image;
            // context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
            context.drawImage(image, 0, 0, width_image, height_image);
            let canvasx = $(canvas).offset().left;
            let canvasy = $(canvas).offset().top;
            let mousex = 0;
            let mousey = 0;
            let mousedown = false;
            $(canvas).on('mousedown', function (e) {
                last_mousex = parseInt(e.clientX - canvasx);
                last_mousey = parseInt(e.clientY - canvasy + window.pageYOffset);
                mousedown = true;
            });
            //Mouseup
            $(canvas).on('mouseup', function (e) {
                mousedown = false;
            });
            //Mousemove
            $(canvas).on('mousemove', function (e) {
                mousex = parseInt(e.clientX - canvasx);
                mousey = parseInt(e.clientY - canvasy + window.pageYOffset);
                if (mousedown) {
                    context.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
                    context.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
                    context.drawImage(image, 0, 0, width_image, height_image);
                    context.beginPath();
                    width_canvas = mousex - last_mousex;
                    height_canvas = mousey - last_mousey;
                    context.rect(last_mousex, last_mousey, width_canvas, height_canvas);
                    context.strokeStyle = 'black';
                    context.lineWidth = 4;
                    context.stroke();
                }
                //Output
                $('#output').html('current: ' + mousex + ', ' + mousey + '<br/>last: ' + last_mousex + ', ' + last_mousey + '<br/>mousedown: ' + mousedown);
            });
        }
    }

}