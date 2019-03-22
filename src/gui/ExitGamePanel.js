
import PanelTemplate from "./PanelTemplate";

class ExitGamePanel extends PanelTemplate {
    constructor () {
        super(document.getElementById('exit_game_panel'), 440, 420, dungeonz.getTextDef('Exit game panel: name'), 'gui/hud/exit-icon');

        const innerContainer = document.createElement('div');
        innerContainer.id = 'exit_inner_cont';
        this.contentsContainer.appendChild(innerContainer);

        const topInfoContainer = document.createElement('div');
        topInfoContainer.id = 'exit_top_info_cont';
        topInfoContainer.innerText = dungeonz.getTextDef('Exit game panel: info 1');
        innerContainer.appendChild(topInfoContainer);

        this.codeContainer = document.createElement('div');
        this.codeContainer.id = 'exit_code_cont';
        this.codeContainer.innerText = _this.player.continueCode;
        innerContainer.appendChild(this.codeContainer);

        const saveCodeButtonContainer = document.createElement('div');
        saveCodeButtonContainer.className = 'exit_button_cont';
        saveCodeButtonContainer.onclick = this.saveCodePressed;
        innerContainer.appendChild(saveCodeButtonContainer);

        this.saveCodeButton = document.createElement('img');
        this.saveCodeButton.className = 'exit_button';
        this.saveCodeButton.src = 'assets/img/gui/panels/save-code-button-border-inactive.png';
        saveCodeButtonContainer.appendChild(this.saveCodeButton);

        this.saveCodeText = document.createElement('div');
        this.saveCodeText.className = 'exit_button_text';
        this.saveCodeText.innerText = dungeonz.getTextDef('Exit game panel: save code');
        saveCodeButtonContainer.appendChild(this.saveCodeText);

        const bottomInfoContainer = document.createElement('div');
        bottomInfoContainer.id = 'exit_bottom_info_cont';
        innerContainer.appendChild(bottomInfoContainer);

        const exitWarningHeading = document.createElement('div');
        exitWarningHeading.id = 'exit_warning_heading';
        exitWarningHeading.innerText = dungeonz.getTextDef('Enter dungeon warning heading');
        bottomInfoContainer.appendChild(exitWarningHeading);

        const exitWarning = document.createElement('div');
        exitWarning.id = 'exit_warning_text';
        exitWarning.innerText = dungeonz.getTextDef('Exit game panel: info 2');
        bottomInfoContainer.appendChild(exitWarning);

        const exitButtonContainer = document.createElement('div');
        exitButtonContainer.className = 'exit_button_cont';
        exitButtonContainer.onclick = this.exitPressed;
        innerContainer.appendChild(exitButtonContainer);

        const exitButton = document.createElement('img');
        exitButton.className = 'exit_button';
        exitButton.src = 'assets/img/gui/panels/exit-game-button-border.png';
        exitButtonContainer.appendChild(exitButton);

        const exitGameText = document.createElement('div');
        exitGameText.className = 'exit_button_text';
        exitGameText.innerText = dungeonz.getTextDef('Exit game panel: exit');
        exitButtonContainer.appendChild(exitGameText);

    }

    show () {
        super.show();
        _this.GUI.isAnyPanelOpen = true;
    }

    hide () {
        super.hide();
        _this.GUI.isAnyPanelOpen = false;
    }

    saveCodePressed () {
        // Save the code to the client local storage.
        localStorage.setItem('continue_code', _this.GUI.exitGamePanel.codeContainer.innerText);

        // Make the button look pressed.
        _this.GUI.exitGamePanel.saveCodeText.innerText = dungeonz.getTextDef('Exit game panel: saved');
        _this.GUI.exitGamePanel.saveCodeButton.src = "assets/img/gui/panels/save-code-button-border-active.png";
    }

    exitPressed () {
        // Reload the page.
        location.reload();
    }
}

export default ExitGamePanel;