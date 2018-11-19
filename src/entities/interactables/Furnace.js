
const Sprite = function (x, y, config) {
    Phaser.Sprite.call(this, _this.game, x, y, 'game-atlas', 'furnace');
    this.scale.setTo(GAME_SCALE);

    this.stationTypeNumber = config.typeNumber;

    this.pseudoInteractable = true;
};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.interactedByPlayer = function () {
    _this.GUI.craftingPanel.show(dungeonz.getTextDef("Furnace"));
    _this.craftingManager.stationTypeNumber = this.stationTypeNumber;
};

Sprite.prototype.onMove = function () {
    _this.tilemap.updateDarknessGrid();
};

Sprite.prototype.defaultLightDistance = 4;
Sprite.prototype.lightDistance = 4;

export default Sprite;