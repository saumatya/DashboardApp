<template>
  <div class="admin-layout">
    <Sidebar class="sidebar" />
    <div class="content">
      <router-view></router-view>
      <!-- Renders selected admin section -->
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue';
</script>

<style scoped>
.admin-layout {
  display: flex;
}

.sidebar {
  width: 250px; /* Adjust the width as needed */
  background-color: #f4f4f4; /* Optional: Add a background color */
}

.content {
  flex: 1;
  padding: 20px;
}
</style>
