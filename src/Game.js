import EntityTypes from '../src/catalogues/EntityTypes'
import EntityList from './entities/EntitiesList';
import Tilemap from './Tilemap'
import GUI from './gui/GUI'
import Stats from './Stats'
import Inventory from './Inventory'
import CraftingManager from "./CraftingManager";
import BankManager from "./BankManager";
import ClanManager from "./ClanManager";

dungeonz.EntityTypes = EntityTypes;
dungeonz.EntityList = EntityList;

dungeonz.Game = function () {

};

dungeonz.Game.prototype = {

    init: function (data) {
        console.log("* In game init:", data);

        /**
         * The name of the board the player is on. This has nothing to do with a dungeon instance that this board might be for.
         * @type {String}
         */
        this.currentBoardName = data.boardName;

        this.boardAlwaysNight = data.boardAlwaysNight;

        /**
         * The ID number of the dungeon that this player is standing next to the entrance of. Each dungeon instance has a unique id, as well as a separate unique name.
         * @type {Number}
         */
        this.adjacentDungeonID = null;

        this.player = {
            continueCode: data.continueCode,
            entityId: data.player.id,
            row: data.player.row,
            col: data.player.col,
            displayName: data.player.displayName,
            maxHitPoints: data.player.maxHitPoints,
            maxEnergy: data.player.maxEnergy,
            defence: data.player.defence,
            hitPoints: data.player.maxHitPoints,
            energy: data.player.maxEnergy,
            glory: data.player.glory,
            respawns: data.player.respawns,
            inventory: new Inventory(data.inventory),
            bankManager: new BankManager(data.bankItems),
            stats: new Stats(data.player.stats),
            tasks: data.player.tasks,
            holdingItem: false
        };

        dungeonz.DMPActivated = data.player.dmpActivated || false;

        this.dynamicsData = data.dynamicsData;

        this.dayPhase = data.dayPhase;

        this.DayPhases = {
            Dawn: 1,
            Day: 2,
            Dusk: 3,
            Night: 4
        };

        //console.log("nearby dynamics: data", this.dynamicsData);

    },

    preload: function () {

    },

    create: function () {

        console.log("* In game create");

        window._this = this;

        // Hide the distracting background gif while the game is running.
        document.getElementById('background_img').style.visibility = "hidden";

        this.canvasContainer = document.getElementById("game_canvas");
        this.canvasContainer.appendChild(this.game.canvas);

        this.scale.fullScreenTarget = document.getElementById("game_cont");

        window.addEventListener('resize', window.windowResize);

        this.moveDelay = 250;
        this.nextMoveTime = 0;

        this.playerTween = null;
        this.playerTweenDirections = {
            u: false,
            d: false,
            l: false,
            r: false
        };

        this.statics = {};
        this.dynamics = {};
        this.lightSources = {};

        this.clanManager = new ClanManager();
        this.GUI = new GUI(this);
        this.craftingManager = new CraftingManager();
        this.tilemap = new Tilemap(this);
        this.tilemap.loadMap(this.currentBoardName);

        this.dynamicsGroup = this.add.group();
        this.pseudoInteractables = {};

        // Make sure the inventory slots are showing the right items.
        for(let slotKey in _this.player.inventory){
            if(_this.player.inventory.hasOwnProperty(slotKey) === false) continue;
            _this.player.inventory.swapInventorySlots(slotKey, slotKey);
        }

        // Load the bank items.
        const items = _this.player.bankManager.items;
        // Make sure the bank slots are showing the right items.
        for(let slotIndex=0, len=items.length; slotIndex<len; slotIndex+=1){
            // Skip empty items slots.
            if(items[slotIndex].catalogueEntry === null) continue;
            _this.player.bankManager.addItemToContents(slotIndex, items[slotIndex].catalogueEntry, items[slotIndex].durability, items[slotIndex].maxDurability);
        }
        // Hide the panel, as if any of the slots were filled with existing items, they will be shown.
        _this.GUI.bankPanel.hide();

        // Hide the shop panel, all of the slots are reset and empty ones won't be visible when first opened.
        _this.GUI.shopPanel.hide();

        // Load the tasks.
        const tasks = _this.player.tasks;
        for(let taskID in tasks){
            if(tasks.hasOwnProperty(taskID) === false) continue;
            _this.GUI.tasksPanel.addTask(taskID, tasks[taskID]);
        }
        // Make sure the item icons are hidden. They aren't after being added at first.
        _this.GUI.tasksPanel.hide();

        // Update the starting value for the next level exp requirement, for the default shown stat info.
        _this.GUI.statsPanel.changeStatInfo(_this.player.stats.list.Melee);

        // Add the entities that are visible on start.
        for(let i=0; i<this.dynamicsData.length; i+=1){
            this.addEntity(this.dynamicsData[i]);
        }

        //this.game.world.bringToTop(this.tilemap.darknessGridGroup);
        this.game.world.bringToTop(this.tilemap.bordersGroup);

        this.tilemap.updateDarknessGrid();

        this.moveUpIsDown = false;
        this.moveDownIsDown = false;
        this.moveLeftIsDown = false;
        this.moveRightIsDown = false;

        this.setupKeyboardControls();

        // Lock the camera to the player sprite.
        this.camera.follow(this.dynamics[this.player.entityId].sprite.baseSprite);

        window.addEventListener('mousedown', this.pointerDownHandler);
        window.addEventListener('mousemove', this.pointerMoveHandler);

        //console.log("dynamics: ", this.dynamics);*/

        // Add the websocket event responses after the game state is started.
        window.addGameStateEventResponses();

        window.startPreRoll();
    },

    update: function () {
        if(this.nextMoveTime < Date.now()){
            this.nextMoveTime = Date.now() + this.moveDelay;

            if(this.moveUpIsDown === true){
                this.checkPseudoInteractables('u');
                ws.sendEvent('mv_u');
            }
            if(this.moveDownIsDown === true){
                this.checkPseudoInteractables('d');
                ws.sendEvent('mv_d');
            }
            if(this.moveLeftIsDown === true){
                this.checkPseudoInteractables('l');
                ws.sendEvent('mv_l');
            }
            if(this.moveRightIsDown === true){
                this.checkPseudoInteractables('r');
                ws.sendEvent('mv_r');
            }

        }
    },

    render: function () {
        this.game.debug.text(this.game.time.fps, 10, this.game.height / 2, "#00ff00", '24px Courier');
    },

    shutdown: function () {
        // Show the background gif.
        document.getElementById('background_img').style.visibility = "visible";

        // Remove the handler for resize events, so it doesn't try to resize the sprite container groups that have been removed.
        window.removeEventListener('resize', window.windowResize);

        // Remove the handler for keyboard events, so it doesn't try to do gameplay stuff while on the landing screen.
        document.removeEventListener('keydown', this.keyDownHandler);

        window.removeEventListener('mousedown', this.pointerDownHandler);
        window.removeEventListener('mousemove', this.pointerMoveHandler);

        // Remove some of the DOM GUI elements so they aren't stacked when the game state starts again.
        this.GUI.removeExistingDOMElements(this.GUI.defenceCounters);
        this.GUI.removeExistingDOMElements(this.GUI.hitPointCounters);
        this.GUI.removeExistingDOMElements(this.GUI.energyCounters);

        for(let elemKey in this.GUI.inventoryBar.slots){
            this.GUI.inventoryBar.slots[elemKey].container.remove();
        }

        let contents = this.GUI.bankPanel.contents;
        while (contents.firstChild) {
            contents.removeChild(contents.firstChild);
        }

        contents = this.GUI.shopPanel.contents;
        while (contents.firstChild) {
            contents.removeChild(contents.firstChild);
        }

        this.GUI.gui.style.visibility = "hidden";
        this.GUI.settingsBar.hide();
        this.GUI.exitGamePanel.hide();

        // Hide all the panels.
        for(let i=0; i<this.GUI.panels.length; i+=1){
            this.GUI.panels[i].hide();
        }
    },

    move (direction) {
        // Hide all panels, in case they are just moving away from the item for it.
        if(this.GUI && this.GUI.isAnyPanelOpen === true){
            this.GUI.exitGamePanel.hide();
            // Hide all the panels.
            for(let i=0; i<this.GUI.panels.length; i+=1){
                this.GUI.panels[i].hide();
            }
        }

        this.checkPseudoInteractables(direction);

        if(this.player.hitPoints <= 0) return;
        ws.sendEvent('mv_' + direction);
        /*if(dungeonz.quickTurnEnabled === true){ // TODO allow to disable quick turn to make placing clan structures easier
            if(this.dynamics[this.player.entityId].sprite.direction !== direction){
                ws.sendEvent('mv_' + direction);
            }
        }*/
        this.nextMoveTime = Date.now() + this.moveDelay;
    },

    /**
     * Check any dynamics and statics that do anything when interacted with, such as opening a panel.
     * @param {String} direction
     */
    checkPseudoInteractables (direction) {
        // Check if any interactables that cause this client only to do something are about
        // to be walked into, such as showing the crafting panel for crafting stations.
        if(direction === 'u'){
            const playerNextRow = this.player.row - 1;
            const playerCol = this.player.col;
            let key,
                dynamic;
            for(key in this.pseudoInteractables){
                if(this.pseudoInteractables.hasOwnProperty(key) === false) continue;
                dynamic = this.pseudoInteractables[key];
                if(dynamic.row === playerNextRow){
                    if(dynamic.col === playerCol){
                        dynamic.sprite.interactedByPlayer();
                        return;
                    }
                }
            }
            const staticEntity = this.statics[playerNextRow + "-" + playerCol];
            // Check there is a static there.
            if(staticEntity !== undefined){
                staticEntity.interactedByPlayer();
            }
        }
        else if(direction === 'd'){
            const playerNextRow = this.player.row + 1;
            const playerCol = this.player.col;
            let key,
                dynamic;
            for(key in this.pseudoInteractables){
                if(this.pseudoInteractables.hasOwnProperty(key) === false) continue;
                dynamic = this.pseudoInteractables[key];
                if(dynamic.row === playerNextRow){
                    if(dynamic.col === playerCol){
                        dynamic.sprite.interactedByPlayer();
                        return;
                    }
                }
            }
            const staticEntity = this.statics[playerNextRow + "-" + playerCol];
            // Check there is a static there.
            if(staticEntity !== undefined){
                staticEntity.interactedByPlayer();
            }
        }
        else if(direction === 'l'){
            const playerNextCol = this.player.col - 1;
            const playerRow = this.player.row;
            let key,
                dynamic;
            for(key in this.pseudoInteractables){
                if(this.pseudoInteractables.hasOwnProperty(key) === false) continue;
                dynamic = this.pseudoInteractables[key];
                if(dynamic.row === playerRow){
                    if(dynamic.col === playerNextCol){
                        dynamic.sprite.interactedByPlayer();
                        return;
                    }
                }
            }
            const staticEntity = this.statics[playerRow + "-" + playerNextCol];
            // Check there is a static there.
            if(staticEntity !== undefined){
                staticEntity.interactedByPlayer();
            }
        }
        else {
            const playerNextCol = this.player.col + 1;
            const playerRow = this.player.row;
            let key,
                dynamic;
            for(key in this.pseudoInteractables){
                if(this.pseudoInteractables.hasOwnProperty(key) === false) continue;
                dynamic = this.pseudoInteractables[key];
                if(dynamic.row === playerRow){
                    if(dynamic.col === playerNextCol){
                        dynamic.sprite.interactedByPlayer();
                        return;
                    }
                }
            }
            const staticEntity = this.statics[playerRow + "-" + playerNextCol];
            // Check there is a static there.
            if(staticEntity !== undefined){
                staticEntity.interactedByPlayer();
            }
        }

    },

    distanceBetween (baseSprite, pointer) {
        return Math.abs(baseSprite.worldPosition.x - pointer.clientX) + Math.abs(baseSprite.worldPosition.y - pointer.clientY);
    },

    pointerDownHandler (event) {
        // Stop double clicking from highlighting text elements, and zooming in on mobile.
        //event.preventDefault();
        // Only use the selected item if the input wasn't over any other GUI element.
        if(event.target === _this.GUI.gui){

            // If the user pressed on their character sprite, pick up item.
            if(_this.distanceBetween(_this.dynamics[_this.player.entityId].sprite.baseSprite, event) < 32){
                ws.sendEvent('pick_up_item');
                return;
            }

            //console.log("in pointerdownhander");
            // Check if any of the dynamics were pressed on that have onInputDown handlers.
            for(let dynamicKey in _this.dynamics){
                //console.log("dyn key:", dynamicKey);
                if(_this.dynamics.hasOwnProperty(dynamicKey) === false) continue;
                //console.log("dyn is a property");
                if(_this.dynamics[dynamicKey].sprite.baseSprite === undefined) continue;
                //console.log("dyn has a basesprite");
                if(_this.dynamics[dynamicKey].sprite.onInputDown === undefined) continue;
                //console.log("dyn has a oninputdown");
                // Check the distance between the cursor and the sprite.
                if(_this.distanceBetween(_this.dynamics[dynamicKey].sprite.baseSprite, event) < 32){
                    _this.dynamics[dynamicKey].sprite.onInputDown();
                    return;
                }
            }

            // Don't try to use the held item if one isn't selected.
            if(_this.player.holdingItem === false) return;

            const midX = window.innerWidth / 2;
            const midY = window.innerHeight / 2;
            const targetX = event.clientX - midX;
            const targetY = event.clientY - midY;

            if(Math.abs(targetX) > Math.abs(targetY)){
                if(targetX > 0) _this.player.inventory.useHeldItem('r');
                else            _this.player.inventory.useHeldItem('l');
            }
            else {
                if(targetY > 0) _this.player.inventory.useHeldItem('d');
                else            _this.player.inventory.useHeldItem('u');
            }
        }

    },

    pointerMoveHandler (event) {
        let sprite;
        for(let dynamicKey in _this.dynamics){
            if(_this.dynamics.hasOwnProperty(dynamicKey) === false) continue;
            sprite = _this.dynamics[dynamicKey].sprite;
            if(sprite.baseSprite === undefined) continue;
            if(_this.distanceBetween(sprite.baseSprite, event) < 32){
                sprite.onInputOver();
            }
            else {
                sprite.onInputOut();
            }
        }
    },

    moveUpPressed () {
        // Don't move while the chat input is open.
        if(_this.GUI && _this.GUI.chatInput.isActive === true) return;
        _this.move('u');
        _this.moveUpIsDown = true;
    },

    moveDownPressed () {
        // Don't move while the chat input is open.
        if(_this.GUI && _this.GUI.chatInput.isActive === true) return;
        _this.move('d');
        _this.moveDownIsDown = true;
    },

    moveLeftPressed () {
        // Don't move while the chat input is open.
        if(_this.GUI && _this.GUI.chatInput.isActive === true) return;
        _this.move('l');
        _this.moveLeftIsDown = true;
    },

    moveRightPressed () {
        // Don't move while the chat input is open.
        if(_this.GUI && _this.GUI.chatInput.isActive === true) return;
        _this.move('r');
        _this.moveRightIsDown = true;
    },

    moveUpReleased () {
        _this.moveUpIsDown = false;
    },

    moveDownReleased () {
        _this.moveDownIsDown = false;
    },

    moveLeftReleased () {
        _this.moveLeftIsDown = false;
    },

    moveRightReleased () {
        _this.moveRightIsDown = false;
    },

    keyDownHandler (event) {
        //console.log("key event:", event);

        const codeNumber = event.code[5];

        if(_this.GUI !== undefined){
            // Don't send pressed events if the chat input is open.
            if(_this.GUI.chatInput.isActive === false){
                // Get the 0 - 9 keys.
                if(codeNumber > -1
                    && codeNumber < 10){
                    //console.log("num key pressed:", codeNumber);
                    // Add the "slot" part of the key to the inventory slot number.
                    _this.player.inventory.useItem("slot" + codeNumber);
                }

                if(event.code === 'KeyE'){
                    ws.sendEvent('pick_up_item');
                }
            }
        }
    },

    setupKeyboardControls () {
        // Add the handler for keyboard events.
        document.addEventListener('keydown', this.keyDownHandler);

        this.keyboardKeys = this.input.keyboard.addKeys(
            {
                arrowUp:    Phaser.KeyCode.UP,
                arrowDown:  Phaser.KeyCode.DOWN,
                arrowLeft:  Phaser.KeyCode.LEFT,
                arrowRight: Phaser.KeyCode.RIGHT,

                w:          Phaser.KeyCode.W,
                s:          Phaser.KeyCode.S,
                a:          Phaser.KeyCode.A,
                d:          Phaser.KeyCode.D,

                shift:      Phaser.KeyCode.SHIFT,

                enterChat:  Phaser.KeyCode.ENTER
            }
        );
        // Stop the key press events from being captured by Phaser, so they
        // can go up to the browser to be used in the chat input box.
        this.input.keyboard.removeKeyCapture(Phaser.KeyCode.UP);
        this.input.keyboard.removeKeyCapture(Phaser.KeyCode.DOWN);
        this.input.keyboard.removeKeyCapture(Phaser.KeyCode.LEFT);
        this.input.keyboard.removeKeyCapture(Phaser.KeyCode.RIGHT);

        this.input.keyboard.removeKeyCapture(Phaser.KeyCode.W);
        this.input.keyboard.removeKeyCapture(Phaser.KeyCode.S);
        this.input.keyboard.removeKeyCapture(Phaser.KeyCode.A);
        this.input.keyboard.removeKeyCapture(Phaser.KeyCode.D);

        this.keyboardKeys.arrowUp.onDown.add(this.moveUpPressed, this, 0);
        this.keyboardKeys.arrowDown.onDown.add(this.moveDownPressed, this, 0);
        this.keyboardKeys.arrowLeft.onDown.add(this.moveLeftPressed, this, 0);
        this.keyboardKeys.arrowRight.onDown.add(this.moveRightPressed, this, 0);

        this.keyboardKeys.arrowUp.onUp.add(this.moveUpReleased, this, 0);
        this.keyboardKeys.arrowDown.onUp.add(this.moveDownReleased, this, 0);
        this.keyboardKeys.arrowLeft.onUp.add(this.moveLeftReleased, this, 0);
        this.keyboardKeys.arrowRight.onUp.add(this.moveRightReleased, this, 0);

        this.keyboardKeys.w.onDown.add(this.moveUpPressed, this, 0);
        this.keyboardKeys.s.onDown.add(this.moveDownPressed, this, 0);
        this.keyboardKeys.a.onDown.add(this.moveLeftPressed, this, 0);
        this.keyboardKeys.d.onDown.add(this.moveRightPressed, this, 0);

        this.keyboardKeys.w.onUp.add(this.moveUpReleased, this, 0);
        this.keyboardKeys.s.onUp.add(this.moveDownReleased, this, 0);
        this.keyboardKeys.a.onUp.add(this.moveLeftReleased, this, 0);
        this.keyboardKeys.d.onUp.add(this.moveRightReleased, this, 0);

        this.keyboardKeys.enterChat.onDown.add(function () {
            if(this.player.hitPoints <= 0){
                // Close the box. Can't chat while dead.
                this.GUI.chatInput.isActive = false;
                this.GUI.chatInput.style.visibility = "hidden";
                this.GUI.chatInput.value = "";
                return;
            }
            // Check if the chat input box is open.
            if(this.GUI.chatInput.isActive === true){
                // Close the box, and submit the message.
                this.GUI.chatInput.isActive = false;
                this.GUI.chatInput.style.visibility = "hidden";

                // Don't bother sending empty messages.
                if(this.GUI.chatInput.value !== ''){
                    // Send the message to the server.
                    ws.sendEvent('chat', this.GUI.chatInput.value);

                    // Empty the contents ready for the next chat.
                    this.GUI.chatInput.value = "";
                }
            }
            // Not open, so open it.
            else {
                this.GUI.chatInput.isActive = true;
                this.GUI.chatInput.style.visibility = "visible";
                this.GUI.chatInput.focus();
            }
        }, this);
    },

    addEntity (data) {
        // Sort the statics from the dynamics.
        if(data.id === undefined){
            this.addStatic(data);
        }
        else {
            this.addDynamic(data);
        }
    },

    addStatic (data) {
        if(_this.statics[data.row + "-" + data.col] === undefined){
            // The static is not yet added to the grid. Wait a bit for the current player tween to finish and the edge is loaded.
            setTimeout(this.tilemap.updateStaticTile.bind(this.tilemap), 500, data.row + "-" + data.col, false);
        }
        // TODO might need to add the above here also, in some weird case. wait and see...
    },

    /**
     * @param {Number|String} data.id
     * @param {Number} data.typeNumber
     * @param {Number} data.row
     * @param {Number} data.col
     */
    addDynamic (data) {
        const id = data.id;
        const typeNumber = data.typeNumber;
        const row = data.row;
        const col = data.col;

        //console.log("adding entity type:", typeNumber, "at row:", row, ", col:", col, ", config:", data);

        //console.log("rel col:", this.player.col - col);

        // Don't add another entity if the one with this ID already exists.
        if(this.dynamics[id] !== undefined) {
            //console.log("* * * * * skipping add entity, already exists:", id);
            return;
        }

        if(EntityList[EntityTypes[typeNumber]] === undefined){
            console.log("* Invalid entity type number:", typeNumber, ", entity types:", EntityTypes);
            return;
        }

        this.dynamics[id] = {
            id: id,
            row: row,
            col: col,
            sprite: new EntityList[EntityTypes[typeNumber]](
                col * dungeonz.TILE_SIZE * GAME_SCALE,
                row * dungeonz.TILE_SIZE * GAME_SCALE,
                data)
        };

        const dynamicSprite = this.dynamics[id].sprite;

        // Add the sprite to the world group, as it extends sprite but
        // overwrites the constructor so doesn't get added automatically.
        _this.add.existing(dynamicSprite);

        if(dynamicSprite.centered === true){
            dynamicSprite.anchor.setTo(0.5);
            dynamicSprite.x += dungeonz.CENTER_OFFSET;
            dynamicSprite.y += dungeonz.CENTER_OFFSET;
        }

        if(dynamicSprite.lightDistance !== undefined){
            this.lightSources[id] = this.dynamics[id];
            this.tilemap.updateDarknessGrid();
        }

        if(dynamicSprite.pseudoInteractable !== undefined){
            this.pseudoInteractables[id] = this.dynamics[id];
        }

        this.dynamicsGroup.add(dynamicSprite);

        this.dynamicsGroup.sort('y', Phaser.Group.SORT_ASCENDING);
    },

    /**
     * @param {Number|String} id
     */
    removeEntity (id) {
        // Don't try to remove an entity that doesn't exist.
        if(this.dynamics[id] === undefined) {
            //console.log("skipping remove entity, doesn't exist:", id);
            return;
        }

        if(this.lightSources[id] !== undefined){
            delete this.lightSources[id];
            this.tilemap.updateDarknessGrid();
        }

        if(this.pseudoInteractables[id] !== undefined){
            delete this.pseudoInteractables[id];
        }

        this.dynamics[id].sprite.destroy();

        delete this.dynamics[id];
    },

    /**
     * @param {Number} rowOffset
     * @param {Number} colOffset
     */
    offsetOtherDynamics (rowOffset, colOffset) {
        const dynamics = this.dynamics,
            playerEntityID = this.player.entityId;
        let dynamic;
        let dynamicSprite;
        let playerRowTopViewRange = _this.player.row - dungeonz.VIEW_RANGE;
        let playerColLeftViewRange = _this.player.col - dungeonz.VIEW_RANGE;
        let playerRowBotViewRange = _this.player.row + dungeonz.VIEW_RANGE;
        let playerColRightViewRange = _this.player.col + dungeonz.VIEW_RANGE;

        for(let key in dynamics){

            if(dynamics.hasOwnProperty(key) === false) continue;

            dynamic = dynamics[key];
            dynamicSprite = dynamic.sprite;

            // Skip the player entity's sprite.
            if(dynamic.id === playerEntityID) continue;

            // Check if it is within the player view range.
            if(dynamic.row < playerRowTopViewRange
            || dynamic.row > playerRowBotViewRange
            || dynamic.col < playerColLeftViewRange
            || dynamic.col > playerColRightViewRange){
                // Out of view range. Remove it.
                dynamicSprite.destroy();
                delete this.dynamics[key];
                if(dynamicSprite.lightDistance !== undefined){
                    delete this.lightSources[key];
                    this.tilemap.updateDarknessGrid();
                }
                continue;
            }

            if(dynamicSprite.onMove !== undefined) dynamicSprite.onMove();
        }
    },

    /**
     * @param {Number} rowOffset
     * @param {Number} colOffset
     */
    offsetStaticTiles (rowOffset, colOffset) {
        const statics = this.statics;
        let staticTile;
        let playerRowTopViewRange = _this.player.row - dungeonz.VIEW_RANGE;
        let playerColLeftViewRange = _this.player.col - dungeonz.VIEW_RANGE;
        let playerRowBotViewRange = _this.player.row + dungeonz.VIEW_RANGE;
        let playerColRightViewRange = _this.player.col + dungeonz.VIEW_RANGE;

        for(let key in statics){

            if(statics.hasOwnProperty(key) === false) continue;

            staticTile = statics[key];

            // Check if it is within the player view range.
            if(staticTile.row < playerRowTopViewRange
                || staticTile.row > playerRowBotViewRange
                || staticTile.col < playerColLeftViewRange
                || staticTile.col > playerColRightViewRange){
                // Out of view range. Remove it.
                staticTile.destroy();
                // Should have been removed above in destroy, but make sure.
                delete statics[key];
                if(staticTile.lightDistance !== 0){
                    delete this.lightSources[key];
                    this.tilemap.updateDarknessGrid();
                }
                continue;
            }

            if(staticTile.lightDistance !== 0){
                _this.tilemap.updateDarknessGrid();
            }
        }
    },

    /**
     *
     * @param {Number} [entityID] - The entity to make this chat appear from. If not given, uses this player.
     * @param {String} message
     * @param {String} [fillColour="#f5f5f5"]
     */
    chat (entityID, message, fillColour) {
        //console.log("chat");
        // Check an entity ID was given. If not, use this player.
        entityID = entityID || _this.player.entityId;

        // Make sure the message is a string.
        message = message + "";

        let dynamic = _this.dynamics[entityID];
        // Check the entity id is valid.
        if(dynamic === undefined) return;

        const style = {
            font: "20px Press Start 2P",
            align: "center",
            fill: fillColour || "#f5f5f5",
            stroke: "#000000",
            strokeThickness: 4,
            wordWrap: true,
            wordWrapWidth: 400
        };

        // Check if the message was a command.
        if(message[0] === '/'){
            const command = message[1];
            // Remove the command part of the message.
            message = message.slice(2);
            // Check which command it is.
            if      (command === 'r')    style.fill = "#ff7066";
            else if (command === 'g')    style.fill = "#73ff66";
            else if (command === 'b')    style.fill = "#66b3ff";
            else if (command === 'y')    style.fill = "#ffde66";
            // Invalid command.
            else {
                style.fill = "#ffa54f";
                // If the message was from this client, tell them a warning message.
                if(entityID === _this.player.entityId){
                    message = dungeonz.getTextDef("Invalid command warning");
                }
                // Someone else's message, so don't show it.
                else {
                    return;
                }
            }
        }

        const chatText = _this.add.text(0, -12, message, style);
        // Add it to the dynamics group so that it will be affected by scales/transforms correctly.
        dynamic.sprite.baseSprite.addChild(chatText);
        chatText.anchor.set(0.5);
        chatText.scale.set(0.3);
        // Make the chat message scroll up.
        _this.add.tween(chatText).to({
            y: -30
        }, dungeonz.CHAT_BASE_LIFESPAN + (60 * message.length), null, true);
        // How long the message should stay for.
        chatText.lifespan = dungeonz.CHAT_BASE_LIFESPAN + (80 * message.length);
        // Destroy and remove from the list of chat messages when the lifespan is over.
        chatText.events.onKilled.add(function () {
            this.destroy();
        }, chatText);
    }


};