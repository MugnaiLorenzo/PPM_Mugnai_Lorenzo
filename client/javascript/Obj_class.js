export class Obj_class {
    constructor(max, modelName, sock, point) {
        this.point = point;
        this.modelName = modelName
        this.sock = sock;
        this.img = new Image();
        this.img.src = "";
        this.canvasElement = document.createElement("canvas");
        this.canvasElement.classList.add("can-img");
        this.canvasCtx = this.canvasElement.getContext('2d');
        this.max_object = max;
        this.var_bol = [];
        this.b = [];
        for (let i = 0; i < this.max_object; i++) {
            this.b = [];
            this.var_bol.push(this.b);
            for (let j = 0; j < 4; j++) {
                this.b.push(false);
            }
        }
        this.objectron = new Objectron({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/objectron@0.4/${file}`;
            }
        });
        this.objectron.setOptions({
            modelName: this.modelName,
            maxNumObjects: this.max_object
        });
        this.objectron.onResults(this.onResults.bind(this));
        window.addEventListener("click", event => {
            setTimeout(event => {
                for (let i = 0; i < this.max_object; i++) {
                    let touch = false;
                    for (let j = 0; j < 4; j++) {
                        if (this.var_bol[i][j] === true) {
                            touch = true;
                        }
                        this.var_bol[i][j] = false
                    }
                    if (touch === true) {
                        this.sock.emit('point');
                    }
                }
            }, 1000);
        });
    }

    onResults(results) {
        let b = window.BOX_CONNECTIONS;
        this.canvasCtx.save();
        const e = this.canvasCtx.canvas;
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.width);
        this.canvasCtx.drawImage(results.image, 0, 0, this.canvasElement.width, this.canvasElement.height);
        let index = 0;
        if (!!results.objectDetections) {
            for (const detectedObject of results.objectDetections) {
                const landmarks = detectedObject.keypoints.map(x => x.point2d);
                this.drawRect(landmarks, e, b[0], b[3], b[1], b[2], index, 2); // sx
                this.drawRect(landmarks, e, b[4], b[7], b[5], b[6], index, 1); //dx
                this.drawRect(landmarks, e, b[1], b[11], b[5], b[6], index, 2); //fronte
                this.drawRect(landmarks, e, b[8], b[10], b[4], b[7], index, 3); //retro
                index++
            }
        }
        this.img = null;
        this.canvasCtx.restore();
    }

    drawRect(landmarks, e, o_1, v_1, o_2, v_2, index, k) {
        let p_0_x = parseFloat((landmarks[o_1[0]].x * e.width).toFixed(2));
        let p_0_y = parseFloat((landmarks[o_1[0]].y * e.height).toFixed(2));
        let p_1_x = parseFloat((landmarks[o_2[0]].x * e.width).toFixed(2));
        let p_1_y = parseFloat((landmarks[o_2[0]].y * e.height).toFixed(2));
        let p_2_x = parseFloat((landmarks[v_1[0]].x * e.width).toFixed(2));
        let p_2_y = parseFloat((landmarks[v_1[0]].y * e.height).toFixed(2));
        let p_3_x = parseFloat((landmarks[v_2[0]].x * e.width).toFixed(2));
        let p_3_y = parseFloat((landmarks[v_2[0]].y * e.height).toFixed(2));
        this.drawLine(p_0_x, p_0_y, p_1_x, p_1_y)
        this.drawLine(p_0_x, p_0_y, p_2_x, p_2_y)
        this.drawLine(p_3_x, p_3_y, p_2_x, p_2_y)
        this.drawLine(p_3_x, p_3_y, p_1_x, p_1_y)
        e.addEventListener("click", event => {
            var offsets = this.canvasElement.getBoundingClientRect();
            var left = offsets.left;
            var top = offsets.top;
            this.getTouch(index, k, (event.clientX - left), (event.clientY - top), p_0_x, p_0_y, p_1_x, p_1_y, p_2_x, p_2_y, p_3_x, p_3_y);
        })
    }

    getTouch(index, k, x, y, p_0_x, p_0_y, p_1_x, p_1_y, p_2_x, p_2_y, p_3_x, p_3_y) {
        let d_0_2 = this.retta_y(x, y, p_0_x, p_0_y, p_2_x, p_2_y);
        let d_3_1 = this.retta_y(x, y, p_3_x, p_3_y, p_1_x, p_1_y);
        let d_0_1 = this.retta_x(x, y, p_0_x, p_0_y, p_1_x, p_1_y);
        let d_3_2 = this.retta_x(x, y, p_3_x, p_3_y, p_2_x, p_2_y);
        if (d_0_2 > 0 && d_3_1 < 0 && d_0_1 < 0 && d_3_2 > 0) {
            this.var_bol[index][k] = true;
        } else {
            this.var_bol[index][k] = false;
        }
    }

    retta_y(x, y, x_0, y_0, x_1, y_1) {
        let r_x = ((y - y_0) / (y_1 - y_0)) * (x_1 - x_0) + x_0;
        let d = x - r_x;
        // canvasCtx.strokeRect(r_x, y, 5, 5); //proiezione
        return parseFloat((d).toFixed(1));
    }

    retta_x(x, y, x_0, y_0, x_1, y_1) {
        let r_y = ((x - x_0) / (x_1 - x_0)) * (y_1 - y_0) + y_0;
        let d = y - r_y;
        // canvasCtx.strokeRect(x, r_y, 5, 5); //proiezione
        return parseFloat((d).toFixed(1));
    }

    drawLine(x_0, y_0, x_1, y_1) {
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(x_0, y_0);
        this.canvasCtx.lineTo(x_1, y_1);
        this.canvasCtx.stroke();
    }

    onFrame(src) {
        this.objectron = new Objectron({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/objectron@0.4/${file}`;
            }
        });
        this.objectron.setOptions({
            modelName: this.modelName,
            maxNumObjects: this.max_object
        });
        this.objectron.onResults(this.onResults.bind(this));
        this.img = new Image();
        this.img.src = src;
        this.canvasElement = document.getElementById("can_out")
        this.canvasElement.width = parseInt(getComputedStyle(this.canvasElement).width);
        this.canvasElement.height = parseInt(getComputedStyle(this.canvasElement).height);
        this.canvasCtx = this.canvasElement.getContext('2d');
        try {
            this.objectron.send({image: this.img});
        } catch (error) {
            this.onFrame(src, null);
        }
    }
}