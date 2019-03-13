
import PanelTemplate from "./PanelTemplate";

class Slot {
    constructor (bank, slotIndex) {

        this.icon = document.createElement('img');
        this.icon.src = 'assets/img/gui/items/icon-gold-ore.png';
        this.icon.className = 'bank_slot_icon';
        this.icon.draggable = false;

        this.durability = document.createElement('img');
        this.durability.src = 'assets/img/gui/hud/durability-meter-10.png';
        this.durability.className = 'bank_slot_durability';
        this.durability.draggable = false;

        //this.border = document.createElement('img');
        //this.border.src = 'assets/img/gui/inventory-slot-border.png';
        //this.border.className = 'inventory_slot_border';
        //this.border.draggable = false;

        this.container = document.createElement('div');
        this.container.className = 'bank_slot_cont';
        this.container.draggable = true;

        this.container.appendChild(this.icon);
        this.container.appendChild(this.durability);
        //this.container.appendChild(this.border);

        bank.bankSlots.appendChild(this.container);

        // Withdraw the item from the bank when it is clicked on.
        this.container.onclick =        bank.slotClick;
        // Show and update the item tooltip info text when mouse is over a slot.
        this.container.onmouseover =    bank.slotMouseOver;
        // Hide the item tooltip when mouse is not over a slot.
        this.container.onmouseout =     bank.slotMouseOut;
        // Drag and drop.
        this.container.ondragstart =    bank.slotDragStart;
        this.container.ondragend =      bank.slotDragEnd;
        this.container.ondragenter =    bank.slotDragEnter;
        this.container.ondrop =         bank.slotDrop;
        // Store the key of this slot on the slot itself.
        this.container.setAttribute('slotIndex', slotIndex);

    }

    refreshBackground () {
        // Only give a white background back to the bank slots that have something in them.
        if(_this.player.bankManager.items[this.container.getAttribute('slotIndex')].catalogueEntry === null){
            this.container.style.backgroundColor = _this.GUI.GUIColours.bankSlotEmpty;
        }
        else {
            this.container.style.backgroundColor = _this.GUI.GUIColours.bankSlotOccupied;
        }
    }
}

class BankPanel extends PanelTemplate {

    constructor () {
        super(document.getElementById('bank_panel'), 500, 320, 'Bank', 'entities/buildings/bank-chest');

        this.innerContainer = document.createElement('div');
        this.innerContainer.id = 'bank_inner_cont';
        this.contentsContainer.appendChild(this.innerContainer);

        this.tabsContainer = document.createElement('div');
        this.tabsContainer.id = 'bank_tabs_cont';
        this.innerContainer.appendChild(this.tabsContainer);

        this.tab1Button = document.createElement('img');
        this.tab1Button.src = 'assets/img/gui/panels/bank-tab-1-button-active.png';
        this.tab1Button.className = 'bank_tab_button';
        this.tabsContainer.appendChild(this.tab1Button);

        this.tab2Button = document.createElement('img');
        this.tab2Button.src = 'assets/img/gui/panels/bank-tab-2-button-inactive.png';
        this.tab2Button.className = 'bank_tab_button';
        this.tabsContainer.appendChild(this.tab2Button);

        this.tab3Button = document.createElement('img');
        this.tab3Button.src = 'assets/img/gui/panels/bank-tab-locked-icon.png';
        this.tab3Button.className = 'bank_tab_button';
        this.tabsContainer.appendChild(this.tab3Button);

        this.tab4Button = document.createElement('img');
        this.tab4Button.src = 'assets/img/gui/panels/bank-tab-locked-icon.png';
        this.tab4Button.className = 'bank_tab_button';
        this.tabsContainer.appendChild(this.tab4Button);

        this.bankSlots = document.createElement('div');
        this.bankSlots.id = 'bank_contents';
        this.innerContainer.appendChild(this.bankSlots);

        this.slots = [];

        //TODO: LOOKS GOOD SO FAR, NOW DO THE DMP LOCKED OTHER TABS, MORE TABS IS GOING TO BE MESSY :/

        // Create some slots.
        for(let i=0; i<15; i+=1){
            this.slots.push(new Slot(this, i));
        }

        this.tooltip = document.createElement('div');
        this.tooltip.id = 'bank_tooltip';
        this.topContainer.appendChild(this.tooltip);

    }

    show () {
        // Show the panel.
        super.show();

        _this.GUI.isAnyPanelOpen = true;

        const items = _this.player.bankManager.items;

        for(let i=0; i<items.length; i+=1){
            // Don't show empty slots.
            if(items[i].catalogueEntry === null) continue;

            const slot = this.slots[i];
            slot.icon.style.visibility = "visible";

            if(items[i].durability === null) continue;
            slot.durability.style.visibility = "visible";
        }
    }

    hide () {
        // Hide the panel.
        super.hide();
        this.tooltip.style.visibility = 'hidden';

        _this.GUI.isAnyPanelOpen = false;

        // Hide the contents.
        for(let i=0; i<this.slots.length; i+=1){
            const slot = this.slots[i];
            slot.icon.style.visibility = "hidden";
            slot.durability.style.visibility = "hidden";
        }
    }

