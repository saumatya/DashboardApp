<template>
  <form @submit.prevent="handleLogin">
    <h1>Login</h1>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" v-model="email" />
    <span v-if="errors.email">{{ errors.email }}</span>

    <label for="password">Password</label>
    <input type="password" id="password" v-model="password" required />
    <span v-if="errors.password">{{ errors.password }}</span>

    <button type="submit">Login</button>
  </form>
  <router-link id="forgot-password" to="/forgot-password"
    >Forgot Password?</router-link
  >
</template>
<style>
/* @import 'tailwindcss'; */
</style>
<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const email = ref('');
const password = ref('');
const errors = reactive({ email: '', password: '' });

const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL + '/api/user/authenticate';
const API_KEY = import.meta.env.VITE_API_KEY;

const jwtDecode = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const validateForm = () => {
  email.value = email.value.trim();
  password.value = password.value.trim();
  errors.email = '';
  errors.password = '';
  let isValid = true;
  if (!email.value) {
    errors.email = 'Email is required.';
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    errors.email = 'Enter a valid email.';
    isValid = false;
  }
  if (!password.value) {
    errors.password = 'Password is required.';
    isValid = false;
  } else if (password.value.length < 10 || password.value.length > 40) {
    errors.password = 'Password must be at between 10 to 40 characters.';
    isValid = false;
  } else if (!/[a-zA-Z]/.test(password.value)) {
    errors.password = 'Password must contain at least one letter.';
    isValid = false;
  } else if (!/[0-9]/.test(password.value)) {
    errors.password = 'Password must contain at least one number.';
    isValid = false;
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password.value)) {
    errors.password = 'Password must contain at least one special symbol.';
    isValid = false;
  }
  return isValid;
};

//AUTHENTICATING WITH API
const handleLogin = async () => {
  if (!validateForm()) {
    return;
  }
  try {
    const response = await axios.post(
      API_URL,
      {
        email: email.value,
        password: password.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CoPower-API': API_KEY,
        },
      }
    );
    console.log(response);

    if (response.status === 200) {
      console.log('Login successful');
      console.log(response.data.token);
      localStorage.setItem('jwtToken', response.data.token);
      localStorage.setItem('username', response.data.name);
      var claims = jwtDecode(response.data.token);
      console.log('CLAIMS:', claims);

      if (claims.role === 'admin') {
        console.log('you are admin');
        localStorage.setItem('role', 'admin');
        router.push('/admin'); //ADMIN GOES TO ADMIN PAGE
        return;
      }
      router.push('/home');
    }
  } catch (error) {
    if (error.response) {
      console.error('Error Response:', error.response.data);

      if (error.response.data == 'AUT767551') {
        console.error('User is disabled');
        alert('User is disabled. Please contact administrator.');
      }

      alert('Login failed');
    } else {
      console.error('Axios error:', error);
      alert('An error occurred.');
    }
  }
};
</script>
