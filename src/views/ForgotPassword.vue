<template>
  <h1>Forgot Password</h1>
  <div class="forgot-password-container">
    <form @submit.prevent="handleForgotPassword">
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required />
      <button type="submit">Send Reset Link</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('');
const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL + '/api/user/forgot-password';

const handleForgotPassword = async () => {
  try {
    const response = await axios.post(
      API_URL,
      { Email: email.value },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CoPower-API': import.meta.env.VITE_API_KEY,
        },
      }
    );
    alert('Password reset link sent to your email.');
    router.push('/'); // Redirect to the login page after success
  } catch (error) {
    console.error('Error sending reset link:', error);
    alert('Failed to send reset link. Please try again.');
  }
};
</script>

<style></style>
