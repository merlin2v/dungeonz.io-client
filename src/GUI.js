
class GUI {

    constructor (game) {

        this.game = game;

        // References to the DOM elements for the icons and parents.
        this.gui =                      document.getElementById('gui');

        this.defenceIcon =              document.getElementById('defence_icon');
        this.hitPointIcon =             document.getElementById('hitpoint_icon');
        this.energyIcon =               document.getElementById('energy_icon');
        this.gloryIcon =                document.getElementById('glory_icon');
        this.coinsIcon =                document.getElementById('coins_icon');
        this.bountyIcon =               document.getElementById('bounty_icon');
        this.watchAdIcon =              document.getElementById('watch_ad_icon');
        this.avatarIcon =               document.getElementById('avatar_icon');
        this.inventoryIcon =            document.getElementById('inventory_icon');
        this.exitIcon =                 document.getElementById('exit_icon');
        this.respawnsIcon =             document.getElementById('respawns_icon');
        this.settingsIcon =             document.getElementById('settings_icon');
        this.quickTurnIcon =            document.getElementById('quick_turn_icon');
        this.audioIcon =                document.getElementById('audio_icon');
        this.audioMinusIcon =           document.getElementById('audio_minus_icon');
        this.audioPlusIcon =            document.getElementById('audio_plus_icon');
        this.guiZoomIcon =              document.getElementById('gui_zoom_icon');
        this.guiZoomMinusIcon =         document.getElementById('gui_zoom_minus_icon');
        this.guiZoomPlusIcon =          document.getElementById('gui_zoom_plus_icon');
        this.virtualDPadIcon =          document.getElementById('virtual_dpad_icon');

        this.defenceTooltip =           document.getElementById('defence_tooltip');
        this.hitPointTooltip =          document.getElementById('hitpoint_tooltip');
        this.energyTooltip =            document.getElementById('energy_tooltip');
        this.gloryTooltip =             document.getElementById('glory_tooltip');
        this.coinsTooltip =             document.getElementById('coins_tooltip');
        this.bountyTooltip =            document.getElementById('bounty_tooltip');
        this.watchAdTooltip =           document.getElementById('watch_ad_tooltip');
        this.avatarTooltip =            document.getElementById('avatar_tooltip');
        this.inventoryTooltip =         document.getElementById('inventory_tooltip');
        this.exitTooltip =              document.getElementById('exit_tooltip');
        this.respawnsTooltip =          document.getElementById('respawns_tooltip');
        this.settingsTooltip =          document.getElementById('settings_tooltip');
        this.quickTurnTooltip =         document.getElementById('quick_turn_tooltip');
        this.audioTooltip =             document.getElementById('audio_tooltip');
        this.guiZoomTooltip =           document.getElementById('gui_zoom_tooltip');
        this.virtualDPadTooltip =       document.getElementById('virtual_dpad_tooltip');

        this.gloryCounter =             document.getElementById('glory_counter');
        this.coinsCounter =             document.getElementById('coin_counter');
        this.respawnsCounter =          document.getElementById('respawns_counter');
        this.audioCounter =             document.getElementById('audio_counter');
        this.guiZoomCounter =           document.getElementById('gui_zoom_counter');
        this.virtualDPad =              document.getElementById('virtual_dpad');
        this.virtualDPadUp =            document.getElementById('virtual_dpad_up');
        this.virtualDPadDown =          document.getElementById('virtual_dpad_down');
        this.virtualDPadLeft =          document.getElementById('virtual_dpad_left');
        this.virtualDPadRight =         document.getElementById('virtual_dpad_right');
        this.playAdButton =             document.getElementById('play_ad_button');
        this.dungeonPrompt =            document.getElementById('dungeon_prompt');
        this.respawnPrompt =            document.getElementById('respawn_prompt');
        this.respawnsRemainingValue =   document.getElementById('respawns_remaining_value');
        this.respawnButton =            document.getElementById('respawn_button');
        this.gameOverPrompt =           document.getElementById('game_over_prompt');
        this.playAgainButton =          document.getElementById('play_again_button');
        this.inventory =                document.getElementById('inventory');
        this.borderContainer =          document.getElementById('border_container');
        this.iconContainer =            document.getElementById('icon_container');
        this.durabilityMeterContainer = document.getElementById('durability_meter_container');
        this.itemTooltipContainer =     document.getElementById('item_tooltip_container');
        this.itemTooltipName =          document.getElementById('item_name');
        this.itemTooltipDescription =   document.getElementById('item_description');
        this.itemTooltipDurability =    document.getElementById('item_durability');
        this.chatInput =                document.getElementById('chat_input');

        // Show the GUI.
        this.gui.style.visibility = "visible";

        // Hide the chat input at the start.
        this.chatInput.isActive = false;
        this.chatInput.style.visibility = "hidden";

        // Check if the virtual D-pad should be shown at the start.
        if(dungeonz.virtualDPadEnabled === true) this.virtualDPad.style.visibility = "visible";

        // Check if the quick turn setting is on. Show faded if it isn't.
        if(dungeonz.quickTurnEnabled === true) this.quickTurnIcon.style.opacity = '1';
        else this.quickTurnIcon.style.opacity = '0.5';

        // Attach the events so the tooltips appear when the icons are hovered over.
        this.defenceIcon.onmouseover =  function(){ game.GUI.defenceTooltip.style.visibility = "visible" };
        this.defenceIcon.onmouseout =   function(){ game.GUI.defenceTooltip.style.visibility = "hidden" };

        this.hitPointIcon.onmouseover = function(){ game.GUI.hitPointTooltip.style.visibility = "visible" };
        this.hitPointIcon.onmouseout =  function(){ game.GUI.hitPointTooltip.style.visibility = "hidden" };

        this.energyIcon.onmouseover =   function(){ game.GUI.energyTooltip.style.visibility = "visible" };
        this.energyIcon.onmouseout =    function(){ game.GUI.energyTooltip.style.visibility = "hidden" };

        this.gloryIcon.onmouseover =    function(){ game.GUI.gloryTooltip.style.visibility = "visible" };
        this.gloryIcon.onmouseout =     function(){ game.GUI.gloryTooltip.style.visibility = "hidden" };

        this.coinsIcon.onmouseover =    function(){ game.GUI.coinsTooltip.style.visibility = "visible" };
        this.coinsIcon.onmouseout =     function(){ game.GUI.coinsTooltip.style.visibility = "hidden" };

        this.bountyIcon.onmouseover =   function(){ game.GUI.bountyTooltip.style.visibility = "visible" };
        this.bountyIcon.onmouseout =    function(){ game.GUI.bountyTooltip.style.visibility = "hidden" };

        this.watchAdIcon.onmouseover =  function(){ game.GUI.watchAdTooltip.style.visibility = "visible" };
        this.watchAdIcon.onmouseout =   function(){ game.GUI.watchAdTooltip.style.visibility = "hidden" };
        this.watchAdIcon.onclick =      function(){ document.getElementById('watch_ad_prompt').style.visibility = "visible"};

        this.avatarIcon.onmouseover =   function(){ game.GUI.avatarTooltip.style.visibility = "visible" };
        this.avatarIcon.onmouseout =    function(){ game.GUI.avatarTooltip.style.visibility = "hidden" };

        this.inventoryIcon.onmouseover =function(){ game.GUI.inventoryTooltip.style.visibility = "visible" };
        this.inventoryIcon.onmouseout = function(){ game.GUI.inventoryTooltip.style.visibility = "hidden" };
        this.inventoryIcon.onclick =    function(){ window.ws.sendEvent('pick_up_item'); };

        this.exitIcon.onmouseover =     function(){ game.GUI.exitTooltip.style.visibility = "visible" };
        this.exitIcon.onmouseout =      function(){ game.GUI.exitTooltip.style.visibility = "hidden" };

        this.respawnsIcon.onmouseover = function(){ game.GUI.respawnsTooltip.style.visibility = "visible" };
        this.respawnsIcon.onmouseout =  function(){ game.GUI.respawnsTooltip.style.visibility = "hidden" };

        this.settingsIcon.onmouseover = function(){ game.GUI.settingsTooltip.style.visibility = "visible" };
        this.settingsIcon.onmouseout =  function(){ game.GUI.settingsTooltip.style.visibility = "hidden" };
        this.settingsIcon.onclick =     function(){
            if(game.GUI.settingsIcon.style.opacity === '0.5'){
                game.GUI.settingsIcon.style.opacity = '1';
                game.GUI.quickTurnIcon.style.visibility = "hidden";
                game.GUI.audioIcon.style.visibility = "hidden";
                game.GUI.audioMinusIcon.style.visibility = "hidden";
                game.GUI.audioPlusIcon.style.visibility = "hidden";
                game.GUI.audioCounter.style.visibility = "hidden";
                game.GUI.guiZoomIcon.style.visibility = "hidden";
                game.GUI.guiZoomMinusIcon.style.visibility = "hidden";
                game.GUI.guiZoomPlusIcon.style.visibility = "hidden";
                game.GUI.guiZoomCounter.style.visibility = "hidden";
                game.GUI.virtualDPadIcon.style.visibility = "hidden";
            }
            else {
                game.GUI.settingsIcon.style.opacity = '0.5';
                game.GUI.quickTurnIcon.style.visibility = "visible";
                game.GUI.audioIcon.style.visibility = "visible";
                game.GUI.audioMinusIcon.style.visibility = "visible";
                game.GUI.audioPlusIcon.style.visibility = "visible";
                game.GUI.audioCounter.style.visibility = "visible";
                game.GUI.guiZoomIcon.style.visibility = "visible";
                game.GUI.guiZoomMinusIcon.style.visibility = "visible";
                game.GUI.guiZoomPlusIcon.style.visibility = "visible";
                game.GUI.guiZoomCounter.style.visibility = "visible";
                game.GUI.virtualDPadIcon.style.visibility = "visible";
            }
        };

        this.quickTurnIcon.onmouseover =function(){ game.GUI.quickTurnTooltip.style.visibility = "visible" };
        this.quickTurnIcon.onmouseout = function(){ game.GUI.quickTurnTooltip.style.visibility = "hidden" };
        this.quickTurnIcon.onclick =    function(){
            if(dungeonz.quickTurnEnabled === true){
                dungeonz.quickTurnEnabled = false;
                game.GUI.quickTurnIcon.style.opacity = '0.5';
            }
            else {
                dungeonz.quickTurnEnabled = true;
                game.GUI.quickTurnIcon.style.opacity = '1';
            }
        };

        this.audioIcon.onmouseover =    function(){ game.GUI.audioTooltip.style.visibility = "visible" };
        this.audioIcon.onmouseout =     function(){ game.GUI.audioTooltip.style.visibility = "hidden" };
        this.audioIcon.onclick =        function(){
            if(dungeonz.audioEnabled === true){
                dungeonz.audioEnabled = false;
                game.GUI.audioCounter.innerText = "0%";
                game.GUI.audioIcon.style.opacity = '0.5';
                game.GUI.audioCounter.style.opacity = '0.5';
                game.GUI.audioMinusIcon.style.opacity = '0.5';
                game.GUI.audioPlusIcon.style.opacity = '0.5';
            }
            else {
                dungeonz.audioEnabled = true;
                game.GUI.audioCounter.innerText = dungeonz.audioLevel + "%";
                game.GUI.audioIcon.style.opacity = '1';
                game.GUI.audioCounter.style.opacity = '1';
                game.GUI.audioMinusIcon.style.opacity = '1';
                game.GUI.audioPlusIcon.style.opacity = '1';
            }
        };

        this.audioMinusIcon.onclick =   function(){
            // Don't go below 0 volume.
            if(dungeonz.audioLevel <= 0) return;

            dungeonz.audioLevel -= 10;
            dungeonz.audioEnabled = true;
            game.GUI.audioCounter.innerText = dungeonz.audioLevel + "%";
            game.GUI.audioIcon.style.opacity = '1';
            game.GUI.audioCounter.style.opacity = '1';
            game.GUI.audioMinusIcon.style.opacity = '1';
            game.GUI.audioPlusIcon.style.opacity = '1';
        };

        this.audioPlusIcon.onclick =    function(){
            // Don't go above 1 volume.
            if(dungeonz.audioLevel >= 100) return;

            dungeonz.audioLevel += 10;
            dungeonz.audioEnabled = true;
            game.GUI.audioCounter.innerText = dungeonz.audioLevel + "%";
            game.GUI.audioIcon.style.opacity = '1';
            game.GUI.audioCounter.style.opacity = '1';
            game.GUI.audioMinusIcon.style.opacity = '1';
            game.GUI.audioPlusIcon.style.opacity = '1';
        };

        this.guiZoomIcon.onmouseover =  function(){ game.GUI.guiZoomTooltip.style.visibility = "visible" };
        this.guiZoomIcon.onmouseout =   function(){ game.GUI.guiZoomTooltip.style.visibility = "hidden" };

        this.guiZoomMinusIcon.onclick = function(){
            // Don't go below 10 zoom.
            if(dungeonz.GUIZoom <= 10) return;

            dungeonz.GUIZoom -= 10;
            game.GUI.guiZoomCounter.innerText = dungeonz.GUIZoom + "%";
            //var zoomables = document.getElementsByClassName("zoom");
            const style = document.styleSheets[0].rules[1].style;
            style.zoom = dungeonz.GUIZoom / 100;
            style['-moz-transform'] = 'scale(' + dungeonz.GUIZoom / 100 + ')';
        };

        this.guiZoomPlusIcon.onclick =  function(){
            // Don't go above 400 zoom.
            if(dungeonz.GUIZoom >= 400) return;

            dungeonz.GUIZoom += 10;
            game.GUI.guiZoomCounter.innerText = dungeonz.GUIZoom + "%";
            //var zoomables = document.getElementsByClassName("zoom");
            const style = document.styleSheets[0].rules[1].style;
            style.zoom = dungeonz.GUIZoom / 100;
            style['-moz-transform'] = 'scale(' + dungeonz.GUIZoom / 100 + ')';
        };

        this.virtualDPadIcon.onmouseover =  function(){ game.GUI.virtualDPadTooltip.style.visibility = "visible" };
        this.virtualDPadIcon.onmouseout =   function(){ game.GUI.virtualDPadTooltip.style.visibility = "hidden" };
        this.virtualDPadIcon.onclick =  function(){
            if(dungeonz.virtualDPadEnabled === true){
                dungeonz.virtualDPadEnabled = false;
                game.GUI.virtualDPad.style.visibility = "hidden";
                game.GUI.virtualDPadIcon.style.opacity = "0.5";
            }
            else {
                dungeonz.virtualDPadEnabled = true;
                game.GUI.virtualDPad.style.visibility = "visible";
                game.GUI.virtualDPadIcon.style.opacity = "1";
            }
        };

        this.virtualDPadUp.onclick =        function(){
            window.ws.sendEvent('move_up');
        };
        this.virtualDPadDown.onclick =      function(){
            window.ws.sendEvent('move_down');
        };
        this.virtualDPadLeft.onclick =      function(){
            window.ws.sendEvent('move_left');
        };
        this.virtualDPadRight.onclick =     function(){
            window.ws.sendEvent('move_right');
        };

        document.getElementById('dungeon_prompt_accept').onclick = function (event) {
            // Check if the player has enough glory.
            if(_this.player.glory < dungeonz.DungeonPrompts[_this.adjacentDungeonID].gloryCost){
                _this.chat(undefined, dungeonz.getTextDef("Not enough glory warning"), "#ffa54f");
            }
            else {
                // Attempt to enter the dungeon. Send the server the ID of the dungeon instance.
                window.ws.sendEvent("enter_dungeon", _this.adjacentDungeonID);
            }

            // Hide the prompt.
            game.GUI.dungeonPrompt.style.visibility = "hidden";
        };
        document.getElementById('dungeon_prompt_decline').onclick = function (event) {
            // Hide the prompt.
            game.GUI.dungeonPrompt.style.visibility = "hidden";
        };

        this.respawnButton.onclick = function (event) {
            window.ws.sendEvent("respawn");
        };

        this.playAgainButton.onclick = function (event) {
            // Refresh the page.
            location.reload();
        };

        // References to the DOM elements for the variable things.
        this.defenceCounters = [];
        this.hitPointCounters = [];
        this.energyCounters = [];

        // Rearrange the order of the slot numbers, as the 0 key is at the right end of keyboards.
        this.slotKeysByIndex = ["slot1", "slot2", "slot3", "slot4", "slot5", "slot6", "slot7", "slot8", "slot9", "slot0"];
        this.inventorySlotBorders = {};
        this.inventorySlotIcons = {};
        this.inventorySlotDurabilityMeters = {};

        this.addDefenceCounters(this.game.player.maxDefence);
        this.addHitPointCounters(this.game.player.maxHitPoints);
        this.addEnergyCounters(this.game.player.maxEnergy);
        this.addInventorySlotBorders();
        this.addInventorySlotIcons();
        this.addInventorySlotDurabilityMeters();

        // Set the values for the text based counters (glory, coins).
        this.gloryCounter.innerText = this.game.player.glory;
        this.coinsCounter.innerText = this.game.player.coins;
        this.respawnsCounter.innerText = this.game.player.respawns;
        this.audioCounter.innerText = dungeonz.audioLevel + "%";
        this.guiZoomCounter.innerText = dungeonz.GUIZoom + "%";
        this.respawnsRemainingValue.innerText = this.game.player.respawns;

    }

