
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
    console.log("default oninputdown");
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

import Bandit                   from './characters/Bandit'
import BanditLeader             from './characters/BanditLeader'
import Bat                      from './characters/Bat'
import BloodLord                from './characters/BloodLord'
import BloodPriest              from './characters/BloodPriest'
import Citizen                  from './characters/Citizen'
import CryptWarden              from './characters/CryptWarden'
import Innkeeper                from './characters/Innkeeper'
import Knight                   from './characters/Knight'
import MagicMerchant            from './characters/MagicMerchant'
import MeleeMerchant            from './characters/MeleeMerchant'
import Mummy                    from './characters/Mummy'
import OmniMerchant             from './characters/OmniMerchant'
import Pharaoh                  from './characters/Pharaoh'
import Prisoner                 from './characters/Prisoner'
import RangedMerchant           from './characters/RangedMerchant'
import Rat                      from './characters/Rat'
import Ruler                    from './characters/Ruler'
import Snoovir                  from './characters/Snoovir'
import ToolMerchant             from './characters/ToolMerchant'
import TutorialMerchant         from './characters/TutorialMerchant'
import Vampire                  from './characters/Vampire'
import Warrior                  from './characters/Warrior'
import ZombieHuman              from './characters/ZombieHuman'

import CorpseHuman              from './corpses/CorpseHuman'

//import Anvil                    from './interactables/Anvil'
//import BankChest                from './interactables/BankChest'
//import Charter                  from './interactables/Charter'
//import WoodWall                 from './interactables/WoodWall'
//import Furnace                  from './interactables/Furnace'
//import Generator                from './interactables/Generator'
//import Workbench                from './interactables/Workbench'
//import CottonPlant              from './interactables/CottonPlant'
//import DungiumOre               from './interactables/DungiumOre'
//import IronOre                  from './interactables/IronOre'
//import OakTree                  from './interactables/OakTree'
//import WoodDoor                 from './interactables/WoodDoor'
//import WoodDoorLockedBlue       from './interactables/WoodDoorLockedBlue'
//import WoodDoorLockedGreen      from './interactables/WoodDoorLockedGreen'
//import WoodDoorLockedRed        from './interactables/WoodDoorLockedRed'
//import WoodDoorLockedYellow     from './interactables/WoodDoorLockedYellow'
//import SmallIronCandle          from './interactables/SmallIronCandle'
//import Exit                     from './interactables/Exit'
//import DungeonPortal            from './interactables/DungeonPortal'
//import OverworldPortal          from './interactables/OverworldPortal'

