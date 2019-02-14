
import TaskTypes from '../../src/catalogues/TaskTypes'
import ItemTypes from '../../src/catalogues/ItemTypes'

class TaskSlot {
    constructor (panel, taskID, progress) {
        console.log("adding task slot:", taskID);
        const task = TaskTypes[taskID];
        console.log("tasks:", TaskTypes);

        this.container = document.createElement('div');
        this.container.className = 'task_cont';

        this.taskName = document.createElement('p');

        this.progress = document.createElement('p');
        this.progress.innerText = progress + "/" + task.completionThreshold;

        this.rewardContainer = document.createElement('div');

        if(task.rewardItemTypeNumbers[0]){
            this.rewardItemIcon1 = document.createElement('img');
            this.rewardItemIcon1.className = "task_reward_item";
            this.rewardItemIcon1.src = 'assets/img/gui/items/' + ItemTypes[task.rewardItemTypeNumbers[0]].iconSource + '.png';
            this.rewardItemIcon1.onmouseover = panel.rewardItemMouseOver;
            this.rewardItemIcon1.onmouseout = panel.rewardItemMouseOut;
            this.rewardContainer.appendChild(this.rewardItemIcon1);
        }

        if(task.rewardItemTypeNumbers[1]){
            this.rewardItemIcon2 = document.createElement('img');
            this.rewardItemIcon2.className = "task_reward_item";
            this.rewardItemIcon2.src = 'assets/img/gui/items/' + ItemTypes[task.rewardItemTypeNumbers[1]].iconSource + '.png';
            this.rewardItemIcon2.onmouseover = panel.rewardItemMouseOver;
            this.rewardItemIcon2.onmouseout = panel.rewardItemMouseOut;
            this.rewardContainer.appendChild(this.rewardItemIcon2);
        }

        if(task.rewardItemTypeNumbers[2]){
            this.rewardItemIcon3 = document.createElement('img');
            this.rewardItemIcon3.className = "task_reward_item";
            this.rewardItemIcon3.src = 'assets/img/gui/items/' + ItemTypes[task.rewardItemTypeNumbers[2]].iconSource + '.png';
            this.rewardItemIcon3.onmouseover = panel.rewardItemMouseOver;
            this.rewardItemIcon3.onmouseout = panel.rewardItemMouseOut;
            this.rewardContainer.appendChild(this.rewardItemIcon3);
        }

        this.rewardGloryIcon = document.createElement('img');
        this.rewardGloryIcon.className = 'task_glory_icon';
        this.rewardGloryIcon.src = 'assets/img/gui/glory-icon.png';
        this.rewardGloryAmount = document.createElement('p');
        this.rewardGloryAmount.innerText = task.rewardGlory;

        this.rewardContainer.appendChild(this.rewardGloryIcon);
        this.rewardContainer.appendChild(this.rewardGloryAmount);

        this.container.onclick = panel.slotClick;
        // Store the task ID of the task this slot is for on the slot itself.
        this.container.setAttribute('taskID', taskID);

        this.container.appendChild(this.taskName);
        this.container.appendChild(this.progress);
        this.container.appendChild(this.rewardContainer);

        panel.list.appendChild(this.container);
    }
}

class TasksPanel {

    constructor (tasks) {
        const panel = this;

        this.container =        document.getElementById('tasks_panel');
        this.tooltip =          document.getElementById('tasks_tooltip');
        this.name =             document.getElementById('tasks_name');
        this.list =             document.getElementById('tasks_list');
        this.claimButton =      document.getElementById('tasks_claim_button');

        this.claimButton.onclick = this.claimPressed;

        /**
         * @type {Object<TaskSlot>} Each task slot instance, accessed by the task ID of the task it is for.
         */
        this.taskSlots = {};

        // The currently selected slot.
        this.selectedSlot = null;
    }

    show () {
        _this.GUI.isAnyPanelOpen = true;
        // Show the panel.
        this.container.style.visibility = "visible";
    }

    hide () {
        _this.GUI.isAnyPanelOpen = false;
        // Hide the panel.
        this.container.style.visibility = "hidden";
        this.tooltip.style.visibility = 'hidden';

        // If a slot is selected, deselect it.
        if(this.selectedSlot !== null){
            this.selectedSlot.container.style.backgroundColor = _this.GUI.GUIColours.white80Percent;
            this.selectedSlot = null;
        }
    }

    rewardItemMouseOver () {
        _this.GUI.tasksPanel.tooltip.innerText = dungeonz.getTextDef(ItemTypes[this.getAttribute('itemNumber')].idName);
        _this.GUI.tasksPanel.tooltip.style.visibility = 'visible';
    }

    rewardItemMouseOut () {
        _this.GUI.tasksPanel.tooltip.style.visibility = 'hidden';
    }

    claimPressed () {
        const tasksPanel = _this.GUI.tasksPanel;

        // Check a slot is actually selected.
        if(tasksPanel.selectedSlot === null) return;

        // Get the selected slot task ID.
        ws.sendEvent("task_claim_reward", tasksPanel.selectedSlot.container.getAttribute('taskID'));
    }

    /**
     *
     * @param {String} taskID
     * @param {Number} [progress]
     */
    addTask (taskID, progress) {
        _this.player.tasks[taskID] = progress;
        this.taskSlots[taskID] = new TaskSlot(this, taskID, progress || 0);
    }

    /**
     *
     * @param {String} taskID
     */
    removeTask (taskID) {
        delete this.taskSlots[taskID];
        delete _this.player.tasks[taskID];
    }

    updateTaskProgress (taskID, progress) {
        _this.player.tasks[taskID] = progress;
        this.taskSlots[taskID].progress.innerText = progress + "/" + TaskTypes[taskID].completionThreshold;
        // If the progress is now enough for the completion threshold, make the slot green.
        if(progress >= TaskTypes[taskID].completionThreshold){
            this.taskSlots[taskID].container.style.backgroundColor = "green";
        }
    }

    slotClick () {
        // If nothing is selected, select this slot.
        if(_this.GUI.tasksPanel.selectedSlot === null){
            const slot = _this.GUI.tasksPanel.taskSlots[this.getAttribute('taskID')];
            _this.GUI.tasksPanel.selectedSlot = slot;
            slot.container.style.backgroundColor = _this.GUI.GUIColours.shopSelected;
        }
        // The selected slot was selected again, deselect it.
        else if(_this.GUI.tasksPanel.selectedSlot.container === this){
            _this.GUI.tasksPanel.selectedSlot.container.style.backgroundColor = _this.GUI.GUIColours.white80Percent;
            _this.GUI.tasksPanel.selectedSlot = null;
        }
        // A slot is already selected, deselect it and select this one.
        else {
            _this.GUI.tasksPanel.selectedSlot.container.style.backgroundColor = _this.GUI.GUIColours.white80Percent;
            const slot = _this.GUI.shopPanel.taskSlots[this.getAttribute('slotIndex')];
            _this.GUI.tasksPanel.selectedSlot = slot;
            slot.container.style.backgroundColor = _this.GUI.GUIColours.shopSelected;
        }

    }

}

export default TasksPanel;