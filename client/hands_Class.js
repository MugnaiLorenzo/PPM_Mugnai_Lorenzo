export class Hands_Class {
    constructor(sock) {
        this.sock = sock;
        this.videoElement = document.createElement('video');
        this.img = null;
        this.point = null;
        this.canvasElement = document.getElementById("can_out");
        this.canvasCtx = this.canvasElement.getContext('2d');
        this.canvasElement.width = parseInt(getComputedStyle(this.canvasElement).width);
        this.canvasElement.height = parseInt(getComputedStyle(this.canvasElement).height);
        this.canvasCtx.translate(this.canvasElement.width, 0);
        this.canvasCtx.scale(-1, 1);
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
        this.hands.onResults(this.onResults.bind(this));
        this.camera = new Camera(this.videoElement, {
            onFrame: async () => {
                await this.hands.send({image: this.videoElement});
            },
            width: parseInt(getComputedStyle(this.canvasElement).width),
            height: parseInt(getComputedStyle(this.canvasElement).height)
        });
        this.camera.start();
        this.num_solution = 0;
    }

    onResults(results) {
        this.canvasCtx.save();
        this.canvasCtx.beginPath();
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width * -1, this.canvasElement.height);
        // this.canvasCtx.drawImage(
        //     this.img, 0, 0, this.canvasElement.width, this.canvasElement.height);
        let x_c = this.point.x;
        let y_c = this.point.y;
        let w = this.point.width * this.canvasElement.width / 950;
        let h = this.point.height * this.canvasElement.width / 950;
        this.canvasCtx.strokeRect(x_c, y_c, w, h);
        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                let x = landmarks[8].x * this.canvasElement.width;
                let y = landmarks[8].y * this.canvasElement.height;
                this.canvasCtx.arc(x, y, 5, 0, 2 * Math.PI);
                this.canvasCtx.fill();
                if (x > x_c && x < (x_c + w) && y > y_c && y < (y_c + h)) {
                    if (this.num_solution === 0) {
                        this.num_solution++;
                        this.sock.emit('point');
                    }
                }
            }
        }
        this.canvasCtx.restore()
    }

    start(img) {
        this.point = img;
        this.img = new Image();
        this.img.src = "./image/opere/" + this.point.src;
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width * -1, this.canvasElement.height);
        this.canvasCtx.drawImage(this.img, 0, 0, this.canvasElement.width, this.canvasElement.height);
    }

}