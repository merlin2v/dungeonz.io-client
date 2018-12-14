
class ExitGamePanel {
    constructor () {

        this.container =document.getElementById('exit_game_panel');
        this.code =     document.getElementById('exit_game_panel_code');
        this.saveCode = document.getElementById('exit_game_panel_save_button');
        this.exit =     document.getElementById('exit_game_panel_exit_button');

        this.saveCode.onclick = this.saveCodePressed;
        this.exit.onclick = this.exitPressed;

    }

    show () {
        _this.GUI.isAnyPanelOpen = true;
        this.container.style.visibility = "visible";
    }

    hide () {
        _this.GUI.isAnyPanelOpen = false;
        this.container.style.visibility = "hidden";
    }

    saveCodePressed () {
        // Save the code to the client local storage.
        localStorage.setItem('continue_code', _this.GUI.exitGamePanel.code.innerText);

        //console.log("save code btn:", this);
        // Change the colour and text of the button to green.
        this.innerText = dungeonz.getTextDef('Exit game panel: saved');
        this.style.backgroundColor = "green";
    }

    exitPressed () {
        // Refresh the page.
        location.reload();
    }
}

export default  ExitGamePanel;