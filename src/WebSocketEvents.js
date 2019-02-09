
// Default websocket object state. Used to detect if there is already a connection.
window.ws = false;

const eventResponses = {};

import EventNames from '../src/catalogues/EventNames'
import ItemTypes from '../src/catalogues/ItemTypes'
import SpellBookTypes from '../src/catalogues/SpellBookTypes'
import ChatWarnings from './catalogues/ChatWarnings'

function makeWebSocketConnection (url) {
    // Only connect if there isn't already a connection.
    if(ws === false){
        // Connect to the game server.
        window.ws = new WebSocket(url);
    }
    // Connection already exists.
    else {
        // Check the if the connection is not working.
        if(ws.readyState !== 1){
            // Close the connection.
            ws.close();
            // Try to create a new connection to the game server.
            window.ws = new WebSocket(url);
        }
        else {
            return false;
        }
    }
    return true;
}

window.connectToGameServer = function () {

    // If the game is running in dev mode (localhost), connect without SSL.
    if(window.devMode === true){
        // Make a connection, or if one is already made, return so the listeners aren't added again.
        if(makeWebSocketConnection('ws://127.0.0.4:3000') === false) return false;
    }
    // Deployment mode. Connect using SSL.
    else {
        // Make a connection, or if one is already made, return so the listeners aren't added again.
        if(makeWebSocketConnection('wss://test.waywardworlds.com:3000') === false) return false;
    }

    /**
     * Event emit helper. Attach this to a socket, and use it to send an event to the server.
     * @param {String} eventName
     * @param {Object} [data]
     */
    ws.sendEvent = function (eventName, data) {
        this.send(JSON.stringify({eventName: eventName, data: data}));
    };

    // Wait for the connection to have finished opening before attempting to join the world.
    ws.onopen = function () {
        //console.log("ws onopen");
        // Attempt to join the world as soon as the connection is ready, so the user doesn't have to press 'Play' twice.
        playPressed();
    };

    ws.onmessage = function (event) {

        //console.log("on message");
        //console.log(event);

        const parsedMessage = JSON.parse(event.data);
        const eventNameID = parsedMessage.eventNameID;
        const eventName = EventNames[eventNameID];

        // Check this event name ID is in the list of valid event name IDs.
        if(eventName !== undefined){
            // Check there is a response function to run for the event.
            if(eventResponses[eventName] !== undefined){
                eventResponses[eventName](parsedMessage.data);
            }
        }

    };

    ws.onclose = function () {
        console.log('* Disconnected from game server.');
        window.ws = false;
        // Reload the page.
        location.reload();
    };

    ws.onerror = function (error) {
        // Get the warning text.
        let element = document.getElementById("warning_message");
        // Show the server connect error message.
        element.innerText = dungeonz.getTextDef("Connect game server warning");
        // Show it.
        element.style.visibility = "visible";
        // Make it disappear after a few seconds.
        setTimeout(function () {
            element.style.visibility = "hidden";
        }, 8000);
    }

};

eventResponses.invalid_continue_code = function () {
    // Get the warning text.
    let element = document.getElementById("warning_message");
    // Show the server connect error message.
    element.innerText = dungeonz.getTextDef("Invalid continue code warning");
    // Show it.
    element.style.visibility = "visible";
    // Make it disappear after a few seconds.
    setTimeout(function () {
        element.style.visibility = "hidden";
    }, 8000);
};

eventResponses.character_in_use = function () {
    // Get the warning text.
    let element = document.getElementById("warning_message");
    // Show the server connect error message.
    element.innerText = dungeonz.getTextDef("Character in use");
    // Show it.
    element.style.visibility = "visible";
    // Make it disappear after a few seconds.
    setTimeout(function () {
        element.style.visibility = "hidden";
    }, 8000);
};

eventResponses.join_world_success = function (data) {
    //console.log("join world success, data:");
    //console.log(data);

    document.getElementById("home_cont").style.display = "none";

    // If something is wrong, close the connection.
    if(!_this.state){
        console.log("* WARNING: _this.state is invalid. Closing WS connection. _this:", _this);
        ws.close();
        return;
    }

    _this.state.start('Game', true, false, data);
};

