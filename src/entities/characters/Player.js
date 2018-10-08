import Humanoid from './Humanoid'

const Sprite = function (x, y, config) {
    Humanoid.call(this, x, y, config);
};

Sprite.prototype = Object.create(Humanoid.prototype);
Sprite.prototype.constructor = Sprite;

export default Sprite;