    slotClick () {
        console.log("slot clicked:", this.getAttribute('slotIndex'));

        _this.player.bankManager.withdrawItem(this.getAttribute('slotIndex'));
    }

    slotMouseOver () {
        /** @type {BankItem} */
        const bankSlot = _this.player.bankManager.items[this.getAttribute('slotIndex')];
        // If the slot is empty, don't show the tooltip.
        if(bankSlot.catalogueEntry === null) return;

        const bankPanel = _this.GUI.bankPanel;

        bankPanel.tooltip.innerText = dungeonz.getTextDef("Item name: " + bankSlot.catalogueEntry.idName);
        bankPanel.tooltip.style.visibility = 'visible';

        bankPanel.slots[this.getAttribute('slotIndex')].container.appendChild(bankPanel.tooltip);
        console.log("tooltip added");
    }

    slotMouseOut () {
        _this.GUI.bankPanel.tooltip.style.visibility = 'hidden';
    }

    slotDragStart (event) {
        //console.log("this:", this);
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();

        console.log("slot drag start");

        const slotIndex = this.getAttribute('slotIndex');

        // Don't bother doing a drag if there is nothing in this slot.
        if(_this.player.bankManager.items[slotIndex].catalogueEntry === null){
            console.log("empty slot:", slotIndex);
            event.preventDefault();
            return;
        }

        const icon = _this.GUI.bankPanel.slots[slotIndex].icon;
        //console.log("icon:", icon);
        event.dataTransfer.setData('text/plain', null);
        _this.GUI.dragData = {
            dragOrigin: _this.GUI.bankPanel.bankSlots,
            bankSlot: _this.GUI.bankPanel.slots[slotIndex].container
        };
        event.dataTransfer.setDragImage(icon, icon.width/2, icon.height/2);

        // Highlight the bank panel slots, to show that slots can be swapped within the bank panel.
        const bankGUISlots = _this.GUI.bankPanel.slots;
        for(let i=0, len=bankGUISlots.length; i<len; i+=1){
            bankGUISlots[i].container.style.backgroundColor = _this.GUI.GUIColours.validDropTargetOver;
        }

        // Highlight the inventory bar slots, to show that bank slots can be moved to the inventory bar.
        const inventoryGUISlots = _this.GUI.inventoryBar.slots;
        for(let slotKey in inventoryGUISlots){
            if(inventoryGUISlots.hasOwnProperty(slotKey) === false) continue;
            inventoryGUISlots[slotKey].container.style.backgroundColor = _this.GUI.GUIColours.validDropTargetOver;
        }

        this.style.backgroundColor = _this.GUI.GUIColours.currentlyDragged;
    }

    slotDragEnter (event) {
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
        //console.log("slot drag enter");
    }

    slotDrop (event) {
        const thisSlotIndex = this.getAttribute('slotIndex');
        event.preventDefault();
        event.stopPropagation();
        //console.log("slot dropped on bank, from:", _this.GUI.dragData.inventorySlot.slotKey, ", to:", this.getAttribute('slotIndex'));
        // Only add an item to the bank if it was dropped from the inventory bar.
        if(_this.GUI.dragData.dragOrigin === _this.GUI.inventoryBar.slotContainer){
            _this.player.bankManager.depositItem(_this.GUI.dragData.inventorySlot.slotKey, this.getAttribute('slotIndex'));
        }
        else if(_this.GUI.dragData.dragOrigin === _this.GUI.bankPanel.bankSlots){
            const otherSlotIndex = _this.GUI.dragData.bankSlot.getAttribute('slotIndex');
            _this.player.bankManager.swapSlots(otherSlotIndex, thisSlotIndex);
        }
        // Clear the drag origin, so other GUI elements don't still refer to the thing that was dragged when they are dropped over.
        _this.GUI.dragData.dragOrigin = null;
        // Reset the highlighted bank slots.
        const bankSlots = _this.GUI.bankPanel.slots;
        for(let i=0, len=bankSlots.length; i<len; i+=1){
            bankSlots[i].refreshBackground();
        }
    }

    slotDragEnd (event) {
        console.log("slot drag end");
        event.preventDefault();
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
        this.style.backgroundColor = "transparent";

        // De-highlight the panel slot drop targets.
        const bankSlots = _this.GUI.bankPanel.slots;
        for(let i=0, len=bankSlots.length; i<len; i+=1){
            bankSlots[i].refreshBackground();
        }
        // And the inventory bar slots.
        const inventorySlots = _this.GUI.inventoryBar.slots;
        for(let slotKey in inventorySlots){
            if(inventorySlots.hasOwnProperty(slotKey) === false) continue;
            inventorySlots[slotKey].container.style.backgroundColor = "transparent";
        }
        // Clear the drag origin, so other GUI elements don't still refer to the thing that was dragged when they are dropped over.
        _this.GUI.dragData.dragOrigin = null;
    }

}

export default BankPanel;