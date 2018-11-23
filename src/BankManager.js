import GUI from "./gui/GUI";

class BankItem {
    constructor () {
        this.catalogueEntry = null;
        this.durability = null;
        this.maxDurability = null;
    }
}

class BankManager {

    constructor (coins) {

        this.coins = coins || 0;
        /** @type {BankItem[]} */
        this.items = [];

        for(let i=0; i<20; i+=1){
            this.items.push(new BankItem());
        }
    }

    depositItem (inventorySlotKey, bankSlotIndex) {
        window.ws.sendEvent('bank_deposit_item', {inventorySlotKey: inventorySlotKey, bankSlotIndex: bankSlotIndex});
    }

    withdrawItem (bankSlotIndex, inventorySlotKey) {
        window.ws.sendEvent('bank_withdraw_item', {bankSlotIndex: bankSlotIndex, inventorySlotKey: inventorySlotKey});
    }

    /**
     *
     * @param {Number} slotIndex
     * @param {{}|null} catalogueEntry - A reference to the catalogue entry for this type of item. Null if there is nothing in this slot.
     * @param {Number|null} durability
     * @param {Number|null} maxDurability
     */
    addItemToContents (slotIndex, catalogueEntry, durability, maxDurability) {
        //console.log("add item to contents:", slotIndex);
        const slot = this.items[slotIndex];
        if(slot === undefined) return;

        slot.catalogueEntry = catalogueEntry;
        slot.durability = durability;
        slot.maxDurability = maxDurability;

        const guiSlot = _this.GUI.bankPanel.slots[slotIndex];

        // Change the source image for the icon.
        guiSlot.icon.src = "assets/img/gui/items/" + catalogueEntry.iconSource + ".png";
        guiSlot.icon.style.visibility = "visible";

        if(durability !== null){
            guiSlot.durability.style.visibility = "visible";
            // Get the durability of the item as a proportion of the max durability, to use as the meter source image.
            const meterNumber = Math.floor((durability / maxDurability) * 10);
            guiSlot.durability.src = "assets/img/gui/durability-meter-" + meterNumber + ".png";
        }
        else {
            guiSlot.durability.style.visibility = "hidden";
        }

    }

    /**
     * Empties the bank slot that the item was withdrawn from.
     * @param {Number} slotIndex - The index of the slot to empty.
     */
    removeItemFromContents (slotIndex) {
        //console.log("remove item from contents:", slotIndex);
        const slot = this.items[slotIndex];
        if(slot === undefined) return;

        slot.catalogueEntry = null;
        slot.durability = null;
        slot.maxDurability = null;

        const guiSlot = _this.GUI.bankPanel.slots[slotIndex];
        guiSlot.icon.style.visibility = "hidden";
        guiSlot.durability.style.visibility = "hidden";
    }

    swapSlots (fromIndex, toIndex) {
        console.log("swapping bank slots:", fromIndex, "to", toIndex);

        const GUIslots = _this.GUI.bankPanel.slots;

        /** @type {BankItem} */
        const fromItem = this.items[fromIndex];
        // Temporary store of the data of the item being moved.
        const fromSlotData = {
            catalogueEntry: fromItem.catalogueEntry,
            durability: fromItem.durability,
            maxDurability: fromItem.maxDurability,
            iconSource: GUIslots[fromIndex].icon.src
        };

        /** @type {BankItem} */
        const toItem = this.items[toIndex];

        // Update the item data of the item being move to be the same as what it is moved into.
        fromItem.catalogueEntry = toItem.catalogueEntry;
        fromItem.durability = toItem.durability;
        fromItem.maxDurability = toItem.maxDurability;

        //console.log("gui slots:", GUIslots);
        //console.log("from item:", fromItem);

        // The item data from the TO slot has been moved into the item data for the FROM slot. Now update the GUI for the FROM slot.
        // Check if any item was moved to this slot. Might have swapped with an empty slot.
        if(fromItem.catalogueEntry === null){
            // Hide the icon and durability bar.
            GUIslots[fromIndex].icon.style.visibility = "hidden";
            GUIslots[fromIndex].durability.style.visibility = "hidden";
        }
        else {
            // Item was moved. Show the icon, and also show the durability bar if it has a durability.
            GUIslots[fromIndex].icon.style.visibility = "visible";
            GUIslots[fromIndex].icon.src = GUIslots[toIndex].icon.src;
            if(fromItem.durability === null){
                GUIslots[fromIndex].durability.style.visibility = "hidden";
            }
            else {
                GUIslots[fromIndex].durability.style.visibility = "visible";
            }
        }

        // The FROM slot is done. Now update the data stored in the TO item to be what was in the FROM item.
        toItem.catalogueEntry = fromSlotData.catalogueEntry;
        toItem.durability = fromSlotData.durability;
        toItem.maxDurability = fromSlotData.maxDurability;

        // Update the TO slot to show what was moved into it.
        if(toItem.catalogueEntry === null){
            // Hide the icon and durability bar.
            GUIslots[toIndex].icon.style.visibility = "hidden";
            GUIslots[toIndex].durability.style.visibility = "hidden";
        }
        else {
            // Item was moved. Show the icon, and also show the durability bar if it has a durability.
            GUIslots[toIndex].icon.style.visibility = "visible";
            GUIslots[toIndex].icon.src = fromSlotData.iconSource;
            if(toItem.durability === null){
                GUIslots[toIndex].durability.style.visibility = "hidden";
            }
            else {
                GUIslots[toIndex].durability.style.visibility = "visible";
            }
        }

        //window.ws.sendEvent("bank_swap_slots", {fromSlotIndex: fromIndex, toSlotIndex: toIndex});
    }

    depositMoney () {
        let moneyValue = parseInt(_this.GUI.bankPanel.input.value);
        if(Number.isInteger(moneyValue) === false) return;
        if(moneyValue <= 0) return;
        // Don't let them deposit more money than they have on them.
        // Deposit everything they have if trying to deposit more.
        if(moneyValue > _this.player.coins){
            moneyValue = _this.player.coins;
        }

        window.ws.sendEvent("bank_deposit_money", moneyValue);
    }

    withdrawMoney () {
        let moneyValue = parseInt(_this.GUI.bankPanel.input.value);
        if(Number.isInteger(moneyValue) === false) return;
        if(moneyValue <= 0) return;
        // Don't let them withdraw more money than they have in the bank.
        // Withdraw everything in the bank if trying to withdraw more.
        if(moneyValue > this.coins){
            moneyValue = this.coins;
        }

        window.ws.sendEvent("bank_withdraw_money", moneyValue);
    }

}

export default BankManager;