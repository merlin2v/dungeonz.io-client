
class Static {
    /**
     * A static tile entity. Used to give a logical form to static map tiles, even though they don't have their own sprites.
     * Everything this class needs is retrieved from the loaded map data.
     * @param {Number} row
     * @param {Number} col
     * @param {Number} tileID
     * @param {*} [data]
     */
    constructor (row, col, tileID, data) {
        this.id = row + "-" + col;
        this.row = row;
        this.col = col;
        /** @type {Boolean} Is this static in an active state. Only applies to interactables. */
        this.activeState = true;
        /** @type {Boolean} Is this static in a broken state. Only applies to breakables. */
        this.brokenState = false;
        // Holder for the light distance property. Tilemap.updateDarknessGrid passes it in as a property of a sprite...
        this.sprite = {};
        /** @type {Number} Does this static emit light. 0 = disabled */
        this.sprite.lightDistance = 0;
        /** @type {Number} The frame on the statics tileset to use for drawing to the bitmap data. */
        this.tileID = tileID;
        /** @type {Number} The frame on the statics tileset to use for drawing to the bitmap data when this static is inactive. */
        this.inactiveFrame = 0;

        if(TileIDInactiveFrames[tileID] === undefined){
            this.inactiveFrame = TileIDInactiveFrames["0"];
        }
        else {
            this.inactiveFrame = TileIDInactiveFrames[tileID];
        }

        // Add this static to the statics list.
        if(_this.statics[this.id] === undefined){
            _this.statics[this.id] = this;
        }
        else {
            console.log("* WARNING: Attempting to add static tile, but ID already taken in statics list:", this.id);
        }

    }

    destroy () {
        delete _this.statics[this.id];

        if(_this.lightSources[this.id] !== undefined){
            delete _this.lightSources[this.id];
            _this.tilemap.updateDarknessGrid();
        }
    }

    interactedByPlayer () {}

}

class Portal extends Static {
    constructor (row, col, tileID, data) {
        super(row, col, tileID, data);
        this.sprite.lightDistance = 6;
    }
}

class DungeonPortal extends Portal {
    constructor (row, col, tileID, data) {
        super(row, col, tileID, data);
        this.dungeonID = data;
    }
    interactedByPlayer () {
        _this.adjacentDungeonID = this.dungeonID;
        _this.GUI.dungeonPanel.show();
    }
}

class Torch extends Static {
    constructor (row, col, tileID, data) {
        super(row, col, tileID, data);
        this.sprite.lightDistance = 6;
    }
}

class CraftingStation extends Static {
    constructor (row, col, tileID, data) {
        super(row, col, tileID, data);

        this.stationTypeNumber = data;
    }

    interactedByPlayer () {}
}

class Anvil extends CraftingStation {
    interactedByPlayer () {
        _this.GUI.craftingPanel.show(dungeonz.getTextDef("Anvil"), 'assets/img/gui/panels/anvil.png');
        _this.craftingManager.stationTypeNumber = this.stationTypeNumber;
    }
}

class Furnace extends CraftingStation {
    interactedByPlayer () {
        _this.GUI.craftingPanel.show(dungeonz.getTextDef("Furnace"), 'assets/img/gui/panels/furnace.png');
        _this.craftingManager.stationTypeNumber = this.stationTypeNumber;
    }
}

class Workbench extends CraftingStation {
    interactedByPlayer () {
        _this.GUI.craftingPanel.show(dungeonz.getTextDef("Workbench"), 'assets/img/gui/panels/workbench.png');
        _this.craftingManager.stationTypeNumber = this.stationTypeNumber;
    }
}

class BankChest extends Static {
    interactedByPlayer () {
        _this.GUI.bankPanel.show();
    }
}


/** @type {Object} The frames to use for each interactable type when it is inactive. */
const TileIDInactiveFrames = {
    0: 0, // The empty frame.
    11: 40
};

/** @type {number} The frame to show when a static is broken. Pile of rubble. */
const brokenFrame = 144;

const StaticClasses = {
    147: DungeonPortal, // Dungeon portal (active)
    211: Portal,    // Overworld portal (active)
    // Light wall torches.
    2183: Torch,
    2184: Torch,
    2185: Torch,
    2186: Torch,
    2187: Torch,
    2188: Torch,

    3022: Anvil,
    3023: Furnace,
    3024: Workbench,
    //3025: PotionryLab,
    //3026: StorageBox,
    3027: BankChest,
};

/**
 * Add a static tile instance to the statics list.
 * @param {Number} row
 * @param {Number} col
 * @param {Number} tileData
 */
function addStaticTile (row, col, tileData) {
    // If there is no specific class to use for this static tile, use the generic one.
    if(StaticClasses[tileData[0]] === undefined){
        return new Static(row, col, tileData[0], tileData[1]);
    }
    // Use the specific class.
    else {
        const staticTile = new StaticClasses[tileData[0]](row, col, tileData[0], tileData[1]);
        // If this static type emits light, add it to the light sources list.
        if(staticTile.sprite.lightDistance > 0){
            _this.lightSources[staticTile.id] = staticTile;
            _this.tilemap.updateDarknessGrid();
        }

        return staticTile;
    }
}

export default addStaticTile;