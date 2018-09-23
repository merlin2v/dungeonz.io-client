
const moveAnimCompleted = function () {
    this.frameName = this.directionFrames[this.direction];
};

const Sprite = function (x, y, config) {
    Phaser.Sprite.call(this, _this.game, x, y, 'game-atlas', this.directionFrames[config.direction] || 'bandit-down-1');

    this.entityId = config.id;
    this.direction = config.direction;

    this.scale.setTo(GAME_SCALE);

    const style = {
        font: "20px Consolas",
        align: "center",
        fill: "#f5f5f5",
        stroke: "#000000",
        strokeThickness: 5
    };

    // The anchor is still in the top left, so offset by half the width to center the text.
    this.displayName = _this.add.text(this.width / 2 / GAME_SCALE, 4, dungeonz.getTextDef("Mob name: Bandit"), style);
    this.displayName.anchor.set(0.5, 1);
    this.displayName.scale.set(0.5);
    this.addChild(this.displayName);

    this.chatTexts = [];

    this.animations.add('u',    ['bandit-up-1',      'bandit-up-2',       'bandit-up-1',       'bandit-up-3'],      10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('d',    ['bandit-down-1',    'bandit-down-2',     'bandit-down-1',     'bandit-down-3'],    10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('l',    ['bandit-left-1',    'bandit-left-2',     'bandit-left-1',     'bandit-left-3'],    10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('r',    ['bandit-right-1',   'bandit-right-2',    'bandit-right-1',    'bandit-right-3'],   10).onComplete.add(moveAnimCompleted, this);
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
        }
    }

};

Sprite.prototype.directionFrames = {
    u: 'bandit-up-1',
    d: 'bandit-down-1',
    l: 'bandit-left-1',
    r: 'bandit-right-1'
};

export default Sprite;