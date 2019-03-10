
class Slot {
    constructor (slotKey, bar) {
        this.icon = document.createElement('img');
        this.icon.src = 'assets/img/gui/items/icon-gold-ore.png';
        this.icon.className = 'inventory_slot_icon';
        this.icon.draggable = false;

        this.durability = document.createElement('img');
        this.durability.src = 'assets/img/gui/durability-meter-10.png';
        this.durability.className = 'inventory_slot_durability';
        this.durability.draggable = false;

        this.open = document.createElement('img');
        this.open.src = 'assets/img/gui/open-icon.png';
        this.open.className = 'inventory_slot_open';
        //this.open.draggable = false;
        this.open.onclick = bar.openClick;
        this.open.onmouseover = bar.openOver;
        this.open.ondragstart = bar.openStopPropagation;
        this.open.ondragend = bar.openStopPropagation;
        this.open.ondragenter = bar.openStopPropagation;
        this.open.ondragleave = bar.openStopPropagation;
        this.open.ondragover = bar.openStopPropagation;
        this.open.ondrop = bar.openStopPropagation;

        this.equipped = document.createElement('img');
        this.equipped.src = 'assets/img/gui/clothing-icon.png';
        this.equipped.className = 'inventory_slot_equipped';
        this.equipped.draggable = false;

        this.border = document.createElement('img');
        this.border.src = 'assets/img/gui/inventory-slot-border.png';
        this.border.className = 'inventory_slot_border';
        this.border.draggable = false;

        this.container = document.createElement('div');
        this.container.className = 'inventory_slot';
        this.container.draggable = true;
        // Use the item in this slot when pressed.
        this.container.onclick =        bar.click;
        this.container.onmousedown =    bar.mouseDown;
        // Show and update the item tooltip info text when mouse is over a slot.
        this.container.onmouseover =    bar.slotMouseOver;
        // Hide the item tooltip when mouse is not over a slot.
        this.container.onmouseout =     bar.slotMouseOut;
        // Drag and drop.
        this.container.ondragstart =    bar.slotDragStart;
        this.container.ondragend =      bar.slotDragEnd;
        this.container.ondragenter =    bar.slotDragEnter;
        this.container.ondragleave =    bar.slotDragLeave;
        this.container.ondragover =     bar.slotDragOver;
        this.container.ondrop =         bar.slotDrop;

        // Store the key of this slot on the slot itself.
        this.container.setAttribute('slotKey', slotKey);

        this.container.appendChild(this.icon);
        this.container.appendChild(this.durability);
        this.container.appendChild(this.open);
        this.container.appendChild(this.equipped);
        this.container.appendChild(this.border);

        bar.slotContainer.appendChild(this.container);
    }
}

class InventoryBar {

    constructor (gui) {
        this.message = document.getElementById('inventory_message');
        this.message.addEventListener('webkitAnimationEnd', gui.textCounterWebkitAnimationEnd, false);
        this.slotContainer = document.getElementById('inventory_bar');
        this.slots = {};

        // Rearrange the order of the slot numbers, as the 0 key is at the right end of keyboards.
        this.slotKeysByIndex = ["slot1", "slot2", "slot3", "slot4", "slot5", "slot6", "slot7", "slot8", "slot9", "slot0"];

        // Create 10 slots.
        for(let i=0; i<10; i+=1){
            const slotKey = this.slotKeysByIndex[i];
            this.slots[slotKey] = new Slot(slotKey, this);
        }
    }

    openClick (event) {
        event.stopPropagation();
        _this.GUI.spellBookPanel.show();
    }

    openOver (event) {
        event.stopPropagation();
    }

