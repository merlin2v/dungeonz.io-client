
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
import Anvil                from './entities/interactables/Anvil'
import BankChest            from './entities/interactables/BankChest'
import GoldExchangeTerminal from './entities/interactables/GoldExchangeTerminal'
import Furnace              from './entities/interactables/Furnace'
import GoldOre              from './entities/interactables/GoldOre'
import Tree                 from './entities/interactables/Tree'
import WoodDoor             from './entities/interactables/WoodDoor'
import SmallIronCandle      from './entities/interactables/SmallIronCandle'
import Exit                 from './entities/interactables/Exit'
import DungeonPortal        from './entities/interactables/DungeonPortal'
import OverworldPortal      from './entities/interactables/OverworldPortal'
import PickupCloak          from './entities/pickups/PickupCloak'
import PickupCoinPile       from './entities/pickups/PickupCoinPile'
import PickupMageRobe       from './entities/pickups/PickupMageRobe'
import PickupIronHatchet    from './entities/pickups/PickupIronHatchet'
import PickupIronPickaxe    from './entities/pickups/PickupIronPickaxe'
import PickupIronDagger     from './entities/pickups/PickupIronDagger'
import PickupIronSword      from './entities/pickups/PickupIronSword'
import PickupFireStaff      from './entities/pickups/PickupFireStaff'
import PickupWindStaff      from './entities/pickups/PickupWindStaff'
import PickupWood           from './entities/pickups/PickupWood'
import PickupGoldOre        from './entities/pickups/PickupGoldOre'
import PickupGoldBar        from './entities/pickups/PickupGoldBar'
import ProjIronDagger       from './entities/projectiles/ProjIronDagger'
import ProjIronSword        from './entities/projectiles/ProjIronSword'
import ProjFire             from './entities/projectiles/ProjFire'
import ProjWind             from './entities/projectiles/ProjWind'

const EntitiesList = {

    Player:                 Player,
    Citizen:                Citizen,
    Bandit:                 Bandit,
    BanditLeader:           BanditLeader,
    Anvil:                  Anvil,
    BankChest:              BankChest,
    GoldExchangeTerminal:   GoldExchangeTerminal,
    Furnace:                Furnace,
    GoldOre:                GoldOre,
    Tree:                   Tree,
    WoodDoor:               WoodDoor,
    SmallIronCandle:        SmallIronCandle,
    PickupCloak:            PickupCloak,
    PickupCoinPile:         PickupCoinPile,
    PickupMageRobe:         PickupMageRobe,
    PickupIronHatchet:      PickupIronHatchet,
    PickupIronPickaxe:      PickupIronPickaxe,
    PickupIronDagger:       PickupIronDagger,
    PickupIronSword:        PickupIronSword,
    PickupFireStaff:        PickupFireStaff,
    PickupWindStaff:        PickupWindStaff,
    PickupWood:             PickupWood,
    PickupGoldOre:          PickupGoldOre,
    PickupGoldBar:          PickupGoldBar,
    ProjIronDagger:         ProjIronDagger,
    ProjIronSword:          ProjIronSword,
    ProjFire:               ProjFire,
    ProjWind:               ProjWind,
    Exit:                   Exit,
    DungeonPortal:          DungeonPortal,
    OverworldPortal:        OverworldPortal

};

export default EntitiesList;