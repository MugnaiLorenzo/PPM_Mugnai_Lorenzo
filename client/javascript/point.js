export class Point {
    constructor() {
        this.turno = 0;
        this.src = [];
        let rect = [];
        let descr = ''
        rect.push(new Rect(277, 490, 248, 104));
        rect.push(new Rect(327, 362, 183, 147));
        descr = 'Può essere un contadino o un lavoratore che cerca di farsi spazio tra le macerie per raggiungere, quasi ipnotizzato, la protagonista.'
        this.src.push(new img("f1.jpg", 1000, 802, rect, descr));

        rect = [];
        rect.push(new Rect(1195, 238, 343, 235));
        descr = 'Lui è Zefiro.\n' +
            '\n' +
            'Ed è la personificazione del vento dell’ovest.\n' +
            '\n' +
            'Nella mitologia greca è il dio del vento occidentale.\n' +
            '\n' +
            'Viene considerato un vento molto leggero ed apprezzato dalle persone, poiché con il suo “soffio” porta frutti sulla terra.\n' +
            '\n' +
            'Non c’è personaggio più indicato per il ruolo di messaggero della primavera.'
        this.src.push(new img("f2.jpg", 1587, 1057, rect, descr));

        rect = [];
        rect.push(new Rect(289, 651, 194, 166));
        rect.push(new Rect(452, 511, 100, 302));
        rect.push(new Rect(356, 563, 100, 145));
        descr = 'I Re Magi.'
        this.src.push(new img("f3.jpg", 945, 1000, rect, descr));

        rect = [];
        rect.push(new Rect(580, 444, 72, 72));
        descr = 'Si sta preparando per difendere il castello di Pontremoli.' + '\n' + 'Come puoi vedere già indossa l’armatura ed è armato di spada, pronto a guidare l’esercito nella battaglia.\n' +
            '\n' +
            'Ma c’è dell’altro che devo dirti su di lui.\n' +
            '\n' +
            'Guarda attentamente i suoi movimenti.' + '\n' + 'Tra le mani stringe la lettera del Doge.'
        this.src.push(new img("f4.jpg", 1000, 842, rect, descr));

        rect = [];
        rect.push(new Rect(0, 728, 69, 404));
        descr = "L'uomo con la barba a destra potrebbe essere Tommaso Rangone" + '\n' + 'Si tratta di un grande e famoso mecenate del ‘500.'
        this.src.push(new img("f5.jpg", 1500, 1147, rect, descr));

        rect = [];
        rect.push(new Rect(13, 499, 96, 208));
        descr = "Sai chi è l’uomo a cui viene offerto il vino?\n" +
            "È lo sposo. Accanto a lui c’è sua moglie.";
        this.src.push(new img("f6.jpg", 1094, 749, rect, descr));

        rect = [];
        rect.push(new Rect(320, 202, 145, 331));
        descr = "Esattamente come tutti gli altri funerali a Ornans (e quelli cristiani, in generale), c’è un prete " +
            "che sta celebrando il rito." + '\n' + "sta indossando un abito scuro per questo rito funebre e sta " +
            "leggendo alcune frasi tratte dal suo breviario.";
        this.src.push(new img("f7.jpg", 1209, 556, rect, descr));
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