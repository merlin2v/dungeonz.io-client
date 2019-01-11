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

    this.animations.add('Necromancer robe-u',    ['necromancer-robe-up-1',      'necromancer-robe-up-2',       'necromancer-robe-up-1',       'necromancer-robe-up-3'],      10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('Necromancer robe-d',    ['necromancer-robe-down-1',    'necromancer-robe-down-2',     'necromancer-robe-down-1',     'necromancer-robe-down-3'],    10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('Necromancer robe-l',    ['necromancer-robe-left-1',    'necromancer-robe-left-2',     'necromancer-robe-left-1',     'necromancer-robe-left-3'],    10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('Necromancer robe-r',    ['necromancer-robe-right-1',   'necromancer-robe-right-2',    'necromancer-robe-right-1',    'necromancer-robe-right-3'],   10).onComplete.add(moveAnimCompleted, this);

    this.animations.add('Cloak-u',    ['cloak-up-1',      'cloak-up-2',       'cloak-up-1',       'cloak-up-3'],      10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('Cloak-d',    ['cloak-down-1',    'cloak-down-2',     'cloak-down-1',     'cloak-down-3'],    10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('Cloak-l',    ['cloak-left-1',    'cloak-left-2',     'cloak-left-1',     'cloak-left-3'],    10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('Cloak-r',    ['cloak-right-1',   'cloak-right-2',    'cloak-right-1',    'cloak-right-3'],   10).onComplete.add(moveAnimCompleted, this);

    this.animations.add('Iron armour-u',    ['iron-armour-up-1',      'iron-armour-up-2',       'iron-armour-up-1',       'iron-armour-up-3'],      10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('Iron armour-d',    ['iron-armour-down-1',    'iron-armour-down-2',     'iron-armour-down-1',     'iron-armour-down-3'],    10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('Iron armour-l',    ['iron-armour-left-1',    'iron-armour-left-2',     'iron-armour-left-1',     'iron-armour-left-3'],    10).onComplete.add(moveAnimCompleted, this);
    this.animations.add('Iron armour-r',    ['iron-armour-right-1',   'iron-armour-right-2',    'iron-armour-right-1',    'iron-armour-right-3'],   10).onComplete.add(moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.clothesFrames = {
    ['Mage robe']: {
        u: 'mage-robe-up-1',
        d: 'mage-robe-down-1',
        l: 'mage-robe-left-1',
        r: 'mage-robe-right-1'
    },
    ['Necromancer robe']: {
        u: 'necromancer-robe-up-1',
        d: 'necromancer-robe-down-1',
        l: 'necromancer-robe-left-1',
        r: 'necromancer-robe-right-1'
    },
    ['Cloak']: {
        u: 'cloak-up-1',
        d: 'cloak-down-1',
        l: 'cloak-left-1',
        r: 'cloak-right-1'
    },
    ['Iron armour']: {
        u: 'iron-armour-up-1',
        d: 'iron-armour-down-1',
        l: 'iron-armour-left-1',
        r: 'iron-armour-right-1'
    }
};

export default Sprite;