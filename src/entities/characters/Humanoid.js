
import Clothes from './Clothes'
import Character from './Character'

const moveAnimCompleted = function () {
    this.frameName = this.humanBaseFrames[this.direction];
};

const Sprite = function (x, y, config) {

    Character.call(this, x, y, config, this.humanBaseFrames);

    this.clothes = new Clothes(config);
    this.addChild(this.clothes);
    // Bring the damage marker over the clothes, so the clothes don't cover it.
    this.swapChildren(this.clothes, this.damageMarker);

    this.animations.add('u',    ['human-up-1',      'human-up-2',       'human-up-1',       'human-up-3'],      10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('d',    ['human-down-1',    'human-down-2',     'human-down-1',     'human-down-3'],    10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('l',    ['human-left-1',    'human-left-2',     'human-left-1',     'human-left-3'],    10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('r',    ['human-right-1',   'human-right-2',    'human-right-1',    'human-right-3'],   10).onComplete.add(moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.onMove = function (playMoveAnim) {
    // Move all of the chat texts along with the player.
    for(let i=0; i<this.chatTexts.length; i+=1){
        this.chatTexts[i].x = this.x + (this.width / 2);
        this.chatTexts[i].y = this.y - 24 + this.chatTexts[i].yScroll;
    }

    if(playMoveAnim === true){
        if(this.animations.currentAnim.isPlaying === false){
            this.animations.play(this.direction);
            this.clothes.animations.play(this.clothes.clothesName + "-" + this.direction);
        }
    }

};

export default Sprite;