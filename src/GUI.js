
class GUI {

    constructor (game) {

        this.game = game;

        // References to the DOM elements for the icons and parents.
        this.gui =                      document.getElementById('gui_cont');

        this.defenceIcon =              document.getElementById('defence_icon');
        this.hitPointIcon =             document.getElementById('hitpoint_icon');
        this.energyIcon =               document.getElementById('energy_icon');
        this.gloryIcon =                document.getElementById('glory_icon');
        this.coinsIcon =                document.getElementById('coins_icon');
        this.bountyIcon =               document.getElementById('bounty_icon');
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
        this.fullscreenIcon =           document.getElementById('fullscreen_icon');

        this.defenceTooltip =           document.getElementById('defence_tooltip');
        this.hitPointTooltip =          document.getElementById('hitpoint_tooltip');
        this.energyTooltip =            document.getElementById('energy_tooltip');
        this.gloryTooltip =             document.getElementById('glory_tooltip');
        this.coinsTooltip =             document.getElementById('coins_tooltip');
        this.bountyTooltip =            document.getElementById('bounty_tooltip');
        this.avatarTooltip =            document.getElementById('avatar_tooltip');
        this.inventoryTooltip =         document.getElementById('inventory_tooltip');
        this.exitTooltip =              document.getElementById('exit_tooltip');
        this.respawnsTooltip =          document.getElementById('respawns_tooltip');
        this.settingsTooltip =          document.getElementById('settings_tooltip');
        this.quickTurnTooltip =         document.getElementById('quick_turn_tooltip');
        this.audioTooltip =             document.getElementById('audio_tooltip');
        this.guiZoomTooltip =           document.getElementById('gui_zoom_tooltip');
        this.virtualDPadTooltip =       document.getElementById('virtual_dpad_tooltip');
        this.fullscreenTooltip =        document.getElementById('fullscreen_tooltip');

        this.gloryCounter =             document.getElementById('glory_counter');
        this.gloryCounterTransition =   document.getElementById('glory_counter_transition');
        this.coinsCounter =             document.getElementById('coin_counter');
        this.coinsCounterTransition =   document.getElementById('coin_counter_transition');
        this.respawnsCounter =          document.getElementById('respawns_counter_value');
        this.respawnsCounterTransition =document.getElementById('respawns_counter_transition');
        this.audioCounter =             document.getElementById('audio_counter');
        this.guiZoomCounter =           document.getElementById('gui_zoom_counter');
        this.virtualDPad =              document.getElementById('virtual_dpad');
        this.virtualDPadUp =            document.getElementById('virtual_dpad_up');
        this.virtualDPadDown =          document.getElementById('virtual_dpad_down');
        this.virtualDPadLeft =          document.getElementById('virtual_dpad_left');
        this.virtualDPadRight =         document.getElementById('virtual_dpad_right');
        this.statsContainer =           document.getElementById('stats_cont');
        this.statTooltipContainer =     document.getElementById('stat_tooltip_cont');
        this.statName =                 document.getElementById('stat_name');
        this.statDescription =          document.getElementById('stat_description');
        this.statCounters = {
            melee:                      document.getElementById('stat_melee_counter'),
            ranged:                     document.getElementById('stat_ranged_counter'),
            magic:                      document.getElementById('stat_magic_counter'),
            gathering:                  document.getElementById('stat_gathering_counter'),
            weaponry:                   document.getElementById('stat_weaponry_counter'),
            armoury:                    document.getElementById('stat_armour_counter'),
            toolery:                    document.getElementById('stat_toolery_counter'),
            cookery:                    document.getElementById('stat_cookery_counter'),
            potionry:                   document.getElementById('stat_potionry_counter')
        };
        this.dungeonPrompt =            document.getElementById('dungeon_prompt');
        this.respawnPrompt =            document.getElementById('respawn_prompt');
        this.respawnsRemainingValue =   document.getElementById('respawns_remaining_value');
        this.respawnButton =            document.getElementById('respawn_button');
        this.gameOverPrompt =           document.getElementById('game_over_prompt');
        this.playAgainButton =          document.getElementById('play_again_button');
        this.inventorySlotContainer =   document.getElementById('inventory_slot_cont');
        this.itemTooltipContainer =     document.getElementById('item_tooltip_cont');
        this.itemTooltipName =          document.getElementById('item_name');
        this.itemTooltipDescription =   document.getElementById('item_description');
        this.itemTooltipDurability =    document.getElementById('item_durability');
        this.craftingPanel =            document.getElementById('crafting_panel');
        this.craftingStationName =      document.getElementById('crafting_station_name');
        this.chatInput =                document.getElementById('chat_input');

        // Show the GUI.
        this.gui.style.visibility = "visible";

        // Hide the chat input at the start.
        this.chatInput.isActive = false;
        this.chatInput.style.visibility = "hidden";

        // Make sure the collapsible settings are hidden.
        this.settingsIcon.style.opacity = '1';
        this.quickTurnIcon.style.visibility = "hidden";
        this.audioIcon.style.visibility = "hidden";
        this.audioMinusIcon.style.visibility = "hidden";
        this.audioPlusIcon.style.visibility = "hidden";
        this.audioCounter.style.visibility = "hidden";
        this.guiZoomIcon.style.visibility = "hidden";
        this.guiZoomMinusIcon.style.visibility = "hidden";
        this.guiZoomPlusIcon.style.visibility = "hidden";
        this.guiZoomCounter.style.visibility = "hidden";
        this.virtualDPadIcon.style.visibility = "hidden";
        this.fullscreenIcon.style.visibility = "hidden";

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

        this.avatarIcon.onmouseover =   function(){ game.GUI.avatarTooltip.style.visibility = "visible" };
        this.avatarIcon.onmouseout =    function(){ game.GUI.avatarTooltip.style.visibility = "hidden" };
        this.avatarIcon.onclick =       function(){
            if(game.GUI.statsContainer.style.visibility === "visible"){
                game.GUI.statsContainer.style.visibility = "hidden"
            }
            else {
                game.GUI.statsContainer.style.visibility = "visible"
            }
        };

        function changeStatTooltip (statName) {
            game.GUI.statTooltipContainer.style.visibility = "visible";
            game.GUI.statName.innerText = dungeonz.getTextDef("Stat name: " + statName);
            game.GUI.statDescription.innerText = dungeonz.getTextDef("Stat description: " + statName);
        }

        document.getElementById('stat_melee_icon').onmouseover =  function(){ changeStatTooltip("Melee") };
        document.getElementById('stat_melee_icon').onmouseout =  function(){ game.GUI.statTooltipContainer.style.visibility = "hidden" };

        document.getElementById('stat_ranged_icon').onmouseover =  function(){ changeStatTooltip("Ranged") };
        document.getElementById('stat_ranged_icon').onmouseout = function(){ game.GUI.statTooltipContainer.style.visibility = "hidden" };

        document.getElementById('stat_magic_icon').onmouseover =  function(){ changeStatTooltip("Magic") };
        document.getElementById('stat_magic_icon').onmouseout =  function(){ game.GUI.statTooltipContainer.style.visibility = "hidden" };

        document.getElementById('stat_gathering_icon').onmouseover =  function(){ changeStatTooltip("Gathering") };
        document.getElementById('stat_gathering_icon').onmouseout =  function(){ game.GUI.statTooltipContainer.style.visibility = "hidden" };

        document.getElementById('stat_weaponry_icon').onmouseover =  function(){ changeStatTooltip("Weaponry") };
        document.getElementById('stat_weaponry_icon').onmouseout =  function(){ game.GUI.statTooltipContainer.style.visibility = "hidden" };

        document.getElementById('stat_armoury_icon').onmouseover =  function(){ changeStatTooltip("Armoury") };
        document.getElementById('stat_armoury_icon').onmouseout =  function(){ game.GUI.statTooltipContainer.style.visibility = "hidden" };

        document.getElementById('stat_toolery_icon').onmouseover =  function(){ changeStatTooltip("Toolery") };
        document.getElementById('stat_toolery_icon').onmouseout =  function(){ game.GUI.statTooltipContainer.style.visibility = "hidden" };

        document.getElementById('stat_cookery_icon').onmouseover =  function(){ changeStatTooltip("Cookery") };
        document.getElementById('stat_cookery_icon').onmouseout =  function(){ game.GUI.statTooltipContainer.style.visibility = "hidden" };

        document.getElementById('stat_potionry_icon').onmouseover =  function(){ changeStatTooltip("Potionry") };
        document.getElementById('stat_potionry_icon').onmouseout =  function(){ game.GUI.statTooltipContainer.style.visibility = "hidden" };

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
                game.GUI.fullscreenIcon.style.visibility = "hidden";
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
                game.GUI.fullscreenIcon.style.visibility = "visible";
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

        let getStyle = function(className){
            let classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
            for (let x = 0; x < classes.length; x++) {
                if (classes[x].selectorText === className) {
                    return classes[x].style;
                }
            }
        };

        this.guiZoomMinusIcon.onclick = function(){
            // Don't go below 10 zoom.
            if(dungeonz.GUIZoom <= 10) return;

            dungeonz.GUIZoom -= 10;
            game.GUI.guiZoomCounter.innerText = dungeonz.GUIZoom + "%";

            const style = getStyle('.gui_zoomable');
            style.zoom = dungeonz.GUIZoom / 100;
            style['-moz-transform'] = 'scale(' + dungeonz.GUIZoom / 100 + ')';
        };

        this.guiZoomPlusIcon.onclick =  function(){
            // Don't go above 400 zoom.
            if(dungeonz.GUIZoom >= 400) return;

            dungeonz.GUIZoom += 10;
            game.GUI.guiZoomCounter.innerText = dungeonz.GUIZoom + "%";

            const style = getStyle('.gui_zoomable');
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

        this.virtualDPadUp.onmousedown =    game.moveUpPressed;
        this.virtualDPadUp.onmouseup =      game.moveUpReleased;
        this.virtualDPadUp.onmouseout =     game.moveUpReleased;

        this.virtualDPadDown.onmousedown =  game.moveDownPressed;
        this.virtualDPadDown.onmouseup =    game.moveDownReleased;
        this.virtualDPadDown.onmouseout =   game.moveDownReleased;

        this.virtualDPadLeft.onmousedown =  game.moveLeftPressed;
        this.virtualDPadLeft.onmouseup =    game.moveLeftReleased;
        this.virtualDPadLeft.onmouseout =   game.moveLeftReleased;

        this.virtualDPadRight.onmousedown = game.moveRightPressed;
        this.virtualDPadRight.onmouseup =   game.moveRightReleased;
        this.virtualDPadRight.onmouseout =  game.moveRightReleased;

        this.fullscreenIcon.onmouseover =  function(){ game.GUI.fullscreenTooltip.style.visibility = "visible" };
        this.fullscreenIcon.onmouseout =   function(){ game.GUI.fullscreenTooltip.style.visibility = "hidden" };
        this.fullscreenIcon.onclick =  function(){
            if(game.game.scale.isFullScreen === true){

                game.game.scale.stopFullScreen();
                game.GUI.fullscreenIcon.style.opacity = "0.5";
            }
            else {
                game.game.scale.startFullScreen(true);
                game.GUI.fullscreenIcon.style.opacity = "1";
            }
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
        this.inventorySlots = {};

        this.addDefenceCounters(this.game.player.maxDefence);
        this.addHitPointCounters(this.game.player.maxHitPoints);
        this.addEnergyCounters(this.game.player.maxEnergy);
        this.addInventorySlots();

        // Set the values for the text based counters (glory, coins).
        this.gloryCounter.innerText = this.game.player.glory;
        this.gloryCounterTransition.addEventListener('webkitAnimationEnd', this.textCounterWebkitAnimationEnd, false);
        this.coinsCounter.innerText = this.game.player.coins;
        this.coinsCounterTransition.addEventListener('webkitAnimationEnd', this.textCounterWebkitAnimationEnd, false);
        this.respawnsCounter.innerText = this.game.player.respawns;
        this.respawnsCounterTransition.addEventListener('webkitAnimationEnd', this.textCounterWebkitAnimationEnd, false);
        this.audioCounter.innerText = dungeonz.audioLevel + "%";
        this.guiZoomCounter.innerText = dungeonz.GUIZoom + "%";
        this.respawnsRemainingValue.innerText = this.game.player.respawns;

        this.dragData = null;

        // Make the various panels draggable.
        this.makeElementDraggable(document.getElementById('crafting_station_name'), this.craftingPanel);


    }

    addDefenceCounters (amount) {
        this.addCounters(amount, this.defenceIcon, 'defence', this.defenceCounters);
        this.updateDefenceCounters();
    }

    addHitPointCounters (amount) {
        this.addCounters(amount, this.hitPointIcon, 'hitpoint', this.hitPointCounters);
    }

    addEnergyCounters (amount) {
        this.addCounters(amount, this.energyIcon, 'energy', this.energyCounters);
    }

    textCounterWebkitAnimationEnd () {
        this.style.webkitAnimationName = '';
    }

    addCounters (amount, icon, type, groupArray) {

        this.removeExistingDOMElements(groupArray);

        const iconTop = icon.offsetTop;
        const halfIconHeight = icon.clientHeight / 2;
        const halfCounterHeight = 8;
        const container = document.getElementById(type + "_counters");

        for(let i=0; i<amount; i+=1){
            const element = document.createElement('img');

            element.src = 'assets/img/gui/' + type + '-counter.png';

            element.className = "gui_counter_icon";

            element.style.top = (halfIconHeight - halfCounterHeight) + iconTop + 'px';
            element.style.left = (46 + (18 * i)) + 'px';

            groupArray.push(element);

            container.appendChild(element);
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

    updateGloryCounter (value) {
        const difference = value - _this.player.glory;
        if(difference > 0){
            this.gloryCounterTransition.innerText = "+" + difference;
        }
        else {
            this.gloryCounterTransition.innerText = difference;
        }
        this.gloryCounterTransition.style.webkitAnimationName = 'fadeOut';
        this.game.player.glory = value;
        this.gloryCounter.innerText = value;
    }

    updateCoinsCounter (value) {
        const difference = value - _this.player.coins;
        if(difference > 0){
            this.coinsCounterTransition.innerText = "+" + difference;
        }
        else {
            this.coinsCounterTransition.innerText = difference;
        }
        this.coinsCounterTransition.style.webkitAnimationName = 'fadeOut';
        this.game.player.coins = value;
        this.coinsCounter.innerText = value;
    }

    updateRespawnsCounter (value) {
        const difference = value - _this.player.respawns;
        if(difference > 0){
            this.respawnsCounterTransition.innerText = "+" + difference;
        }
        else {
            this.respawnsCounterTransition.innerText = difference;
        }
        this.respawnsCounterTransition.style.webkitAnimationName = 'fadeOut';
        this.game.player.respawns = value;
        this.respawnsCounter.innerText = value;
        this.respawnsRemainingValue.innerText = value;
    }

    addInventorySlots () {
        const slotKeysByIndex = this.slotKeysByIndex;

        // Create 10 slots.
        for(let i=0; i<10; i+=1){

            // Add the contents of the slot.
            const addComponent = document.createElement('img');
            addComponent.src = 'assets/img/gui/add-component-icon.png';
            addComponent.className = 'component_slot_add';

            const icon = document.createElement('img');
            icon.src = 'assets/img/gui/items/icon-gold-ore.png';
            icon.className = 'inventory_slot_icon';
            icon.draggable = false;

            const iconGhost = document.createElement('div');
            iconGhost.appendChild(icon);

            const durability = document.createElement('img');
            durability.src = 'assets/img/gui/durability-meter-10.png';
            durability.className = 'inventory_slot_durability';
            durability.draggable = false;

            const equipped = document.createElement('img');
            equipped.src = 'assets/img/gui/clothing-icon.png';
            equipped.className = 'inventory_slot_equipped';
            equipped.draggable = false;

            const border = document.createElement('img');
            border.src = 'assets/img/gui/inventory-slot-border.png';
            border.className = 'inventory_slot_border';
            border.draggable = false;

            const div = document.createElement('div');
            div.className = 'inventory_slot';
            div.draggable = true;

            // Use the item in this slot when pressed.
            div.onclick = function () {
                //console.log('invent slot pressed: ' + slotKeysByIndex[i]);
                _this.equipItem(slotKeysByIndex[i]);
            };
            // Show and update the item tooltip info text when mouse is over a slot.
            div.onmouseover = function () {
                //console.log("on border mouse over, this:", slotKeysByIndex[i]);

                const inventorySlot = _this.player.inventory[slotKeysByIndex[i]];
                // Skip empty inventory slots.
                if(inventorySlot.catalogueEntry === null) return;

                // Show the container.
                _this.GUI.itemTooltipContainer.style.visibility = "visible";
                // Update the contents.
                _this.GUI.itemTooltipName.innerHTML = dungeonz.getTextDef("Item name: " + inventorySlot.catalogueEntry.idName);
                _this.GUI.itemTooltipDescription.innerHTML = dungeonz.getTextDef("Item description: " + inventorySlot.catalogueEntry.idName);

                if(inventorySlot.durability === null)   _this.GUI.itemTooltipDurability.innerHTML = "";
                else                                    _this.GUI.itemTooltipDurability.innerHTML = "(" + inventorySlot.durability + "/" + inventorySlot.maxDurability + ")";

                /* Bug fix hack, brightness changes position when used on parent. :S */
                const guiSlot = _this.GUI.inventorySlots[slotKeysByIndex[i]];
                guiSlot.icon.style["-webkit-filter"] = "brightness(150%)";
                guiSlot.durability.style["-webkit-filter"] = "brightness(150%)";
                guiSlot.equipped.style["-webkit-filter"] = "brightness(150%)";
                guiSlot.border.style["-webkit-filter"] = "brightness(150%)";
            };
            // Hide the item tooltip when mouse is not over a slot.
            div.onmouseout = function () {
                //console.log("on border mouse out, this:", slotKeysByIndex[i]);

                _this.GUI.itemTooltipContainer.style.visibility = "hidden";

                /* Bug fix hack, brightness changes position when used on parent. :S */
                const guiSlot = _this.GUI.inventorySlots[slotKeysByIndex[i]];
                guiSlot.icon.style["-webkit-filter"] = null;
                guiSlot.durability.style["-webkit-filter"] = null;
                guiSlot.equipped.style["-webkit-filter"] = null;
                guiSlot.border.style["-webkit-filter"] = null;
            };
            // Drag and drop.
            div.ondragstart = this.inventorySlotDragStart;
            div.ondragend = this.inventorySlotDragEnd;
            div.ondragenter = this.inventorySlotDragEnter;
            div.ondragleave = this.inventorySlotDragLeave;
            div.ondragover = this.inventorySlotDragOver;
            div.ondrop = this.inventorySlotDrop;

            div.setAttribute('slotKey', slotKeysByIndex[i]);

            addComponent.onclick = function () {
                _this.craftingManager.addComponent(slotKeysByIndex[i]);
            };

            div.appendChild(addComponent); GET RID OF THE ADDCOMPONENT ICON SHIT AND PLAN THE OTHER PANELS FOR DRAG DROP
            div.appendChild(iconGhost);
            div.appendChild(durability);
            div.appendChild(equipped);
            div.appendChild(border);

            this.inventorySlots[slotKeysByIndex[i]] = {
                slot: div,
                border: border,
                equipped: equipped,
                durability: durability,
                icon: icon,
                addComponent: addComponent
            };
            this.inventorySlotContainer.appendChild(div);
        }
    }

    inventorySlotDragStart (event) {
        console.log("drag started, this:", this);
        const slotKey = this.getAttribute('slotKey');
        const icon = _this.GUI.inventorySlots[slotKey].icon;
        event.dataTransfer.setData('text', 'anything');
        _this.dragData = {
            dragOrigin: _this.GUI.inventorySlotContainer,
            inventorySlot: _this.player.inventory[slotKey]
        };
        event.dataTransfer.setDragImage(icon, icon.width/2, icon.height/2);
        this.style.backgroundColor = "rgba(255, 171, 0, 0.5)";
    }
    inventorySlotDragEnter () {
        console.log("drag enter");
        event.preventDefault();
        const slotKey = this.getAttribute('slotKey');
        const guiSlot = _this.GUI.inventorySlots[slotKey];
        guiSlot.icon.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.durability.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.equipped.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.border.style["-webkit-filter"] = "brightness(150%)";
        if(_this.dragData.inventorySlot.slotKey !== slotKey){
            guiSlot.slot.style.backgroundColor = "rgba(146, 255, 236, 0.25)";
        }
    }
    inventorySlotDragLeave () {
        console.log("drag leave");
        const slotKey = this.getAttribute('slotKey');
        const guiSlot = _this.GUI.inventorySlots[slotKey];
        guiSlot.icon.style["-webkit-filter"] = null;
        guiSlot.durability.style["-webkit-filter"] = null;
        guiSlot.equipped.style["-webkit-filter"] = null;
        guiSlot.border.style["-webkit-filter"] = null;
        // Don't change the colour if the element being left is the start element.
        // Want to keep the orange background for the start.
        if(_this.dragData.inventorySlot.slotKey !== slotKey){
            guiSlot.slot.style.backgroundColor = "transparent";
        }
    }
    inventorySlotDragOver (event) {
        event.preventDefault();
    }
    inventorySlotDrop () {
        console.log("drag drop, drag data:", _this.dragData);
        const slotKey = this.getAttribute('slotKey');
        console.log("drag drop, slot keyyy:", slotKey);
        // If it was from the inventory bar, swap the slots.
        if(_this.dragData.dragOrigin === _this.GUI.inventorySlotContainer){
            console.log("invent slot dropped over another inventory slot");
            _this.player.inventory.swapInventorySlots(_this.dragData.inventorySlot.slotKey, slotKey);
        }
        this.style.backgroundColor = "transparent";
    }
    inventorySlotDragEnd () {
        this.style.backgroundColor = "transparent";
    }

    updateDungeonPrompt () {
        const prompt = dungeonz.DungeonPrompts[_this.adjacentDungeonID];
        document.getElementById('dungeon_prompt_name_value').innerText = dungeonz.getTextDef(prompt.nameDefinitionID);
        document.getElementById('dungeon_prompt_difficulty_value').innerText = dungeonz.getTextDef(prompt.difficulty);
        document.getElementById('dungeon_prompt_glory_cost_value').innerText = prompt.gloryCost;
    }

    showCraftingPanel (stationName) {
        // Show the crafting panel and change the station name.
        _this.GUI.craftingPanel.style.visibility = "visible";
        _this.GUI.craftingStationName.innerText = stationName;

        // Clear any existing recipe code.
        _this.craftingManager.recipeCode = '';

        // Show the buttons to add components from the inventory bar, for each item the player has.
        const inventory = this.game.player.inventory;
        for(let slotKey in inventory){
            if(inventory.hasOwnProperty(slotKey) === false) continue;
            if(inventory[slotKey].catalogueEntry === null) continue;
            inventory[slotKey].craftingComponent = null;
            this.inventorySlots[slotKey].addComponent.style.visibility = "visible";
            this.inventorySlots[slotKey].addComponent.style.opacity = 1;
        }
    }

    hideCraftingPanel () {
        // Hide the crafting panel.
        _this.GUI.craftingPanel.style.visibility = "hidden";

        // Hide the buttons to add components from the inventory bar, and all of the crafting panel elements.
        const inventory = this.game.player.inventory;
        for(let slotKey in inventory){
            if(inventory.hasOwnProperty(slotKey) === false) continue;
            this.inventorySlots[slotKey].addComponent.style.visibility = "hidden";
        }

        const components = this.game.craftingManager.components;
        for(let slotKey in components){
            if(components.hasOwnProperty(slotKey) === false) continue;
            components[slotKey].occupiedBy = null;
            components[slotKey].DOMRemove.style.visibility = "hidden";
            components[slotKey].DOMIcon.style.visibility = "hidden";
        }

        const craftingManager = this.game.craftingManager;
        craftingManager.resultDOMIcon.style.visibility = "hidden";
        craftingManager.resultDOMAccept.style.visibility = "hidden";
    }

    makeElementDraggable(handle, container){
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            container.style.top = (container.offsetTop - pos2) + "px";
            container.style.left = (container.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

}

export default GUI;