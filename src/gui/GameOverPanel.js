
import PanelTemplate from "./PanelTemplate";

class GameOverPanel extends PanelTemplate {
    constructor () {
        super(document.getElementById('game_over_panel'), 440, 220, dungeonz.getTextDef('Game over'), 'gui/panels/game-over-icon', true);

        const innerContainer = document.createElement('div');
        innerContainer.id = 'game_over_inner_cont';
        this.contentsContainer.appendChild(innerContainer);

        const mainContainer = document.createElement('div');
        mainContainer.id = 'game_over_main_cont';
        innerContainer.appendChild(mainContainer);

        const gameOverInfo = document.createElement('div');
        gameOverInfo.id = 'game_over_info';
        gameOverInfo.innerText = dungeonz.getTextDef('Game over message');
        mainContainer.appendChild(gameOverInfo);

        const bottomContainer = document.createElement('div');
        bottomContainer.id = 'game_over_bottom_cont';
        innerContainer.appendChild(bottomContainer);

        const gameOverButtonContainer = document.createElement('div');
        gameOverButtonContainer.id = 'game_over_button_cont';
        gameOverButtonContainer.className = 'centered';
        gameOverButtonContainer.onclick = this.playAgainPressed;
        bottomContainer.appendChild(gameOverButtonContainer);

        const gameOverButton = document.createElement('img');
        gameOverButton.id = 'game_over_button';
        gameOverButton.className = 'centered';
        gameOverButton.src = 'assets/img/gui/panels/buy-button-border-valid.png';
        gameOverButtonContainer.appendChild(gameOverButton);

        const gameOverText = document.createElement('div');
        gameOverText.id = 'game_over_text';
        gameOverText.className = 'centered';
        gameOverText.innerText = dungeonz.getTextDef('Play again');
        gameOverButtonContainer.appendChild(gameOverText);

    }

    show () {
        super.show();
        _this.GUI.isAnyPanelOpen = true;
    }

    hide () {
        super.hide();
        _this.GUI.isAnyPanelOpen = false;
    }

    playAgainPressed () {
        // Refresh the page.
        location.reload();
    }
}

export default GameOverPanel;