eventResponses.world_full = function () {
    console.log("* World is full.");
};

eventResponses.moved = function (data) {
    //console.log("moved: ", data);

    const dynamic = _this.dynamics[data.id];

    // Check the entity id is valid.
    if(dynamic === undefined) return;

    const dynamicSprite = dynamic.sprite;

    // The client player moved.
    if(data.id === _this.player.entityId){

        let origRow = _this.player.row;
        let origCol = _this.player.col;

        _this.player.row = data.row;
        _this.player.col = data.col;
        //_this.player.energy -= 0.5;
        //_this.GUI.updateEnergyCounters();

        // Update the static entities BEFORE setting the new values on the player.
        // Right.
        if(data.col > origCol){
            _this.offsetOtherDynamics(0, +1);
            _this.tilemap.tileGridBitmapData.move(-dungeonz.TILE_SIZE, 0);
            _this.tilemap.staticsGridBitmapData.move(-dungeonz.TILE_SIZE, 0);
            _this.tilemap.updateTileGridEdgeRight();
            _this.tilemap.updateStaticsGridEdgeRight();
        }
        // Left.
        else if(data.col < origCol){
            _this.offsetOtherDynamics(0, -1);
            _this.tilemap.tileGridBitmapData.move(dungeonz.TILE_SIZE, 0);
            _this.tilemap.staticsGridBitmapData.move(dungeonz.TILE_SIZE, 0);
            _this.tilemap.updateTileGridEdgeLeft();
            _this.tilemap.updateStaticsGridEdgeLeft();
        }
        // Down.
        if(data.row > origRow){
            _this.offsetOtherDynamics(+1, 0);
            _this.tilemap.tileGridBitmapData.move(0, -dungeonz.TILE_SIZE);
            _this.tilemap.staticsGridBitmapData.move(0, -dungeonz.TILE_SIZE);
            _this.tilemap.updateTileGridEdgeBottom();
            _this.tilemap.updateStaticsGridEdgeBottom();
        }
        // Up.
        else if(data.row < origRow){
            _this.offsetOtherDynamics(-1, 0);
            _this.tilemap.tileGridBitmapData.move(0, dungeonz.TILE_SIZE);
            _this.tilemap.staticsGridBitmapData.move(0, dungeonz.TILE_SIZE);
            _this.tilemap.updateTileGridEdgeTop();
            _this.tilemap.updateStaticsGridEdgeTop();
        }

    }
    // Another entity moved.
    else {
        //console.log("moving other entity:", data.id);

        let playerRowTopViewRange = _this.player.row - dungeonz.VIEW_RANGE;
        let playerColLeftViewRange = _this.player.col - dungeonz.VIEW_RANGE;
        let playerRowBotViewRange = _this.player.row + dungeonz.VIEW_RANGE;
        let playerColRightViewRange = _this.player.col + dungeonz.VIEW_RANGE;

        dynamic.row = data.row;
        dynamic.col = data.col;

        // Check if it is still within the player view range.
        if(dynamic.row < playerRowTopViewRange
        || dynamic.row > playerRowBotViewRange
        || dynamic.col < playerColLeftViewRange
        || dynamic.col > playerColRightViewRange){
            // Out of view range. Remove it.
            dynamicSprite.destroy();
            // Remove the reference to it.
            delete _this.dynamics[dynamic.id];
            //console.log("other entity moved out of view range:", dynamic.id);
            return;
        }

        // Get the position relative to the player.
        const relCol = data.col - _this.player.col;
        const relRow = data.row - _this.player.row;

        dynamicSprite.x = (relCol + dungeonz.VIEW_RANGE) * dungeonz.TILE_SIZE * GAME_SCALE;
        dynamicSprite.y = (relRow + dungeonz.VIEW_RANGE) * dungeonz.TILE_SIZE * GAME_SCALE;

        if(dynamicSprite.centered === true){
            dynamicSprite.x += dungeonz.CENTER_OFFSET;
            dynamicSprite.y += dungeonz.CENTER_OFFSET;
        }
    }

    if(dynamicSprite.onMove !== undefined) dynamicSprite.onMove(true);

    _this.dynamicsGroup.sort('y', Phaser.Group.SORT_ASCENDING);
};

