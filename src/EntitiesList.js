
Phaser.Sprite.prototype.tweenPickupFromCenter = function () {
    this.anchor.setTo(0.5);
    this.x += dungeonz.TILE_SIZE * (GAME_SCALE / 2);
    this.y += dungeonz.TILE_SIZE * (GAME_SCALE / 2);
    _this.add.tween(this.scale).to({x: GAME_SCALE * 0.8, y: GAME_SCALE * 0.8}, 1000, "Linear", true, 0, -1, true);
};

Phaser.Sprite.prototype.humanBaseFrames = {
    u: 'human-up-1',
    d: 'human-down-1',
    l: 'human-left-1',
    r: 'human-right-1'
};

import Player               from './entities/characters/Player'
import Citizen              from './entities/characters/Citizen'
import Bandit               from './entities/characters/Bandit'
import BanditLeader         from './entities/characters/BanditLeader'
import GoldOre              from './entities/GoldOre'
import Tree                 from './entities/Tree'
import WoodDoor             from './entities/WoodDoor'
import SmallIronCandle      from './entities/SmallIronCandle'
import Exit                 from './entities/Exit'
import DungeonPortal        from './entities/DungeonPortal'
import OverworldPortal      from './entities/OverworldPortal'
import PickupCloak          from './entities/pickups/PickupCloak'
import PickupMageRobe       from './entities/pickups/PickupMageRobe'
import PickupIronHatchet    from './entities/pickups/PickupIronHatchet'
import PickupIronPickaxe    from './entities/pickups/PickupIronPickaxe'
import PickupIronDagger     from './entities/pickups/PickupIronDagger'
import PickupIronSword      from './entities/pickups/PickupIronSword'
import PickupFireStaff      from './entities/pickups/PickupFireStaff'
import PickupWindStaff      from './entities/pickups/PickupWindStaff'
import PickupWood           from './entities/pickups/PickupWood'
import PickupGold           from './entities/pickups/PickupGold'
import ProjIronDagger       from './entities/projectiles/ProjIronDagger'
import ProjIronSword        from './entities/projectiles/ProjIronSword'
import ProjFire             from './entities/projectiles/ProjFire'
import ProjWind             from './entities/projectiles/ProjWind'

const EntitiesList = {

    Player:             Player,
    Citizen:            Citizen,
    Bandit:             Bandit,
    BanditLeader:       BanditLeader,
    GoldOre:            GoldOre,
    Tree:               Tree,
    WoodDoor:           WoodDoor,
    SmallIronCandle:    SmallIronCandle,
    PickupCloak:        PickupCloak,
    PickupMageRobe:     PickupMageRobe,
    PickupIronHatchet:  PickupIronHatchet,
    PickupIronPickaxe:  PickupIronPickaxe,
    PickupIronDagger:   PickupIronDagger,
    PickupIronSword:    PickupIronSword,
    PickupFireStaff:    PickupFireStaff,
    PickupWindStaff:    PickupWindStaff,
    PickupWood:         PickupWood,
    PickupGold:         PickupGold,
    ProjIronDagger:     ProjIronDagger,
    ProjIronSword:      ProjIronSword,
    ProjFire:           ProjFire,
    ProjWind:           ProjWind,
    Exit:               Exit,
    DungeonPortal:      DungeonPortal,
    OverworldPortal:    OverworldPortal

};

export default EntitiesList;