export class Point {
    constructor() {
        this.turno = 0;
        this.src = [];
        let rect = [];
        let descr = ''
        rect.push(new Rect(277, 490, 248, 104));
        descr = 'Può essere un contadino o un lavoratore che cerca di farsi spazio tra le macerie per raggiungere, quasi ipnotizzato, la protagonista.'
        this.src.push(new img("f1.jpg", 1000, 802, rect, descr));
        rect = [];
        rect.push(new Rect(1195, 238, 343, 235));
        this.src.push(new img("f2.jpg", 1587, 1057, rect, descr));
        rect = [];
        rect.push(new Rect(285, 507, 270, 294));
        this.src.push(new img("f3.jpg", 945, 1000, rect, descr));
        rect = [];
        rect.push(new Rect(580, 444, 72, 72));
        this.src.push(new img("f4.jpg", 1000, 842, rect, descr));
        rect = [];
        rect.push(new Rect(0, 728, 69, 404));
        this.src.push(new img("f5.jpg", 1500, 1147, rect, descr));
        rect = [];
        rect.push(new Rect(150, 238, 827, 200));
        this.src.push(new img("f6.jpg", 1094, 749, rect, descr));
        rect = [];
        rect.push(new Rect(325, 200, 134, 369));
        this.src.push(new img("f7.jpg", 1209, 556, rect, '7'));
        this.length = this.src.length
    }

    setPoint() {
        this.turno = this.turno + 1;
    }
}

class img {
    constructor(src, width, height, ret, descrizione) {
        this.src = src;
        this.descrizione = descrizione;
        this.width = width;
        this.height = height;
        this.ret = ret;
    }
}

class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}