<template>
  <div class="text-left">
    <p class="text-left">
      <span class="mr-2">
        <font-awesome-icon icon="filter" class="mr-2"/>
        <a href="javascript:void(0)" @click="showall = !showall">{{ showall ? 'Hide done' : 'Show all (' + column.tasks.length + ')' }} </a>
      </span>
    </p>
    <div class="list-group scratch pt-2 pb-2">
      <p class="text-center text-info mt-5 mb-5" v-if="tasks_not_done.length == 0 & !showall">¯\_(ツ)_/¯ Nothing here</p>
      <div v-if="!showall" style="max-height:20rem;">
        <TaskItem v-for="task in tasks_not_done" :key="task.id" :note="task" :columnid="column.id"/>
      </div>
      <div v-else style="max-height:20rem;">
        <TaskItem v-for="task in column.tasks" :key="task.id" :note="task" :columnid="column.id" />
      </div>
    </div>
    <b-form>
      <b-form-textarea @keyup.shift.enter="addTask" v-model="task.text" placeholder="(Shift+Enter to save)" rows="6" class="mt-3 mb-3"></b-form-textarea>
      <b-form-input v-model="task.dueDate" type="date"></b-form-input>
      <p class="mt-3">
        <a class="text-white p-2 bg-success" href="javascript:void(0)" @click="addTask">Add</a>
      </p>
    </b-form>
  </div>
</template>

<script>
/*eslint-disable*/
import TaskItem from './TaskItem'
import {mapActions} from 'vuex'
export default {
  name: 'Scratchpad',
  props:{
    column: {
      type: Object,
      required: true
    }
  },
  data(){
    return{
      task:{columnid: this.column.id, text:'', dueDate:''},
      filtering: false,
      showall:false,
      error: ''
    }
  },
  components:{
    TaskItem
  },
  methods:{
    ...mapActions(['add_task']),
    addTask(){
      if(this.task.text !== '' && this.task.dueDate !== ''){
        console.log(this.task)
        this.add_task(this.task)
        this.task = {columnid: this.column.id, text:'', dueDate:''}
      }else{
        alert('Did yoy forget something? Check your task has a due date and a bit of text.')
      }
    }
  },
  computed: {
    tasks_not_done(){
      return this.column.tasks.filter((task) => task.done === false)
    }
  }
}
</script>

<style>
.scratch{
  max-height: 500px;
  overflow-y: scroll;
  border-top: 1px solid rgba(0, 0, 0, 0.125);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}
textarea.form-control:focus{
  outline-width: 0 !important;
  box-shadow: none;
  outline: none!important;
}
</style>