    addDefenceCounters (amount) {
        this.addCounters(amount, this.defenceIcon, 'defence-counter', this.defenceCounters);
        this.updateDefenceCounters();
    }

    addHitPointCounters (amount) {
        this.addCounters(amount, this.hitPointIcon, 'hitpoint-counter', this.hitPointCounters);
    }

    addEnergyCounters (amount) {
        this.addCounters(amount, this.energyIcon, 'energy-counter', this.energyCounters);
    }

    addCounters (amount, icon, imageName, groupArray) {

        this.removeExistingDOMElements(groupArray);

        const iconTop = icon.offsetTop;
        const halfIconHeight = icon.clientHeight / 2;
        const halfCounterHeight = 8;

        for(let i=0; i<amount; i+=1){
            const element = document.createElement('img');

            element.src = 'assets/img/gui/' + imageName + '.png';

            element.className = "icon_counter gui_zoom";

            //element.style.position = 'absolute';
            element.style.top = (halfIconHeight - halfCounterHeight) + iconTop + 'px';
            element.style.left = (46 + (18 * i)) + 'px';
            //element.style.width = "16px";
            //element.style.height = "16px";


            groupArray.push(element);

            this.gui.appendChild(element);
        }
    }

    removeExistingDOMElements (groupObject) {
        //console.log("remove existing counters, ", groupObject);

        // Check if the group is an array, such as the defence/HP counters.
        if(Array.isArray(groupObject)){
            //console.log("group is an array");
            if(groupObject.length < 1) return;

            // Remove any existing icons of this type.
            for(let i=0; i<groupObject.length; i+=1){

                //console.log("removing counter");
                //console.dir(groupObject[i]);
                groupObject[i].remove();
            }
            // Empty the object.
            groupObject.length = 0;
        }
        // Is a regular object.
        else {
            //console.log("group is an object");
            // Remove any existing icons of this type.
            for(let key in groupObject){
                if(groupObject.hasOwnProperty(key) === false) continue;

                //console.log("removing counter");
                //console.dir(groupObject[key]);
                groupObject[key].remove();
            }
        }

    }

