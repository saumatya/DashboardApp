<template>
  <div>
    <h1>Edit User</h1>
    <UserForm :userData="user" @update-user="updateUser" />
  </div>
</template>

<script>
import axios from 'axios';
import UserForm from '@/components/UserForm.vue';
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const token = import.meta.env.VITE_TOKEN;

export default {
  // props: [id],
  components: { UserForm },
  data() {
    return {
      user: {
        id: null,
        name: '',
        email: '',
        password: '',
        // phone: '',
        role: 'user',
        organization_id: '',
        disabled: '',
      },
    };
  },
  methods: {
    async fetchUser() {
      const userId = this.$route.params.id;
      // const userId = this.id;
      console.log('User ID from props:', this.id); // Make sure this prints the correct ID
      console.log('User ID from route params:', this.$route.params.id); // Make sure this prints the correct ID
      try {
        const response = await axios.get(`${API_URL}/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-CoPower-API': API_KEY,
          },
        });
        console.log('Fetch response:', response.data); // Log fetch response
        // this.user = { ...response.data, password: "" };
        // this.user = { ...response.data };
        this.user = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          password: '',
          phone: response.data.contact_number,
          role: response.data.access || 'user',
          organization_id: response.data.organisation,
          disabled: response.data.disabled,
        };
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    updateUser(updatedUser) {
      const userId = this.$route.params.id;
      // Call API to update the user
      axios
        .put(`${API_URL}/api/user/${userId}`, updatedUser, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-CoPower-API': API_KEY,
          },
        })
        .then((response) => {
          console.log('User updated:', response.data);
          this.$router.push('/admin/users'); // Redirect after successful update
        })
        .catch((error) => {
          console.error('Error updating user:', error);
        });
    },
  },
  created() {
    console.log('User in props:', this.user); // Log user in props
    this.fetchUser();
  },
};
</script>
