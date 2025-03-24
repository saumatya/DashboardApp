<template>
  <aside class="sidebar">
    <ul>
      <li @click="navigateTo('/admin/organizations')">📁 Organizations</li>
      <li @click="navigateTo('/admin/users')">👤 Users</li>
      <li @click="navigateTo('/admin/sensors')">🛠 Sensor Settings</li>
    </ul>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const navigateTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background: #2c3e50;
  color: black;
  padding: 20px;
  margin-top: 50px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  cursor: pointer;
  padding: 10px;
  transition: background 0.3s;
}
li:hover {
  background: #34495e;
}
</style>
