import data from '../quadri.json' assert { type: "json"};

export class Point {
    constructor() {
        this.turno = 0;
        this.src = [];
        console.log(data)
        for (let i = 0; i < data.quadri.length; i++) {
            let rect = [];
            rect.push(new Rect(data.quadri[i].rect_x, data.quadri[i].rect_y, data.quadri[i].rect_w, data.quadri[i].rect_h));
            this.src.push(new img(data.quadri[i].src, data.quadri[i].width, data.quadri[i].heigth, rect, data.quadri[i].descr, data.quadri[i].title));
        }
        console.log(this.src)
    }

    setPoint() {
        this.turno = this.turno + 1;
    }
}

class img {
    constructor(src, width, height, ret, descrizione, title) {
        this.src = src;
        this.descrizione = descrizione;
        this.width = width;
        this.height = height;
        this.ret = ret;
        this.title = title;
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