eventResponses.change_board = function (data) {
    _this.dynamicsData = data.dynamicsData;
    _this.boardAlwaysNight = data.boardAlwaysNight;
    _this.player.row = data.playerRow;
    _this.player.col = data.playerCol;

    if(_this.boardAlwaysNight === false){
        // Make the darkness layer invisible during day time.
        if(_this.dayPhase === _this.DayPhases.Day){
            let row,
                col,
                darknessGrid = _this.tilemap.darknessGrid;

            for(row=0; row<dungeonz.VIEW_DIAMETER; row+=1){
                for(col=0; col<dungeonz.VIEW_DIAMETER; col+=1){
                    darknessGrid[row][col].alpha = 0;
                }
            }
        }
    }

    _this.tilemap.loadMap(data.boardName);

    // Remove the old entities.
    const dynamics = _this.dynamics;
    for(let key in dynamics){
        if(dynamics.hasOwnProperty(key) === false) continue;
        _this.removeEntity(key);
    }

    // Add the new entities.
    const dynamicsData = _this.dynamicsData;
    for(let i=0; i<dynamicsData.length; i+=1){
        _this.addEntity(dynamicsData[i]);
    }
};

eventResponses.change_day_phase = function (data) {
    //console.log("changing day phase:", data);
    _this.dayPhase = data;

    if(_this.boardAlwaysNight === false){
        // Make the darkness layer invisible during day time.
        if(_this.dayPhase === _this.DayPhases.Day){
            let row,
                col,
                darknessGrid = _this.tilemap.darknessGrid;

            for(row=0; row<dungeonz.VIEW_DIAMETER; row+=1){
                for(col=0; col<dungeonz.VIEW_DIAMETER; col+=1){
                    darknessGrid[row][col].alpha = 0;
                }
            }
        }
    }

    _this.tilemap.updateDarknessGrid();
};

eventResponses.dungeon_prompt = function (data) {
    //console.log("dungeon_prompt, data:", data);
    _this.adjacentDungeonID = data;
    _this.GUI.updateDungeonPrompt();
    _this.GUI.dungeonPrompt.style.visibility = "visible";
};

eventResponses.hit_point_value = function (data) {
    _this.player.hitPoints = data;
    if(_this.player.hitPoints <= 0){
        // If the player has any respawns left, show the respawn prompt.
        if(_this.player.respawns > 0){
            _this.GUI.respawnPrompt.style.visibility = "visible";
        }
        // No respawns left. Game over...
        else {
            _this.GUI.gameOverPrompt.style.visibility = "visible";
        }
    }
    _this.GUI.updateHitPointCounters();
};

eventResponses.energy_value = function (data) {
    _this.player.energy = data;
    _this.GUI.updateEnergyCounters();
};

eventResponses.defence_value = function (data) {
    _this.player.defence = data;
    _this.GUI.updateDefenceCounters();
};

eventResponses.glory_value = function (data) {
    _this.GUI.updateGloryCounter(data);
};

eventResponses.durability_value = function (data) {
    //console.log("durability_value:", data);
    _this.player.inventory[data.slotKey].updateDurability(data.durability);
};

eventResponses.heal = function (data) {
    _this.dynamics[data.id].sprite.onHitPointsModified(data.amount);
};

eventResponses.damage = function (data) {
    _this.dynamics[data.id].sprite.onHitPointsModified(data.amount);
};

eventResponses.start_burn = function (data) {
    _this.dynamics[data].sprite.onBurnStart();
};

eventResponses.stop_burn = function (data) {
    _this.dynamics[data].sprite.onBurnStop();
};

eventResponses.player_respawn = function () {
    _this.GUI.updateRespawnsCounter(_this.player.respawns - 1);
    _this.player.hitPoints = _this.player.maxHitPoints;
    _this.player.energy = _this.player.maxEnergy;
    _this.GUI.respawnPrompt.style.visibility = "hidden";
    _this.GUI.updateHitPointCounters();
};

