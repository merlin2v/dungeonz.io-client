
import TaskTypes from '../../src/catalogues/TaskTypes'
import ItemTypes from '../../src/catalogues/ItemTypes'

class TaskSlot {
    constructor (panel, taskID, progress) {
        const task = TaskTypes[taskID];

        this.container = document.createElement('div');
        this.container.className = 'task_slot_cont';

        this.taskName = document.createElement('p');
        this.taskName.innerText = dungeonz.getTextDef("Task: " + task.textDefIDName);

        this.progress = document.createElement('p');
        this.progress.innerText = progress + "/" + task.completionThreshold;

        this.rewardContainer = document.createElement('div');
        this.rewardContainer.className = 'task_reward_cont';

        this.rewardItemIcon1 = document.createElement('img');
        this.rewardItemIcon1.className = "task_reward_item";
        this.rewardItemIcon1.onmouseover = panel.rewardItemMouseOver;
        this.rewardItemIcon1.onmouseout = panel.rewardItemMouseOut;
        this.rewardContainer.appendChild(this.rewardItemIcon1);

        this.rewardItemIcon2 = document.createElement('img');
        this.rewardItemIcon2.className = "task_reward_item";
        this.rewardItemIcon2.onmouseover = panel.rewardItemMouseOver;
        this.rewardItemIcon2.onmouseout = panel.rewardItemMouseOut;
        this.rewardContainer.appendChild(this.rewardItemIcon2);

        this.rewardItemIcon3 = document.createElement('img');
        this.rewardItemIcon3.className = "task_reward_item";
        this.rewardItemIcon3.onmouseover = panel.rewardItemMouseOver;
        this.rewardItemIcon3.onmouseout = panel.rewardItemMouseOut;
        this.rewardContainer.appendChild(this.rewardItemIcon3);

        if(task.rewardItemTypeNumbers[0]){
            this.rewardItemIcon1.src = 'assets/img/gui/items/' + ItemTypes[task.rewardItemTypeNumbers[0]].iconSource + '.png';
            this.rewardItemIcon1.style.visibility = "visible";
            this.rewardItemIcon1.setAttribute('itemNumber', task.rewardItemTypeNumbers[0]);
        }

        if(task.rewardItemTypeNumbers[1]){
            this.rewardItemIcon2.src = 'assets/img/gui/items/' + ItemTypes[task.rewardItemTypeNumbers[1]].iconSource + '.png';
            this.rewardItemIcon2.style.visibility = "visible";
            this.rewardItemIcon2.setAttribute('itemNumber', task.rewardItemTypeNumbers[1]);
        }

        if(task.rewardItemTypeNumbers[2]){
            this.rewardItemIcon3.src = 'assets/img/gui/items/' + ItemTypes[task.rewardItemTypeNumbers[2]].iconSource + '.png';
            this.rewardItemIcon3.style.visibility = "visible";
            this.rewardItemIcon3.setAttribute('itemNumber', task.rewardItemTypeNumbers[2]);
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

        this.completed = false;
        // Check this task is already completed. Progress might have been made before, but
        // the completion threshold lowered since they last played, and thus now is complete.
        if(progress >= task.completionThreshold){
            this.container.style.backgroundColor = _this.GUI.GUIColours.taskComplete;
            this.completed = true;
        }
    }
}

class TasksPanel {

    constructor (tasks) {
        const panel = this;

        this.container =        document.getElementById('tasks_panel');
        this.tooltip =          document.getElementById('tasks_panel_tooltip');
        this.name =             document.getElementById('tasks_name');
        this.list =             document.getElementById('tasks_list');
        this.claimButton =      document.getElementById('tasks_claim_button');
        this.claimButtonCont =  document.getElementById('tasks_claim_button_cont');

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

        // Shoe the reward item icons.
        for(let taskKey in this.taskSlots){
            if(this.taskSlots.hasOwnProperty(taskKey) === false) continue;
            const taskSlot = this.taskSlots[taskKey];
            taskSlot.rewardItemIcon1.style.visibility = "visible";
            taskSlot.rewardItemIcon2.style.visibility = "visible";
            taskSlot.rewardItemIcon3.style.visibility = "visible";
        }
    }

    hide () {
        _this.GUI.isAnyPanelOpen = false;
        // Hide the panel.
        this.container.style.visibility = "hidden";
        this.tooltip.style.visibility = 'hidden';

        // If a slot is selected, deselect it.
        if(this.selectedSlot !== null){
            this.selectedSlot.container.style.borderWidth = "0";
            this.selectedSlot = null;
        }
        // Hide the reward item icons and the claim button, as they have their visibility set.
        for(let taskKey in this.taskSlots){
            if(this.taskSlots.hasOwnProperty(taskKey) === false) continue;
            const taskSlot = this.taskSlots[taskKey];
            taskSlot.rewardItemIcon1.style.visibility = "hidden";
            taskSlot.rewardItemIcon2.style.visibility = "hidden";
            taskSlot.rewardItemIcon3.style.visibility = "hidden";
        }
        this.claimButtonCont.style.visibility = "hidden";
    }

    rewardItemMouseOver () {
        _this.GUI.tasksPanel.tooltip.innerText = dungeonz.getTextDef("Item name: " + ItemTypes[this.getAttribute('itemNumber')].idName);
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

        // Assume it will be claimed successfully, so hide the claim button.
        tasksPanel.claimButtonCont.style.visibility = "hidden";
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
        this.taskSlots[taskID].container.remove();
        delete this.taskSlots[taskID];
        delete _this.player.tasks[taskID];
    }

    updateTaskProgress (taskID, progress) {
        _this.player.tasks[taskID] = progress;
        this.taskSlots[taskID].progress.innerText = progress + "/" + TaskTypes[taskID].completionThreshold;
        // If the progress is now enough for the completion threshold, make the slot green.
        if(progress >= TaskTypes[taskID].completionThreshold){
            this.taskSlots[taskID].container.style.backgroundColor = _this.GUI.GUIColours.taskComplete;
            this.taskSlots[taskID].completed = true;
            // Tell them via a chat message.
            _this.chat(undefined, dungeonz.getTextDef("Task completed"), "#50ff7f");
        }
    }

    slotClick () {
        const tasksPanel = _this.GUI.tasksPanel;
        // If nothing is selected, select this slot.
        if(tasksPanel.selectedSlot === null){
            const slot = tasksPanel.taskSlots[this.getAttribute('taskID')];
            tasksPanel.selectedSlot = slot;
            slot.container.style.borderWidth = "6px";
            // Show the claim button if the task is complete.
            if(tasksPanel.selectedSlot.completed === true) tasksPanel.claimButtonCont.style.visibility = "visible";
            else tasksPanel.claimButtonCont.style.visibility = "hidden";
        }
        // The selected slot was selected again, deselect it.
        else if(tasksPanel.selectedSlot.container === this){
            tasksPanel.selectedSlot.container.style.borderWidth = "0";
            tasksPanel.selectedSlot = null;
            tasksPanel.claimButtonCont.style.visibility = "hidden";
        }
        // A slot is already selected, deselect it and select this one.
        else {
            tasksPanel.selectedSlot.container.style.borderWidth = "0";
            const slot = tasksPanel.taskSlots[this.getAttribute('taskID')];
            tasksPanel.selectedSlot = slot;
            slot.container.style.borderWidth = "6px";
            // Show the claim button if the task is complete.
            if(tasksPanel.selectedSlot.completed === true) tasksPanel.claimButtonCont.style.visibility = "visible";
            else tasksPanel.claimButtonCont.style.visibility = "hidden";
        }
    }

}

export default TasksPanel;