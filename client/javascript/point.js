export class Point {
    constructor() {
        this.turno = 0;
        this.src = [["f1.jpeg", "face"], ["f2.jpg", "face"], ["f3.jpg", "Chair"], ["f4.jpg", "face"], ["f5.jpeg", "face"], ["f6.jpg", "face"], ["f7.jpg", "face"], ["f8.jpg", "face"]];
        this.length = this.src.length
    }

    setPoint() {
        this.turno = this.turno + 1;
    }
}