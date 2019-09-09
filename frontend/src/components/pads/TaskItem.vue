<template>
  <div class="list-group-item mb-2" draggable @dragstart="pickuptask($event, task.id, columnid)">
    <!--[TOP LEFT] id, status, [goals], dueDate, [reminders] div -->
    <div>    
      <span class="mr-2"><small v-if="error_message" class="text-danger mr-2 error-message">{{error_message}}</small># {{ task.id }}</span>
      <span :class="task.done ? 'badge badge-success mr-2' : 'badge badge-warning mr-2'">{{ task.done ? 'Done' : '' }}</span>
      <span v-for="goal in taskGoals" :key="goal.id" class="badge badge-success mr-2">{{ goal.title }}</span>
      <span class="badge badge-info mr-2">Due {{ task.dueDate | toHumanDate }}</span>
      <span v-for="alert in taskalerts" :key="alert.time" class="badge badge-warning mr-2">
        <font-awesome-icon icon="clock"/> {{alert.time}}
      </span>
    </div>

    <!--[TOP RIGHT] Attachments div -->
    <div>
      <small @click="dropArea = !dropArea" class="spt2 font-italic"><a href="javascript:void(0)"><font-awesome-icon icon="paperclip" class="mr-2"/>Attachments</a></small>
      <span v-if="dropArea" class="spt3 mt-1" title="Drop a file or click to explore."><small>Drop area <font-awesome-icon icon="question-circle"/></small></span>
    </div>

    <!--[BOTTOM RIGHT] Created date div -->
    <div class="spt">
      <small class="font-italic">{{ task.created | toHumanDate }}</small>
    </div>
    
    <!--[CENTER] edit div or task text -->
    <div>
      <p v-if="!edit" class="text-left mt-4 mb-3 mr-5 pr-5">{{ task.text }}</p>
      <p v-else>
        <input @keyup.enter="save_edit" v-model="new_text" type="text" class="form-control border-warning mt-3 mb-3 mr-5">
      </p>
      <p>
        <input v-if="setting_reminder" @keyup.enter="save_reminder" v-model="reminder_input" type="text" placeholder=" hh:mm (Enter to save)">
      </p>
    </div>

    <!--[BOTTOM LEFT] calls to action  -->
    <div class="text-left">
      <hr class="m-2">
      <span class="mr-3">
        <a href="javascript:void(0)" class="text-success" @click="toggle_done({taskid: task.id})"><font-awesome-icon icon="check"/> {{ task.done ? 'Undo' : 'Done' }}</a>
      </span>
      <b-dropdown size="sm" text="More" variant="outline-secondary" class="m-2">
        <b-dropdown-item-button v-if="!edit" @click="edit = !edit"><font-awesome-icon icon="pen" class="text-info mr-3"/>Edit</b-dropdown-item-button>
        <b-dropdown-item-button v-else @click="save_edit"><font-awesome-icon icon="save" class="text-info mr-3"/>Save</b-dropdown-item-button>
        <b-dropdown-item-button @click="setting_reminder = !setting_reminder"><font-awesome-icon icon="clock" class="text-info mr-3"/>Remind me</b-dropdown-item-button>
        <b-dropdown-divider></b-dropdown-divider>        
        <b-dropdown-item-button @click="delete_task_reminders({taskid: task.id})"><font-awesome-icon icon="trash" class="text-danger mr-3"/>Clear Reminders</b-dropdown-item-button>
        <b-dropdown-item-button @click="delete_task"><font-awesome-icon icon="trash" class="text-danger mr-3"/>Delete Task</b-dropdown-item-button>
      </b-dropdown>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {mapActions} from 'vuex'
export default {
  name: 'TaskItem',
  data(){
    return{
      dropArea: false,
      new_text: this.note.text,
      edit:false,
      task: this.note, // props are not reactive. To ensure reactivity remains, they must be used as local data properties.
      reminder_input: '',
      setting_reminder: false,
      error_message: '',
      taskGoals: []
    }
  },
  props: {
    note: {
      type: Object,
      required: true
    },
    columnid: {
      type: Number,
      required: true
    }
  },
  filters:{
    toHumanDate(d){
      return moment(d).calendar()
    }
  },
  methods:{
    ...mapActions(['toggle_done', 'delete_task_reminders']),
    pickuptask(e, taskid, columnid){
      e.dataTransfer.effectAllowed = "move"
      e.dataTransfer.dropEffect = "move"
      e.dataTransfer.setData('taskid', taskid)
      e.dataTransfer.setData('columnid', columnid)
    },
    save_reminder(){
      if(this.reminder_input.match(/^\d\d:\d\d$/gsi) && this.reminder_input.match(/^[0-2][0-9]:[0-5][0-9]$/)){
        this.$store.dispatch('add_reminder', {taskid: this.task.id, time: this.reminder_input})
        this.reminder_input = ''
        this.toggle_settings()
      }else{
        this.error_message = 'Entry must be 24h based.'
        setTimeout(()=>{
          this.error_message = ''
        }, 3000)
      }
    },
    save_edit(){
      this.$store.dispatch('update_task', {taskid: this.task.id, text: this.new_text})
      this.toggle_settings()
    },
    toggle_settings(){
      // "cancel" action
      this.setting_reminder = false
      this.edit = false
    },
    delete_task(){
      if(confirm('Delete task?')){
        this.$store.dispatch('delete_task', {taskid: this.task.id})
      }
    }
  },
  computed:{
    taskalerts(){
      return this.task.alerts.filter((alert) => alert.completed === false)
    }
  },
  created(){
    this.$store.state.goals.goals.forEach(goal => {
      if(goal.tasks.find(t => t.taskId === this.task.id)){
        this.taskGoals.push(goal)
      }
    });
  }
}
</script>

<style>

input:focus, input.form-control:focus{
  outline-width: 0 !important;
  box-shadow: none;
  outline: none!important;
}
.spt{
  position: absolute!important;
  right: 10px!important;
  bottom: 15px!important;
}
.spt2{
  position: absolute!important;
  top: 10px;
  right: 10px!important;
}
.spt3{
  position: absolute!important;
  top: 30px;
  right: 10px!important;
  border: 1px dotted lightgray;
  padding: 1rem;
  opacity: 0.7;
}

</style>