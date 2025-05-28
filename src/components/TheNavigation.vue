<template>
  <!-- <div class="navigation"> -->
  <div v-if="!hideNavigation" class="navigation">
    <router-link id="home" to="/home">Home</router-link>
    <router-link id="OrganizationShow" to="/organization"
      >Organization</router-link
    >
    <router-link id="Sensors" to="/home">Sensors</router-link>
    <router-link id="Admin" to="/admin" v-if="isAdmin()">Settings</router-link>
    <!-- <router-link id="Logout" to="/logout">Logout</router-link> -->
    <a href="#" id="Logout" @click="handleLogout">Logout</a>
    <span v-if="username" class="username">{{ username }}</span>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, computed } from 'vue';

const router = useRouter();
const route = useRoute();
// import { computed } from 'vue';
const jwtDecode = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// const isAdmin = () =>
//   jwtDecode(localStorage.getItem('token'))?.role === 'admin' || false;

const username = ref(localStorage.getItem('username') || '');
const isAdmin = () => localStorage.getItem('role') === 'admin' || false;

const handleLogout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('role');
  localStorage.removeItem('username');
  router.push('/');
};

// Hide navigation bar on specific routes
const hideNavigation = computed(
  () => route.path === '/forgot-password' || route.path === '/reset-password'
);
</script>
<style>
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin-top: 0;
  padding: 30px;
  background: #027d4a;
  color: white;
  display: flex;
  align-items: center;
  border-bottom: 5px solid #06372c;
  z-index: 2;
}
.navigation a {
  display: inline-block;
  margin-right: 20px;
  color: white;
  opacity: 0.7;
  transition: 0.2 ease color;
}
.navigation a.router-link-active,
.navigation a:hover {
  opacity: 1;
}
.username {
  margin-left: auto;
  font-weight: bold;
  opacity: 1;
  background: #035e36;
  border-radius: 20px;
  padding: 6px 18px 6px 10px;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 1.25rem;
  text-transform: capitalize;
}
.username::before {
  content: '';
  display: inline-block;
  width: 32px;
  height: 32px;
  margin-right: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ee08e 40%, #027d4a 100%);
}
</style>