    updateDefenceCounters () {
        // Defence might be in 0.5s as well as whole numbers, so round down to only count each full defence counter.
        let defence = Math.floor(this.game.player.defence);
        let maxDefence = this.game.player.maxDefence;

        for(let i=0; i<maxDefence; i+=1){
            if(i < defence){
                this.defenceCounters[i].src = "./assets/img/gui/defence-counter.png";
            }
            else {
                this.defenceCounters[i].src = "./assets/img/gui/empty-counter.png";
            }
        }
    }

    updateHitPointCounters () {
        // Hitpoints might be in 0.5s as well as whole numbers, so round down to only count each full hitpoint counter.
        let hitPoints = Math.floor(this.game.player.hitPoints);
        let maxHitPoints = this.game.player.maxHitPoints;

        for(let i=0; i<maxHitPoints; i+=1){
            if(i < hitPoints){
                this.hitPointCounters[i].src = "./assets/img/gui/hitpoint-counter.png";
            }
            else {
                this.hitPointCounters[i].src = "./assets/img/gui/empty-counter.png";
            }
        }
    }

    updateEnergyCounters () {
        // Energy can be in 0.5s as well as whole numbers, so round down to only count each full energy counter.
        let energy = Math.floor(this.game.player.energy);
        let maxEnergy = this.game.player.maxEnergy;

        for(let i=0; i<maxEnergy; i+=1){
            if(i < energy){
                this.energyCounters[i].src = "./assets/img/gui/energy-counter.png";
            }
            else {
                this.energyCounters[i].src = "./assets/img/gui/empty-counter.png";
            }
        }
    }

