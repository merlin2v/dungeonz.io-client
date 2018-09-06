
class InventorySlot {

    constructor (slotKey) {
        /**
         * A reference to the catalogue entry for this type of item. Null if there is nothing in this slot.
         * @type {{}|null}
         */
        this.catalogueEntry = null;

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
        _this.GUI.inventorySlotIcons[this.slotKey].style.visibility = "hidden";
        _this.GUI.inventorySlotDurabilityMeters[this.slotKey].style.visibility = "hidden";

        // Reset the catalogue entry so it doesn't show up in the tooltip.
        this.catalogueEntry = null;
    }

    updateDurability (value) {
        this.durability = value;
        // Get the durability of the item as a proportion of the max durability, to use as the meter source image.
        const meterNumber = Math.floor((this.durability / this.maxDurability) * 10);
        _this.GUI.inventorySlotDurabilityMeters[this.slotKey].src = "assets/img/gui/durability-meter-" + meterNumber + ".png";
    }
}

export default InventorySlot;