eventResponses.add_entity = function (data) {
    //console.log("add entity event:", data);
    _this.addEntity(data);
};

eventResponses.remove_entity = function (data) {
    //console.log("remove entity event:", data);
    _this.removeEntity(data);
};

eventResponses.add_entities = function (data) {
    //console.log("add entities event");
    for(let i=0; i<data.length; i+=1){
        _this.addEntity(data[i]);
    }
};

eventResponses.add_item = function (data) {
    //console.log("add item event:", data);
    _this.player.inventory[data.slotKey].fill(ItemTypes[data.typeNumber], data.durability, data.maxDurability);
};

eventResponses.remove_item = function (data) {
    //console.log("remove item event:", data);
    _this.player.inventory[data].empty();
};

eventResponses.equip_clothes = function (data) {
    const clothes = _this.dynamics[data.id].sprite.clothes;
    clothes.visible = true;
    clothes.clothesName = ItemTypes[data.typeNumber].idName;
    clothes.frameName = clothes.clothesFrames[clothes.clothesName][clothes.parent.direction];
};

eventResponses.unequip_clothes = function (data) {
    //console.log("unequip clothes:", data);
    _this.dynamics[data].sprite.clothes.visible = false;
};

eventResponses.activate_ammunition = function (data) {
    // Show the equipped icon on the inventory slot.
    _this.GUI.inventoryBar.slots[data].equipped.src = 'assets/img/gui/ammunition-icon.png';
    _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "visible";
};

eventResponses.deactivate_ammunition = function (data) {
    // Hide the equipped icon on the inventory slot.
    _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "hidden";
};

eventResponses.activate_clothing = function (data) {
    // Show the equipped icon on the inventory slot.
    _this.GUI.inventoryBar.slots[data].equipped.src = 'assets/img/gui/clothing-icon.png';
    _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "visible";
};

eventResponses.deactivate_clothing = function (data) {
    // Hide the equipped icon on the inventory slot.
    _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "hidden";
};

eventResponses.activate_holding = function (data) {
    _this.player.holdingItem = true;
    // Show the equipped icon on the inventory slot.
    _this.GUI.inventoryBar.slots[data].equipped.src = 'assets/img/gui/holding-icon.png';
    _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "visible";
};

eventResponses.deactivate_holding = function (data) {
    _this.player.holdingItem = false;
    // Hide the equipped icon on the inventory slot.
    _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "hidden";
    _this.GUI.inventoryBar.slots[data].open.style.visibility = "hidden";
};

/**
 *
 * @param data - The type number of the spell book being held.
 */
eventResponses.activate_spell_book = function (data) {
    _this.GUI.spellBookPanel.changeSpellBook(data[1]);
    // Show the open button on the inventory slot.
    _this.GUI.inventoryBar.slots[data[0]].open.style.visibility = "visible";
};

eventResponses.bank_item_deposited = function (data) {
    //console.log("bank_item_deposited, data:", data);
    _this.player.bankManager.addItemToContents(data.slotIndex, ItemTypes[data.typeNumber], data.durability, data.maxDurability);
};

eventResponses.bank_item_withdrawn = function (data) {
    //console.log("bank_item_withdrawn, data:", data);
    _this.player.bankManager.removeItemFromContents(data);
};

eventResponses.active_state = function (data) {
    //console.log("active state change:", data);
    // Check the entity id is valid.
    const dynamic = _this.dynamics[data.id];
    if(dynamic === undefined) return;

    if(data.activeState === true){
        dynamic.sprite.frameName = dynamic.sprite.activeStateFrame;
        if(dynamic.sprite.lightDistance !== undefined){
            dynamic.sprite.lightDistance = dynamic.sprite.defaultLightDistance;
            _this.tilemap.updateDarknessGrid();
        }
    }
    else {
        dynamic.sprite.frameName = dynamic.sprite.inactiveStateFrame;
        if(dynamic.sprite.lightDistance !== undefined){
            dynamic.sprite.lightDistance = 0;
            _this.tilemap.updateDarknessGrid();
        }
    }
};

