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
        this.turno = 0;
        this.num_solution = 0;
        this.x_c = null;
        this.y_c = null;
        this.w = null;
        this.h = null;
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
    }

    onResults(results) {
        if (this.ready === true) {
            this.canvasCtx.save();
            this.canvasCtx.beginPath();
            this.canvasCtx.clearRect(0, 0, this.canvasElement.width * -1, this.canvasElement.height);
            this.canvasCtx.drawImage(this.img, 0, 0, this.canvasElement.width, this.canvasElement.height);

            if (results.multiHandLandmarks) {
                for (const landmarks of results.multiHandLandmarks) {
                    let x = landmarks[8].x * this.canvasElement.width;
                    let y = landmarks[8].y * this.canvasElement.height;
                    this.canvasCtx.arc(x, y, 5, 0, 2 * Math.PI);
                    this.canvasCtx.fill();
                    if (x > this.x_c && x < (this.x_c + this.w) && y > this.y_c && y < (this.y_c + this.h)) {
                        this.sock.emit('point', this.turno);
                        this.ready = false;
                    }
                }
            }
            this.canvasCtx.restore()
        }
    }

    start(img, canvas, ctx, img_src, turno) {
        this.x_c = null;
        this.y_c = null;
        this.w = null;
        this.h = null;
        this.turno = turno;
        this.canvasElement = canvas;
        this.canvasCtx = ctx;
        this.ready = false;
        this.num_solution = 0;
        this.point = img;
        this.img = new Image();
        this.img.src = img_src;
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width * -1, this.canvasElement.height);
        this.x_c = this.point.ret.x * this.canvasElement.width / this.point.width;
        this.y_c = this.point.ret.y * this.canvasElement.height / this.point.height;
        this.w = this.point.ret.w * this.canvasElement.width / this.point.width;
        this.h = this.point.ret.h * this.canvasElement.height / this.point.height;
        this.ready = true;
        this.camera.start();

        // setTimeout(() => {
        //     this.sock.emit('point', turno)
        // }, 3000);
    }

}