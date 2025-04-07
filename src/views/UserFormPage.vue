<template>
  <div>
    <h1>{{ isEditMode ? 'Edit user' : 'Create user' }}</h1>
    <UserForm
      :userData="user"
      :isEditMode="isEditMode"
      @create-user="createuser"
      @update-user="updateuser"
    />
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }} - {{ user.disabled ? 'Disabled' : 'Active' }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import UserForm from '@/components/UserForm.vue';
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
// const token = import.meta.env.VITE_TOKEN;
const token = localStorage.getItem('jwtToken');

export default {
  components: { UserForm },
  data() {
    return {
      user: { name: '', createdDate: '', disabled: false, id: null }, // Default empty data
      isEditMode: false, // Default to create mode
      users: [], // List of users (stored in-memory)
    };
  },
  methods: {
    // async createuser(newUser) {
    //   // console.log("isEditMode in createuser:", this.isEditMode);
    //   try {
    //     const response = await axios.post(`${API_URL}/api/user`, newUser, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         'Content-Type': 'application/json',
    //         'X-CoPower-API': API_KEY,
    //       },
    //     });
    //     this.users.push(response.data);
    //     console.log('New user Created:', response.data);

    //     // Reset form after successful creation
    //     this.resetForm();
    //   } catch (error) {
    //     console.error('Error creating user:', error);
    //   }
    // },

    async createuser(newUser) {
      // Log the incoming newUser object (request payload)
      console.log('Request payload:', newUser);

      try {
        // Log before making the request to see the payload you’re sending to the backend
        console.log('Sending payload to API:', newUser);

        const response = await axios.post(
          `${API_URL}/api/user`, // The URL
          newUser, // The payload (newUser should be sent as the second argument)
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              'X-CoPower-API': API_KEY,
            },
          }
        );

        // Log the response from the server
        console.log('API Response:', response.data);

        // If successful, add the new user to your users list
        this.users.push(response.data);
        console.log('New user Created:', response.data);

        // Reset form after successful creation
        this.resetForm();
      } catch (error) {
        // Log any error that occurs during the request
        console.error('Error creating user:', error);
      }
    },
    async updateuser(updatedUser) {
      // console.log("isEditMode in updateuser:", this.isEditMode);
      try {
        const response = await axios.put(
          `${API_URL}/api/user/${updatedUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              'X-CoPower-API': API_KEY,
            },
          },
          updatedUser
        );
        const index = this.users.findIndex(
          (user) => user.id === updatedUser.id
        );
        if (index !== -1) {
          this.users.splice(index, 1, response.data); // Update the existing user
        }
        // console.log("user Updated:", response.data);
        this.$router.push('/users');
        // Reset form after successful update
        this.resetForm();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    },
    resetForm() {
      // console.log("isEditMode before resetForm:", this.isEditMode);
      this.user = { name: '', createdDate: '', disabled: false, id: null };
      this.isEditMode = false;
      // console.log("isEditMode after resetForm:", this.isEditMode);
    },
  },
  created() {
    const userId = this.$route.params.id; // Get ID from the route params (for editing)
    if (userId) {
      this.isEditMode = true; // Switch to edit mode
      // console.log("isEditMode in created (edit mode):", this.isEditMode);
      const existingUser = this.users.find(
        (user) => user.id === parseInt(userId)
      );
      if (existingUser) {
        this.user = { ...existingUser }; // Populate form with existing data
      }
    } else {
      this.isEditMode = false; // Ensure we are in create mode if there's no ID
      // console.log("isEditMode in created (create mode):", this.isEditMode);
    }
  },
  watch: {
    $route(to, from) {
      const userId = to.params.id;
      if (!userId) {
        // Reset to create mode when navigating to create page
        // console.log("isEditMode before resetting in watch:", this.isEditMode);
        this.isEditMode = false;
        this.user = { name: '', createdDate: '', disabled: false, id: null };
        // console.log("isEditMode after resetting in watch:", this.isEditMode);
      }
    },
  },
};
</script>