eventResponses.change_direction = function (data) {
    //console.log("change_direction:", data);
    // Check the entity id is valid.
    const dynamic = _this.dynamics[data.id];
    if(dynamic === undefined) return;

    const sprite = dynamic.sprite;
    // Some sprites show their direction by having different frames, others by rotating.
    if(sprite.baseFrames !== undefined){
        sprite.baseSprite.frameName = sprite.baseFrames[data.direction];
    }
    if(sprite.directionAngles !== undefined){
        sprite.angle = sprite.directionAngles[data.direction];
    }
    if(sprite.clothes !== undefined){
        sprite.clothes.frameName = sprite.clothes.clothesFrames[sprite.clothes.clothesName][data.direction];
        sprite.clothes.animations.stop();
    }
    sprite.direction = data.direction;
    sprite.onChangeDirection();
};

eventResponses.curse_set = function (data) {
    const dynamic = _this.dynamics[data];
    if(dynamic === undefined) return;
    dynamic.sprite.curseIcon.visible = true;
};

eventResponses.curse_removed = function (data) {
    const dynamic = _this.dynamics[data];
    if(dynamic === undefined) return;
    dynamic.sprite.curseIcon.visible = false;
};

eventResponses.enchantment_set = function (data) {
    const dynamic = _this.dynamics[data];
    if(dynamic === undefined) return;
    dynamic.sprite.enchantmentIcon.visible = true;
};

eventResponses.enchantment_removed = function (data) {
    const dynamic = _this.dynamics[data];
    if(dynamic === undefined) return;
    dynamic.sprite.enchantmentIcon.visible = false;
};

eventResponses.chat = function (data) {
    //console.log("chat:", data);
    _this.chat(data.id, data.message);
};

eventResponses.chat_warning = function (data) {
    _this.chat(undefined, dungeonz.getTextDef(ChatWarnings[data]), "#ffa54f");
};

eventResponses.cannot_drop_here = function () {
    _this.GUI.textCounterSetText(_this.GUI.inventoryBar.message, dungeonz.getTextDef("Drop item blocked warning"));
};

eventResponses.item_broken = function () {
    _this.GUI.textCounterSetText(_this.GUI.inventoryBar.message, dungeonz.getTextDef("Item broken warning"));
};

eventResponses.inventory_full = function () {
    _this.GUI.textCounterSetText(_this.GUI.inventoryBar.message, dungeonz.getTextDef("Inventory full warning"));
};

eventResponses.hatchet_needed = function () {
    _this.GUI.textCounterSetText(_this.GUI.inventoryBar.message, dungeonz.getTextDef("Hatchet needed warning"));
};

eventResponses.pickaxe_needed = function () {
    _this.GUI.textCounterSetText(_this.GUI.inventoryBar.message, dungeonz.getTextDef("Pickaxe needed warning"));
};

eventResponses.exp_gained = function (data) {
    //console.log("exp gained, data:", data);
    _this.player.stats.list[data.statName].modExp(data.exp);
};

eventResponses.stat_levelled = function (data) {
    //console.log("stat levelled, data:", data);
    _this.player.stats.list[data.statName].levelUp(data.level, data.nextLevelExpRequirement);
};

eventResponses.shop_prices = function (data) {
    console.log("shop prices, data:", data);
    _this.GUI.shopPanel.updatePrices(data);
};

eventResponses.clan_joined = function (data) {
    console.log("clan joined, data:", data);
    _this.clanManager.memberJoined(data);
};

// A member was kicked from the clan. Might have been this player.
eventResponses.clan_kicked = function (data) {
    console.log("clan kicked, data:", data);
    _this.clanManager.memberKicked(data);
};

// Another member left the clan.
eventResponses.clan_left = function (data) {
    console.log("clan left, data:", data);
    _this.clanManager.memberLeft(data);
};

eventResponses.clan_promoted = function (data) {
    console.log("clan promoted, data:", data);
    _this.clanManager.promoteMember(data);
};

eventResponses.clan_destroyed = function (data) {
    console.log("clan destroyed, data:", data);
    _this.clanManager.destroyed();
};

eventResponses.clan_values = function (data) {
    console.log("clan values, data:", data);
    _this.GUI.clanPanel.updateValues(data);
};