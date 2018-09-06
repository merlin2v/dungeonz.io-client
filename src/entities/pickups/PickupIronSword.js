
const Sprite = function (x, y, config) {

    console.log("creating iron sword");

    Phaser.Sprite.call(this, _this.game, x, y, 'game-atlas', 'pickup-iron-sword');

    this.scale.setTo(GAME_SCALE);

};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

export default Sprite;