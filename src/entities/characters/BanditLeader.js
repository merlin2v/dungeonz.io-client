import Humanoid from './Humanoid'

const Sprite = function (x, y, config) {
    Humanoid.call(this, x, y, config);
    this.displayName.setText(dungeonz.getTextDef("Mob name: Bandit leader"));
    this.displayName.addColor("#ff6b00", 0);
};

Sprite.prototype = Object.create(Humanoid.prototype);
Sprite.prototype.constructor = Sprite;

export default Sprite;