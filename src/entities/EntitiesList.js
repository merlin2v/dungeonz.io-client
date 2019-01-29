import Sprite from "./characters/Character";

Phaser.Sprite.prototype.tweenPickupFromCenter = function () {
    this.anchor.setTo(0.5);
    this.x += dungeonz.CENTER_OFFSET;
    this.y += dungeonz.CENTER_OFFSET;
    _this.add.tween(this.scale).to({x: this.scale.x * 0.8, y: this.scale.y * 0.8}, 1000, "Linear", true, 0, -1, true);
};

Phaser.Sprite.prototype.onChangeDirection = function () {
};

Phaser.Sprite.prototype.onHitPointsModified = function (amount) {
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

Phaser.Sprite.prototype.onInputOver = function () {
    this.displayName.visible = true;
};

Phaser.Sprite.prototype.onInputOut = function () {
    this.displayName.visible = false;
};

/*Phaser.Sprite.prototype.onInputDown = function () {
    this.displayName.visible = true; //Might need to do a loop of
    all dynamics in Game pointerDownHandler to have click-on-able characters
};*/

Phaser.Sprite.prototype.addDamageMarker = function () {
    this.damageMarker = _this.add.text(dungeonz.TILE_SIZE / 2, dungeonz.TILE_SIZE / 2, -99, {
        font: "20px Press Start 2P",
        align: "center",
        fill: "#f5f5f5",
        stroke: "#000000",
        strokeThickness: 5
    });
    this.damageMarker.anchor.set(0.5);
    this.damageMarker.scale.set(0.25);
    this.damageMarker.visible = false;
    this.addChild(this.damageMarker);
    this.damageMarkerDisappearTimeout = null;
};

Phaser.Sprite.prototype.addDisplayName = function (displayName) {
    // The anchor is still in the top left, so offset by half the width to center the text.
    this.displayName = _this.add.text(dungeonz.TILE_SIZE / 2, 4, displayName, {
        font: "20px Press Start 2P",
        align: "center",
        fill: "#f5f5f5",
        stroke: "#000000",
        strokeThickness: 5
    });
    this.displayName.anchor.set(0.5, 1);
    this.displayName.scale.set(0.25);
    this.addChild(this.displayName);
    this.displayName.visible = false;
};

import Player                   from './characters/Player'
import Citizen                  from './characters/Citizen'
import Bat                      from './characters/Bat'
import Bandit                   from './characters/Bandit'
import BanditLeader             from './characters/BanditLeader'
import Knight                   from './characters/Knight'
import Prisoner                 from './characters/Prisoner'
import Rat                      from './characters/Rat'
import Warrior                  from './characters/Warrior'
import ZombieHuman              from './characters/ZombieHuman'

import CorpseHuman              from './corpses/CorpseHuman'

import Anvil                    from './interactables/Anvil'
import BankChest                from './interactables/BankChest'
import Charter                  from './interactables/Charter'
import ClanWoodWall             from './interactables/ClanWoodWall'
import Furnace                  from './interactables/Furnace'
import Generator                from './interactables/Generator'
import Workbench                from './interactables/Workbench'
import GoldOre                  from './interactables/GoldOre'
import IronOre                  from './interactables/IronOre'
import Tree                     from './interactables/Tree'
import WoodDoor                 from './interactables/WoodDoor'
import SmallIronCandle          from './interactables/SmallIronCandle'
import Exit                     from './interactables/Exit'
import DungeonPortal            from './interactables/DungeonPortal'
import OverworldPortal          from './interactables/OverworldPortal'

import PickupBookOfLight        from './pickups/PickupBookOfLight'
import PickupBookOfSouls        from './pickups/PickupBookOfSouls'
import PickupCloak              from './pickups/PickupCloak'
import PickupMageRobe           from './pickups/PickupMageRobe'
import PickupNecromancerRobe    from './pickups/PickupNecromancerRobe'
import PickupNinjaGarb          from './pickups/PickupNinjaGarb'
import PickupIronArmour         from './pickups/PickupIronArmour'
import PickupIronArrows         from './pickups/PickupIronArrows'
import PickupIronHatchet        from './pickups/PickupIronHatchet'
import PickupIronPickaxe        from './pickups/PickupIronPickaxe'
import PickupIronDagger         from './pickups/PickupIronDagger'
import PickupIronSword          from './pickups/PickupIronSword'
import PickupIronSheet          from './pickups/PickupIronSheet'
import PickupIronHammer         from './pickups/PickupIronHammer'
import PickupFeathers           from './pickups/PickupFeathers'
import PickupFireGem            from './pickups/PickupFireGem'
import PickupFireStaff          from './pickups/PickupFireStaff'
import PickupScrollOfHealing    from './pickups/PickupScrollOfHealing'
import PickupShuriken           from './pickups/PickupShuriken'
import PickupSuperFireStaff     from './pickups/PickupSuperFireStaff'
import PickupWindStaff          from './pickups/PickupWindStaff'
import PickupOakLogs            from './pickups/PickupOakLogs'
import PickupWoodPlank          from './pickups/PickupWoodPlank'
import PickupGoldOre            from './pickups/PickupGoldOre'
import PickupGoldBar            from './pickups/PickupGoldBar'
import PickupIronOre            from './pickups/PickupIronOre'
import PickupIronBar            from './pickups/PickupIronBar'
import PickupOakBow             from './pickups/PickupOakBow'

import ProjDeathbind            from './projectiles/ProjDeathbind'
import ProjIronArrow            from './projectiles/ProjIronArrow'
import ProjIronDagger           from './projectiles/ProjIronDagger'
import ProjIronSword            from './projectiles/ProjIronSword'
import ProjIronHammer           from './projectiles/ProjIronHammer'
import ProjPacify               from './projectiles/ProjPacify'
import ProjShuriken             from './projectiles/ProjShuriken'
import ProjFire                 from './projectiles/ProjFire'
import ProjSuperFire            from './projectiles/ProjSuperFire'
import ProjWind                 from './projectiles/ProjWind'

const EntitiesList = {

    Player:                 Player,
    Citizen:                Citizen,
    Bat:                    Bat,
    Bandit:                 Bandit,
    BanditLeader:           BanditLeader,
    Knight:                 Knight,
    Prisoner:               Prisoner,
    Rat:                    Rat,
    Warrior:                Warrior,
    ZombieHuman:            ZombieHuman,

    CorpseHuman:            CorpseHuman,

    Anvil:                  Anvil,
    BankChest:              BankChest,
    Charter:                Charter,
    ClanWoodWall:           ClanWoodWall,
    Furnace:                Furnace,
    Generator:              Generator,
    Workbench:              Workbench,
    GoldOre:                GoldOre,
    IronOre:                IronOre,
    Tree:                   Tree,
    WoodDoor:               WoodDoor,
    SmallIronCandle:        SmallIronCandle,

    PickupBookOfLight:      PickupBookOfLight,
    PickupBookOfSouls:      PickupBookOfSouls,
    PickupCloak:            PickupCloak,
    PickupMageRobe:         PickupMageRobe,
    PickupNecromancerRobe:  PickupNecromancerRobe,
    PickupNinjaGarb:        PickupNinjaGarb,
    PickupIronArmour:       PickupIronArmour,
    PickupIronHatchet:      PickupIronHatchet,
    PickupIronArrows:       PickupIronArrows,
    PickupIronPickaxe:      PickupIronPickaxe,
    PickupIronDagger:       PickupIronDagger,
    PickupIronSheet:        PickupIronSheet,
    PickupIronSword:        PickupIronSword,
    PickupIronHammer:       PickupIronHammer,
    PickupFeathers:         PickupFeathers,
    PickupFireGem:          PickupFireGem,
    PickupFireStaff:        PickupFireStaff,
    PickupScrollOfHealing:  PickupScrollOfHealing,
    PickupShuriken:         PickupShuriken,
    PickupSuperFireStaff:   PickupSuperFireStaff,
    PickupWindStaff:        PickupWindStaff,
    PickupOakLogs:          PickupOakLogs,
    PickupWoodPlank:        PickupWoodPlank,
    PickupGoldOre:          PickupGoldOre,
    PickupGoldBar:          PickupGoldBar,
    PickupIronOre:          PickupIronOre,
    PickupIronBar:          PickupIronBar,
    PickupOakBow:           PickupOakBow,

    ProjDeathbind:          ProjDeathbind,
    ProjIronArrow:          ProjIronArrow,
    ProjIronDagger:         ProjIronDagger,
    ProjIronSword:          ProjIronSword,
    ProjIronHammer:         ProjIronHammer,
    ProjPacify:             ProjPacify,
    ProjShuriken:           ProjShuriken,
    ProjFire:               ProjFire,
    ProjSuperFire:          ProjSuperFire,
    ProjWind:               ProjWind,

    Exit:                   Exit,
    DungeonPortal:          DungeonPortal,
    OverworldPortal:        OverworldPortal

};

export default EntitiesList;