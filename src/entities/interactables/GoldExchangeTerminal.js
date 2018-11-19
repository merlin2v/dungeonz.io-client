
const Sprite = function (x, y, config) {
    Phaser.Sprite.call(this, _this.game, x, y, 'game-atlas', 'gold-exchange-terminal');
    this.scale.setTo(GAME_SCALE);

    this.pseudoInteractable = true;
};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.interactedByPlayer = function () {
    _this.GUI.goldExchangePanel.show();
};

export default Sprite;