
import ItemTypes from '../../src/catalogues/ItemTypes'
import PanelTemplate from "./PanelTemplate";

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

        panel.shopContents.appendChild(this.container);

        // TODO, add tooltips for each shop stock slot, could just do one and move it, might be messy

        // The item name for when it is hovered over.
        this.itemName = '';
    }
}

class ShopPanel extends PanelTemplate {

    constructor () {

        super(document.getElementById('shop_panel_test'), 440, 384, 'Shop', 'shop-icon');

        this.shopContents = document.createElement('div');
        this.shopContents.id = 'shop_contents';
        this.contentsContainer.appendChild(this.shopContents);

        const bottomContainer = document.createElement('div');
        bottomContainer.id = 'shop_bottom_cont';
        this.contentsContainer.appendChild(bottomContainer);

        // Add a container for the 'Buy' text and the image button.
        const buyButtonContainer = document.createElement('div');
        buyButtonContainer.className = 'centered shop_buy_button_cont';
        buyButtonContainer.onclick = this.buyPressed;
        bottomContainer.appendChild(buyButtonContainer);

        this.buyButton = document.createElement('img');
        this.buyButton.className = 'centered shop_buy_button';
        this.buyButton.src = 'assets/img/gui/buy-button-border-valid.png';
        this.buyButton.draggable = false;
        buyButtonContainer.appendChild(this.buyButton);

        const buyText = document.createElement('div');
        buyText.innerText = "Buy";
        buyText.className = 'centered shop_buy_text';
        buyButtonContainer.appendChild(buyText);


        this.stockSlots = [];
        this.maxStock = 30;
        for(let i=0; i<this.maxStock; i+=1){
            this.stockSlots.push(new StockSlot(this, i));
        }

        // Keep the currently shown shop stock, so the item type numbers can be found to be sent when buying.
        this.shopStock = [];

        // The trader entity that this player is trading with, to send when buying something so the server knows who to buy from.
        this.traderID = null;

        // The currently selected slot.
        this.selectedSlot = null;

        // When the panel is open, periodically check the shown prices are correct.
        this.getPricesLoop = null;
    }

    show (traderID, shopName, shopStock) {

        super.show();

        _this.GUI.isAnyPanelOpen = true;
        // Show the panel and change the shop name.
        //this.container.style.visibility = "visible";
        this.changeName(shopName);
        //this.name.innerText = shopName;

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

        this.shopStock = shopStock;
        this.traderID = traderID;
    }

    hide () {
        // Hide the panel.
        super.hide();

        _this.GUI.isAnyPanelOpen = false;

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

        // Reset the buy button.
        this.buyButton.src = 'assets/img/gui/buy-button-border-invalid.png';

        clearInterval(this.getPricesLoop);
    }

    buyPressed () {
        const shopPanel = _this.GUI.shopPanel;

        // Check a slot is actually selected.
        if(shopPanel.selectedSlot === null) return;

        // Get the selected slot index.
        const slotIndex = shopPanel.selectedSlot.container.getAttribute('slotIndex');

        ws.sendEvent("shop_buy_item", {
            traderID: shopPanel.traderID,
            row: _this.dynamics[shopPanel.traderID].row,
            col: _this.dynamics[shopPanel.traderID].col,
            index: slotIndex,
            itemTypeNumber: shopPanel.shopStock[slotIndex],
            price: shopPanel.selectedSlot.price.innerText
        });
    }

    updatePrices (prices) {
        for(let i=0; i<this.maxStock; i+=1){
            this.stockSlots[i].price.innerText = prices[i];
        }
    }

    slotClick () {
        // If nothing is selected, select this slot.
        if(_this.GUI.shopPanel.selectedSlot === null){
            /** @type {StockSlot} */
            const slot = _this.GUI.shopPanel.stockSlots[this.getAttribute('slotIndex')];
            _this.GUI.shopPanel.selectedSlot = slot;
            slot.container.style.backgroundColor = _this.GUI.GUIColours.shopSelected;

            // If the player has enough glory for that item, make the buy button green.
            if(slot.price.innerText > _this.player.glory) _this.GUI.shopPanel.buyButton.src = 'assets/img/gui/buy-button-border-invalid.png';
            else _this.GUI.shopPanel.buyButton.src = 'assets/img/gui/buy-button-border-valid.png';
        }
        // The selected slot was selected again, deselect it.
        else if(_this.GUI.shopPanel.selectedSlot.container === this){
            _this.GUI.shopPanel.selectedSlot.container.style.backgroundColor = _this.GUI.GUIColours.white80Percent;
            _this.GUI.shopPanel.selectedSlot = null;

            _this.GUI.shopPanel.buyButton.src = 'assets/img/gui/buy-button-border-invalid.png';
        }
        // A slot is already selected, deselect it and select this one.
        else {
            _this.GUI.shopPanel.selectedSlot.container.style.backgroundColor = _this.GUI.GUIColours.white80Percent;
            const slot = _this.GUI.shopPanel.stockSlots[this.getAttribute('slotIndex')];
            _this.GUI.shopPanel.selectedSlot = slot;
            slot.container.style.backgroundColor = _this.GUI.GUIColours.shopSelected;
            // If the player has enough glory for that item, make the buy button green.
            if(slot.price.innerText > _this.player.glory) _this.GUI.shopPanel.buyButton.src = 'assets/img/gui/buy-button-border-invalid.png';
            else _this.GUI.shopPanel.buyButton.src = 'assets/img/gui/buy-button-border-valid.png';
        }

    }

    slotMouseOver () {
        const slotIndex = this.getAttribute('slotIndex');
        // If the slot is empty, don't show the tooltip.
        //if(_this.GUI.shopPanel.stockSlots[slotIndex].itemName === null) return;
        //_this.GUI.shopPanel.tooltip.innerText = _this.GUI.shopPanel.stockSlots[slotIndex].itemName;
        //_this.GUI.shopPanel.tooltip.style.visibility = 'visible';
    }

    slotMouseOut () {
        //_this.GUI.shopPanel.tooltip.style.visibility = 'hidden';
    }

}

export default ShopPanel;