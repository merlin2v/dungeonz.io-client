
const moveAnimCompleted = function () {
    this.frameName = this.baseFrames[this.direction];
};

const Sprite = function (x, y, config, baseFrames) {

    this.baseFrames = baseFrames;

    Phaser.Sprite.call(this, _this.game, x, y, 'game-atlas', this.baseFrames[config.direction] || this.baseFrames.d);

    //this.entityId = config.id;
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

    this.damageMarker = _this.add.text(this.width / 2 / GAME_SCALE, this.height / 2 / GAME_SCALE, -99, style);
    this.damageMarker.anchor.set(0.5);
    this.damageMarker.scale.set(0.5);
    this.damageMarker.visible = false;
    this.addChild(this.damageMarker);
    this.damageMarkerDisappearTimeout = null;

    this.burnEffect = _this.add.sprite(0, 0, 'game-atlas', 'burn-effect-1');
    this.burnEffect.animations.add('burn', ['burn-effect-1', 'burn-effect-2'], 2, true);
    this.addChild(this.burnEffect);
    this.burnEffect.visible = false;

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

Sprite.prototype.onBurnStart = function () {
    this.burnEffect.visible = true;
    this.burnEffect.animations.play('burn');
};

Sprite.prototype.onBurnStop = function () {
    this.burnEffect.visible = false;
    this.burnEffect.animations.stop(null, true);
};

Sprite.prototype.onHitPointsModified = function (amount) {

    if(amount < 0){
        this.damageMarker.addColor('#ff2f00', 0);
    }
    else {
        this.damageMarker.addColor('#87B500', 0);
    }

    this.damageMarker.visible = true;
    this.damageMarker.text = amount;

    // If there is already a previous damage marker waiting to be hidden,
    // stop that timer and start a new one for this damage event.
    if(this.damageMarkerDisappearTimeout !== null){
        clearTimeout(this.damageMarkerDisappearTimeout);
    }

    var that = this;
    this.damageMarkerDisappearTimeout = setTimeout(function () {
        that.damageMarker.visible = false;
        that.damageMarkerDisappearTimeout = null;
    }, 800);
};

export default Sprite;