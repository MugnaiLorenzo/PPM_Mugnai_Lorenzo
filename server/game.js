class RpsGame {
    constructor(p1, p2, u1, u2, length) {
        this.length = length;
        this._players = [p1, p2];
        this.punt = [0, 0];
        this.occupato = [];
        this.waiting = [false, false];
        for (let i = 0; i < length; i++) {
            this.occupato.push(false);
        }
        this._players[0].emit('user', u2);
        this._players[1].emit('user', u1);
        this._players[0].emit('start');
        this._players[1].emit('start');
        this.turn = 0;
        this._players[0].on('point', (turno) => {
            if (this.occupato[turno] === false) {
                this.occupato[turno] = true;
                this._getGameResult(0)
            }
        });
        this._players[1].on('point', (turno) => {
            if (this.occupato[turno] === false) {
                this.occupato[turno] = true;
                this._getGameResult(1)
            }
        });
    }

    _getGameResult(winner) {
        this.turn = this.turn + 1;
        switch (winner) {
            case 0:
                this.punt[0] = this.punt[0] + 1;
                this._players[0].emit("punt", this.punt[0], this.punt[1]);
                this._players[1].emit("punt", this.punt[1], this.punt[0]);
                this._sendWinMessage(this._players[0], this._players[1]);
                break;

            case 1:
                this.punt[1] = this.punt[1] + 1;
                this._players[0].emit("punt", this.punt[0], this.punt[1]);
                this._players[1].emit("punt", this.punt[1], this.punt[0]);
                this._sendWinMessage(this._players[1], this._players[0]);
                break;
        }
    }

    sendready() {
        if (this.turn === this.length) {
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

    _sendWinMessage(winner, loser) {
        winner.emit('message_win', 'Hai vinto il round!');
        loser.emit('message_win', 'Hai perso il round!');
    }
}

module.exports = RpsGame;
