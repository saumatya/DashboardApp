<template>
  <h1>Forgot Password</h1>
  <div class="forgot-password-container">
    <form @submit.prevent="handleForgotPassword">
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required />
      <span v-if="errors.email">{{ errors.email }}</span>
      <button type="submit">Send Reset Link</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('');
const router = useRouter();
const errors = reactive({ email: '' });
const API_URL = import.meta.env.VITE_API_URL + '/api/user/forgot-password';

const validateForm = () => {
  email.value = email.value.trim();
  let isValid = true;
  if (!email.value) {
    errors.email = 'Email is required.';
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    errors.email = 'Enter a valid email.';
    isValid = false;
  }
  return isValid;
};
const handleForgotPassword = async () => {
  if (!validateForm()) {
    return;
  }

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

    // Handle successful response
    if (response.status === 200) {
      alert('If user is valid, reset email will be sent.');
      router.push('/'); // Redirect to the login page after success
    } else {
      // In case a 2xx response returns but we want to show a generic error (just in case)
      alert('Unexpected success response, please try again.');
    }
  } catch (error) {
    // Check if the error is a response from the server
    if (error.response) {
      const status = error.response.status;

      // Handle server-side errors
      if (status === 400) {
        alert('If user is valid, reset email will be sent.'); // Inform the user without revealing sensitive details
      } else if (status === 500) {
        alert('Server error. Please try again later.');
      } else {
        alert('An unexpected error occurred. Please try again.');
      }

      console.error('Error response:', error.response);
    } else if (error.request) {
      // This condition handles if no response was received from the server
      alert('Network error. Please check your internet connection.');
      console.error('No response received:', error.request);
    } else {
      // Handle other types of errors, such as in the request setup
      alert('An unexpected error occurred. Please try again.');
      console.error('Error details:', error.message);
    }
  }
};
</script>

<style>
span {
  color: red;
  font-size: 12px;
}
</style>
