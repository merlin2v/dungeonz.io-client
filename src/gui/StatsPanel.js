
class StatsPanel {

    constructor () {
        const statsPanel = this;

        // Which stat is currently selected.
        this.selectedStat = _this.player.stats.list.Melee;

        // The whole thing.
        this.container =    document.getElementById('stats_panel');
        this.name =         document.getElementById('stats_panel_name');
        this.statName =     document.getElementById('stat_name');
        this.description =  document.getElementById('stat_description');
        this.levelCounter = document.getElementById('stat_level_counter');
        this.expCounter =   document.getElementById('stat_exp_counter');

        this.icons = {
            Melee:      document.getElementById('stat_melee'),
            Ranged:     document.getElementById('stat_ranged'),
            Magic:      document.getElementById('stat_magic'),
            Gathering:  document.getElementById('stat_gathering'),
            Weaponry:   document.getElementById('stat_weaponry'),
            Armoury:    document.getElementById('stat_armoury'),
            Toolery:    document.getElementById('stat_toolery'),
            Cookery:    document.getElementById('stat_cookery'),
            Potionry:   document.getElementById('stat_potionry')
        };

        const stats = _this.player.stats.list;

        document.getElementById('stat_melee_icon').onclick =        function(){ statsPanel.changeStatInfo(stats.Melee) };
        document.getElementById('stat_ranged_icon').onclick =       function(){ statsPanel.changeStatInfo(stats.Ranged) };
        document.getElementById('stat_magic_icon').onclick =        function(){ statsPanel.changeStatInfo(stats.Magic) };
        document.getElementById('stat_gathering_icon').onclick =    function(){ statsPanel.changeStatInfo(stats.Gathering) };
        document.getElementById('stat_weaponry_icon').onclick =     function(){ statsPanel.changeStatInfo(stats.Weaponry) };
        document.getElementById('stat_armoury_icon').onclick =      function(){ statsPanel.changeStatInfo(stats.Armoury) };
        document.getElementById('stat_toolery_icon').onclick =      function(){ statsPanel.changeStatInfo(stats.Toolery) };
        document.getElementById('stat_cookery_icon').onclick =      function(){ statsPanel.changeStatInfo(stats.Cookery) };
        document.getElementById('stat_potionry_icon').onclick =     function(){ statsPanel.changeStatInfo(stats.Potionry) };
    }

    updateSelectedStat () {
        this.changeStatInfo(this.selectedStat);
    }

    changeStatInfo (stat) {
        this.selectedStat = stat;

        // Un-highlight all other icons.
        for(let key in this.icons){
            if(this.icons.hasOwnProperty(key) === false) continue;
            this.icons[key].style.backgroundColor = "transparent";
        }

        this.icons[stat.name].style.backgroundColor = _this.GUI.GUIColours.currentlySelected;
        this.statName.innerText = dungeonz.getTextDef("Stat name: " + stat.name);
        this.description.innerText = dungeonz.getTextDef("Stat description: " + stat.name);
        this.levelCounter.innerText = dungeonz.getTextDef("Level") + ": " + stat.level;
        this.expCounter.innerText = dungeonz.getTextDef("Exp") + ": " + stat.exp + " / " + stat.nextLevelExpRequirement;
    }

    show () {
        _this.GUI.isAnyPanelOpen = true;
        this.container.style.visibility = "visible";
        this.updateSelectedStat();
    }

    hide () {
        _this.GUI.isAnyPanelOpen = false;
        this.container.style.visibility = "hidden";
    }

}

export default StatsPanel;