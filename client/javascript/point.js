export class Point {
    constructor() {
        this.turno = 0;
        this.src = []
        this.src.push(new img("f1.jpg", 1000, 802, 481, 27, 235, 544));
        this.src.push(new img("f2.jpg", 1587, 1057, 1195, 238, 343, 235));
        this.src.push(new img("f3.jpg", 945, 1000, 285, 507, 270, 294));
        this.src.push(new img("f4.jpg", 1000, 842, 580, 444, 72, 72));
        this.src.push(new img("f5.jpg", 1500, 1147, 0, 728, 69, 404));
        this.src.push(new img("f6.jpg", 1094, 749, 150, 238, 827, 200));
        this.src.push(new img("f7.jpg", 1209, 556, 325, 200, 134, 369));
        this.length = this.src.length
    }

    setPoint() {
        this.turno = this.turno + 1;
    }
}

class img {
    constructor(src, width, height, x, y, w, h) {
        this.src = src;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}