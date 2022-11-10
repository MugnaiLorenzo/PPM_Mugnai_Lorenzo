class RpsGame {
    constructor(p1, p2, u1, u2, length) {
        this.length = length;
        this._players = [p1, p2];
        this._send = [false, false];
        this.punt = [0, 0];
        this._players[0].emit('user', u2);
        this._players[1].emit('user', u1);
        this._players[0].emit('start');
        this._players[1].emit('start');
        this._players[0].on('point', () => {
            this._getGameResult(0)
        });
        this._players[1].on('point', () => {
            this._getGameResult(1)
        });
        this._players[0].on('e', () => {
            this._getGameResult(2)
        });
        this._players[1].on('e', () => {
            this._getGameResult(3)
        });
    }

    _getGameResult(winner) {
        switch (winner) {
            case 0:
                this.punt[0] = this.punt[0] + 1;
                this._players[0].emit("punt", this.punt[0], this.punt[1]);
                this._players[1].emit("punt", this.punt[1], this.punt[0]);
                this._sendWinMessage(this._players[0]);
                if(this._send[1] === false){
                    this._sendLose(this._players[1]);
                }else{
                    this._send[1] = false;
                }
                break;

            case 1:
                this.punt[1] = this.punt[1] + 1;
                this._players[0].emit("punt", this.punt[0], this.punt[1]);
                this._players[1].emit("punt", this.punt[1], this.punt[0]);
                this._sendWinMessage(this._players[1]);
                if(this._send[0] === false){
                    this._sendLose(this._players[0]);
                }else{
                    this._send[0] = false;
                }
                break;
            case 2:
                this._send[0] = true;
                if(this._send[1] === true){
                    this._send[0] = false;
                    this._send[1] = false;
                }
                this._sendError(this._players[0])
                break;
            case 3:
                this._send[1] = true;
                if(this._send[0] === true){
                    this._send[0] = false;
                    this._send[1] = false;
                }
                this._sendError(this._players[1])
                break;
        }
    }

    sendready(turno) {
        if (turno === this.length) {
            if (this.punt[0] > this.punt[1]) {
                this._players[0].emit("win", "Hai vinto");
                this._players[1].emit("win", "Hai perso");
            } else if (this.punt[0] === this.punt[1]) {
                this._players[0].emit("win", "Avete Pareggiato");
                this._players[1].emit("win", "Avete Pareggiato");
            } else {
                this._players[1].emit("win", "Hai vinto");
                this._players[0].emit("win", "Hai perso");
            }
        } else {
            this._players[1].emit("ready");
            this._players[0].emit("ready");
        }
    }

    _sendError(player) {
        player.emit('message_win', 'Hai sbagliato!');
    }

    _sendLose(player){
        player.emit('message_win', 'Hai perso il round!');
    }

    _sendWinMessage(player) {
        player.emit('message_win', 'Hai vinto il round!');
    }
}

module.exports = RpsGame;
