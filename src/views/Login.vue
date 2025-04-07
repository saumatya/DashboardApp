<template>
  <form @submit.prevent="handleLogin">
    <h1>Login</h1>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" v-model="email" required />

    <label for="password">Password</label>
    <input
      type="password"
      id="password"
      name="password"
      v-model="password"
      required
    />

    <button type="submit">Login</button>
  </form>
  <router-link id="forgot-password" to="/forgot-password"
    >Forgot Password?</router-link
  >
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const email = ref('');
const password = ref('');
const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL + '/api/user/authenticate';
console.log(API_URL);
// const API_URL =
//   'https://copower.westeurope.cloudapp.azure.com/dashboard/api/user/authenticate';
const API_KEY = import.meta.env.VITE_API_KEY;
console.log(API_KEY);

if (email.value === 'admin@gmail.com' && password.value) {
  console.log('Admin Login successful');
  router.push('/admin'); //ADMING GOES TO ADMIN PAGE
}
const jwtDecode = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};
//AUTHENTICATING WITH API
const handleLogin = async () => {
  // if (email.value === 'admin@gmail.com' && password.value) {
  //   console.log('Admin Login successful');
  //   router.push('/admin'); //ADMING GOES TO ADMIN PAGE
  //   return;
  // }
  try {
    //direct redirection REMOVE LATER
    //router.push('/home');
    //return;
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
      alert('Login failed: ' + error.response.data.message);
    } else {
      console.error('Axios error:', error);
      alert('An error occurred.');
    }
  }
};

//     const handleLogin = async () => {
//     let data = JSON.stringify({
//         email: email.value,
//         password: password.value
//     });

//     let config = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: API_URL,
//         headers: {
//             'Content-Type': 'application/json',
//             'X-CoPower-API': API_KEY
//         },
//         data
//     };

//     axios.request(config)
//         .then(response => {
//             console.log(response);
//             if (response.status === 200) {
//                 console.log('Login successful');
//                 localStorage.setItem('jwtToken', response.data.token);
//                 router.push('/home');
//             }
//         })
//         .catch(error => {
//             if (error.response) {
//                 console.error("Error Response:", error.response.data);
//                 alert("Login failed: " + error.response.data.message);
//             } else {
//                 console.error("Axios error:", error);
//                 alert("An error occurred.");
//             }
//         });
// };

//     const handleLogin = () => {
//     if (email.value==="user@gmail.com" && password.value) {
//       console.log('User Login successful');
//       router.push('/home'); //USER GOES TO HOME PAGE

//     }else if (email.value==="admin@gmail.com" && password.value){
//       console.log('Admin Login successful');
//       router.push('/admin'); //ADMING GOES TO ADMIN PAGE
//     }
//     else {
//       alert('Please enter valid credentials');
//     }
// };
</script>
