
class ComponentSlot {
    constructor () {

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
    }
}

class CraftingPanel {

    constructor () {
        const panel = this;

        this.isOpen = false;
        this.container =    document.getElementById('crafting_panel');
        this.stationName =  document.getElementById('crafting_station_name');
        this.componentsBar =  document.getElementById('crafting_components_bar');

        this.componentsBar.ondragenter = panel.componentsBarDragEnter;
        this.componentsBar.ondragover =  panel.componentsBarDragOver;
        this.componentsBar.ondrop =      panel.componentsBarDrop;

        this.componentSlots = {};

        for(let i=1; i<6; i+=1){
            const slot = this.componentSlots['slot'+i] = document.getElementById('component_slot_' + i);
            // Show and update the item tooltip info text when mouse is over a slot.
            slot.onmouseover =  this.slotMouseOver;
            // Hide the item tooltip when mouse is not over a slot.
            slot.onmouseout =   this.slotMouseOut;
            // Drag and drop.
            slot.ondragstart =  this.slotDragStart;
            slot.ondragend =    this.slotDragEnd;
            slot.ondragenter =  this.slotDragEnter;
            slot.ondragleave =  this.slotDragLeave;
            slot.ondragover =   this.slotDragOver;
            slot.ondrop =       this.slotDrop;
        }
    }

    show (stationName) {
        this.isOpen = true;
        // Show the crafting panel and change the station name.
        this.container.style.visibility = "visible";
        this.stationName.innerText = stationName;

        // Clear any existing recipe code.
        _this.craftingManager.recipeCode = '';
    }

    hide () {
        if(this.isOpen === false) return;
        this.isOpen = false;

        // Hide the crafting panel.
        this.container.style.visibility = "hidden";

        const craftingManager = _this.craftingManager;
        craftingManager.empty();
        craftingManager.resultDOMIcon.style.visibility = "hidden";
        craftingManager.resultDOMAccept.style.visibility = "hidden";
    }

    slotMouseOver () {

    }

    slotMouseOut () {

    }

    slotDragStart (event) {
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
    }

    slotDragEnter (event) {
        // Prevent the GUI from firing it's own drag and drop stuff from this slot.
        event.stopPropagation();
    }

    slotDragLeave (event) {

    }

    slotDragOver (event) {

    }

    slotDrop (event) {

    }

    slotDragEnd (event) {

    }

    componentsBarDragEnter (event) {
        event.preventDefault();
    }

    componentsBarDragOver (event) {
        event.preventDefault();
    }

    componentsBarDrop (event) {
        event.stopPropagation();
        console.log("comp bar drop");

        if(_this.GUI.dragData.dragOrigin === _this.GUI.inventoryBar.slotContainer){
            _this.craftingManager.addComponent(_this.GUI.dragData.inventorySlot.slotKey);
        }
    }

}

export default CraftingPanel;