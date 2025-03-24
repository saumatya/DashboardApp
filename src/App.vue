<!-- <script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheNavigation from './components/TheNavigation.vue'
</script>

<template>
<TheNavigation />
<div class="container">
  <h1>Dashboard</h1>
</div>
<div class="container">
  <router-view></router-view>
</div>

</template>

<style scoped>

</style> -->
<script setup>
import { useRoute } from 'vue-router'
import TheNavigation from './components/TheNavigation.vue'

const route = useRoute();
</script>

<template>
  <div v-if="route.name !== 'LoginPage'">
    <TheNavigation />
    <div class="container">
      <!-- <hr>
      <hr> -->
      <!-- <h1>Dashboard</h1> -->
    </div>
  </div>
  <div class="container">
    <router-view></router-view>
  </div>
</template>