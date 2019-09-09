<template>
  <div class="m-3">
    <b-card-group deck>
      <GoalCard v-for="goal in activeGoals" :key="goal.id" :goalObj="goal" />
    </b-card-group>
    <div v-if="activeGoals.length === 0">
      <p class="text-center text-info">¯\_(ツ)_/¯ Nothing here</p>
      <a href="javascript:void(0)" class="text-muted" @click="showInactiveGoals = !showInactiveGoals">Click to see {{ inactiveGoals.length }} completed {{inactiveGoals.length > 1 ? 'goals' : 'goal'}}.</a>
      <div v-if="showInactiveGoals">
        <ul>
          <li v-for="goal in inactiveGoals" :key="goal.id">{{ goal.title }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import GoalCard from '../components/GoalCard'
import { mapState } from 'vuex'

export default {
  name: 'Goals',
  data(){
    return {
      showInactiveGoals: false
    }
  },
  components:{
    GoalCard,
  },
  computed: {
    ...mapState('goals',{
      activeGoals: state => state.goals.filter(goal => goal.completed === false),
      inactiveGoals: state => state.goals.filter(goal => goal.completed === true)
    })
  }
}
</script>

<style>

</style>