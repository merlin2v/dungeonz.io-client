
class GoldExchangePanel {
    constructor () {

        this.container =    document.getElementById('gold_ex_panel');
        this.name =         document.getElementById('gold_ex_name');
        this.rateValue =    document.getElementById('gold_ex_rate_value');
        this.accept =       document.getElementById('gold_ex_accept');

        this.accept.onclick = function () {
            window.ws.sendEvent("exchange_gold");
        }

    }

    show () {
        _this.GUI.isAnyPanelOpen = true;
        // Show the panel.
        this.container.style.visibility = "visible";

        this.getExchangeRate();
    }

    hide () {
        _this.GUI.isAnyPanelOpen = false;
        // Hide the panel.
        this.container.style.visibility = "hidden";
    }

    updateExchangeRate (value) {
        _this.GUI.goldExchangePanel.rateValue.innerText = value;
        // Set a timer to request the current exchange rate again, in case it has changed while the user is looking at it.
        setTimeout(_this.GUI.goldExchangePanel.getExchangeRate, 2000);
    }

    getExchangeRate () {
        // If the panel is closed, stop requesting the exchange rate.
        if(_this.GUI.goldExchangePanel.container.style.visibility === "hidden") return;

        window.ws.sendEvent("get_gold_exchange_rate");
    }
}

export default GoldExchangePanel;