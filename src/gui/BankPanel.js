
class Slot {
    constructor (bank, slotIndex) {

        this.icon = document.createElement('img');
        this.icon.src = 'assets/img/gui/items/icon-gold-ore.png';
        this.icon.className = 'inventory_slot_icon';
        this.icon.draggable = false;

        this.durability = document.createElement('img');
        this.durability.src = 'assets/img/gui/durability-meter-10.png';
        this.durability.className = 'inventory_slot_durability';
        this.durability.draggable = false;

        this.border = document.createElement('img');
        this.border.src = 'assets/img/gui/inventory-slot-border.png';
        this.border.className = 'inventory_slot_border';
        this.border.draggable = false;

        this.container = document.createElement('div');
        this.container.className = 'inventory_slot';
        this.container.draggable = true;

        this.container.appendChild(this.icon);
        this.container.appendChild(this.durability);
        this.container.appendChild(this.border);

        bank.contents.appendChild(this.container);

        // Withdraw the item from the bank when it is clicked on.
        this.container.onclick =        bank.slotClick;
        // Show and update the item tooltip info text when mouse is over a slot.
        this.container.onmouseover =    bank.slotMouseOver;
        // Hide the item tooltip when mouse is not over a slot.
        this.container.onmouseout =     bank.slotMouseOut;
        // Drag and drop.
        this.container.ondragstart =    bank.slotDragStart;
        this.container.ondragenter =    bank.slotDragEnter;
        this.container.ondrop =         bank.slotDrop;
        // Store the key of this slot on the slot itself.
        this.container.setAttribute('slotIndex', slotIndex);

    }
}

class BankPanel {

    constructor () {
        this.container =    document.getElementById('bank_panel');
        this.tooltip =      document.getElementById('bank_tooltip');
        this.name =         document.getElementById('bank_name');
        this.contents =     document.getElementById('bank_contents');
        this.moneyValue =   document.getElementById('bank_money_value');
        this.deposit =      document.getElementById('bank_deposit');
        this.withdraw =     document.getElementById('bank_withdraw');
        this.input =        document.getElementById('bank_money_input');

        this.slots = [];

        // Create 10 slots.
        for(let i=0; i<20; i+=1){
            this.slots.push(new Slot(this, i));
        }

        this.deposit.onclick = function(){
            _this.bankManager.depositMoney();
            // Clear the input box.
            _this.GUI.bankPanel.input.value = "";
        };
        this.withdraw.onclick = function(){
            _this.bankManager.withdrawMoney();
            // Clear the input box.
            _this.GUI.bankPanel.input.value = "";
        };
    }

    show () {
        _this.GUI.isAnyPanelOpen = true;
        // Show the panel.
        this.container.style.visibility = "visible";
        for(let i=0; i<20; i+=1){
            // Don't show empty slots.
            if(_this.bankManager.items[i].catalogueEntry === null) continue;

            const slot = this.slots[i];
            slot.icon.style.visibility = "visible";

            if(_this.bankManager.items[i].durability === null) continue;
            slot.durability.style.visibility = "visible";
        }
    }

    hide () {
        _this.GUI.isAnyPanelOpen = false;
        // Hide the panel.
        this.container.style.visibility = "hidden";
        this.tooltip.style.visibility = 'hidden';
        // Hide the contents.
        for(let i=0; i<20; i+=1){
            const slot = this.slots[i];
            slot.icon.style.visibility = "hidden";
            slot.durability.style.visibility = "hidden";
        }
    }

    slotClick () {
        //console.log("slot clicked:", this.getAttribute('slotIndex'));

        _this.bankManager.withdrawItem(this.getAttribute('slotIndex'));
    }

    slotMouseOver () {
        const slotIndex = this.getAttribute('slotIndex');
        // If the slot is empty, don't show the tooltip.
        if(_this.bankManager.items[slotIndex].catalogueEntry === null) return;

        _this.GUI.bankPanel.tooltip.innerText = dungeonz.getTextDef("Item name: " + _this.bankManager.items[slotIndex].catalogueEntry.idName);
        _this.GUI.bankPanel.tooltip.style.visibility = 'visible';
    }

    slotMouseOut () {
        _this.GUI.bankPanel.tooltip.style.visibility = 'hidden';
    }

    slotDragStart (event) {
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
        event.preventDefault();
    }

    slotDragEnter (event) {
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
    }

    slotDrop (event) {
        event.stopPropagation();
        //console.log("slot dropped on bank, from:", _this.GUI.dragData.inventorySlot.slotKey, ", to:", this.getAttribute('slotIndex'));
        // Only add an item to the bank if it was dropped from the inventory bar.
        if(_this.GUI.dragData.dragOrigin === _this.GUI.inventoryBar.slotContainer){
            _this.bankManager.depositItem(_this.GUI.dragData.inventorySlot.slotKey, this.getAttribute('slotIndex'));
        }
    }

}

export default BankPanel;