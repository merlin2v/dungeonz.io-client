
import Character from './Character'
import Clothes from "./Clothes";

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);

    this.clothes = new Clothes(config);
    this.addChild(this.clothes);
    // Bring the damage marker over the clothes, so the clothes don't cover it.
    this.swapChildren(this.clothes, this.damageMarker);

    this.body.animations.add('u',    ['human-up-1',      'human-up-2',       'human-up-1',       'human-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    this.body.animations.add('d',    ['human-down-1',    'human-down-2',     'human-down-1',     'human-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.body.animations.add('l',    ['human-left-1',    'human-left-2',     'human-left-1',     'human-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.body.animations.add('r',    ['human-right-1',   'human-right-2',    'human-right-1',    'human-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.onMove = function (playMoveAnim) {
    // Move all of the chat texts along with the player.
    for(let i=0; i<this.chatTexts.length; i+=1){
        this.chatTexts[i].x = this.x + this.body.width;
        this.chatTexts[i].y = this.y - 24 + this.chatTexts[i].yScroll;
    }

    if(playMoveAnim === true){
        if(this.body.animations.currentAnim.isPlaying === false){
            this.body.animations.play(this.direction);
            this.clothes.animations.play(this.clothes.clothesName + "-" + this.direction);
        }
    }
};

Sprite.prototype.baseFrames = {
    u: 'human-up-1',
    d: 'human-down-1',
    l: 'human-left-1',
    r: 'human-right-1'
};

export default Sprite;