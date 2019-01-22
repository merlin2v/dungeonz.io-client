
const Sprite = function (x, y, config) {

    Phaser.Sprite.call(this, _this.game, x, y, undefined, undefined);

    //this.anchor.set(0.5);
    this.scale.setTo(GAME_SCALE);

    //this.entityId = config.id;
    this.direction = config.direction;

    let frame = undefined;
    if(this.baseFrames !== undefined){
        frame = this.baseFrames[config.direction] || this.baseFrames.d;
    }
    this.body = _this.add.sprite(dungeonz.TILE_SIZE / 2, dungeonz.TILE_SIZE / 2, 'game-atlas', frame);
    //this.body.baseFrames = baseFrames;
    //this.body.frameName = frame;
    this.body.anchor.set(0.5);
    this.addChild(this.body);

    const style = {
        font: "20px Press Start 2P",
        align: "center",
        fill: "#f5f5f5",
        stroke: "#000000",
        strokeThickness: 5
    };

    // The anchor is still in the top left, so offset by half the width to center the text.
    this.displayName = _this.add.text(dungeonz.TILE_SIZE / 2, 4, config.displayName, style);
    this.displayName.anchor.set(0.5, 1);
    this.displayName.scale.set(0.25);
    this.addChild(this.displayName);
    this.displayName.visible = false;

    this.chatTexts = [];

    this.burnEffect = _this.add.sprite(dungeonz.TILE_SIZE / 2, dungeonz.TILE_SIZE / 2, 'game-atlas', 'burn-effect-1');
    this.burnEffect.animations.add('burn', ['burn-effect-1', 'burn-effect-2'], 2, true);
    this.burnEffect.anchor.set(0.5);
    this.addChild(this.burnEffect);
    this.burnEffect.visible = false;

    this.curseIcon = _this.add.sprite(dungeonz.TILE_SIZE / 2 - 6, -6, 'game-atlas', 'curse-icon');
    this.curseIcon.anchor.set(0.5);
    this.addChild(this.curseIcon);
    this.curseIcon.visible = false;

    this.enchantmentIcon = _this.add.sprite(dungeonz.TILE_SIZE / 2 + 6, -6, 'game-atlas', 'enchantment-icon');
    this.enchantmentIcon.anchor.set(0.5);
    this.addChild(this.enchantmentIcon);
    this.enchantmentIcon.visible = false;

    this.damageMarker = _this.add.text(dungeonz.TILE_SIZE / 2, dungeonz.TILE_SIZE / 2, -99, style);
    this.damageMarker.anchor.set(0.5);
    this.damageMarker.scale.set(0.25);
    this.damageMarker.visible = false;
    this.addChild(this.damageMarker);
    this.damageMarkerDisappearTimeout = null;

};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.onInputOver = function () {
    this.displayName.visible = true;
};

Sprite.prototype.onInputOut = function () {
    this.displayName.visible = false;
};

Sprite.prototype.onInputDown = function () {
    console.log("oninputdown");
    this.displayName.visible = true;
};

Sprite.prototype.moveAnimCompleted = function () {
    this.body.frameName = this.baseFrames[this.direction];
};

Sprite.prototype.onMove = function (playMoveAnim) {
    // Move all of the chat texts along with the character.
    for(let i=0; i<this.chatTexts.length; i+=1){
        this.chatTexts[i].x = this.x + (dungeonz.TILE_SIZE * 2);
        this.chatTexts[i].y = this.y - 24 + this.chatTexts[i].yScroll;
    }

    if(playMoveAnim === true){
        if(this.body.animations.currentAnim.isPlaying === false){
            this.body.animations.play(this.direction);
        }
    }
};

Sprite.prototype.onChangeDirection = function () {
    this.body.animations.stop();
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
        this.damageMarker.addColor('#6abe30', 0);
        amount = '+' + amount;
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