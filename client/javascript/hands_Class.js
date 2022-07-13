export class Hands_Class {
    constructor(sock) {
        this.sock = sock;
        this.videoElement = document.createElement('video');
        this.img = null;
        this.point = null;
        this.canvasElement = null;
        this.canvasCtx = null;
        this.hands = null;
        this.camera = null;
        this.num_solution = 0;
        this.x_c = [];
        this.y_c = [];
        this.w = [];
        this.h = [];
        this.ready = false;
        this.hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });
        this.hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        let e = document.createElement("canvas");
        e.classList.add("can-img");
        this.hands.onResults(this.onResults.bind(this));
        this.camera = new Camera(this.videoElement, {
            onFrame: async () => {
                await this.hands.send({image: this.videoElement});
            },
            width: parseInt(getComputedStyle(e).width),
            height: parseInt(getComputedStyle(e).height)
        });
        this.camera.start();
    }

    onResults(results) {
        if (this.ready === true) {
            this.canvasCtx.save();
            this.canvasCtx.beginPath();
            this.canvasCtx.clearRect(0, 0, this.canvasElement.width * -1, this.canvasElement.height);
            this.canvasCtx.drawImage(this.img, 0, 0, this.canvasElement.width, this.canvasElement.height);
            for (let i = 0; i < this.point.ret.length; i++) {
                this.canvasCtx.strokeRect(this.x_c[i], this.y_c[i], this.w[i], this.h[i]);
            }
            if (results.multiHandLandmarks) {
                for (const landmarks of results.multiHandLandmarks) {
                    let x = landmarks[8].x * this.canvasElement.width;
                    let y = landmarks[8].y * this.canvasElement.height;
                    this.canvasCtx.arc(x, y, 5, 0, 2 * Math.PI);
                    this.canvasCtx.fill();
                    for (let i = 0; i < this.point.ret.length; i++) {
                        if (x > this.x_c[i] && x < (this.x_c[i] + this.w[i]) && y > this.y_c[i] && y < (this.y_c[i] + this.h[i])) {
                            this.ready = false;
                            this.sock.emit('point');
                        }
                    }
                }
            }
            this.canvasCtx.restore()
        }
    }

    start(img, canvas, ctx) {
        this.canvasElement = canvas;
        this.canvasCtx = ctx;
        this.ready = false;
        this.num_solution = 0;
        this.point = img;
        this.img = new Image();
        this.img.src = "./image/opere/" + this.point.src;
        this.canvasCtx.save();
        this.canvasCtx.beginPath();
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width * -1, this.canvasElement.height);
        for (let i = 0; i < this.point.ret.length; i++) {
            this.x_c.push(this.point.ret[i].x * this.canvasElement.width / this.point.width);
            this.y_c.push(this.point.ret[i].y * this.canvasElement.height / this.point.height);
            this.w.push(this.point.ret[i].w * this.canvasElement.width / this.point.width);
            this.h.push(this.point.ret[i].h * this.canvasElement.height / this.point.height);
        }
        this.ready = true;
    }

}