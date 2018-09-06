
"use strict";

(function () {

    const game = new Phaser.Game(100, 100, Phaser.CANVAS, 'gameContainer', null, true, false);

    game.state.add('Boot',              dungeonz.Boot);
    game.state.add('Game',              dungeonz.Game);

    game.state.start('Boot');

})();