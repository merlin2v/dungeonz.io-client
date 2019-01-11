
Phaser.Sprite.prototype.tweenPickupFromCenter = function () {
    this.anchor.setTo(0.5);
    this.x += dungeonz.TILE_SIZE * (GAME_SCALE / 2);
    this.y += dungeonz.TILE_SIZE * (GAME_SCALE / 2);
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
import ZombieHuman              from './characters/ZombieHuman'

import CorpseHuman              from './corpses/CorpseHuman'

import Anvil                    from './interactables/Anvil'
import BankChest                from './interactables/BankChest'
import Furnace                  from './interactables/Furnace'
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
import PickupIronArmour         from './pickups/PickupIronArmour'
import PickupIronArrows         from './pickups/PickupIronArrows'
import PickupIronHatchet        from './pickups/PickupIronHatchet'
import PickupIronPickaxe        from './pickups/PickupIronPickaxe'
import PickupIronDagger         from './pickups/PickupIronDagger'
import PickupIronSword          from './pickups/PickupIronSword'
import PickupIronHammer         from './pickups/PickupIronHammer'
import PickupFeathers           from './pickups/PickupFeathers'
import PickupFireGem            from './pickups/PickupFireGem'
import PickupFireStaff          from './pickups/PickupFireStaff'
import PickupSuperFireStaff     from './pickups/PickupSuperFireStaff'
import PickupScrollOfHealing    from './pickups/PickupScrollOfHealing'
import PickupWindStaff          from './pickups/PickupWindStaff'
import PickupWood               from './pickups/PickupWood'
import PickupWoodPlank          from './pickups/PickupWoodPlank'
import PickupGoldOre            from './pickups/PickupGoldOre'
import PickupGoldBar            from './pickups/PickupGoldBar'
import PickupIronOre            from './pickups/PickupIronOre'
import PickupIronBar            from './pickups/PickupIronBar'

import ProjDeathbind            from './projectiles/ProjDeathbind'
import ProjIronDagger           from './projectiles/ProjIronDagger'
import ProjIronSword            from './projectiles/ProjIronSword'
import ProjIronHammer           from './projectiles/ProjIronHammer'
import ProjPacify               from './projectiles/ProjPacify'
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
    ZombieHuman:            ZombieHuman,

    CorpseHuman:            CorpseHuman,

    Anvil:                  Anvil,
    BankChest:              BankChest,
    Furnace:                Furnace,
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
    PickupIronArmour:       PickupIronArmour,
    PickupIronHatchet:      PickupIronHatchet,
    PickupIronArrows:       PickupIronArrows,
    PickupIronPickaxe:      PickupIronPickaxe,
    PickupIronDagger:       PickupIronDagger,
    PickupIronSword:        PickupIronSword,
    PickupIronHammer:       PickupIronHammer,
    PickupFeathers:         PickupFeathers,
    PickupFireGem:          PickupFireGem,
    PickupFireStaff:        PickupFireStaff,
    PickupSuperFireStaff:   PickupSuperFireStaff,
    PickupScrollOfHealing:  PickupScrollOfHealing,
    PickupWindStaff:        PickupWindStaff,
    PickupWood:             PickupWood,
    PickupWoodPlank:        PickupWoodPlank,
    PickupGoldOre:          PickupGoldOre,
    PickupGoldBar:          PickupGoldBar,
    PickupIronOre:          PickupIronOre,
    PickupIronBar:          PickupIronBar,

    ProjDeathbind:          ProjDeathbind,
    ProjIronDagger:         ProjIronDagger,
    ProjIronSword:          ProjIronSword,
    ProjIronHammer:         ProjIronHammer,
    ProjPacify:             ProjPacify,
    ProjFire:               ProjFire,
    ProjSuperFire:          ProjSuperFire,
    ProjWind:               ProjWind,

    Exit:                   Exit,
    DungeonPortal:          DungeonPortal,
    OverworldPortal:        OverworldPortal

};

export default EntitiesList;