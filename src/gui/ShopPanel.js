
import ItemTypes from '../../src/catalogues/ItemTypes'

class StockSlot {
    constructor (panel, slotNumber) {
        this.container = document.createElement('div');
        this.container.className = 'shop_item_cont';

        this.itemIcon = document.createElement('img');
        this.itemIcon.className = "shop_item";
        this.itemIcon.src = 'assets/img/gui/items/icon-iron-hatchet.png';

        this.priceContainer = document.createElement('div');
        this.priceContainer.className = "shop_price_cont";

        this.gloryIcon = document.createElement('img');
        this.gloryIcon.className = 'shop_glory_icon';
        this.gloryIcon.src = 'assets/img/gui/glory-icon.png';

        this.price = document.createElement('p');
        this.price.className = "shop_price";

        this.priceContainer.appendChild(this.gloryIcon);
        this.priceContainer.appendChild(this.price);

        this.container.onclick =        panel.slotClick;
        // Show and update the item tooltip info text when mouse is over a slot.
        this.container.onmouseover =    panel.slotMouseOver;
        // Hide the item tooltip when mouse is not over a slot.
        this.container.onmouseout =     panel.slotMouseOut;
        // Drag and drop.
        //this.container.ondragstart =    panel.slotDragStart;
        //this.container.ondragenter =    panel.slotDragEnter;
        // Store the key of this slot on the slot itself.
        this.container.setAttribute('slotIndex', slotNumber);

        this.container.appendChild(this.itemIcon);
        this.container.appendChild(this.priceContainer);

        panel.contents.appendChild(this.container);

        // The item name for when it is hovered over.
        this.itemName = '';
    }
}

class ShopPanel {

    constructor () {
        const panel = this;

        this.container =        document.getElementById('shop_panel');
        this.tooltip =          document.getElementById('shop_tooltip');
        this.name =             document.getElementById('shop_name');
        this.contents =         document.getElementById('shop_contents');
        this.buyButton =        document.getElementById('shop_buy_button');

        this.buyButton.onclick = this.buyPressed;

        this.stockSlots = [];
        this.maxStock = 20;
        for(let i=0; i<this.maxStock; i+=1){
            this.stockSlots.push(new StockSlot(this, i));
        }

        // The currently selected slot.
        this.selectedSlot = null;

        // When the panel is open, periodically check the shown prices are correct.
        this.getPricesLoop = null;
    }

    show (traderID, shopName, shopStock) {
        _this.GUI.isAnyPanelOpen = true;
        // Show the panel and change the shop name.
        this.container.style.visibility = "visible";
        this.name.innerText = shopName;

        // Request the prices of items in this shop.
        ws.sendEvent('get_shop_prices', {traderID: traderID, row: _this.dynamics[traderID].row, col: _this.dynamics[traderID].col});

        this.getPricesLoop = setInterval(function () {
            ws.sendEvent('get_shop_prices', {traderID: traderID, row: _this.dynamics[traderID].row, col: _this.dynamics[traderID].col});
        }, 5000);

        for(let i=0; i<shopStock.length; i+=1){
            this.stockSlots[i].itemIcon.src = 'assets/img/gui/items/' + ItemTypes[shopStock[i]].iconSource + '.png';

            // And the item name for when it is hovered over.
            this.stockSlots[i].itemName = dungeonz.getTextDef("Item name: " +  ItemTypes[shopStock[i]].idName);

            this.stockSlots[i].container.style.display = "block";
        }
    }

    hide () {
        _this.GUI.isAnyPanelOpen = false;
        // Hide the panel.
        this.container.style.visibility = "hidden";
        this.tooltip.style.visibility = 'hidden';

        // Hide all of the stock items, so they don't show in the next shop visited.
        for(let i=0; i<this.maxStock; i+=1){
            this.stockSlots[i].container.style.display = "none";
            this.stockSlots[i].itemName = '';
        }

        // If a slot is selected, deselect it.
        if(this.selectedSlot !== null){
            this.selectedSlot.container.style.backgroundColor = _this.GUI.GUIColours.white80Percent;
            this.selectedSlot = null;
        }

        clearInterval(this.getPricesLoop);
    }

    buyPressed () {
        // Get the selected slot index.
        // TODO
        const slotIndex = this.getAttribute('slotIndex');
    }

    updatePrices (prices) {
        for(let i=0; i<this.maxStock; i+=1){
            this.stockSlots[i].price.innerText = prices[i];
        }
    }

    slotClick () {
        // If nothing is selected, select this slot.
        if(_this.GUI.shopPanel.selectedSlot === null){
            const slot = _this.GUI.shopPanel.stockSlots[this.getAttribute('slotIndex')];
            _this.GUI.shopPanel.selectedSlot = slot;
            slot.container.style.backgroundColor = _this.GUI.GUIColours.shopSelected;
        }
        // The selected slot was selected again, deselect it.
        else if(_this.GUI.shopPanel.selectedSlot.container === this){
            _this.GUI.shopPanel.selectedSlot.container.style.backgroundColor = _this.GUI.GUIColours.white80Percent;
            _this.GUI.shopPanel.selectedSlot = null;
        }
        // A slot is already selected, deselect it and select this one.
        else {
            _this.GUI.shopPanel.selectedSlot.container.style.backgroundColor = _this.GUI.GUIColours.white80Percent;
            const slot = _this.GUI.shopPanel.stockSlots[this.getAttribute('slotIndex')];
            _this.GUI.shopPanel.selectedSlot = slot;
            slot.container.style.backgroundColor = _this.GUI.GUIColours.shopSelected;
        }

    }

    slotMouseOver () {
        const slotIndex = this.getAttribute('slotIndex');
        // If the slot is empty, don't show the tooltip.
        if(_this.GUI.shopPanel.stockSlots[slotIndex].itemName === null) return;
        _this.GUI.shopPanel.tooltip.innerText = _this.GUI.shopPanel.stockSlots[slotIndex].itemName;
        _this.GUI.shopPanel.tooltip.style.visibility = 'visible';
    }

    slotMouseOut () {
        _this.GUI.shopPanel.tooltip.style.visibility = 'hidden';
    }

}

export default ShopPanel;