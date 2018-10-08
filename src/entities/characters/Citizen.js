import Humanoid from './Humanoid'

const Sprite = function (x, y, config) {
    Humanoid.call(this, x, y, config);
    this.displayName.setText(dungeonz.getTextDef("Mob name: Citizen"));
};

Sprite.prototype = Object.create(Humanoid.prototype);
Sprite.prototype.constructor = Sprite;

export default Sprite;