import moment from 'moment';

const state = {
  tasks: [],
  now: moment(new Date()),
};

const getters = {
  tasksCount: state => state.tasks.length,
  tasks: state => state.tasks,
  now: state => state.now,
};

const mutations = {
  ADD_TASK({ tasks }, taskObj) {
    tasks.push(taskObj);
  },
  UPDATE_TASK({ tasks }, { taskId, updates }) {
    const task_to_update = tasks.filter((t) => t.id === taskId);

    if (task_to_update) {
      const { name, time, duration } = updates;

      if (name) task_to_update.name = name;
      if (time) task_to_update.time = time;
      if (duration) task_to_update.duration = duration;
    }
  },
  DELETE_TASK({ tasks }, taskId) {
    const task_to_delete = tasks.find((t) => t.id === taskId);

    if (task_to_delete) {
      tasks.splice(tasks.indexOf(task_to_delete), 1);
    }
  },
  UPDATE_GLOBAL_TIME(state) {
    state.now = moment( new Date);
  }
};

const actions = {
  add_task({ commit }, { id, name, time, duration }) {
    commit('ADD_TASK', { id, name, time, duration });
  },
  update_task({ commit }, { taskId, updates }) {
    commit('UPDATE_TASK', { taskId, updates});
  },
  delete_task({ commit }, taskId) {
    commit('DELETE_TASK', taskId);
  },
  update_global_time({ commit }) {
    setInterval(() => {
      commit('UPDATE_GLOBAL_TIME')
    }, 1000)
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};