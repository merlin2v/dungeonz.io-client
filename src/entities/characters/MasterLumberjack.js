
const Sprite = function (x, y, config) {

    //console.log("player const: ", x, y, config);

    Phaser.Sprite.call(this, _this.game, x, y, 'game-atlas', this.directionFrames[config.direction] || 'human-down-1');

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
    this.displayName = _this.add.text(this.width / 2 / GAME_SCALE, 4, config.displayName, style);
    this.displayName.anchor.set(0.5, 1);
    this.displayName.scale.set(0.5);
    this.addChild(this.displayName);

    this.chatTexts = [];

};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.onMove = function () {
    // Move all of the chat texts along with the character.
    for(let i=0; i<this.chatTexts.length; i+=1){
        this.chatTexts[i].x = this.x + (this.width / 2);
        this.chatTexts[i].y = this.y - 16 + this.chatTexts[i].yScroll;
    }

    const thisEntity = _this.dynamics[this.entityId];
    const playerEntity = _this.dynamics[_this.player.entityId];

    // Check if this entity is now in front of the player character.
    if(playerEntity.direction === 'u'){
        if(playerEntity){

        }

    }
    //else if(){ <-- finish doing this stuff, check if this entity is now in front of where the player is facing.

    //}



    // Show the "Talk (C)" prompt if this is now in front of the player character.
    if(playerEntity.row === _this.player.row){

    }
};

Sprite.prototype.directionBaseFrames = {
    u: 'human-up-1',
    d: 'human-down-1',
    l: 'human-left-1',
    r: 'human-right-1'
};

export default Sprite;