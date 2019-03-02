
const Sprite = function (x, y, config) {

    Phaser.Sprite.call(this, _this.game, x, y, undefined, undefined);

    //this.anchor.set(0.5);
    this.scale.setTo(GAME_SCALE);

    this.entityId = config.id;
    this.direction = config.direction;

    let frame = undefined;
    if(this.baseFrames !== undefined){
        frame = this.baseFrames[config.direction] || this.baseFrames.d;
    }
    this.baseSprite = _this.add.sprite(dungeonz.TILE_SIZE / 2, dungeonz.TILE_SIZE / 2, 'game-atlas', frame);
    //this.baseSprite.baseFrames = baseFrames;
    //this.baseSprite.frameName = frame;
    this.baseSprite.anchor.set(0.5);
    this.addChild(this.baseSprite);

    this.addDisplayName(config.displayName);

    //this.chatTexts = [];

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

    this.addDamageMarker();
};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.moveAnimCompleted = function () {
    this.baseSprite.frameName = this.baseFrames[this.direction];
};

Sprite.prototype.onMove = function (playMoveAnim) {
    // Move all of the chat texts along with the character.
    /*for(let i=0; i<this.chatTexts.length; i+=1){
        // Tween them to the characters new row/col.
        _this.add.tween(this.chatTexts[i]).to({
            x: _this.player.col * dungeonz.TILE_SCALE,
            y: _this.player.row * dungeonz.TILE_SCALE
        }, _this.moveDelay, null, true);

        //this.chatTexts[i].x = this.x + (dungeonz.TILE_SIZE * 2);
        //this.chatTexts[i].y = this.y - 24 + this.chatTexts[i].yScroll;
    }*/

    if(playMoveAnim === true){
        if(this.baseSprite.animations.currentAnim.isPlaying === false){
            this.baseSprite.animations.play(this.direction);
        }
    }
};

Sprite.prototype.onChangeDirection = function () {
    this.baseSprite.animations.stop();
};

Sprite.prototype.onBurnStart = function () {
    this.burnEffect.visible = true;
    this.burnEffect.animations.play('burn');
};

Sprite.prototype.onBurnStop = function () {
    this.burnEffect.visible = false;
    this.burnEffect.animations.stop(null, true);
};

export default Sprite;