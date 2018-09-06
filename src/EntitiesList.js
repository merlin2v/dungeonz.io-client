
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
import PickupWood           from './entities/pickups/PickupWood'
import PickupGold           from './entities/pickups/PickupGold'
import ProjIronSword        from './entities/projectiles/ProjIronSword'

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
    PickupWood:         PickupWood,
    PickupGold:         PickupGold,
    ProjIronSword:      ProjIronSword,
    Exit:               Exit,
    DungeonPortal:      DungeonPortal,
    OverworldPortal:    OverworldPortal

};

export default EntitiesList;