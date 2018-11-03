
class InventorySlot {

    constructor (slotKey) {
        /**
         * A reference to the catalogue entry for this type of item. Null if there is nothing in this slot.
         * @type {{}|null}
         */
        this.catalogueEntry = null;

        /**
         * The component in the crafting panel that this item is being used in, otherwise null.
         * @type {Boolean}
         */
        this.craftingComponent = null;

        /**
         * How much durability this item has.
         * @type {Number|null}
         */
        this.durability = null;

        /**
         * How much durability this can have.
         * @type {Number|null}
         */
        this.maxDurability = null;

        this.slotKey = slotKey;
    }

    empty () {
        // Hide the item icon and durability meter.
        _this.GUI.inventorySlots[this.slotKey].icon.style.visibility = "hidden";
        _this.GUI.inventorySlots[this.slotKey].durability.style.visibility = "hidden";
        _this.GUI.inventorySlots[this.slotKey].equipped.style.visibility = "hidden";
        _this.GUI.inventorySlots[this.slotKey].addComponent.style.visibility = "hidden";

        // Reset the catalogue entry so it doesn't show up in the tooltip.
        this.catalogueEntry = null;

        // If this item was being used in crafting when removed, update the crafting panel.
        if(this.craftingComponent !== null){
            _this.craftingManager.removeComponent(this.craftingComponent.number);
        }
    }

    updateDurability (value) {
        this.durability = value;
        // Get the durability of the item as a proportion of the max durability, to use as the meter source image.
        const meterNumber = Math.floor((this.durability / this.maxDurability) * 10);
        _this.GUI.inventorySlots[this.slotKey].durability.src = "assets/img/gui/durability-meter-" + meterNumber + ".png";
    }
}

export default InventorySlot;