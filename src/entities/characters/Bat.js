
import Character from './Character'

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);

    this.body.scale.setTo(1);

    this.displayName.setText(dungeonz.getTextDef("Mob name: Bat"));

    this.body.animations.add('u',    ['bat-up-1',      'bat-up-2',       'bat-up-1',       'bat-up-3'],      5, true);
    this.body.animations.add('d',    ['bat-down-1',    'bat-down-2',     'bat-down-1',     'bat-down-3'],    5, true);
    this.body.animations.add('l',    ['bat-left-1',    'bat-left-2',     'bat-left-1',     'bat-left-3'],    5, true);
    this.body.animations.add('r',    ['bat-right-1',   'bat-right-2',    'bat-right-1',    'bat-right-3'],   5, true);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.onChangeDirection = function () {
    this.body.animations.stop();
    this.body.animations.play(this.direction);
};

Sprite.prototype.baseFrames = {
    u: 'bat-up-1',
    d: 'bat-down-1',
    l: 'bat-left-1',
    r: 'bat-right-1'
};

export default Sprite;