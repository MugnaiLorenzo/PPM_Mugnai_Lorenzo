export class Face_class {
    constructor(sock) {
        this.sock = sock;
        this.img = new Image();
        this.img.src = "";
        this.canvasElement = document.createElement("canvas");
        this.canvasElement.classList.add("can-img");
        this.canvasCtx = this.canvasElement.getContext('2d');
        this.old_canvas = null;
        this.faceDetection = new FaceDetection({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.3/${file}`;
            }
        });
        this.faceDetection.setOptions({
            modelSelection: 0,
            minDetectionConfidence: 0.5
        });
        this.faceDetection.onResults(this.onResultsFace.bind(this));
    }

    onResultsFace(results) {
        console.log(results);
        this.canvasCtx.save();
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.canvasCtx.drawImage(results.image, 0, 0, this.canvasElement.width, this.canvasElement.height);
        for (let i = 0; i < results.detections.length; i++) {
            if (results.detections.length > 0) {
                let cX = results.detections[i].boundingBox.xCenter * this.canvasElement.width;
                let cY = results.detections[i].boundingBox.yCenter * this.canvasElement.height;
                let w = results.detections[i].boundingBox.width * this.canvasElement.width;
                let h = results.detections[i].boundingBox.height * this.canvasElement.height;
                let x = cX - w / 2;
                let y = cY - h / 2;
                this.canvasCtx.strokeRect(x, y, w, h);
                this.canvasElement.addEventListener("click", event => {
                    this.getCursorPosition(this.canvasElement, event, x, y, w, h);
                })
            }
        }
        this.img = null;
        this.canvasCtx.restore();
    }

    getCursorPosition(canvas, event, x, y, w, h) {
        const rect = canvas.getBoundingClientRect();
        const x_c = event.clientX - rect.left;
        const y_c = event.clientY - rect.top;
        if (x_c > x && x_c < (w + x) && y_c > y && y_c < (h + y)) {
            this.sock.emit('point');
        }
    }

    async onFrame(src, old) {
        this.img = new Image();
        this.img.src = src;
        this.old_canvas = old;
        this.faceDetection = new FaceDetection({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.3/${file}`;
            }
        });
        this.faceDetection.setOptions({
            modelSelection: 0,
            minDetectionConfidence: 0.5
        });
        this.faceDetection.onResults(this.onResultsFace.bind(this));
        console.log(this.old_canvas)
        if (this.old_canvas !== null) {
            document.getElementById("output").removeChild(this.old_canvas)
        }
        this.canvasElement = document.createElement("canvas");
        this.canvasElement.classList.add("can-img");
        this.canvasCtx = this.canvasElement.getContext('2d');
        this.old_canvas = this.canvasElement;
        document.getElementById("output").appendChild(this.canvasElement);
        this.canvasElement.width = parseInt(getComputedStyle(this.canvasElement).width);
        this.canvasElement.height = parseInt(getComputedStyle(this.canvasElement).height);
        try {
            await this.faceDetection.send({image: this.img});
            console.log("AA", this.canvasElement)
            return this.old_canvas
        } catch (error) {
            return this.onFrame(src);
        }
    }
}