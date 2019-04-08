
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
        //this.activeState = true;
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
            //console.log("* WARNING: Attempting to add static tile, but ID already taken in statics list:", this.id);
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

/**
 * A list of the GUI triggers by triger name. Multiple GUI trigger entities can have the same name, to group them.
 * @type {{}}
 */
const GUITriggers = {};

class GUITrigger extends Static {
    constructor (row, col, tileID, data) {
        super(row, col, tileID, data);

        this.triggerName = data.name;
        this.panelNameTextDefID = data.panelNameTextDefID;
        this.contentTextDefID = data.contentTextDefID;
        this.contentFileName = data.contentFileName;
        this.panel = _this.GUI[data.panelName];
        // Don't show the yellow square.
        this.tileID = 0;

        if(this.panel === undefined){
            console.log("WARNING: Trigger cannot open invalid GUI panel:", data.panelName);
        }

        if(GUITriggers[this.triggerName] === undefined){
            GUITriggers[this.triggerName] = {};
        }

        GUITriggers[this.triggerName][this.id] = this;
    }

    static removeTriggerGroup (triggerName) {
        const triggerGroup = GUITriggers[triggerName];
        // Remove all of the other triggers in this group.
        for(let triggerKey in triggerGroup){
            if(triggerGroup.hasOwnProperty(triggerKey) === false) continue;
            triggerGroup[triggerKey].destroy();
        }
        // Remove the group.
        delete GUITriggers[triggerName];
    }

    destroy () {
        delete GUITriggers[this.triggerName][this.id];

        super.destroy();
    }

    interactedByPlayer () {
        // Check the panel is valid. Might have been given the wrong panel name.
        if(this.panel !== undefined){
            // Show the GUI panel this trigger opens.
            this.panel.show(this.panelNameTextDefID, this.contentTextDefID, this.contentFileName);
        }

        // Remove this trigger and the group it is in.
        GUITrigger.removeTriggerGroup(this.triggerName);
    }
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
        this.sprite.lightDistance = 4;
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
        this.sprite.lightDistance = 4;
    }
}

class Laboratory extends CraftingStation {
    interactedByPlayer () {
        _this.GUI.craftingPanel.show(dungeonz.getTextDef("Laboratory"), 'assets/img/gui/panels/laboratory.png');
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

/** @type {number} The frame to show when a static is broken. Pile of rubble. */
const brokenFrame = 144;

/** @type {Object} The frames to use for each interactable type when it is inactive. */
const TileIDInactiveFrames = {
    0: 5,       // The empty frame.
    11: 40,

    147: 148,   // Dungeon portal
    211: 212,   // Overworld portal

    1235: 1236, // Oak tree
    1299: 1300, // Spruce tree
    1363: 1364, // Fir tree
    1427: 1428, // Mangrove tree
    1491: 1492, // Egaso tree
    1555: 1556, // Palm tree
    1237: 1238, // Cotton
    1301: 1302, // Cactus
    1365: 1366, // Red mushroom
    1429: 1430, // Green mushroom
    1493: 1494, // Blue mushroom
    1241: 1242, // Clay ore
    1305: 1242, // Iron ore
    1369: 1242, // Dungium ore
    1433: 1242, // Noctis ore

    2324: 2325, // Counter flap

    2767: 2766, // Wood door
    2768: 2766, // Wood door padlocked
    2769: 2766, // Wood door locked red
    2770: 2766, // Wood door locked green
    2771: 2766, // Wood door locked blue
    2772: 2766, // Wood door locked yellow
    2831: 2830, // Metal door
    2832: 2830, // Metal door padlocked
    2833: 2830, // Metal door locked red
    2834: 2830, // Metal door locked green
    2835: 2830, // Metal door locked blue
    2836: 2830, // Metal door locked yellow
};

const StaticClasses = {
    86: GUITrigger,
    147: DungeonPortal, // Dungeon portal (active)
    211: Portal,    // Overworld portal (active)
    // Light wall torches
    2183: Torch,
    2184: Torch,
    2185: Torch,
    2186: Torch,
    2187: Torch,
    2188: Torch,
    2247: Torch,
    2248: Torch,
    2250: Torch,
    2251: Torch,
    2252: Torch,
    2311: Torch,
    2313: Torch,
    2315: Torch,
    // Dark wall torches
    2375: Torch,
    2376: Torch,
    2377: Torch,
    2378: Torch,
    2379: Torch,
    2380: Torch,
    2439: Torch,
    2440: Torch,
    2442: Torch,
    2443: Torch,
    2444: Torch,
    2503: Torch,
    2505: Torch,
    2507: Torch,
    // Sand wall torches
    2567: Torch,
    2568: Torch,
    2569: Torch,
    2570: Torch,
    2571: Torch,
    2572: Torch,
    2631: Torch,
    2632: Torch,
    2634: Torch,
    2635: Torch,
    2636: Torch,
    2695: Torch,
    2697: Torch,
    2699: Torch,
    // Snow wall torches
    2759: Torch,
    2760: Torch,
    2761: Torch,
    2762: Torch,
    2763: Torch,
    2764: Torch,
    2823: Torch,
    2824: Torch,
    2826: Torch,
    2827: Torch,
    2828: Torch,
    2887: Torch,
    2889: Torch,
    2891: Torch,
    // Light wood torches
    2951: Torch,
    2952: Torch,
    2953: Torch,
    2954: Torch,
    2955: Torch,
    2956: Torch,
    3015: Torch,
    3016: Torch,
    3019: Torch,
    3079: Torch,
    3081: Torch,
    // Medium wood torches
    3143: Torch,
    3144: Torch,
    3145: Torch,
    3146: Torch,
    3147: Torch,
    3148: Torch,
    3207: Torch,
    3208: Torch,
    3211: Torch,
    3271: Torch,
    3273: Torch,
    // Dark wood torches
    3335: Torch,
    3336: Torch,
    3337: Torch,
    3338: Torch,
    3339: Torch,
    3340: Torch,
    3399: Torch,
    3400: Torch,
    3403: Torch,
    3463: Torch,
    3465: Torch,


    3022: Anvil,
    3023: Furnace,
    3024: Workbench,
    3025: Laboratory,
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