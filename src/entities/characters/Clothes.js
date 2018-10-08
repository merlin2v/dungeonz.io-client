import ItemTypes from '../../../src/catalogues/ItemTypes'

const moveAnimCompleted = function () {
    this.frameName = this.clothesFrames[this.clothesName][this.parent.direction];
};

const Sprite = function (config) {
    //console.log("clothing const:", config);

    Phaser.Sprite.call(this, _this.game, 0, 0, 'game-atlas');

    this.direction = config.direction || 'd';

    // If clothes were specified (a character came into range already wearing something), then use those clothes.
    if(config.clothingTypeNumber !== undefined){
        this.clothesName = ItemTypes[config.clothingTypeNumber].idName;
    }
    // No clothes, don't show the clothes sprite.
    else {
        this.visible = false;
        this.clothesName = 'Mage robe';
    }

    this.frameName = this.clothesFrames[this.clothesName][this.direction];

    this.animations.add('Mage robe-u',    ['mage-robe-up-1',      'mage-robe-up-2',       'mage-robe-up-1',       'mage-robe-up-3'],      10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('Mage robe-d',    ['mage-robe-down-1',    'mage-robe-down-2',     'mage-robe-down-1',     'mage-robe-down-3'],    10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('Mage robe-l',    ['mage-robe-left-1',    'mage-robe-left-2',     'mage-robe-left-1',     'mage-robe-left-3'],    10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('Mage robe-r',    ['mage-robe-right-1',   'mage-robe-right-2',    'mage-robe-right-1',    'mage-robe-right-3'],   10).onComplete.add(moveAnimCompleted, this);

    this.animations.add('cloak-clothes-u',    ['cloak-clothes-up-1',      'cloak-clothes-up-2',       'cloak-clothes-up-1',       'cloak-clothes-up-3'],      10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('cloak-clothes-d',    ['cloak-clothes-down-1',    'cloak-clothes-down-2',     'cloak-clothes-down-1',     'cloak-clothes-down-3'],    10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('cloak-clothes-l',    ['cloak-clothes-left-1',    'cloak-clothes-left-2',     'cloak-clothes-left-1',     'cloak-clothes-left-3'],    10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('cloak-clothes-r',    ['cloak-clothes-right-1',   'cloak-clothes-right-2',    'cloak-clothes-right-1',    'cloak-clothes-right-3'],   10).onComplete.add(moveAnimCompleted, this);

};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.clothesFrames = {
    ['Mage robe']: {
        u: 'mage-robe-up-1',
        d: 'mage-robe-down-1',
        l: 'mage-robe-left-1',
        r: 'mage-robe-right-1'
    }
};

export default Sprite;