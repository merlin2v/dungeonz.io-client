import EntityTypes from '../src/catalogues/EntityTypes'
import EntityList from '../src/EntitiesList';
import Tilemap from './Tilemap'
import GUI from './GUI'
import InventorySlot from './InventorySlot'

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
            }
        };

        this.dynamicsData = data.dynamicsData;

        //console.log("nearby dynamics: data", this.dynamicsData);

    },

    preload: function () {

    },

    create: function () {

        window._this = this;

        window.addEventListener('resize', window.windowResize);

        this.moveDelay = 100;
        this.keyDownDelay = 500;
        this.nextMoveTime = 0;

        this.tilemap = new Tilemap(this);

        this.GUI = new GUI(this);

        this.dynamics = {};

        this.dynamicsGroup = this.add.group();

        this.dynamicsGroup.x = (window.innerWidth * 0.5)  - (16 * GAME_SCALE * (1+dungeonz.VIEW_RANGE*2) * 0.5);
        this.dynamicsGroup.y = (window.innerHeight * 0.5) - (16 * GAME_SCALE * (1+dungeonz.VIEW_RANGE*2) * 0.5);

        for(let i=0; i<this.dynamicsData.length; i+=1){
            this.addEntity(this.dynamicsData[i]);
        }

        this.setupKeyboardControls();

        //console.log("dynamics: ", this.dynamics);
    },

    update: function () {
        if(this.nextMoveTime < Date.now()){
            this.nextMoveTime = Date.now() + this.moveDelay;

            if(this.keyboardKeys.arrowUp.isDown){
                ws.sendEvent('move_up');
            }
            if(this.keyboardKeys.arrowDown.isDown){
                ws.sendEvent('move_down');
            }
            if(this.keyboardKeys.arrowLeft.isDown){
                ws.sendEvent('move_left');
            }
            if(this.keyboardKeys.arrowRight.isDown){
                ws.sendEvent('move_right');
            }

        }

        // TODO: Perhaps only do this when an entity is added or moves...
        this.dynamicsGroup.sort('y', Phaser.Group.SORT_ASCENDING);

    },

    render: function () {

    },

    shutdown: function () {
        // Remove the handler for resize events, so it doesn't try to resize the sprite container groups that have been removed.
        window.removeEventListener('resize', window.windowResize);

        // Remove the handler for keyboard events, so it doesn't try to do gameplay stuff while on the landing screen.
        document.removeEventListener('keydown', this.keyDownHandler);

        // Remove some of the DOM GUI elements so they aren't stacked when the game state starts again.
        this.GUI.removeExistingDOMElements(this.GUI.defenceCounters);
        this.GUI.removeExistingDOMElements(this.GUI.hitPointCounters);
        this.GUI.removeExistingDOMElements(this.GUI.energyCounters);
        this.GUI.removeExistingDOMElements(this.GUI.inventorySlotBorders);
        this.GUI.removeExistingDOMElements(this.GUI.inventorySlotIcons);
        this.GUI.removeExistingDOMElements(this.GUI.inventorySlotDurabilityMeters);

        this.GUI.gui.style.visibility = "hidden";
        this.GUI.dungeonPrompt.style.visibility = "hidden";
    },

    inventorySlotPressed (slotNumber) {
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


        // Tell the game server this player wants to use this item.
        ws.sendEvent('use_item', slotNumber);
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
                _this.inventorySlotPressed("slot" + codeNumber);
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

        this.keyboardKeys.arrowUp.onDown.add(function () {
            ws.sendEvent('move_up');
            if(dungeonz.quickTurnEnabled === true){
                if(this.dynamics[this.player.entityId].sprite.direction !== 'u'){
                    ws.sendEvent('move_up');
                }
            }
            this.nextMoveTime = Date.now() + this.moveDelay + this.keyDownDelay;
        }, this);
        this.keyboardKeys.arrowDown.onDown.add(function () {
            ws.sendEvent('move_down');
            if(dungeonz.quickTurnEnabled === true){
                if(this.dynamics[this.player.entityId].sprite.direction !== 'd'){
                    ws.sendEvent('move_down');
                }
            }
            this.nextMoveTime = Date.now() + this.moveDelay + this.keyDownDelay;
        }, this);
        this.keyboardKeys.arrowLeft.onDown.add(function () {
            ws.sendEvent('move_left');
            if(dungeonz.quickTurnEnabled === true){
                if(this.dynamics[this.player.entityId].sprite.direction !== 'l'){
                    ws.sendEvent('move_left');
                }
            }
            this.nextMoveTime = Date.now() + this.moveDelay + this.keyDownDelay;
        }, this);
        this.keyboardKeys.arrowRight.onDown.add(function () {
            ws.sendEvent('move_right');
            if(dungeonz.quickTurnEnabled === true){
                if(this.dynamics[this.player.entityId].sprite.direction !== 'r'){
                    ws.sendEvent('move_right');
                }
            }
            this.nextMoveTime = Date.now() + this.moveDelay + this.keyDownDelay;
        }, this);

        this.keyboardKeys.enterChat.onDown.add(function () {
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
            console.log("* * * * * skipping add entity, already exists:", id);
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