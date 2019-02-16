
import InventoryBar from './InventoryBar';
import SettingsBar from "./SettingsBar";
import StatsPanel from "./StatsPanel";
import CraftingPanel from "./CraftingPanel";
import BankPanel from "./BankPanel";
import ExitGamePanel from "./ExitGamePanel";
import ClanPanel from "./ClanPanel";
//import GeneratorPanel from "./GeneratorPanel";
import SpellBookPanel from "./SpellBookPanel";
import ShopPanel from "./ShopPanel";
import TasksPanel from "./TasksPanel";

class GUI {

    constructor (game) {

        this.game = game;

        // References to the DOM elements for the icons and parents.
        this.gui =                      document.getElementById('gui_cont');

        this.defenceIcon =              document.getElementById('defence_icon');
        this.hitPointIcon =             document.getElementById('hitpoint_icon');
        this.energyIcon =               document.getElementById('energy_icon');
        this.gloryIcon =                document.getElementById('glory_icon');
        this.bountyIcon =               document.getElementById('bounty_icon');
        this.avatarIcon =               document.getElementById('avatar_icon');
        this.tasksIcon =                document.getElementById('tasks_icon');
        this.clanIcon =                 document.getElementById('clan_icon');
        this.inventoryIcon =            document.getElementById('inventory_icon');
        this.exitIcon =                 document.getElementById('exit_icon');
        this.respawnsIcon =             document.getElementById('respawns_icon');

        this.defenceTooltip =           document.getElementById('defence_tooltip');
        this.hitPointTooltip =          document.getElementById('hitpoint_tooltip');
        this.energyTooltip =            document.getElementById('energy_tooltip');
        this.gloryTooltip =             document.getElementById('glory_tooltip');
        this.bountyTooltip =            document.getElementById('bounty_tooltip');
        this.avatarTooltip =            document.getElementById('avatar_tooltip');
        this.tasksTooltip =             document.getElementById('tasks_tooltip');
        this.clanTooltip =              document.getElementById('clan_tooltip');
        this.inventoryTooltip =         document.getElementById('inventory_tooltip');
        this.exitTooltip =              document.getElementById('exit_tooltip');
        this.respawnsTooltip =          document.getElementById('respawns_tooltip');

        this.gloryCounter =             document.getElementById('glory_counter');
        this.gloryCounterTransition =   document.getElementById('glory_counter_transition');
        this.respawnsCounter =          document.getElementById('respawns_counter_value');
        this.respawnsCounterTransition =document.getElementById('respawns_counter_transition');

        this.virtualDPad =              document.getElementById('virtual_dpad');
        this.virtualDPadUp =            document.getElementById('virtual_dpad_up');
        this.virtualDPadDown =          document.getElementById('virtual_dpad_down');
        this.virtualDPadLeft =          document.getElementById('virtual_dpad_left');
        this.virtualDPadRight =         document.getElementById('virtual_dpad_right');

        this.dungeonPrompt =            document.getElementById('dungeon_prompt');
        this.respawnPrompt =            document.getElementById('respawn_prompt');
        this.respawnsRemainingValue =   document.getElementById('respawns_remaining_value');
        this.respawnButton =            document.getElementById('respawn_button');
        this.gameOverPrompt =           document.getElementById('game_over_prompt');
        this.playAgainButton =          document.getElementById('play_again_button');
        this.itemTooltipContainer =     document.getElementById('item_tooltip_cont');
        this.itemTooltipName =          document.getElementById('item_name');
        this.itemTooltipDescription =   document.getElementById('item_description');
        this.itemTooltipDurability =    document.getElementById('item_durability');

        this.chatInput =                document.getElementById('chat_input');

        this.panels = [];
        this.isAnyPanelOpen = false;

        this.inventoryBar =     new InventoryBar(this);
        this.settingsBar =      new SettingsBar();
        this.exitGamePanel =    new ExitGamePanel();
        this.statsPanel =       this.addPanel(new StatsPanel());
        this.craftingPanel =    this.addPanel(new CraftingPanel());
        this.bankPanel =        this.addPanel(new BankPanel());
        this.spellBookPanel=    this.addPanel(new SpellBookPanel());
        this.clanPanel =        this.addPanel(new ClanPanel());
        //this.generatorPanel =   this.addPanel(new GeneratorPanel());
        this.shopPanel =        this.addPanel(new ShopPanel());
        this.tasksPanel =       this.addPanel(new TasksPanel());

        // Show the GUI.
        this.gui.style.visibility = "visible";

        // Hide the chat input at the start.
        this.chatInput.isActive = false;
        this.chatInput.style.visibility = "hidden";

        // Check if the virtual D-pad should be shown at the start.
        if(dungeonz.virtualDPadEnabled === true) this.virtualDPad.style.visibility = "visible";

        // Attach the events so the tooltips appear when the icons are hovered over.
        this.defenceIcon.onmouseover =  function(){ game.GUI.defenceTooltip.style.visibility = "visible" };
        this.defenceIcon.onmouseout =   function(){ game.GUI.defenceTooltip.style.visibility = "hidden" };

        this.hitPointIcon.onmouseover = function(){ game.GUI.hitPointTooltip.style.visibility = "visible" };
        this.hitPointIcon.onmouseout =  function(){ game.GUI.hitPointTooltip.style.visibility = "hidden" };

        this.energyIcon.onmouseover =   function(){ game.GUI.energyTooltip.style.visibility = "visible" };
        this.energyIcon.onmouseout =    function(){ game.GUI.energyTooltip.style.visibility = "hidden" };

        this.gloryIcon.onmouseover =    function(){ game.GUI.gloryTooltip.style.visibility = "visible" };
        this.gloryIcon.onmouseout =     function(){ game.GUI.gloryTooltip.style.visibility = "hidden" };

        this.bountyIcon.onmouseover =   function(){ game.GUI.bountyTooltip.style.visibility = "visible" };
        this.bountyIcon.onmouseout =    function(){ game.GUI.bountyTooltip.style.visibility = "hidden" };

        this.avatarIcon.onmouseover =   function(){ game.GUI.avatarTooltip.style.visibility = "visible" };
        this.avatarIcon.onmouseout =    function(){ game.GUI.avatarTooltip.style.visibility = "hidden" };
        this.avatarIcon.onclick =       function(){
            if(game.GUI.statsPanel.container.style.visibility === "visible"){
                game.GUI.statsPanel.hide();
            }
            else {
                game.GUI.statsPanel.show();
            }
        };

        this.tasksIcon.onmouseover =    function(){ game.GUI.tasksTooltip.style.visibility = "visible" };
        this.tasksIcon.onmouseout =     function(){ game.GUI.tasksTooltip.style.visibility = "hidden" };
        this.tasksIcon.onclick =       function(){
            if(game.GUI.tasksPanel.container.style.visibility === "visible"){
                game.GUI.tasksPanel.hide();
            }
            else {
                game.GUI.tasksPanel.show();
            }
        };

        this.clanIcon.onmouseover =   function(){ game.GUI.clanTooltip.style.visibility = "visible" };
        this.clanIcon.onmouseout =    function(){ game.GUI.clanTooltip.style.visibility = "hidden" };
        this.clanIcon.onclick =       function(){
            if(game.GUI.clanPanel.container.style.visibility === "visible"){
                game.GUI.clanPanel.hide();
            }
            else {
                game.GUI.clanPanel.show();
            }
        };
        this.clanIcon.style.visibility = "hidden";

        this.inventoryIcon.onmouseover =function(){ game.GUI.inventoryTooltip.style.visibility = "visible" };
        this.inventoryIcon.onmouseout = function(){ game.GUI.inventoryTooltip.style.visibility = "hidden" };
        this.inventoryIcon.onclick =    function(){ window.ws.sendEvent('pick_up_item'); };

        this.exitIcon.onmouseover =     function(){ game.GUI.exitTooltip.style.visibility = "visible" };
        this.exitIcon.onmouseout =      function(){ game.GUI.exitTooltip.style.visibility = "hidden" };
        this.exitIcon.onclick =         function(){
            if(game.GUI.exitGamePanel.container.style.visibility === "visible"){
                game.GUI.exitGamePanel.hide();
            }
            else {
                game.GUI.exitGamePanel.show();
            }
        };

        this.respawnsIcon.onmouseover = function(){ game.GUI.respawnsTooltip.style.visibility = "visible" };
        this.respawnsIcon.onmouseout =  function(){ game.GUI.respawnsTooltip.style.visibility = "hidden" };

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

        this.addDefenceCounters(this.game.player.defence);
        this.addHitPointCounters(this.game.player.maxHitPoints);
        this.addEnergyCounters(this.game.player.maxEnergy);

        // Set the values for the text based counters (glory, coins).
        this.gloryCounter.innerText = this.game.player.glory;
        this.gloryCounterTransition.addEventListener('webkitAnimationEnd', this.textCounterWebkitAnimationEnd, false);
        //this.coinsCounter.innerText = this.game.player.coins;
        //this.coinsCounterTransition.addEventListener('webkitAnimationEnd', this.textCounterWebkitAnimationEnd, false);
        this.respawnsCounter.innerText = this.game.player.respawns;
        this.respawnsCounterTransition.addEventListener('webkitAnimationEnd', this.textCounterWebkitAnimationEnd, false);
        this.respawnsRemainingValue.innerText = this.game.player.respawns;

        this.GUIColours = {
            currentlyDragged: "rgba(255, 171, 0, 0.5)",
            validDropTarget: "rgba(146, 255, 236, 0.25)",
            validDropTargetOver: "rgba(140, 203, 255, 0.75)",
            invalidDropTarget: "rgba(255, 34, 0, 0.5)",
            currentlySelected: "rgba(251, 242, 54, 0.5)",
            white80Percent: "rgba(255, 255, 255, 0.8)",
            shopSelected: "rgb(153, 229, 80, 0.8)",
            taskComplete: "rgba(106, 190, 48, 0.8)"
        };

        this.dragData = null;

        this.gui.ondragenter = function (event) {
            event.preventDefault();
        };
        this.gui.ondragover = function (event) {
            event.preventDefault();
        };
        // If an inventory item is dropped onto the game canvas, drop it.
        this.gui.ondrop = function (event) {
            event.preventDefault();

            if(_this.GUI.dragData === null) return;
            // If it was from the inventory bar, drop the item.
            if(_this.GUI.dragData.dragOrigin === _this.GUI.inventoryBar.slotContainer){
                window.ws.sendEvent('drop_item', _this.GUI.dragData.inventorySlot.slotKey);
            }
        };

    }

