<template>
  <div class="reset-password">
    <h2>Reset Your Password</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label for="password">New Password</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div>
        <label for="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          required
        />
      </div>
      <button type="submit">Reset Password</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const password = ref('');
const confirmPassword = ref('');
const token = ref(''); // Token will be stored here
const errorMessage = ref('');

const apiKey = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL + '/api/user/reset-password';
// API key from environment variables
console.log(apiKey);
onMounted(() => {
  // Capture the token from the URL parameters
  token.value = new URLSearchParams(window.location.search).get('token');
  console.log('reset token:', token.value); // For debugging purposes
});

const submitForm = async () => {
  // Basic validation for the passwords
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }

  // Call the backend API to reset the password
  try {
    const response = await axios.post(
      API_URL,
      {
        token: token.value, // Pass the token from the URL
        newPassword: password.value,
      },
      {
        headers: {
          'X-CoPower-API': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    alert('Password reset successful!');
    //redirect to the login page

    // if (response.ok) {
    //   alert('Password reset successful!');
    //   // Redirect to login or another page after success
    // } else {
    //   const errorData = await response.json();
    //   errorMessage.value = errorData.message || 'Error resetting password.';
    // }
  } catch (error) {
    console.log(error);
    errorMessage.value =
      error.response?.data?.message ||
      'An error occurred while resetting your password.';
  }
};
</script>

<style scoped>
/* Add styles as needed */
.error {
  color: red;
}
</style>