    openStopPropagation (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    mouseDown (event) {
        // Detect right mouse button click, to drop inventory items.
        let isRightMB;
        if ("which" in event)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            isRightMB = event.which === 3;
        else if ("button" in event)  // IE, Opera
            isRightMB = event.button === 2;

        if(isRightMB === true){
            window.ws.sendEvent('drop_item', this.getAttribute('slotKey'));
        }
    }

    click (event) {
        _this.player.inventory.useItem(this.getAttribute('slotKey'));
    }

    slotMouseOver () {
        const slotKey = this.getAttribute('slotKey');
        const inventorySlot = _this.player.inventory[slotKey];
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
        const guiSlot = _this.GUI.inventoryBar.slots[slotKey];
        guiSlot.icon.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.durability.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.equipped.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.border.style["-webkit-filter"] = "brightness(150%)";
    }

    slotMouseOut () {
        const slotKey = this.getAttribute('slotKey');
        _this.GUI.itemTooltipContainer.style.visibility = "hidden";
        /* Bug fix hack, brightness changes position when used on parent. :S */
        const guiSlot = _this.GUI.inventoryBar.slots[slotKey];
        guiSlot.icon.style["-webkit-filter"] = null;
        guiSlot.durability.style["-webkit-filter"] = null;
        guiSlot.equipped.style["-webkit-filter"] = null;
        guiSlot.border.style["-webkit-filter"] = null;
    }

    slotDragStart (event) {
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.

        //console.log("drag started, this:", this);
        const slotKey = this.getAttribute('slotKey');
        const icon = _this.GUI.inventoryBar.slots[slotKey].icon;
        event.dataTransfer.setData('text/plain', null);
        _this.GUI.dragData = {
            dragOrigin: _this.GUI.inventoryBar.slotContainer,
            inventorySlot: _this.player.inventory[slotKey]
        };
        event.dataTransfer.setDragImage(icon, icon.width/2, icon.height/2);

        // Highlight the slots in panels where items can be dropped.
        for(let slotKey in _this.GUI.inventoryBar.slots){
            if(_this.GUI.inventoryBar.slots.hasOwnProperty(slotKey) === false) continue;
            _this.GUI.inventoryBar.slots[slotKey].container.style.backgroundColor = _this.GUI.GUIColours.validDropTargetOver;
        }
        for(let slotKey in _this.GUI.craftingPanel.components){
            if(_this.GUI.craftingPanel.components.hasOwnProperty(slotKey) === false) continue;
            _this.GUI.craftingPanel.components[slotKey].container.style.backgroundColor = _this.GUI.GUIColours.validDropTargetOver;
        }
        for(let i=0, len=_this.GUI.bankPanel.slots.length; i<len; i+=1){
            _this.GUI.bankPanel.slots[i].container.style.backgroundColor = _this.GUI.GUIColours.validDropTargetOver;
        }

        this.style.backgroundColor = _this.GUI.GUIColours.currentlyDragged;

    }

    slotDragEnter (event) {
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
        /*const slotKey = this.getAttribute('slotKey');
        //console.log("drag enter, slotkey:", slotKey);
        const guiSlot = _this.GUI.inventoryBar.slots[slotKey];
        guiSlot.icon.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.durability.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.equipped.style["-webkit-filter"] = "brightness(150%)";
        guiSlot.border.style["-webkit-filter"] = "brightness(150%)";
        if(_this.GUI.dragData.inventorySlot.slotKey !== slotKey){
            guiSlot.container.style.backgroundColor = _this.GUI.dragColours.validDropTarget;
        }*/
    }

    slotDragLeave (event) {
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
        //console.log("drag leave");
        /*const slotKey = this.getAttribute('slotKey');
        const guiSlot = _this.GUI.inventoryBar.slots[slotKey];
        guiSlot.icon.style["-webkit-filter"] = null;
        guiSlot.durability.style["-webkit-filter"] = null;
        guiSlot.equipped.style["-webkit-filter"] = null;
        guiSlot.border.style["-webkit-filter"] = null;
        // Don't change the colour if the element being left is the start element.
        // Want to keep the orange background for the start.
        if(_this.GUI.dragData.inventorySlot.slotKey !== slotKey){
            guiSlot.container.style.backgroundColor = "transparent";
        }*/
    }

    slotDragOver (event) {
        event.preventDefault();
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
    }

    slotDrop (event) {
        event.preventDefault();
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
        const slotKey = this.getAttribute('slotKey');
        // If it was from the inventory bar, swap the slots.
        if(_this.GUI.dragData.dragOrigin === _this.GUI.inventoryBar.slotContainer){
            //console.log("invent slot dropped over another inventory slot");
            _this.player.inventory.swapInventorySlots(_this.GUI.dragData.inventorySlot.slotKey, slotKey);
        }
        // If it was from the bank panel, withdraw the item.
        else if(_this.GUI.dragData.dragOrigin === _this.GUI.bankPanel.contents){
            _this.player.bankManager.withdrawItem(_this.GUI.dragData.bankSlot.getAttribute('slotIndex'), slotKey);
        }

        this.style.backgroundColor = "transparent";

        // De-highlight the panel slot drop targets.
        for(let slotKey in _this.GUI.craftingPanel.components){
            _this.GUI.craftingPanel.components[slotKey].container.style.backgroundColor = "transparent";
        }

        // Clear the drag origin, so other GUI elements don't still refer to the thing that was dragged when they are dropped over.
        _this.GUI.dragData.dragOrigin = null;

        //console.log("invent slot drop");
    }

    slotDragEnd (event) {
        event.preventDefault();
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
        this.style.backgroundColor = "transparent";

        // De-highlight the panel slot drop targets.
        for(let slotKey in _this.GUI.inventoryBar.slots){
            if(_this.GUI.inventoryBar.slots.hasOwnProperty(slotKey) === false) continue;
            _this.GUI.inventoryBar.slots[slotKey].container.style.backgroundColor = "transparent";
        }
        for(let slotKey in _this.GUI.craftingPanel.components){
            if(_this.GUI.craftingPanel.components.hasOwnProperty(slotKey) === false) continue;
            _this.GUI.craftingPanel.components[slotKey].container.style.backgroundColor = "transparent";
        }
        for(let i=0, len=_this.GUI.bankPanel.slots.length; i<len; i+=1){
            _this.GUI.bankPanel.slots[i].container.style.backgroundColor = "transparent";
        }

        // Clear the drag origin, so other GUI elements don't still refer to the thing that was dragged when they are dropped over.
        _this.GUI.dragData.dragOrigin = null;
    }

}

export default InventoryBar