    addInventorySlotBorders () {
        this.removeExistingDOMElements(this.inventorySlotBorders);

        const slotKeysByIndex = this.slotKeysByIndex;

        // Create 10 slots.
        for(let i=0; i<10; i+=1){
            //console.log("loop:", i, " slot num:", this.slotKeysByIndex[i]);
            const element = document.createElement('img');

            element.src = 'assets/img/gui/inventory-slot-border.png';
            element.className = 'inventory_slot_border zoom';
            // Use the item in this slot when pressed.
            element.onclick = function () {
                //console.log('invent slot pressed: ' + slotKeysByIndex[i]);
                _this.inventorySlotPressed(slotKeysByIndex[i]);
            };
            // Show and update the item tooltip info text when mouse is over a slot.
            element.onmouseover = function () {

                //console.log("on border mouse over, this:", slotKeysByIndex[i]);

                const inventorySlot = _this.player.inventory[slotKeysByIndex[i]];
                // Skip empty inventory slots.
                if(inventorySlot.catalogueEntry === null) return;

                //console.log(inventorySlot);

                // Show the container.
                _this.GUI.itemTooltipContainer.style.visibility = "visible";
                // Update the contents.
                _this.GUI.itemTooltipName.innerHTML = dungeonz.getTextDef("Item name: " + inventorySlot.catalogueEntry.idName);
                _this.GUI.itemTooltipDescription.innerHTML = dungeonz.getTextDef("Item description: " + inventorySlot.catalogueEntry.idName);

                if(inventorySlot.durability === null)
                    _this.GUI.itemTooltipDurability.innerHTML = "";
                else
                    _this.GUI.itemTooltipDurability.innerHTML = "(" + inventorySlot.durability + "/" + inventorySlot.maxDurability + ")";

            };
            // Hide the item tooltip when mouse is not over a slot.
            element.onmouseout = function () {
                //console.log("on border mouse out, this:", slotKeysByIndex[i]);
                _this.GUI.itemTooltipContainer.style.visibility = "hidden";
            };

            this.inventorySlotBorders[slotKeysByIndex[i]] = element;

            this.borderContainer.appendChild(element);
        }
    }

