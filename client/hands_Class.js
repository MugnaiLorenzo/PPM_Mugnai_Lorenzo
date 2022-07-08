export class Hands_Class {
    constructor() {
        this.videoElement = null;
        this.img = null;
        this.point = null;
        this.canvasElement = null;
        this.canvasCtx = null;
        this.hands = null;
        this.camera = null;
    }

    onResults(results) {
        this.canvasCtx.save();
        this.canvasCtx.beginPath();
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width * -1, this.canvasElement.height);
        this.canvasCtx.drawImage(
            this.img, 0, 0, this.canvasElement.width, this.canvasElement.height);
        this.canvasCtx.strokeRect(this.point.x, this.point.y, this.point.width * this.canvasElement.width / 950, this.point.height * this.canvasElement.width / 950);

        // results.image, 0, 0, canvasElement.width, canvasElement.height);
        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                let x = landmarks[8].x * this.canvasElement.width;
                let y = landmarks[8].y * this.canvasElement.height;
                this.canvasCtx.arc(x, y, 5, 0, 2 * Math.PI);
                this.canvasCtx.fill();
                // console.log(landmarks)
                // drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                //     {color: '#00FF00', lineWidth: 5});
                // drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
            }
        }
        this.canvasCtx.restore()
    }

    start(img) {
        this.point = img;
        this.videoElement = document.createElement('video');
        this.img = new Image();
        this.img.src = "./image/opere/" + this.point.src;
        this.canvasElement = document.getElementById("can_out");
        this.canvasCtx = this.canvasElement.getContext('2d');
        this.canvasElement.width = parseInt(getComputedStyle(this.canvasElement).width);
        this.canvasElement.height = parseInt(getComputedStyle(this.canvasElement).height);
        this.canvasCtx.save();
        this.canvasCtx.beginPath();
        this.canvasCtx.translate(this.canvasElement.width, 0);
        this.canvasCtx.scale(-1, 1);
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width * -1, this.canvasElement.height);
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
        this.img_load = false;
        this.img_load = this.loadImg(this.canvasCtx, this.canvasElement, this.img);
        this.load(this.canvasCtx, this.canvasElement, this.point, this.camera);
        //     function (this.canvasCtx) {
        //     this.canvasCtx.drawImage(
        //         this.img, 0, 0, this.canvasElement.width, this.canvasElement.height);
        //     this.canvasCtx.strokeRect(this.point.x, this.point.y, this.point.width * this.canvasElement.width / 950, this.point.height * this.canvasElement.width / 950);
        //     this.camera.start();
        // }

    }

    loadImg(canvasCtx, canvasElement, img) {
        canvasCtx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);
        return true;
    }

    load(canvasCtx, canvasElement, point, camera) {
        canvasCtx.strokeRect(point.x, point.y, point.width * canvasElement.width / 950, point.height * canvasElement.width / 950);
        camera.start();
    }

}