import PickupAnvil              from './pickups/PickupAnvil'
import PickupBankChest          from './pickups/PickupBankChest'
import PickupBlueKey            from './pickups/PickupBlueKey'
import PickupBookOfLight        from './pickups/PickupBookOfLight'
import PickupBookOfSouls        from './pickups/PickupBookOfSouls'
import PickupCharter            from './pickups/PickupCharter'
import PickupCloak              from './pickups/PickupCloak'
import PickupCotton             from './pickups/PickupCotton'
import PickupDungiumArmour      from './pickups/PickupDungiumArmour'
import PickupDungiumBar         from './pickups/PickupDungiumBar'
import PickupDungiumOre         from './pickups/PickupDungiumOre'
import PickupEnergyPotion       from './pickups/PickupEnergyPotion'
import PickupExpOrbArmoury      from './pickups/PickupExpOrbArmoury'
import PickupExpOrbGathering    from './pickups/PickupExpOrbGathering'
import PickupExpOrbMagic        from './pickups/PickupExpOrbMagic'
import PickupExpOrbMelee        from './pickups/PickupExpOrbMelee'
import PickupExpOrbWeaponry     from './pickups/PickupExpOrbWeaponry'
import PickupFabric             from './pickups/PickupFabric'
import PickupFeathers           from './pickups/PickupFeathers'
import PickupFireGem            from './pickups/PickupFireGem'
import PickupFireStaff          from './pickups/PickupFireStaff'
import PickupFurnace            from './pickups/PickupFurnace'
import PickupGenerator          from './pickups/PickupGenerator'
import PickupGreenKey           from './pickups/PickupGreenKey'
import PickupHealthPotion       from './pickups/PickupHealthPotion'
import PickupIronArmour         from './pickups/PickupIronArmour'
import PickupIronArrows         from './pickups/PickupIronArrows'
import PickupIronBar            from './pickups/PickupIronBar'
import PickupIronDagger         from './pickups/PickupIronDagger'
import PickupIronHammer         from './pickups/PickupIronHammer'
import PickupIronHatchet        from './pickups/PickupIronHatchet'
import PickupIronOre            from './pickups/PickupIronOre'
import PickupIronPickaxe        from './pickups/PickupIronPickaxe'
import PickupIronSheet          from './pickups/PickupIronSheet'
import PickupIronSword          from './pickups/PickupIronSword'
import PickupMageRobe           from './pickups/PickupMageRobe'
import PickupNecromancerRobe    from './pickups/PickupNecromancerRobe'
import PickupNinjaGarb          from './pickups/PickupNinjaGarb'
import PickupNoctisArmour       from './pickups/PickupNoctisArmour'
import PickupOakBow             from './pickups/PickupOakBow'
import PickupOakLogs            from './pickups/PickupOakLogs'
import PickupPlainRobe          from './pickups/PickupPlainRobe'
import PickupRedKey             from './pickups/PickupRedKey'
import PickupShuriken           from './pickups/PickupShuriken'
import PickupString             from './pickups/PickupString'
import PickupSuperFireStaff     from './pickups/PickupSuperFireStaff'
import PickupVampireFang        from './pickups/PickupVampireFang'
import PickupWindStaff          from './pickups/PickupWindStaff'
import PickupWoodDoor           from './pickups/PickupWoodDoor'
import PickupWoodWall           from './pickups/PickupWoodWall'
import PickupWorkbench          from './pickups/PickupWorkbench'
import PickupYellowKey          from './pickups/PickupYellowKey'

import ProjBloodBolt            from './projectiles/ProjBloodBolt'
import ProjDeathbind            from './projectiles/ProjDeathbind'
import ProjFire                 from './projectiles/ProjFire'
import ProjIronArrow            from './projectiles/ProjIronArrow'
import ProjIronDagger           from './projectiles/ProjIronDagger'
import ProjIronHammer           from './projectiles/ProjIronHammer'
import ProjIronSword            from './projectiles/ProjIronSword'
import ProjPacify               from './projectiles/ProjPacify'
import ProjShuriken             from './projectiles/ProjShuriken'
import ProjSnowball             from './projectiles/ProjSnowball'
import ProjSuperFire            from './projectiles/ProjSuperFire'
import ProjVampireFang          from './projectiles/ProjVampireFang'
import ProjWind                 from './projectiles/ProjWind'

