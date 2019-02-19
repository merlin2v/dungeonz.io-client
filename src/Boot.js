import TextDefs from '../src/catalogues/TextDefinitions';
import DungeonPrompts from '../src/catalogues/DungeonPrompts';

import overworld from '../assets/map/overworld'
import dungeon_bandit_hideout from '../assets/map/dungeon-bandit-hideout'
import dungeon_city_sewers from '../assets/map/dungeon-city-sewers'
import dungeon_west_pyramid from '../assets/map/dungeon-west-pyramid'

window._this = {};
window.GAME_SCALE = 4;
window.dungeonz = {
    mapsData: {},
    TILE_SIZE: 16,
    // The view range on the client is one less than the view range on the server, so the client can see things leaving the view range.
    VIEW_RANGE: 15,
    // The edge to edge view distance. x2 for both sides, and +1 for the middle (where this player is).
    VIEW_DIAMETER: (1+15*2),
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
// Used to center entity sprites that are centered, such as projectiles and pickups.
window.dungeonz.CENTER_OFFSET = dungeonz.TILE_SIZE * GAME_SCALE * 0.5;

window.windowResize = function () {
    /*console.log("resized");
    console.log("w: " + window.innerWidth);
    console.log("h: " + window.innerHeight);*/

    _this.tilemap.tileGridGraphic.x = (window.innerWidth * 0.5)  - (16 * GAME_SCALE * dungeonz.VIEW_DIAMETER * 0.5);
    _this.tilemap.tileGridGraphic.y = (window.innerHeight * 0.5) - (16 * GAME_SCALE * dungeonz.VIEW_DIAMETER * 0.5);

    _this.tilemap.staticsGridGraphic.x = (window.innerWidth * 0.5)  - (16 * GAME_SCALE * dungeonz.VIEW_DIAMETER * 0.5);
    _this.tilemap.staticsGridGraphic.y = (window.innerHeight * 0.5) - (16 * GAME_SCALE * dungeonz.VIEW_DIAMETER * 0.5);

    _this.tilemap.darknessGridGroup.x = (window.innerWidth * 0.5)  - (16 * GAME_SCALE * dungeonz.VIEW_DIAMETER * 0.5);
    _this.tilemap.darknessGridGroup.y = (window.innerHeight * 0.5) - (16 * GAME_SCALE * dungeonz.VIEW_DIAMETER * 0.5);

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

        console.log("* In boot create");

        window._this = this;

        document.getElementById("home_cont").style.display = "block";

        // Keep the game running even when the window loses focus.
        this.stage.disableVisibilityChange = true;

        // Round pixels so text doesn't appear blurry/anti-aliased.
        this.game.renderer.renderSession.roundPixels = true;

        // Make sure the window always has focus when clicked on. Fixes not detecting input when iframed.
        window.addEventListener("click", function () {
            //console.log("click");
            window.focus();
        }, false);

        dungeonz.mapsData["overworld"] =                overworld;
        dungeonz.mapsData["dungeon-bandit-hideout"] =   dungeon_bandit_hideout;
        dungeonz.mapsData["dungeon-city-sewers"] =      dungeon_city_sewers;
        dungeonz.mapsData["dungeon-west-pyramid"] =     dungeon_west_pyramid;

        //console.log("maps data:");
        //console.log(dungeonz.mapsData);

        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
        //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        dungeonz.virtualDPadEnabled = !_this.game.device.desktop;

        //this.game.add.plugin(Phaser.Plugin.Debug);

        // Enable advanced timing for the FPS counter.
        this.game.time.advancedTiming = true;

    },

    update: function () {

    },

    render: function () {

    }

};