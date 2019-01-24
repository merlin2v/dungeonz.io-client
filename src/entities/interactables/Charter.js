
const Sprite = function (x, y, config) {
    Phaser.Sprite.call(this, _this.game, x, y, 'game-atlas', 'charter');
    this.scale.setTo(GAME_SCALE);

    this.pseudoInteractable = true;

    this.addDamageMarker();
};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.interactedByPlayer = function () {
    //_this.GUI.clanPanel.show();
};

export default Sprite;