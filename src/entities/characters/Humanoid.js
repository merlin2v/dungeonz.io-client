
import Clothes from './Clothes'

const moveAnimCompleted = function () {
    this.frameName = this.humanBaseFrames[this.direction];
};

const Sprite = function (x, y, config) {
    Phaser.Sprite.call(this, _this.game, x, y, 'game-atlas', this.humanBaseFrames[config.direction] || this.humanBaseFrames.d);

    //this.entityId = config.id;
    this.direction = config.direction;
    this.baseFrames = this.humanBaseFrames;
    this.clothes = new Clothes(config);
    this.addChild(this.clothes);
    this.scale.setTo(GAME_SCALE);

    const style = {
        font: "20px Consolas",
        align: "center",
        fill: "#f5f5f5",
        stroke: "#000000",
        strokeThickness: 5
    };

    // The anchor is still in the top left, so offset by half the width to center the text.
    this.displayName = _this.add.text(this.width / 2 / GAME_SCALE, 4, config.displayName, style);
    this.displayName.anchor.set(0.5, 1);
    this.displayName.scale.set(0.5);
    this.addChild(this.displayName);

    this.chatTexts = [];

    this.animations.add('u',    ['human-up-1',      'human-up-2',       'human-up-1',       'human-up-3'],      10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('d',    ['human-down-1',    'human-down-2',     'human-down-1',     'human-down-3'],    10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('l',    ['human-left-1',    'human-left-2',     'human-left-1',     'human-left-3'],    10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('r',    ['human-right-1',   'human-right-2',    'human-right-1',    'human-right-3'],   10).onComplete.add(moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
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