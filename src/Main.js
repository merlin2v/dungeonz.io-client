
"use strict";

(function () {
    // Load the saved renderer preference.
    window.renderer = localStorage.getItem('renderer') || 'webgl';
    let renderer = Phaser.WEBGL;
    if(window.renderer === 'canvas'){
        renderer = Phaser.CANVAS;
    }

    const game = new Phaser.Game(100, 100, renderer, '', null, true, false);

    game.state.add('Game',              dungeonz.Game);
    game.state.add('Boot',              dungeonz.Boot);

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