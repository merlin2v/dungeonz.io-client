
// Default websocket object state. Used to detect if there is already a connection.
window.ws = false;

const eventResponses = {};
// 1vCPU 1GB server.
//const serverIPAddress = '104.248.48.75';
const serverIPAddress = '127.0.0.4';

import EventNames from '../src/catalogues/EventNames'
import ItemTypes from '../src/catalogues/ItemTypes'
import ChatWarnings from './catalogues/ChatWarnings'

window.connectToGameServer = function () {

    // Only connect if there isn't already a connection.
    if(ws === false){
        // Connect to the game server.
        window.ws = new WebSocket('ws://' + serverIPAddress + ':3000');
    }
    // Connection already exists.
    else {
        // Check the if the connection is not working.
        if(ws.readyState !== 1){
            // Close the connection.
            ws.close();
            // Try to create a new connection to the game server.
            window.ws = new WebSocket('ws://' + serverIPAddress + ':3000');
        }
        else {
            return;
        }
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
        // Attempt to join the world as soon as the connection is ready, so the user doesn't have to press 'Play' twice.
        ws.sendEvent('join_world', {displayName: document.getElementById('name_input').value});
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
        _this.state.start('Boot');
        //console.log('after start boot');
    };

    ws.onerror = function (error) {
        // Get the warning text.
        let element = document.getElementById("warning_message");
        // Show it.
        element.style.visibility = "visible";
        // Make it disappear after a few seconds.
        setTimeout(function () {
            element.style.visibility = "hidden";
        }, 8000);
    }

};

eventResponses.join_world_success = function (data) {
    console.log("join world success, data:");
    console.log(data);

    document.getElementById("home_cont").style.display = "none";

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
        if(data.col > origCol){
            _this.offsetOtherDynamics(0, +1);
        }
        else if(data.col < origCol){
            _this.offsetOtherDynamics(0, -1);
        }
        if(data.row > origRow){
            _this.offsetOtherDynamics(+1, 0);
        }
        else if(data.row < origRow){
            _this.offsetOtherDynamics(-1, 0);
        }

        _this.tilemap.updateTileGrid();
        _this.tilemap.updateStaticsGrid();

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
            dynamicSprite.anchor.setTo(0.5);
            dynamicSprite.x += dynamicSprite.width / GAME_SCALE;
            dynamicSprite.y += dynamicSprite.height / GAME_SCALE;
        }
    }

    if(dynamicSprite.onMove !== undefined) dynamicSprite.onMove(true);
};

eventResponses.change_board = function (data) {
    _this.dynamicsData = data.dynamicsData;
    _this.boardIsDungeon = data.boardIsDungeon;
    _this.player.row = data.playerRow;
    _this.player.col = data.playerCol;

    if(_this.boardIsDungeon === false){
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

    if(_this.boardIsDungeon === false){
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

eventResponses.coins_value = function (data) {
    _this.GUI.updateCoinsCounter(data);
};

eventResponses.durability_value = function (data) {
    //console.log("durability_value:", data);
    _this.player.inventory[data.slotKey].updateDurability(data.durability);
};

eventResponses.heal = function (data) {
    _this.chat(data.id, data.amount, "#87b500");
};

eventResponses.damage = function (data) {
    _this.chat(data.id, data.amount, "#ff6700");
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

eventResponses.activate_clothing = function (data) {
    // Show the clothing icon on the inventory slot.
    _this.GUI.inventorySlots[data].equipped.src = 'assets/img/gui/clothing-icon.png';
    _this.GUI.inventorySlots[data].equipped.style.visibility = "visible";
};

eventResponses.deactivate_clothing = function (data) {
    // Hide the equipped icon on the inventory slot.
    _this.GUI.inventorySlots[data].equipped.style.visibility = "hidden";
};

eventResponses.activate_holding = function (data) {
    _this.player.holdingItem = true;
    // Show the holding icon on the inventory slot.
    _this.GUI.inventorySlots[data].equipped.src = 'assets/img/gui/holding-icon.png';
    _this.GUI.inventorySlots[data].equipped.style.visibility = "visible";
};

eventResponses.deactivate_holding = function (data) {
    _this.player.holdingItem = false;
    // Hide the equipped icon on the inventory slot.
    _this.GUI.inventorySlots[data].equipped.style.visibility = "hidden";
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
        sprite.frameName = sprite.baseFrames[data.direction];
    }
    if(sprite.directionAngles !== undefined){
        sprite.angle = sprite.directionAngles[data.direction];
    }
    if(sprite.clothes !== undefined){
        sprite.clothes.frameName = sprite.clothes.clothesFrames[sprite.clothes.clothesName][data.direction];
        sprite.clothes.animations.stop();
    }
    sprite.direction = data.direction;
    sprite.animations.stop();
};

eventResponses.chat = function (data) {
    //console.log("chat:", data);
    _this.chat(data.id, data.message);
};

eventResponses.chat_warning = function (data) {
    _this.chat(undefined, dungeonz.getTextDef(ChatWarnings[data]), "#ffa54f");
};

eventResponses.stat_levelled = function (data) {
    console.log("stat levelled, data:", data);
    _this.GUI.statCounters[data.statName].innerText = data.level;
    const upperCaseStatName = data.statName.charAt(0).toUpperCase() + data.statName.slice(1);
    _this.chat(undefined, dungeonz.getTextDef("Stat name: " + upperCaseStatName) + " level gained!", '#73ff66');
};