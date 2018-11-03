
const Sprite = function (x, y, config) {
    Phaser.Sprite.call(this, _this.game, x, y, 'game-atlas', 'furnace');
    this.scale.setTo(GAME_SCALE);

    this.stationTypeNumber = config.typeNumber;

    this.pseudoInteractable = true;
};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.interactedByPlayer = function () {
    _this.GUI.showCraftingPanel(dungeonz.getTextDef("Furnace"));
    _this.craftingManager.stationTypeNumber = this.stationTypeNumber;
};

export default Sprite;