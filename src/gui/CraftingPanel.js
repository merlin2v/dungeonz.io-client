import CraftingManager from "../CraftingManager";

class ComponentSlot {
    constructor (panel, slotNumber) {
        this.container =    document.getElementById('component_slot_' + slotNumber);
        this.icon =         document.getElementById('component_slot_' + slotNumber + '_icon');
        this.remove =       document.getElementById('component_slot_' + slotNumber + '_remove');

        // Remove the component when it is clicked on.
        this.container.onclick =        panel.slotClick;
        // Show and update the item tooltip info text when mouse is over a slot.
        this.container.onmouseover =    panel.slotMouseOver;
        // Hide the item tooltip when mouse is not over a slot.
        this.container.onmouseout =     panel.slotMouseOut;
        // Drag and drop.
        this.container.ondragstart =    panel.slotDragStart;
        this.container.ondragenter =    panel.slotDragEnter;
        // Store the key of this slot on the slot itself.
        this.container.setAttribute('slotKey', 'slot' + slotNumber);
    }
}

class CraftingPanel {

    constructor () {
        const panel = this;

        this.container =        document.getElementById('crafting_panel');
        this.tooltip =          document.getElementById('crafting_tooltip');
        this.name =             document.getElementById('crafting_station_name');
        this.componentsBar =    document.getElementById('crafting_components_bar');
        this.result = {
            container:          document.getElementById('craft_result'),
            icon:               document.getElementById('craft_result_icon'),
            accept:             document.getElementById('craft_result_accept'),
            itemName: ''
        };

        this.componentsBar.ondragenter = panel.componentsBarDragEnter;
        this.componentsBar.ondragover =  panel.componentsBarDragOver;
        this.componentsBar.ondrop =      panel.componentsBarDrop;

        this.result.accept.onclick = CraftingManager.accept;
        this.result.container.onmouseover = this.resultMouseOver;
        this.result.container.onmouseout = this.slotMouseOut;

        this.components = {};

        for(let i=1; i<6; i+=1){
            this.components['slot' + i] = new ComponentSlot(this, i);
        }
    }

    show (stationName) {
        _this.GUI.isAnyPanelOpen = true;
        // Show the panel and change the station name.
        this.container.style.visibility = "visible";
        this.name.innerText = stationName;

        // Clear any existing recipe code.
        _this.craftingManager.recipeCode = '';
    }

    hide () {
        _this.GUI.isAnyPanelOpen = false;
        // Hide the panel.
        this.container.style.visibility = "hidden";
        this.tooltip.style.visibility = 'hidden';
        this.result.icon.style.visibility = "hidden";
        this.result.accept.style.visibility = "hidden";

        _this.craftingManager.empty();
    }

    slotClick () {
        const slotKey = this.getAttribute('slotKey');
        console.log("slot clicked:", slotKey);
        _this.craftingManager.removeComponent(slotKey[4]);
    }

    slotMouseOver () {
        const slotKey = this.getAttribute('slotKey');
        // If the slot is empty, don't show the tooltip.
        if(_this.craftingManager.components[slotKey].occupiedBy === null) return;

        _this.GUI.craftingPanel.tooltip.innerText = dungeonz.getTextDef("Item name: " + _this.player.inventory[_this.craftingManager.components[slotKey].occupiedBy].catalogueEntry.idName);
        _this.GUI.craftingPanel.tooltip.style.visibility = 'visible';
    }

    slotMouseOut () {
        _this.GUI.craftingPanel.tooltip.style.visibility = 'hidden';
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

    componentsBarDragEnter (event) {
        event.preventDefault();
    }

    componentsBarDragOver (event) {
        event.preventDefault();
    }

    componentsBarDrop (event) {
        event.preventDefault();
        event.stopPropagation();

        if(_this.GUI.dragData.dragOrigin === _this.GUI.inventoryBar.slotContainer){
            _this.craftingManager.addComponent(_this.GUI.dragData.inventorySlot.slotKey);
        }
    }

    resultMouseOver () {
        if(_this.GUI.craftingPanel.result.itemName === '') return;

        _this.GUI.craftingPanel.tooltip.innerText = _this.GUI.craftingPanel.result.itemName;
        _this.GUI.craftingPanel.tooltip.style.visibility = 'visible';
    }

}

export default CraftingPanel;