    addPanel (panel) {
        this.panels.push(panel);
        // Make the various panels draggable.
        this.makeElementDraggable(panel.name, panel.container);
        return panel;
    }

    addDefenceCounters (amount) {
        this.addCounters(amount, this.defenceIcon, 'defence', this.defenceCounters);
    }

    addHitPointCounters (amount) {
        this.addCounters(amount, this.hitPointIcon, 'hitpoint', this.hitPointCounters);
    }

    addEnergyCounters (amount) {
        this.addCounters(amount, this.energyIcon, 'energy', this.energyCounters);
    }

    textCounterSetText (element, value) {
        // Clear the previous animation.
        element.style.animationName = "none";
        // Trigger reflow.
        element.offsetHeight;

        element.style.visibility = "visible";
        element.style.webkitAnimationName = 'fadeOut';
        element.innerText = value;
    }

    textCounterWebkitAnimationEnd () {
        this.style.webkitAnimationName = '';
        this.style.visibility= "hidden";
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

            element.draggable = false;

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
        // Remove all current defence counters.
        //this.removeExistingDOMElements(this.defenceCounters);
        // Add new ones for however many defence points.
        this.addDefenceCounters(this.game.player.defence);
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
            this.textCounterSetText(this.gloryCounterTransition, "+" + difference);
        }
        else {
            this.textCounterSetText(this.gloryCounterTransition, difference);
        }
        this.game.player.glory = value;
        this.gloryCounter.innerText = value;
    }

    updateRespawnsCounter (value) {
        const difference = value - _this.player.respawns;
        if(difference > 0){
            this.textCounterSetText(this.respawnsCounterTransition, "+" + difference);
        }
        else {
            this.textCounterSetText(this.respawnsCounterTransition, difference);
        }
        this.game.player.respawns = value;
        this.respawnsCounter.innerText = value;
        this.respawnsRemainingValue.innerText = value;
    }

    updateDungeonPrompt () {
        const prompt = dungeonz.DungeonPrompts[_this.adjacentDungeonID];
        document.getElementById('dungeon_prompt_name_value').innerText = dungeonz.getTextDef(prompt.nameDefinitionID);
        document.getElementById('dungeon_prompt_difficulty_value').innerText = dungeonz.getTextDef(prompt.difficulty);
        document.getElementById('dungeon_prompt_glory_cost_value').innerText = prompt.gloryCost;
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