
import SpellBookTypes from '../../src/catalogues/SpellBookTypes'

class SpellBookPanel {

    constructor () {
        const spellPanel = this;

        // The number of which spell is selected.
        this.selectedSpellNumber = 1;

        // The spell book data of the held spell book.
        this.selectedSpellBook = SpellBookTypes[1];

        // The whole thing.
        this.container =    document.getElementById('spell_book_panel');
        this.name =         document.getElementById('spell_book_panel_name');
        this.spellName =    document.getElementById('spell_name');
        this.description =  document.getElementById('spell_description');

        this.icons = {
            spell1: document.getElementById('spell_1_icon'),
            spell2: document.getElementById('spell_2_icon'),
            spell3: document.getElementById('spell_3_icon'),
            spell4: document.getElementById('spell_4_icon')
        };

        document.getElementById('spell_1_icon').onclick = function(){ spellPanel.spellSelect(1) };
        document.getElementById('spell_2_icon').onclick = function(){ spellPanel.spellSelect(2) };
        document.getElementById('spell_3_icon').onclick = function(){ spellPanel.spellSelect(3) };
        document.getElementById('spell_4_icon').onclick = function(){ spellPanel.spellSelect(4) };

    }

    spellSelect (spellNumber) {
        this.selectedSpellNumber = spellNumber;

        // Un-highlight all other icons.
        for(let key in this.icons){
            if(this.icons.hasOwnProperty(key) === false) continue;
            this.icons[key].style.backgroundColor = "transparent";
        }

        this.icons['spell' + spellNumber].style.backgroundColor = _this.GUI.GUIColours.currentlySelected;
        this.spellName.innerText = dungeonz.getTextDef("Spell name: " + this.selectedSpellBook['spell' + spellNumber + 'IdName']);
        this.description.innerText = dungeonz.getTextDef("Spell description: " + this.selectedSpellBook['spell' + spellNumber + 'IdName']);

        // Tell the server that the selected spell of this spell book has changed.
        ws.sendEvent('spell_selected', this.selectedSpellNumber);
    }

    changeSpellBook (spellBookTypeNumber) {
        this.selectedSpellBook = SpellBookTypes[spellBookTypeNumber];

        // Update the spell icons.
        this.icons.spell1.src = "assets/img/gui/spells/" + this.selectedSpellBook.spell1IconSource + "-spell-icon.png";
        this.icons.spell2.src = "assets/img/gui/spells/" + this.selectedSpellBook.spell2IconSource + "-spell-icon.png";
        this.icons.spell3.src = "assets/img/gui/spells/" + this.selectedSpellBook.spell3IconSource + "-spell-icon.png";
        this.icons.spell4.src = "assets/img/gui/spells/" + this.selectedSpellBook.spell4IconSource + "-spell-icon.png";

        this.spellSelect(this.selectedSpellNumber);
    }

    show () {
        _this.GUI.isAnyPanelOpen = true;
        this.container.style.visibility = "visible";
    }

    hide () {
        _this.GUI.isAnyPanelOpen = false;
        this.container.style.visibility = "hidden";
    }

}

export default SpellBookPanel;