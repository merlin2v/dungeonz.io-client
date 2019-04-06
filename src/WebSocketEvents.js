
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

eventResponses.dmp_code_accepted = function () {
    console.log("* DMP code accepted");
    // Keep this stored for future reference.
    localStorage.setItem('DMP_activated', "true");
    dungeonz.DMPActivated = true;
};

eventResponses.invalid_dmp_code = function () {
    console.log("* Invalid DMP code");
    // Get the warning text.
    let element = document.getElementById("warning_message");
    // Show the server connect error message.
    element.innerText = dungeonz.getTextDef("Invalid DMP code warning");
    // Show it.
    element.style.visibility = "visible";
    // Make it disappear after a few seconds.
    setTimeout(function () {
        element.style.visibility = "hidden";
    }, 8000);
    // The DMP code is not activated.
    localStorage.setItem('DMP_activated', "false");
    dungeonz.DMPActivated = true;
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
    console.log("* Join world success, data:");
    console.log(data);

    document.getElementById("home_cont").style.display = "none";

    // If something is wrong, close the connection.
    if(!_this.state){
        console.log("* WARNING: _this.state is invalid. Closing WS connection. _this:", _this);
        setTimeout(function () {
            ws.close();
        }, 10000);
        return;
    }

    _this.state.start('Game', true, false, data);

    // Add the websocket event responses after the game state is started.
    addGameStateEventResponses();
};

eventResponses.world_full = function () {
    console.log("* World is full.");
};

function tweenCompleteLeft () {
    _this.tilemap.groundGridBitmapData.move(dungeonz.TILE_SIZE, 0);
    _this.tilemap.staticsGridBitmapData.move(dungeonz.TILE_SIZE, 0);
    _this.tilemap.groundGridGraphic.x -= dungeonz.TILE_SIZE * GAME_SCALE;
    _this.tilemap.staticsGridGraphic.x -= dungeonz.TILE_SIZE * GAME_SCALE;
    //_this.tilemap.darknessGridGroup.x -= dungeonz.TILE_SIZE * GAME_SCALE;
    _this.tilemap.updateGroundGridEdgeLeft();
    _this.tilemap.updateStaticsGridEdgeLeft();
    _this.tilemap.updateDarknessGrid();
    _this.playerTween = null;
    _this.playerTweenDirections.l = false;
}

function tweenCompleteRight () {
    _this.tilemap.groundGridBitmapData.move(-dungeonz.TILE_SIZE, 0);
    _this.tilemap.staticsGridBitmapData.move(-dungeonz.TILE_SIZE, 0);
    _this.tilemap.groundGridGraphic.x += dungeonz.TILE_SIZE * GAME_SCALE;
    _this.tilemap.staticsGridGraphic.x += dungeonz.TILE_SIZE * GAME_SCALE;
    //_this.tilemap.darknessGridGroup.x += dungeonz.TILE_SIZE * GAME_SCALE;
    _this.tilemap.updateGroundGridEdgeRight();
    _this.tilemap.updateStaticsGridEdgeRight();
    _this.tilemap.updateDarknessGrid();
    _this.playerTween = null;
    _this.playerTweenDirections.r = false;
}

function tweenCompleteUp () {
    _this.tilemap.groundGridBitmapData.move(0, dungeonz.TILE_SIZE);
    _this.tilemap.staticsGridBitmapData.move(0, dungeonz.TILE_SIZE);
    _this.tilemap.groundGridGraphic.y -= dungeonz.TILE_SIZE * GAME_SCALE;
    _this.tilemap.staticsGridGraphic.y -= dungeonz.TILE_SIZE * GAME_SCALE;
    //_this.tilemap.darknessGridGroup.y -= dungeonz.TILE_SIZE * GAME_SCALE;
    _this.tilemap.updateGroundGridEdgeTop();
    _this.tilemap.updateStaticsGridEdgeTop();
    _this.tilemap.updateDarknessGrid();
    _this.playerTween = null;
    _this.playerTweenDirections.u = false;
}

