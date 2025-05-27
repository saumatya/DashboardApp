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
        <span v-if="errors.password">{{ errors.password }}</span>
      </div>
      <button type="submit" :disabled="!isTokenValid">Reset</button>
      <p v-if="errorMessage" class="error-alert">⚠️{{ errorMessage }}</p>
      <ul class="password-rules">
        <li>✓ At least one letter (a–z or A–Z)</li>
        <li>✓ At least one number (0–9)</li>
        <li>✓ At least one special symbol (e.g. @, #, !)</li>
        <li>✓ 10–40 characters long</li>
      </ul>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const password = ref('');
const confirmPassword = ref('');
const token = ref(''); // Token will be stored here
const errorMessage = ref('');
const errors = reactive({ password: '' });
const isTokenValid = ref(false);

const apiKey = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL + '/api/user/reset-password';
// API key from environment variables
// console.log(apiKey);
onMounted(async () => {
  // Capture the token from the URL parameters
  token.value = new URLSearchParams(window.location.search).get('token');
  console.log('reset token:', token.value); // For debugging purposes

  if (!token.value) {
    errorMessage.value = 'Invalid or missing token.';
    isTokenValid.value = false;
    return;
  }

  // Validate the token with backend
  try {
    await axios.post(
      import.meta.env.VITE_API_URL + '/api/user/validate-reset-token',
      { token: token.value },
      {
        headers: {
          'X-CoPower-API': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    isTokenValid.value = true;
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      'Invalid or expired token. Please contact admin.';
    isTokenValid.value = false;
  }
});

const validateForm = () => {
  password.value = password.value.trim();
  confirmPassword.value = confirmPassword.value.trim();
  let isValid = true;
  if (!password.value || !confirmPassword.value) {
    errors.password = 'Password is required.';
    isValid = false;
  } else if (password.value !== confirmPassword.value) {
    errors.password = 'Passwords do not match.';
    isValid = false;
  } else if (password.value.length < 10 || password.value.length > 40) {
    errors.password = 'Password must be between 10 to 40 characters.';
    isValid = false;
  } else if (!/[a-zA-Z]/.test(password.value)) {
    errors.password = 'Password must contain at least one letter.';
    isValid = false;
  } else if (!/\d/.test(password.value)) {
    errors.password = 'Password must contain at least one number.';
    isValid = false;
  } else if (!/[!@#$%^&*]/.test(password.value)) {
    errors.password = 'Password must contain at least one special character.';
    isValid = false;
  }
  return isValid;
};

const submitForm = async () => {
  if (!isTokenValid.value) {
    errorMessage.value = 'Invalid or expired token.';
    return;
  }
  if (!validateForm()) {
    console.log('formdata not valid');
    return;
  }
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
    console.log('Password reset successful!');
    router.push('/login'); // Redirect to the login page

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
.error-alert {
  background-color: #ffe0e0;
  color: #b00020;
  border: 1px solid #b00020;
  padding: 12px;
  border-radius: 4px;
  margin: 12px 0;
  font-weight: bold;
}
</style>
