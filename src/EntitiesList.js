
Phaser.Sprite.prototype.tweenPickupFromCenter = function () {
    this.anchor.setTo(0.5);
    this.x += dungeonz.TILE_SIZE * (GAME_SCALE / 2);
    this.y += dungeonz.TILE_SIZE * (GAME_SCALE / 2);
    _this.add.tween(this.scale).to({x: GAME_SCALE * 0.8, y: GAME_SCALE * 0.8}, 1000, "Linear", true, 0, -1, true);
};

import Player               from './entities/characters/Player'
import Bandit               from './entities/characters/Bandit'
import BanditLeader         from './entities/characters/BanditLeader'
import GoldOre              from './entities/GoldOre'
import Tree                 from './entities/Tree'
import WoodDoor             from './entities/WoodDoor'
import SmallIronCandle      from './entities/SmallIronCandle'
import Exit                 from './entities/Exit'
import DungeonPortal        from './entities/DungeonPortal'
import OverworldPortal      from './entities/OverworldPortal'
import PickupIronHatchet    from './entities/pickups/PickupIronHatchet'
import PickupIronPickaxe    from './entities/pickups/PickupIronPickaxe'
import PickupIronSword      from './entities/pickups/PickupIronSword'
import PickupWindStaff      from './entities/pickups/PickupWindStaff'
import PickupWood           from './entities/pickups/PickupWood'
import PickupGold           from './entities/pickups/PickupGold'
import ProjIronSword        from './entities/projectiles/ProjIronSword'
import ProjWind             from './entities/projectiles/ProjWind'

const EntitiesList = {

    Player:             Player,
    Bandit:             Bandit,
    BanditLeader:       BanditLeader,
    GoldOre:            GoldOre,
    Tree:               Tree,
    WoodDoor:           WoodDoor,
    SmallIronCandle:    SmallIronCandle,
    PickupIronHatchet:  PickupIronHatchet,
    PickupIronPickaxe:  PickupIronPickaxe,
    PickupIronSword:    PickupIronSword,
    PickupWindStaff:    PickupWindStaff,
    PickupWood:         PickupWood,
    PickupGold:         PickupGold,
    ProjIronSword:      ProjIronSword,
    ProjWind:           ProjWind,
    Exit:               Exit,
    DungeonPortal:      DungeonPortal,
    OverworldPortal:    OverworldPortal

};

export default EntitiesList;