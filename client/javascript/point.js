export class Point {
    constructor() {
        this.turno = 0;
        this.src = []
        this.src.push(new img("f2.jpg", 1587, 1057, 0, 343, 343, 235));
        this.src.push(new img("f1.jpg", 1000, 802, 311, 27, 235, 544));
        // this.src.push(new img("f2.jpg", 1587, 1057, 1207, 242, 343, 235));
        this.src.push(new img("f3.jpg", 945, 1000, 0, 0, 200, 200));
        this.src.push(new img("f4.jpg", 1000, 842, 0, 0, 200, 200));
        this.src.push(new img("f5.jpg", 1500, 1147, 0, 0, 200, 200));
        this.src.push(new img("f6.jpg", 1094, 749, 0, 0, 200, 200));
        this.src.push(new img("f6.jpg", 1209, 556, 0, 0, 200, 200));
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