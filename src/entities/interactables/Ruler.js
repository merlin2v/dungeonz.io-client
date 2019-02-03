
const Sprite = function (x, y, config) {
    Phaser.Sprite.call(this, _this.game, x, y, undefined, undefined);
    this.scale.setTo(GAME_SCALE);

    this.baseSprite = _this.add.sprite(dungeonz.TILE_SIZE / 2, dungeonz.TILE_SIZE / 2, 'game-atlas', 'ruler-1');
    this.baseSprite.anchor.set(0.5);
    this.addChild(this.baseSprite);

    this.baseSprite.animations.add('idle',    ['ruler-1',   'ruler-2'],   2, true);
    this.baseSprite.animations.play('idle');

    this.pseudoInteractable = true;
    //this.addDisplayName(dungeonz.getTextDef("Ruler"));
    this.addDisplayName("Ruler");
};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.interactedByPlayer = function () {
    // Show the charter purchase panel.

};

export default Sprite;