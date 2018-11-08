import InventorySlot from "./InventorySlot";

class Inventory {

    constructor(){
        this.slot1 = new InventorySlot("slot1");
        this.slot2 = new InventorySlot("slot2");
        this.slot3 = new InventorySlot("slot3");
        this.slot4 = new InventorySlot("slot4");
        this.slot5 = new InventorySlot("slot5");
        this.slot6 = new InventorySlot("slot6");
        this.slot7 = new InventorySlot("slot7");
        this.slot8 = new InventorySlot("slot8");
        this.slot9 = new InventorySlot("slot9");
        this.slot0 = new InventorySlot("slot0");


    }

    swapInventorySlots(slotKeyFrom, slotKeyTo){
        console.log("swapping inventory slots: from", slotKeyFrom, "to", slotKeyTo);

        const fromSlot = this[slotKeyFrom];
        const fromSlotData = {
            catalogueEntry: fromSlot.catalogueEntry,
            craftingComponent: fromSlot.craftingComponent,
            durability: fromSlot.durability,
            maxDurability: fromSlot.maxDurability,
            equippedSource: _this.GUI.inventorySlots[fromSlot.slotKey].equipped.src,
            equippedVisibility: _this.GUI.inventorySlots[fromSlot.slotKey].equipped.style.visibility
        };
        const toSlot = this[slotKeyTo];
        const toSlotData = {
            catalogueEntry: toSlot.catalogueEntry,
            craftingComponent: toSlot.craftingComponent,
            durability: toSlot.durability,
            maxDurability: toSlot.maxDurability,
            equippedSource: _this.GUI.inventorySlots[toSlot.slotKey].equipped.src,
            equippedVisibility: _this.GUI.inventorySlots[toSlot.slotKey].equipped.style.visibility
        };

        this[slotKeyFrom].empty();
        this[slotKeyTo].empty();

        this[slotKeyFrom].fill(toSlotData.catalogueEntry, toSlotData.durability, toSlotData.maxDurability);
        this[slotKeyTo].fill(fromSlotData.catalogueEntry, fromSlotData.durability, fromSlotData.maxDurability);

        // When the slots were emptied, the equipped icon was hidden. Reshow it for items that were equipped.
        if(fromSlotData.equippedVisibility === "visible"){
            _this.GUI.inventorySlots[slotKeyTo].equipped.style.visibility = "visible";
            _this.GUI.inventorySlots[slotKeyTo].equipped.src = fromSlotData.equippedSource;
        }
        if(toSlotData.equippedVisibility === "visible"){
            _this.GUI.inventorySlots[slotKeyFrom].equipped.style.visibility = "visible";
            _this.GUI.inventorySlots[slotKeyFrom].equipped.src = toSlotData.equippedSource;
        }

        window.ws.sendEvent('swap_inventory_slots', {slotKeyFrom: slotKeyFrom, slotKeyTo: slotKeyTo});

    }

}

export default Inventory;