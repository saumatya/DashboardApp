<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="name">User Name:</label>
      <input type="text" id="name" v-model="user.name" required />
    </div>
    <div>
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="user.email" required />
    </div>
    <div>
      <label for="password">Password:</label>
      <input type="password" id="password" v-model="user.password" required />
    </div>
    <div>
      <label for="role">Role:</label>
      <select id="role" v-model="user.role" required>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
    </div>
    <div>
      <label for="organization">Organization:</label>
      <select id="organization" v-model="user.organization_id" required>
        <option v-for="org in organizations" :key="org.id" :value="org.id">
          {{ org.name }}
        </option>
      </select>
    </div>
    <!-- <div>
      <label for="phone">Phone:</label>
      <input type="text" id="phone" v-model="user.phone" required />
    </div> -->
    <!-- <div>
      <label for="disabled">Disabled:</label>
      <input type="checkbox" id="disabled" v-model="user.disabled" />
    </div> -->

    <div v-if="isEditMode">
      <label for="disabled">Disabled:</label>
      <input type="checkbox" id="disabled" v-model="user.disabled" />
    </div>

    <button type="submit">{{ isEditMode ? 'Update' : 'Create' }}</button>
  </form>
</template>

<script>
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const token = import.meta.env.VITE_TOKEN;
export default {
  props: {
    userData: Object, // Used when editing
  },
  data() {
    return {
      user: this.userData
        ? { ...this.userData }
        : {
            name: '',
            email: '',
            password: '',
            // phone: '',
            role: '',
            organization_id: '',
            disabled: false,
          },
      organizations: [], // To store the list of organizations
    };
  },
  computed: {
    isEditMode() {
      return this.userData && this.userData.id != null;
    },
  },
  methods: {
    async fetchOrganizations() {
      try {
        const response = await axios.get(
          `${API_URL}/dashboard/api/organisation/list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              'X-CoPower-API': API_KEY,
            },
          }
        );
        this.organizations = response.data.filter((org) => !org.disabled); // Exclude disabled organizations
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    },
    handleSubmit() {
      const payload = {
        // id: this.user.id,
        username: this.user.name,
        email: this.user.email,
        password: this.user.password,
        // phone: this.user.phone,
        access: this.user.role,
        organisation: this.user.organization_id, // Send the selected organization ID
        disabled: this.user.disabled || false,
      };

      if (this.isEditMode) {
        this.$emit('update-user', payload); // Emit update event for editing
      } else {
        this.$emit('create-user', payload); // Emit create event for new user
      }

      this.$router.push('/admin/users');
    },
  },
  watch: {
    userData(newData) {
      if (newData) {
        this.user = { ...newData };
      }
    },
  },
  mounted() {
    this.fetchOrganizations(); // Fetch organizations when the component is mounted
  },
};
</script>

<style scoped>
ul {
  font-size: 50pt;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
}
button {
  background-color: blue;
  color: white;
  padding: 5px;
  border: none;
  cursor: pointer;
}
</style>
