
Phaser.Sprite.prototype.tweenPickupFromCenter = function () {
    this.anchor.setTo(0.5);
    this.x += dungeonz.CENTER_OFFSET;
    this.y += dungeonz.CENTER_OFFSET;
    _this.add.tween(this.scale).to({x: this.scale.x * 0.8, y: this.scale.y * 0.8}, 1000, "Linear", true, 0, -1, true);
};

Phaser.Sprite.prototype.onChangeDirection = function () {
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
import Furnace                  from './interactables/Furnace'
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
    Furnace:                Furnace,
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