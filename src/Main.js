
"use strict";

(function () {

    const game = new Phaser.Game(100, 100, Phaser.CANVAS, '', null, true, false);

    game.state.add('Boot',              dungeonz.Boot);
    game.state.add('Game',              dungeonz.Game);

    game.state.start('Boot');

    // Check if the game should be run in dev mode.
    const http = new XMLHttpRequest();
    http.open('HEAD', "../server/admin-commands", false);
    http.send();
    if(http.status === 404){
        console.log("* Running in prod mode.");
        window.devMode = false;
    }
    else {
        console.log("* Running in dev mode.");
        window.devMode = true;
    }

})();