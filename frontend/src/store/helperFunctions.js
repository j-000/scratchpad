function next_column_id (state) {
  if(state.columns.length > 0){
    return state.columns[ state.columns.length - 1 ].id + 1
  }
  return 1
}

function next_task_id(state){
  // tasks id need to take into account all tasks in the state.
  // because when changing columns, ids cannot be equal.
  var totalTaks = 0
  state.columns.forEach(col => {
    totalTaks += col.tasks.length
  });
  return totalTaks
}

function next_reminder_id(state, taskid){
  var nextid;
  state.columns.forEach((col) => {
    if(col.tasks.length > 0){
      var task = col.tasks.find((t) => t.id === taskid)
      if(task && task.alerts.length > 0){
        nextid = task.alerts[ task.alerts.length - 1 ].id + 1
      }else{
        nextid = 1
      }
    }else{
      nextid = 1
    }
  })
  return nextid
}


export default {
  next_column_id,
  next_task_id,
  next_reminder_id
}