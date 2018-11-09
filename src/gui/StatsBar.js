
class StatsBar {

    constructor () {
        const statsBar = this;

        // The whole thing.
        this.container =            document.getElementById('stats_cont');
        // Container for the tooltip.
        this.tooltipContainer =     document.getElementById('stat_tooltip_cont');
        // The stat name in the tooltip.
        this.tooltipName =          document.getElementById('stat_name');
        // The stat description in the tooltip.
        this.tooltipDescription =   document.getElementById('stat_description');
        // Each of the numbers below the stat icons.
        this.counters = {
            melee:      document.getElementById('stat_melee_counter'),
            ranged:     document.getElementById('stat_ranged_counter'),
            magic:      document.getElementById('stat_magic_counter'),
            gathering:  document.getElementById('stat_gathering_counter'),
            weaponry:   document.getElementById('stat_weaponry_counter'),
            armoury:    document.getElementById('stat_armour_counter'),
            toolery:    document.getElementById('stat_toolery_counter'),
            cookery:    document.getElementById('stat_cookery_counter'),
            potionry:   document.getElementById('stat_potionry_counter')
        };

        function changeStatTooltip (statName) {
            statsBar.tooltipContainer.style.visibility = "visible";
            statsBar.tooltipName.innerText = dungeonz.getTextDef("Stat name: " + statName);
            statsBar.tooltipDescription.innerText = dungeonz.getTextDef("Stat description: " + statName);
        }

        document.getElementById('stat_melee_icon').onmouseover =  function(){ changeStatTooltip("Melee") };
        document.getElementById('stat_melee_icon').onmouseout =  function(){ statsBar.tooltipContainer.style.visibility = "hidden" };

        document.getElementById('stat_ranged_icon').onmouseover =  function(){ changeStatTooltip("Ranged") };
        document.getElementById('stat_ranged_icon').onmouseout = function(){ statsBar.tooltipContainer.style.visibility = "hidden" };

        document.getElementById('stat_magic_icon').onmouseover =  function(){ changeStatTooltip("Magic") };
        document.getElementById('stat_magic_icon').onmouseout =  function(){ statsBar.tooltipContainer.style.visibility = "hidden" };

        document.getElementById('stat_gathering_icon').onmouseover =  function(){ changeStatTooltip("Gathering") };
        document.getElementById('stat_gathering_icon').onmouseout =  function(){ statsBar.tooltipContainer.style.visibility = "hidden" };

        document.getElementById('stat_weaponry_icon').onmouseover =  function(){ changeStatTooltip("Weaponry") };
        document.getElementById('stat_weaponry_icon').onmouseout =  function(){ statsBar.tooltipContainer.style.visibility = "hidden" };

        document.getElementById('stat_armoury_icon').onmouseover =  function(){ changeStatTooltip("Armoury") };
        document.getElementById('stat_armoury_icon').onmouseout =  function(){ statsBar.tooltipContainer.style.visibility = "hidden" };

        document.getElementById('stat_toolery_icon').onmouseover =  function(){ changeStatTooltip("Toolery") };
        document.getElementById('stat_toolery_icon').onmouseout =  function(){ statsBar.tooltipContainer.style.visibility = "hidden" };

        document.getElementById('stat_cookery_icon').onmouseover =  function(){ changeStatTooltip("Cookery") };
        document.getElementById('stat_cookery_icon').onmouseout =  function(){ statsBar.tooltipContainer.style.visibility = "hidden" };

        document.getElementById('stat_potionry_icon').onmouseover =  function(){ changeStatTooltip("Potionry") };
        document.getElementById('stat_potionry_icon').onmouseout =  function(){ statsBar.tooltipContainer.style.visibility = "hidden" };
    }

}

export default StatsBar;