const EntitiesList = {

    Player:                 Player,
    Bandit:                 Bandit,
    BanditLeader:           BanditLeader,
    Bat:                    Bat,
    BloodLord:              BloodLord,
    BloodPriest:            BloodPriest,
    Citizen:                Citizen,
    CryptWarden:            CryptWarden,
    Innkeeper:              Innkeeper,
    Knight:                 Knight,
    MagicMerchant:          MagicMerchant,
    MeleeMerchant:          MeleeMerchant,
    Mummy:                  Mummy,
    OmniMerchant:           OmniMerchant,
    Pharaoh:                Pharaoh,
    Prisoner:               Prisoner,
    RangedMerchant:         RangedMerchant,
    Rat:                    Rat,
    Ruler:                  Ruler,
    Snoovir:                Snoovir,
    ToolMerchant:           ToolMerchant,
    TutorialMerchant:       TutorialMerchant,
    Vampire:                Vampire,
    Warrior:                Warrior,
    ZombieHuman:            ZombieHuman,

    CorpseHuman:            CorpseHuman,

    //Anvil:                  Anvil,
    //BankChest:              BankChest,
    //Charter:                Charter,
    //WoodWall:               WoodWall,
    //Furnace:                Furnace,
    //Generator:              Generator,
    //Workbench:              Workbench,
    //CottonPlant:            CottonPlant,
    //DungiumOre:             DungiumOre,
    //IronOre:                IronOre,
    //OakTree:                OakTree,
    //WoodDoor:               WoodDoor,
    //WoodDoorLockedBlue:     WoodDoorLockedBlue,
    //WoodDoorLockedGreen:    WoodDoorLockedGreen,
    //WoodDoorLockedRed:      WoodDoorLockedRed,
    //WoodDoorLockedYellow:   WoodDoorLockedYellow,
    //SmallIronCandle:        SmallIronCandle,

    PickupAnvil:            PickupAnvil,
    PickupBankChest:        PickupBankChest,
    PickupBlueKey:          PickupBlueKey,
    PickupBookOfLight:      PickupBookOfLight,
    PickupBookOfSouls:      PickupBookOfSouls,
    PickupCharter:          PickupCharter,
    PickupCloak:            PickupCloak,
    PickupCotton:           PickupCotton,
    PickupDungiumArmour:    PickupDungiumArmour,
    PickupExpOrbArmoury:    PickupExpOrbArmoury,
    PickupExpOrbGathering:  PickupExpOrbGathering,
    PickupExpOrbMagic:      PickupExpOrbMagic,
    PickupExpOrbMelee:      PickupExpOrbMelee,
    PickupExpOrbWeaponry:   PickupExpOrbWeaponry,
    PickupFabric:           PickupFabric,
    PickupFeathers:         PickupFeathers,
    PickupFireGem:          PickupFireGem,
    PickupFireStaff:        PickupFireStaff,
    PickupFurnace:          PickupFurnace,
    PickupGenerator:        PickupGenerator,
    PickupDungiumBar:       PickupDungiumBar,
    PickupDungiumOre:       PickupDungiumOre,
    PickupGreenKey:         PickupGreenKey,
    PickupIronArmour:       PickupIronArmour,
    PickupIronArrows:       PickupIronArrows,
    PickupIronBar:          PickupIronBar,
    PickupIronDagger:       PickupIronDagger,
    PickupIronHammer:       PickupIronHammer,
    PickupIronHatchet:      PickupIronHatchet,
    PickupIronOre:          PickupIronOre,
    PickupIronPickaxe:      PickupIronPickaxe,
    PickupIronSheet:        PickupIronSheet,
    PickupIronSword:        PickupIronSword,
    PickupMageRobe:         PickupMageRobe,
    PickupNecromancerRobe:  PickupNecromancerRobe,
    PickupNinjaGarb:        PickupNinjaGarb,
    PickupNoctisArmour:     PickupNoctisArmour,
    PickupOakBow:           PickupOakBow,
    PickupOakLogs:          PickupOakLogs,
    PickupPlainRobe:        PickupPlainRobe,
    PickupRedKey:           PickupRedKey,
    PickupShuriken:         PickupShuriken,
    PickupString:           PickupString,
    PickupSuperFireStaff:   PickupSuperFireStaff,
    PickupVampireFang:      PickupVampireFang,
    PickupWindStaff:        PickupWindStaff,
    PickupWoodDoor:         PickupWoodDoor,
    PickupWoodWall:         PickupWoodWall,
    PickupWorkbench:        PickupWorkbench,
    PickupYellowKey:        PickupYellowKey,

    ProjBloodBolt:          ProjBloodBolt,
    ProjDeathbind:          ProjDeathbind,
    ProjFire:               ProjFire,
    ProjIronArrow:          ProjIronArrow,
    ProjIronDagger:         ProjIronDagger,
    ProjIronHammer:         ProjIronHammer,
    ProjIronSword:          ProjIronSword,
    ProjPacify:             ProjPacify,
    ProjShuriken:           ProjShuriken,
    ProjSnowball:           ProjSnowball,
    ProjSuperFire:          ProjSuperFire,
    ProjVampireFang:        ProjVampireFang,
    ProjWind:               ProjWind,

};

export default EntitiesList;