function tweenCompleteDown () {
    _this.tilemap.groundGridBitmapData.move(0, -dungeonz.TILE_SIZE);
    _this.tilemap.staticsGridBitmapData.move(0, -dungeonz.TILE_SIZE);
    _this.tilemap.groundGridGraphic.y += dungeonz.TILE_SIZE * GAME_SCALE;
    _this.tilemap.staticsGridGraphic.y += dungeonz.TILE_SIZE * GAME_SCALE;
    //_this.tilemap.darknessGridGroup.y += dungeonz.TILE_SIZE * GAME_SCALE;
    _this.tilemap.updateGroundGridEdgeBottom();
    _this.tilemap.updateStaticsGridEdgeBottom();
    _this.tilemap.updateDarknessGrid();
    _this.playerTween = null;
    _this.playerTweenDirections.d = false;
}

function addGameStateEventResponses() {

eventResponses.moved = function (data) {
    //console.log("moved: ", data);

    if(_this.dynamics === undefined){
        // Something went wrong... Reload the page.
        //location.reload();
        return;
    }

    const dynamic = _this.dynamics[data.id];

    // Check the entity id is valid.
    if(dynamic === undefined) return;

    const dynamicSprite = dynamic.sprite;

    // The client player moved.
    if(data.id === _this.player.entityId){
        //console.log("player moved, data:", data);
        let origRow = _this.player.row;
        let origCol = _this.player.col;

        // Make sure the current tween has stopped, so it finishes with moving the tilemap in that direction correctly.
        if(_this.playerTween !== null){
            _this.playerTween.stop(true);
            //_this.tilemap.checkPendingStaticTileChanges();
        }

        // Do this AFTER stopping the current player tween, so it can finish with the
        // previous position (the one that matches the state the tween starts in).
        _this.player.row = data.row;
        _this.player.col = data.col;

        dynamic.row = data.row;
        dynamic.col = data.col;

        // Tween the player sprite to the target row/col.
        _this.playerTween = _this.add.tween(dynamicSprite).to({
            x: data.col * dungeonz.TILE_SCALE,
            y: data.row * dungeonz.TILE_SCALE
        }, _this.moveDelay, null, true);

        // Right.
        if(data.col > origCol){
            _this.offsetOtherDynamics(0, -1);
            _this.offsetStaticTiles(0, -1);
            _this.playerTween.onComplete.add(tweenCompleteRight);
            _this.playerTweenDirections.r = true;
            _this.tilemap.darknessGridGroup.x += dungeonz.TILE_SIZE * GAME_SCALE;
        }
        // Left.
        else if(data.col < origCol){
            _this.offsetOtherDynamics(0, +1);
            _this.offsetStaticTiles(0, +1);
            _this.playerTween.onComplete.add(tweenCompleteLeft);
            _this.playerTweenDirections.l = true;
            _this.tilemap.darknessGridGroup.x -= dungeonz.TILE_SIZE * GAME_SCALE;
        }
        // Down.
        if(data.row > origRow){
            _this.offsetOtherDynamics(+1, 0);
            _this.offsetStaticTiles(+1, 0);
            _this.playerTween.onComplete.add(tweenCompleteDown);
            _this.playerTweenDirections.d = true;
            _this.tilemap.darknessGridGroup.y += dungeonz.TILE_SIZE * GAME_SCALE;
        }
        // Up.
        else if(data.row < origRow){
            _this.offsetOtherDynamics(-1, 0);
            _this.offsetStaticTiles(-1, 0);
            _this.playerTween.onComplete.add(tweenCompleteUp);
            _this.playerTweenDirections.u = true;
            _this.tilemap.darknessGridGroup.y -= dungeonz.TILE_SIZE * GAME_SCALE;
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
            return;
        }

        // Tween to the new location.
        if(dynamicSprite.centered === true){
            _this.add.tween(dynamicSprite).to({
                x: (data.col * dungeonz.TILE_SCALE) + dungeonz.CENTER_OFFSET,
                y: (data.row * dungeonz.TILE_SCALE) + dungeonz.CENTER_OFFSET
            }, 250, null, true);//TODO get the move rate of each dynamic, and use this here (250) for smoother timing
        }
        else {
            _this.add.tween(dynamicSprite).to({
                x: data.col * dungeonz.TILE_SCALE,
                y: data.row * dungeonz.TILE_SCALE
            }, 250, null, true);
        }
    }

    if(dynamicSprite.onMove !== undefined) dynamicSprite.onMove(true);

    _this.dynamicsGroup.sort('y', Phaser.Group.SORT_ASCENDING);
};

eventResponses.change_board = function (data) {
    //console.log("change board, data:", data);
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

    // Lock the camera to the player sprite.
    _this.camera.follow(_this.dynamics[_this.player.entityId].sprite.baseSprite);

    // Refresh the darkness grid.
    _this.tilemap.updateDarknessGrid();
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

eventResponses.hit_point_value = function (data) {
    _this.player.hitPoints = data;
    if(_this.player.hitPoints <= 0){
        // If the player has any respawns left, show the respawn panel.
        if(_this.player.respawns > 0){
            _this.GUI.respawnPanel.show();
        }
        // No respawns left. Game over...
        else {
            _this.GUI.gameOverPanel.show();
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
    _this.GUI.respawnPanel.hide();
    _this.GUI.updateHitPointCounters();
    _this.GUI.updateEnergyCounters();
};

eventResponses.add_entity = function (data) {
    //console.log("add entity event:", data);
    if(_this.addEntity === undefined) return;
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
    _this.GUI.inventoryBar.slots[data].equipped.src = 'assets/img/gui/hud/ammunition-icon.png';
    _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "visible";
};

eventResponses.deactivate_ammunition = function (data) {
    // Hide the equipped icon on the inventory slot.
    _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "hidden";
};

eventResponses.activate_clothing = function (data) {
    // Show the equipped icon on the inventory slot.
    _this.GUI.inventoryBar.slots[data].equipped.src = 'assets/img/gui/hud/clothing-icon.png';
    _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "visible";
};

eventResponses.deactivate_clothing = function (data) {
    // Hide the equipped icon on the inventory slot.
    _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "hidden";
};

eventResponses.activate_holding = function (data) {
    _this.player.holdingItem = true;
    // Show the equipped icon on the inventory slot.
    _this.GUI.inventoryBar.slots[data].equipped.src = 'assets/img/gui/hud/holding-icon.png';
    _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "visible";
    // Change the cursor to the attack icon.
    _this.GUI.gui.className = "attack_cursor";
};

eventResponses.deactivate_holding = function (data) {
    _this.player.holdingItem = false;
    // Hide the equipped icon on the inventory slot.
    _this.GUI.inventoryBar.slots[data].equipped.style.visibility = "hidden";
    _this.GUI.spellBar.hide();
    // Change the cursor to the normal icon.
    _this.GUI.gui.className = "normal_cursor";
};

/**
 *
 * @param data - The type number of the spell book being held.
 */
eventResponses.activate_spell_book = function (data) {
    _this.GUI.spellBar.changeSpellBook(data[1]);
    _this.GUI.spellBar.show();
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
    _this.tilemap.updateStaticTile(data, true);
};

eventResponses.inactive_state = function (data) {
    //console.log("inactive state change:", data);
    _this.tilemap.updateStaticTile(data, false);
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
    //console.log("shop prices, data:", data);
    _this.GUI.shopPanel.updatePrices(data);
};

eventResponses.clan_joined = function (data) {
    //console.log("clan joined, data:", data);
    _this.clanManager.memberJoined(data);
};

// A member was kicked from the clan. Might have been this player.
eventResponses.clan_kicked = function (data) {
    //console.log("clan kicked, data:", data);
    _this.clanManager.memberKicked(data);
};

// Another member left the clan.
eventResponses.clan_left = function (data) {
    //console.log("clan left, data:", data);
    _this.clanManager.memberLeft(data);
};

eventResponses.clan_promoted = function (data) {
    //console.log("clan promoted, data:", data);
    _this.clanManager.promoteMember(data);
};

eventResponses.clan_destroyed = function (data) {
    //console.log("clan destroyed, data:", data);
    _this.clanManager.destroyed();
};

eventResponses.clan_values = function (data) {
    //console.log("clan values, data:", data);
    _this.GUI.clanPanel.updateValues(data);
};

eventResponses.task_progress_made = function (data) {
    //console.log("task progresss made, data:", data);
    _this.GUI.tasksPanel.updateTaskProgress(data.taskID, data.progress);
};

eventResponses.task_claimed = function (data) {
    //console.log("task claimed, data:", data);
    _this.GUI.tasksPanel.removeTask(data);
};

eventResponses.task_added = function (data) {
    //console.log("task added, data:", data);
    if(_this.GUI === undefined) return;

    _this.GUI.tasksPanel.addTask(data.taskID, data.progress);
};

};