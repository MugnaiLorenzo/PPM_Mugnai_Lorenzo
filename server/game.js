class RpsGame {
    constructor(p1, p2, u1, u2, length) {
        this.length = length;
        this._players = [p1, p2];
        this.punt = [0, 0];
        this._players[0].emit('user', u2);
        this._players[1].emit('user', u1);
        this._players[0].emit('start');
        this._players[1].emit('start');
        this.turn = 0;
        this._players[0].on('point', () => {
            this._getGameResult(0)
        });
        this._players[1].on('point', () => {
            this._getGameResult(1)
        });
    }

    _sendToPlayers(msg) {
        this._players.forEach((player) => {
            player.emit('message', msg);
        });
    }

    _getGameResult(winner) {
        this.turn = this.turn + 1;
        this._players[0].emit('finishTurn');
        this._players[1].emit('finishTurn');
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
        }
    }

    _sendWinMessage(winner, loser) {
        winner.emit('message', 'You won!');
        loser.emit('message', 'You lost.');
    }
}

module.exports = RpsGame;
