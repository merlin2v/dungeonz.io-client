
class ClanPanel {

    constructor () {
        const clanPanel = this;

        // The whole thing.
        this.container =        document.getElementById('clan_panel');
        this.name =             document.getElementById('clan_name');
        this.memberList =       document.getElementById('clan_member_list');
        this.membersCount =     document.getElementById('clan_members_count');
        this.structuresCount =  document.getElementById('clan_structures_count');
        this.powerCount =       document.getElementById('clan_power_count');
        this.kickButton =       document.getElementById('clan_kick');
        this.promoteButton =    document.getElementById('clan_promote');
        this.leaveButton =      document.getElementById('clan_leave');

        this.kickButton.onclick = this.kickPressed;
        this.promoteButton.onclick = this.promotePressed;
        this.leaveButton.onclick = this.leavePressed;

        this.selectedMemberNameElement = null;
        // An array of references to the member name elements for easy access.
        this.memberListArray = [];

        let nameElement;
        // Add some elements for the individual names.
        for(let i=0; i<_this.clanManager.maxMembers; i+=1){
            nameElement = document.createElement('p');
            //nameElement.innerText = "Some dude name that is really long";
            nameElement.className = 'clan_member_text';
            nameElement.onclick = function (thing) {
                console.log("member name pressed:", this, thing);

                // Ignore empty slots.
                if(this.innerText === '') return;

                if(clanPanel.selectedMemberNameElement !== null){
                    clanPanel.selectedMemberNameElement.className = 'clan_member_text';
                }

                // If the already selected element was clicked on, deselect it.
                if(this === clanPanel.selectedMemberNameElement){
                    clanPanel.selectedMemberNameElement = null;
                }
                else {
                    this.className = 'clan_member_text_selected';
                    clanPanel.selectedMemberNameElement = this;
                }
            };
            // Attach the rank index that anyone in this slot should have.
            nameElement.rankIndex = i;
            this.memberListArray.push(nameElement);
            this.memberList.appendChild(nameElement);
        }

    }

    show () {
        _this.GUI.isAnyPanelOpen = true;
        this.container.style.visibility = "visible";
    }

    hide () {
        _this.GUI.isAnyPanelOpen = false;
        this.container.style.visibility = "hidden";
    }

    kickPressed () {
        console.log(_this.GUI.clanPanel.selectedMemberNameElement);
        // Don't allow kick self, or higher ranks.
        if(_this.clanManager.ownRankIndex < _this.GUI.clanPanel.selectedMemberNameElement.rankIndex){
            ws.sendEvent("clan_kick", _this.GUI.clanPanel.selectedMemberNameElement.rankIndex);
        }
    }

    promotePressed () {
        // Don't allow promote self, or higher ranks, or the rank directly below.
        //if(_this.clanManager.ownRankIndex < _this.GUI.clanPanel.selectedMemberNameElement.rankIndex-1){
            ws.sendEvent("clan_promote", _this.GUI.clanPanel.selectedMemberNameElement.rankIndex);
        //}
    }

    leavePressed () {
        console.log("leave clan pressed");
        _this.clanManager.leave();
    }

    updateMemberList () {
        const members = _this.clanManager.members;
        const maxMembers = _this.clanManager.maxMembers;
        // Add some elements for the individual names.
        let i=0,
            memberCount=0;
        for(; i<maxMembers; i+=1){
            // Clear empty slots.
            if(members[i] === null){
                this.memberListArray[i].innerText = "-";
            }
            else {
                memberCount+=1;
                this.memberListArray[i].innerText = members[i].displayName;
            }
        }

        // Update the counter too.
        this.membersCount.innerText = memberCount + "/" + _this.clanManager.maxMembers;
    }

}

export default ClanPanel;