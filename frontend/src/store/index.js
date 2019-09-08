import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment';
import timer from './timer'
import helperFunctions from './helperFunctions'
import regularTasks from './regularTasks';

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    timer,
    regularTasks,
  },
  state:{
    activeTab:'',
    columns:[{
      id:1,
      title: 'Things to do',
      tasks: []
    }],
    alerts:[],
    usedStorage: 0,
    now: moment(),
  },
  mutations:{
    MOVE_TASK({columns}, {fromColId, toColId, taskid}){
      // get fromCol and toCol objects
      var fromCol = columns.find(col => col.id === fromColId)
      var toCol = columns.find(col => col.id === toColId)
      if(fromCol && toCol){
        // get the task object
        var task = fromCol.tasks.find(t => t.id === taskid)
        if(task){
          // push task to toCol
          toCol.tasks.push(task)
          // delete task from fromCol
          fromCol.tasks.splice(fromCol.tasks.indexOf(task), 1)
        }
      }
    },
    UPDATE_REMINDER({columns}, {columnid, taskid, reminderid}){
      // sets completed to true as it has alerted the user
      var column = columns.find((col) => col.id === columnid)
      if(column){
        var task = column.tasks.find((t) => t.id === taskid)
        if(task){
          var reminder = task.alerts.find((rem) => rem.id === reminderid)
          if(reminder){
            reminder.completed = true
          }
        }
      }
    },
    ADD_REMINDER({columns}, {columnid, taskid, alertobj}){
      var col = columns.find((c)=> c.id === columnid)
      if(col){
        var task = col.tasks.find((n) => n.id === taskid)
        if(task){
          if(task.alerts){
            task.alerts.push(alertobj)
          }else{
            task['alerts'] = []
            task.alerts.push(alertobj)
          }
        }
      }
    },
    DELETE_REMINDER({columns}, {columnid, taskid, reminderid}){
      var col = columns.find((c) => c.id === columnid)
      if (col){
        var task = col.tasks.find((t) => t.id === taskid)
        if(task){
          var reminder = task.alerts.find((rem) => rem.id === reminderid)
          if(reminder){
            task.alerts.splice(task.alerts.indexOf(reminder), 1)
          }
        }
      }
    },
    DELETE_COLUMN({columns}, {columnid}){
      var col = columns.find((c)=>c.id === columnid)
      if(col){
        columns.splice(columns.indexOf(col), 1)
      }
    },
    SAVE_NEW_TITLE({columns}, {columnid, newtitle}){
      var col = columns.find((c)=>c.id === columnid)
      if(col){
        col.title = newtitle
      }
    },
    UPDATE_ACTIVE_TAB(state, columnid){
      state.activeTab = columnid
    },
    ADD_NEW_COLUMN({columns}, newcolobj){
      columns.push(newcolobj)
    },
    UPDATE_STATE(state, newstate){
      if (newstate.columns) state.columns = newstate.columns
      if (newstate.timer) state.timer = newstate.timer
      if (newstate.regularTasks) state.regularTasks = newstate.regularTasks  
    },
    ADD_TASK({columns}, {columnid, task}){
      var column = columns.find((col) => col.id === columnid)
      if (column) {
        column.tasks.push(task)
      }
    },
    UPDATE_TASK({columns}, {columnid, taskid, text}){
      var col = columns.find((c) => c.id === columnid)
      if(col){
        var task = col.tasks.find((n) => n.id === taskid)
        if(task){
          task.text = text
        }
      }
    },
    TOGGLE_DONE({columns}, {columnid, taskid}){
      var col = columns.find((c) => c.id === columnid)
      if(col){
        var task = col.tasks.find((n) => n.id === taskid)
        if(task){
          task.done = !task.done
          task.due = !task.due
        }
      }
    },
    DELETE_TASK({columns}, {columnid, taskid}){
      var col = columns.find((c) => c.id === columnid)
      if(col){
        var task = col.tasks.find((n) => n.id === taskid)
        if(task){
          var index = col.tasks.indexOf(task)
          col.tasks.splice(index, 1)
        }
      }
    },
    ADD_ALERT({alerts}, alert){
      alerts.push(alert)
    },
    REMOVE_ALERT({alerts}, alertobj){
      var alert = alerts.filter((a) => a.id === alertobj.id)[0]
      if(alert){
        alerts.splice(alerts.indexOf(alert), 1)
      }
    },
    UPDATE_STORAGE_USED(store, newValue){
      store.usedStorage = newValue
    },
    UPDATE_GLOBAL_TIME(state) {
      state.now = moment();
    },
  },
  actions:{
    move_task({commit}, {fromColId, toColId, taskid}){
      commit('MOVE_TASK', {fromColId, toColId, taskid})
    },
    update_reminder({commit}, {columnid, taskid, reminderid}){
      commit('UPDATE_REMINDER', {columnid, taskid, reminderid})
    },
    add_reminder({commit, state}, {columnid, taskid, time}){     
      var alertobj = {
        id: helperFunctions.next_reminder_id(state, columnid, taskid),
        time,
        completed: false
      }
      commit('ADD_REMINDER', {columnid, taskid, alertobj})
    },
    delete_task_reminder({commit}, {columnid, taskid, reminderid}){
      commit('DELETE_REMINDER', {columnid, taskid, reminderid})
    },
    delete_column({commit}, {columnid}){
      commit('DELETE_COLUMN', {columnid})
    },
    add_new_column({commit, state}, {title}){
      var nextid = helperFunctions.next_column_id(state)
      var newcolobj = {
        id: nextid,
        title,
        tasks: []
      }
      commit('ADD_NEW_COLUMN', newcolobj)
    },
    save_new_title({commit}, {columnid, newtitle}){
      commit('SAVE_NEW_TITLE', {columnid, newtitle})
    },
    update_active_tab({commit}, columnid){
      commit('UPDATE_ACTIVE_TAB', columnid)
    },
    add_task({commit, state}, {columnid, text}){
      var task = {
        id: helperFunctions.next_task_id(state),
        text,
        done: false,
        alerts: [],
        due: true,
        columnid,
        dueDate: new Date().toDateString(),
        created: new Date().toUTCString()
      }
      commit('ADD_TASK', {columnid, task})
    },
    update_task({commit}, {columnid, taskid, text}){
      commit('UPDATE_TASK', {columnid, taskid, text})
    },
    toggle_done({commit}, {columnid, taskid}){
      commit('TOGGLE_DONE', {columnid, taskid})
    },
    delete_task({commit}, {columnid, taskid}){
      commit('DELETE_TASK', {columnid, taskid})
    },
    add_alert({commit}, {message, error}){
      if(!error){error = false}
      var alertobj = {id: `${new Date().getTime().toString()}`, message, error }
      commit('ADD_ALERT', alertobj)
    },
    remove_alert({commit}, alertobj){
      commit('REMOVE_ALERT', alertobj)
    },
    update_state({commit}, state){
      commit('UPDATE_STATE', state)
    },
    calculate_used_storage({commit}){
      var _lsTotal = 0, _xLen, _x
      for(_x in localStorage){
        if(!localStorage.hasOwnProperty(_x)){
          continue
        }
        _xLen = ((localStorage[_x].length + _x.length)* 2)
        _lsTotal += _xLen
      }
      commit('UPDATE_STORAGE_USED', (_lsTotal/1024).toFixed(2))
    },
    global_time({ commit }) {
      return setInterval(() => {
        commit('UPDATE_GLOBAL_TIME')
      }, 60000)
    },
  },
  getters:{
    now: state => state.now,
    all_tasks_not_done_count({columns}){
      var total = 0
      columns.forEach((col)=>{
        total += col.tasks.filter((todo)=>todo.done === false).length
      })
      return total
    }
  }
})

export default store