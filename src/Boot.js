import TextDefs from '../src/catalogues/TextDefinitions';
import DungeonPrompts from '../src/catalogues/DungeonPrompts';

import overworld from '../assets/map/overworld'
import dungeon_bandit_hideout from '../assets/map/dungeon-bandit-hideout'

window._this = {};
window.dungeonz = {
    mapsData: {},
    TILE_SIZE: 16,
    // The view range on the client is one less than the view range on the server, so the client can see things leaving the view range.
    VIEW_RANGE: 20,
    // The edge to edge view distance. x2 for both sides, and +1 for the middle (where this player is).
    VIEW_DIAMETER: (1+20*2),
    // Minimum amount of time (in ms) for how long any chat messages should stay for.
    CHAT_BASE_LIFESPAN: 2000,
    // How fast chat messages float upwards.
    CHAT_SCROLL_SPEED: 0.3,
    // What language to use from the text defs.
    language: 'English',

    quickTurnEnabled: true,
    audioEnabled: true,
    // The volume of the audio. 0 is no audio, 100 is full volume. Can't use floats due to imperfect decimal precision.
    audioLevel: 50,

    GUIZoom: 100,

    virtualDPadEnabled: false,

    TextDefs: TextDefs,

    DungeonPrompts: DungeonPrompts,

    /**
     * Gets the text for a given definition ID for the selected language from the text definitions catalogue.
     * Defaults to English if the definition is not found in the selected language.
     * @param {String} definitionID
     */
    getTextDef: function (definitionID) {
        //console.log("lang:", dungeonz.language);
        //console.log("def name:", definitionID);
        let text = dungeonz.TextDefs[dungeonz.language][definitionID];
        // Check if definition is defined for selected language.
        if(text === null){
            // Use English instead.
            return dungeonz.TextDefs['English'][definitionID];
        }
        else {
            return text;
        }
    }
};
window.GAME_SCALE = 2;

window.windowResize = function () {
    //console.log("resized");
    //console.log("w: " + window.innerWidth);
    //console.log("h: " + window.innerHeight);

    _this.tilemap.tileGridGroup.x = (window.innerWidth * 0.5)  - (16 * GAME_SCALE * dungeonz.VIEW_DIAMETER * 0.5);
    _this.tilemap.tileGridGroup.y = (window.innerHeight * 0.5) - (16 * GAME_SCALE * dungeonz.VIEW_DIAMETER * 0.5);

    _this.tilemap.staticsGridGroup.x = (window.innerWidth * 0.5)  - (16 * GAME_SCALE * dungeonz.VIEW_DIAMETER * 0.5);
    _this.tilemap.staticsGridGroup.y = (window.innerHeight * 0.5) - (16 * GAME_SCALE * dungeonz.VIEW_DIAMETER * 0.5);

    _this.dynamicsGroup.x = (window.innerWidth * 0.5)  - (16 * GAME_SCALE * dungeonz.VIEW_DIAMETER * 0.5);
    _this.dynamicsGroup.y = (window.innerHeight * 0.5) - (16 * GAME_SCALE * dungeonz.VIEW_DIAMETER * 0.5);

};

dungeonz.Boot = function () {
    
};

dungeonz.Boot.prototype = {

    preload: function () {

        this.load.atlasJSONArray('game-atlas',  'assets/img/game-atlas.png',    'assets/img/game-atlas.json');
        this.load.spritesheet('ground-tileset', 'assets/img/ground.png', 16, 16);
        this.load.spritesheet('statics-tileset', 'assets/img/statics.png', 16, 16);
        this.load.spritesheet('interactables-tileset', 'assets/img/interactables.png', 16, 16);

    },

    create: function () {

        console.log("in boot create");

        window._this = this;

        document.getElementById("menu_container").style.display = "block";

        // Keep the game running even when the window loses focus.
        this.stage.disableVisibilityChange = true;

        // Round pixels so text doesn't appear blurry/anti-aliased.
        this.game.renderer.renderSession.roundPixels = true;

        // Make sure the window always has focus when clicked on. Fixes not detecting input when iframed.
        window.addEventListener("click", function () {
            //console.log("click");
            window.focus();
        }, false);

        dungeonz.mapsData["overworld"] = overworld;
        dungeonz.mapsData["dungeon-bandit-hideout"] = dungeon_bandit_hideout;

        //console.log("maps data:");
        //console.log(dungeonz.mapsData);

        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        dungeonz.virtualDPadEnabled = !_this.game.device.desktop;

    },

    update: function () {

    },

    render: function () {

    }

};