    addInventorySlotIcons () {
        this.removeExistingDOMElements(this.inventorySlotIcons);

        let i=0;
        for(let key in this.inventorySlotBorders){
            if(this.inventorySlotBorders.hasOwnProperty(key) === false) continue;

            const element = document.createElement('img');

            element.src = 'assets/img/gui/icons/icon-gold.png';
            element.className = 'inventory_slot_icon zoom';
            element.style.visibility = "hidden";

            this.inventorySlotIcons[this.slotKeysByIndex[i]] = element;

            this.iconContainer.appendChild(element);

            i+=1;
        }
    }

    addInventorySlotDurabilityMeters () {
        this.removeExistingDOMElements(this.inventorySlotDurabilityMeters);

        let i=0;
        for(let key in this.inventorySlotBorders){
            if(this.inventorySlotBorders.hasOwnProperty(key) === false) continue;

            const element = document.createElement('img');

            element.src = 'assets/img/gui/durability-meter-10.png';
            element.className = 'inventory_slot_durability_meter zoom';
            element.style.visibility = "hidden";

            this.inventorySlotDurabilityMeters[this.slotKeysByIndex[i]] = element;

            this.durabilityMeterContainer.appendChild(element);

            i+=1;
        }
    }

    updateDungeonPrompt () {
        const prompt = dungeonz.DungeonPrompts[_this.adjacentDungeonID];
        document.getElementById('dungeon_prompt_name_value').innerText = dungeonz.getTextDef(prompt.nameDefinitionID);
        document.getElementById('dungeon_prompt_difficulty_value').innerText = dungeonz.getTextDef(prompt.difficulty);
        document.getElementById('dungeon_prompt_glory_cost_value').innerText = prompt.gloryCost;
    }

}

export default GUI;