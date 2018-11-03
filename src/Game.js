import EntityTypes from '../src/catalogues/EntityTypes'
import EntityList from '../src/EntitiesList';
import Tilemap from './Tilemap'
import GUI from './GUI'
import InventorySlot from './InventorySlot'
import CraftingManager from "./CraftingManager";

dungeonz.Game = function () {

};

dungeonz.Game.prototype = {

    init: function (data) {
        //console.log("in game init: ", data);

        /**
         * The name of the board the player is on. This has nothing to do with a dungeon instance that this board might be for.
         * @type {String}
         */
        this.currentBoardName = data.boardName;

        this.boardIsDungeon = data.boardIsDungeon;

        /**
         * The ID number of the dungeon that this player is standing next to the entrance of. Each dungeon instance has a unique id, as well as a separate unique name.
         * @type {Number}
         */
        this.adjacentDungeonID = null;

        this.player = {
            entityId: data.playerId,
            row: data.playerRow,
            col: data.playerCol,
            displayName: data.playerDisplayName,
            maxDefence: data.playerMaxDefence,
            maxHitPoints: data.playerMaxHitPoints,
            maxEnergy: data.playerMaxEnergy,
            hitPoints: data.playerMaxHitPoints,
            energy: data.playerMaxEnergy,
            glory: data.playerGlory,
            coins: data.playerCoins,
            respawns: data.playerRespawns,
            inventory: {
                slot1: new InventorySlot("slot1"),
                slot2: new InventorySlot("slot2"),
                slot3: new InventorySlot("slot3"),
                slot4: new InventorySlot("slot4"),
                slot5: new InventorySlot("slot5"),
                slot6: new InventorySlot("slot6"),
                slot7: new InventorySlot("slot7"),
                slot8: new InventorySlot("slot8"),
                slot9: new InventorySlot("slot9"),
                slot0: new InventorySlot("slot0")
            },
            holdingItem: false
        };

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

        document.getElementById("game_canvas").appendChild(this.game.canvas);

        this.scale.fullScreenTarget = document.getElementById("game_cont");

        window.addEventListener('resize', window.windowResize);

        this.moveDelay = 100;
        this.keyDownDelay = 500;
        this.nextMoveTime = 0;

        this.lightSources = {};

        this.pseudoInteractables = {};

        this.tilemap = new Tilemap(this);

        this.GUI = new GUI(this);

        this.craftingManager = new CraftingManager();

        this.dynamics = {};

        this.dynamicsGroup = this.add.group();

        this.dynamicsGroup.x = (window.innerWidth * 0.5)  - (16 * GAME_SCALE * (1+dungeonz.VIEW_RANGE*2) * 0.5);
        this.dynamicsGroup.y = (window.innerHeight * 0.5) - (16 * GAME_SCALE * (1+dungeonz.VIEW_RANGE*2) * 0.5);

        for(let i=0; i<this.dynamicsData.length; i+=1){
            this.addEntity(this.dynamicsData[i]);
        }

        this.game.world.bringToTop(this.tilemap.darknessGridGroup);

        this.tilemap.updateDarknessGrid();

        this.setupKeyboardControls();

        window.addEventListener('mousedown', this.pointerDownHandler);

        //console.log("dynamics: ", this.dynamics);
    },

    update: function () {
        if(this.nextMoveTime < Date.now()){
            this.nextMoveTime = Date.now() + this.moveDelay;

            if(this.keyboardKeys.arrowUp.isDown){
                ws.sendEvent('mv_u');
            }
            if(this.keyboardKeys.arrowDown.isDown){
                ws.sendEvent('mv_d');
            }
            if(this.keyboardKeys.arrowLeft.isDown){
                ws.sendEvent('mv_l');
            }
            if(this.keyboardKeys.arrowRight.isDown){
                ws.sendEvent('mv_r');
            }

        }

        // TODO: Perhaps only do this when an entity is added or moves...
        this.dynamicsGroup.sort('y', Phaser.Group.SORT_ASCENDING);

    },

    shutdown: function () {
        // Remove the handler for resize events, so it doesn't try to resize the sprite container groups that have been removed.
        window.removeEventListener('resize', window.windowResize);

        // Remove the handler for keyboard events, so it doesn't try to do gameplay stuff while on the landing screen.
        document.removeEventListener('keydown', this.keyDownHandler);

        window.removeEventListener('mousedown', this.pointerDownHandler);

        // Remove some of the DOM GUI elements so they aren't stacked when the game state starts again.
        this.GUI.removeExistingDOMElements(this.GUI.defenceCounters);
        this.GUI.removeExistingDOMElements(this.GUI.hitPointCounters);
        this.GUI.removeExistingDOMElements(this.GUI.energyCounters);

        for(let elemKey in this.GUI.inventorySlots){
            this.GUI.inventorySlots[elemKey].slot.remove();
        }

        this.GUI.hideCraftingPanel();

        this.GUI.gui.style.visibility = "hidden";
        this.GUI.dungeonPrompt.style.visibility = "hidden";
        this.GUI.respawnPrompt.style.visibility = "hidden";
        this.GUI.settingsIcon.style.opacity = "1";
        this.GUI.quickTurnIcon.style.visibility = "hidden";
        this.GUI.audioIcon.style.visibility = "hidden";
        this.GUI.audioCounter.style.visibility = "hidden";
        this.GUI.audioMinusIcon.style.visibility = "hidden";
        this.GUI.audioPlusIcon.style.visibility = "hidden";
        this.GUI.guiZoomIcon.style.visibility = "hidden";
        this.GUI.guiZoomCounter.style.visibility = "hidden";
        this.GUI.guiZoomMinusIcon.style.visibility = "hidden";
        this.GUI.guiZoomPlusIcon.style.visibility = "hidden";
        this.GUI.virtualDPadIcon.style.visibility = "hidden";
        this.GUI.virtualDPad.style.visibility = "hidden";
        this.GUI.fullscreenIcon.style.visibility = "hidden";
        this.GUI.craftingPanel.style.visibility = "hidden";
    },

    move (key, direction) {
        //console.log("move dir:", direction);

        // Hide the crafting panel, in case they are just moving away from a station.
        this.GUI.hideCraftingPanel();

        this.checkPseudoInteractables(direction);

        if(this.player.hitPoints <= 0) return;
        ws.sendEvent('mv_' + direction);
        if(dungeonz.quickTurnEnabled === true){
            if(this.dynamics[this.player.entityId].sprite.direction !== direction){
                ws.sendEvent('mv_' + direction);
            }
        }
        this.nextMoveTime = Date.now() + this.moveDelay + this.keyDownDelay;
    },

    checkPseudoInteractables (direction) {
        // Check if any interactables that cause this client only to do something are about
        // to be walked into, such as showing the crafting panel for crafting stations.
        if(direction === 'u'){
            const playerNextRow = this.player.row - 1;
            let key,
                dynamic;
            for(key in this.pseudoInteractables){
                if(this.pseudoInteractables.hasOwnProperty(key) === false) continue;
                dynamic = this.pseudoInteractables[key];
                if(dynamic.row === playerNextRow){
                    if(dynamic.col === this.player.col){
                        dynamic.sprite.interactedByPlayer();
                        return;
                    }
                }
            }
        }
        else if(direction === 'd'){
            const playerNextRow = this.player.row + 1;
            let key,
                dynamic;
            for(key in this.pseudoInteractables){
                if(this.pseudoInteractables.hasOwnProperty(key) === false) continue;
                dynamic = this.pseudoInteractables[key];
                if(dynamic.row === playerNextRow){
                    if(dynamic.col === this.player.col){
                        dynamic.sprite.interactedByPlayer();
                        return;
                    }
                }
            }
        }
        else if(direction === 'l'){
            const playerNextCol = this.player.col - 1;
            let key,
                dynamic;
            for(key in this.pseudoInteractables){
                if(this.pseudoInteractables.hasOwnProperty(key) === false) continue;
                dynamic = this.pseudoInteractables[key];
                if(dynamic.row === this.player.row){
                    if(dynamic.col === playerNextCol){
                        dynamic.sprite.interactedByPlayer();
                        return;
                    }
                }
            }
        }
        else {
            const playerNextCol = this.player.col + 1;
            let key,
                dynamic;
            for(key in this.pseudoInteractables){
                if(this.pseudoInteractables.hasOwnProperty(key) === false) continue;
                dynamic = this.pseudoInteractables[key];
                if(dynamic.row === this.player.row){
                    if(dynamic.col === playerNextCol){
                        dynamic.sprite.interactedByPlayer();
                        return;
                    }
                }
            }
        }

    },

    useHeldItem (direction) {
        if(direction === undefined){
            // Tell the game server this player wants to use this item.
            ws.sendEvent('use_item');
        }
        else {
            // Tell the game server this player wants to use this item in a direction.
            ws.sendEvent('use_item', direction);
        }
    },

    equipItem (slotNumber) {
        // Check there is an item in that inventory slot.
        if(this.player.inventory[slotNumber].catalogueEntry === null){
            //console.log("no invent item at that slot");
            return;
        }

        // Check if they want to drop the item.
        if(this.keyboardKeys.shift.isDown === true){
            // Tell the game server this player wants to drop this item.
            ws.sendEvent('drop_item', slotNumber);
            return;
        }

        // Check if they want to move this item to another slot.

        // Tell the game server this player wants to equip this item.
        ws.sendEvent('equip_item', slotNumber);
    },

    pointerDownHandler (event) {
        // Stop double clicking from highlighting text elements.
        //event.preventDefault();
        // Only use the selected item if the input wasn't over any other GUI element.
        if(event.target === _this.GUI.gui){
            // Don't try to use the held item if one isn't selected.
            if(_this.player.holdingItem === false) return;

            const midX = window.innerWidth / 2;
            const midY = window.innerHeight / 2;
            const targetX = event.clientX - midX;
            const targetY = event.clientY - midY;

            if(Math.abs(targetX) > Math.abs(targetY)){
                if(targetX > 0) _this.useHeldItem('r');
                else            _this.useHeldItem('l');
            }
            else {
                if(targetY > 0) _this.useHeldItem('d');
                else            _this.useHeldItem('u');
            }
        }

    },

    keyDownHandler (event) {
        //console.log("key event:", event);

        const codeNumber = event.code[5];

        // Don't send pressed events if the chat input is open.
        if(_this.GUI.chatInput.isActive === false){
            // Get the 0 - 9 keys.
            if(codeNumber > -1
            && codeNumber < 10){
                //console.log("num key pressed:", codeNumber);
                // Add the "slot" part of the key to the inventory slot number.
                _this.equipItem("slot" + codeNumber);
            }

            if(event.code === 'KeyE'){
                ws.sendEvent('pick_up_item');
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

                shift:      Phaser.KeyCode.SHIFT,

                enterChat:  Phaser.KeyCode.ENTER
            }
        );

        this.keyboardKeys.arrowUp.onDown.add(this.move, this, 0, 'u');
        this.keyboardKeys.arrowDown.onDown.add(this.move, this, 0, 'd');
        this.keyboardKeys.arrowLeft.onDown.add(this.move, this, 0, 'l');
        this.keyboardKeys.arrowRight.onDown.add(this.move, this, 0, 'r');

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

    /**
     * @param {Number|String} data.id
     * @param {Number} data.typeNumber
     * @param {Number} data.row
     * @param {Number} data.col
     */
    addEntity (data) {
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

        // Get the position relative to the player.
        const relCol = col - this.player.col;
        const relRow = row - this.player.row;

        this.dynamics[id] = {
            id: id,
            row: row,
            col: col,
            sprite: new EntityList[EntityTypes[typeNumber]](
                ((relCol * 2) + (dungeonz.VIEW_RANGE * 2)) * (16 / 2 * GAME_SCALE),
                ((relRow * 2) + (dungeonz.VIEW_RANGE * 2)) * (16 / 2 * GAME_SCALE),
                data)
        };

        const dynamicSprite = this.dynamics[id].sprite;

        if(dynamicSprite.centered === true){
            dynamicSprite.anchor.setTo(0.5);
            dynamicSprite.x += dynamicSprite.width / GAME_SCALE;
            dynamicSprite.y += dynamicSprite.height / GAME_SCALE;
        }

        if(dynamicSprite.lightDistance !== undefined){
            this.lightSources[id] = dynamicSprite;
            this.tilemap.updateDarknessGrid();
        }

        if(dynamicSprite.pseudoInteractable !== undefined){
            this.pseudoInteractables[id] = this.dynamics[id];
        }

        this.dynamicsGroup.add(dynamicSprite);
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
        let dynamic;
        let playerRowTopViewRange = _this.player.row - dungeonz.VIEW_RANGE;
        let playerColLeftViewRange = _this.player.col - dungeonz.VIEW_RANGE;
        let playerRowBotViewRange = _this.player.row + dungeonz.VIEW_RANGE;
        let playerColRightViewRange = _this.player.col + dungeonz.VIEW_RANGE;

        for(let key in this.dynamics){

            if(this.dynamics.hasOwnProperty(key) === false) continue;

            dynamic = this.dynamics[key];

            // Skip the player entity's sprite.
            if(dynamic.id === this.player.entityId) continue;

            // Check if it is within the player view range.
            if(dynamic.row < playerRowTopViewRange
            || dynamic.row > playerRowBotViewRange
            || dynamic.col < playerColLeftViewRange
            || dynamic.col > playerColRightViewRange){
                // Out of view range. Remove it.
                dynamic.sprite.destroy();
                delete this.dynamics[key];
                if(dynamic.sprite.lightDistance !== undefined){
                    delete this.lightSources[key];
                    this.tilemap.updateDarknessGrid();
                }
                continue;
            }

            // Shift the other dynamics, so it looks like the player is the one moving.
            dynamic.sprite.x -= (32 / 2 * GAME_SCALE) * colOffset;
            dynamic.sprite.y -= (32 / 2 * GAME_SCALE) * rowOffset;

            if(dynamic.sprite.onMove !== undefined) dynamic.sprite.onMove();
        }
    },

    /**
     *
     * @param {Number} [entityID]
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
            font: "20px Consolas",
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

        const chatText = _this.add.text(dynamic.sprite.x + (dynamic.sprite.width / 2), dynamic.sprite.y - 24, message, style);
        // Add it to the dynamics group so that it will be affected by scales/transforms correctly.
        _this.dynamicsGroup.add(chatText);
        // Add it to this dynamics list of chat texts, so they can be moved and removed later.
        dynamic.sprite.chatTexts.push(chatText);
        chatText.anchor.set(0.5);
        // How far this chat message has scrolled up so far.
        chatText.yScroll = 0;
        // Make the chat message scroll up.
        chatText.update = function () {
            this.y -= dungeonz.CHAT_SCROLL_SPEED;
            this.yScroll -= dungeonz.CHAT_SCROLL_SPEED;
        };
        // How long the message should stay for.
        chatText.lifespan = dungeonz.CHAT_BASE_LIFESPAN + (60 * message.length);
        // Destroy and remove from the list of chat messages when the lifespan is over.
        chatText.events.onKilled.add(function () {
            dynamic.sprite.chatTexts.shift();
            this.destroy();
        }, chatText);
    }


};