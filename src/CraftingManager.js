import RecipeCatalogue from './catalogues/CraftingRecipes'
import ItemTypes from '../src/catalogues/ItemTypes'

class CraftingComponent {
    constructor (number) {
        this.number = number;
        /**
         * The key of the inventory slot that is occupying this component, or null if empty.
         * @type {String||null}
         */
        this.occupiedBy = null;
        //this.DOMContainer = document.getElementById('component_slot_' + number);
        this.DOMRemove = document.getElementById('component_slot_' + number + '_remove');
        this.DOMIcon = document.getElementById('component_slot_' + number + '_icon');
        //this.DOMBorder = document.getElementById('component_slot_' + number + '_border');

        this.DOMRemove.onclick = function () {
            _this.craftingManager.removeComponent(number);
        };
    }
}

class CraftingManager {

    constructor () {

        this.stationTypeNumber = null;

        this.recipeCode = '';

        this.components = {
            slot1: new CraftingComponent(1),
            slot2: new CraftingComponent(2),
            slot3: new CraftingComponent(3),
            slot4: new CraftingComponent(4),
            slot5: new CraftingComponent(5)
        };

        this.resultDOMAccept = document.getElementById('craft_result_accept');
        this.resultDOMIcon = document.getElementById('craft_result_icon');

        this.resultDOMAccept.onclick = function () {
            const inventorySlotKeys = [];
            const components = _this.craftingManager.components;
            for(let slotKey in components){
                if(components.hasOwnProperty(slotKey) === false) continue;
                if(components[slotKey].occupiedBy === null) break;
                inventorySlotKeys.push(components[slotKey].occupiedBy);
            }

            for(let slotKey in components){
                if(components.hasOwnProperty(slotKey) === false) continue;
                _this.craftingManager.removeComponent(components.slot1.number);
            }

            window.ws.sendEvent("craft", {stationTypeNumber: _this.craftingManager.stationTypeNumber, inventorySlotKeys: inventorySlotKeys});
        };

    }

    addComponent (inventorySlotKey) {
        //console.log("adding component, key:", inventorySlotKey);
        // Don't try to add this item if it is already being used as a component.
        if(_this.player.inventory[inventorySlotKey].craftingComponent !== null) return;
        // Don't try to add this item if there is nothing in that inventory slot.
        if(_this.player.inventory[inventorySlotKey].catalogueEntry === null) return;

        let component;
        // Get the first empty component slot.
        for(let slotKey in this.components){
            if(this.components.hasOwnProperty(slotKey) === false) continue;
            component = this.components[slotKey];
            if(component.occupiedBy === null){
                component.occupiedBy = inventorySlotKey;
                component.DOMRemove.style.visibility = "visible";
                component.DOMIcon.style.visibility = "visible";
                component.DOMIcon.src = _this.GUI.inventoryBar.slots[inventorySlotKey].icon.src;
                this.recipeCode += _this.player.inventory[inventorySlotKey].catalogueEntry.typeNumber + '-';
                _this.player.inventory[inventorySlotKey].craftingComponent = component;
                _this.GUI.inventoryBar.slots[inventorySlotKey].icon.style.opacity = 0.5;

                this.checkRecipeCode();

                return;
            }
        }

        //TODO All components are full. Fade out the rest of the add component buttons for the items that aren't being used.


    }

    removeComponent (componentNumber) {
        console.log("remove component:", componentNumber);
        let component = this.components['slot' + componentNumber];
        if(component === undefined) return;
        if(component.occupiedBy === null) return;
        component.DOMRemove.style.visibility = "hidden";
        component.DOMIcon.style.visibility = "hidden";

        _this.GUI.inventoryBar.slots[component.occupiedBy].icon.style.opacity = 1;
        _this.player.inventory[component.occupiedBy].craftingComponent = null;
        component.occupiedBy = null;

        this.shiftEmptyComponentsLeft();

        // Remake the recipe code.
        this.recipeCode = '';
        for(let slotKey in this.components){
            if(this.components.hasOwnProperty(slotKey) === false) continue;
            if(this.components[slotKey].occupiedBy === null) break;
            this.recipeCode += _this.player.inventory[this.components[slotKey].occupiedBy].catalogueEntry.typeNumber + '-';
        }

        this.checkRecipeCode();

    }

    checkRecipeCode () {
        //console.log("checking recipe code", this.recipeCode);
        // Check if the recipe code matches a valid recipe.
        if(RecipeCatalogue[this.stationTypeNumber] !== undefined){
            //console.log("  station is valid, result:", RecipeCatalogue[this.stationTypeNumber]);
            if(RecipeCatalogue[this.stationTypeNumber][this.recipeCode] !== undefined){
                //console.log("  recipe found for this crafting station:", RecipeCatalogue[this.stationTypeNumber][this.recipeCode]);
                this.resultDOMAccept.style.visibility = "visible";
                this.resultDOMIcon.style.visibility = "visible";
                this.resultDOMIcon.src = 'assets/img/gui/items/' + ItemTypes[RecipeCatalogue[this.stationTypeNumber][this.recipeCode].resultTypeNumber].iconSource + ".png";
            }
            else {
                //console.log("  recipe is NOT valid");
                this.resultDOMAccept.style.visibility = "hidden";
                this.resultDOMIcon.style.visibility = "hidden";
            }
        }
    }

    shiftEmptyComponentsLeft () {
        // Move the remaining components to the left to fill any gaps.
        const componentKeys = Object.keys(this.components);
        let currentComponent,
            nextComponent;
        for(let i=0; i<componentKeys.length; i+=1){
            currentComponent = this.components[componentKeys[i]];
            if(currentComponent.occupiedBy === null){
                // An empty slot found. Find the next non-empty slot and move it to this one.
                for(let j=i+1; j<componentKeys.length; j+=1){
                    nextComponent = this.components[componentKeys[j]];
                    if(nextComponent.occupiedBy === null) continue;

                    currentComponent.occupiedBy = nextComponent.occupiedBy;
                    nextComponent.occupiedBy = null;

                    currentComponent.DOMRemove.style.visibility = 'visible';
                    nextComponent.DOMRemove.style.visibility = 'hidden';

                    currentComponent.DOMIcon.src = nextComponent.DOMIcon.src;
                    currentComponent.DOMIcon.style.visibility = 'visible';
                    nextComponent.DOMIcon.style.visibility = 'hidden';

                    break;
                }
            }
        }
    }

    empty () {
        for(let i=0; i<5; i+=1){
            this.removeComponent(1);looking good, now bank?
        }
    }

}

export default CraftingManager;