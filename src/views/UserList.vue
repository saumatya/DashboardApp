<template>
  <div>
    <h1>List of Users</h1>
    <!-- Add New Button -->
    <router-link to="/admin/users/new">
      <button class="add-button">Add New</button>
    </router-link>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Organization</th>
          <th>Created Date</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
          <!-- <th>Phone</th> -->
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          :class="{ disabledRow: user.disabled }"
        >
          <td>{{ user.name }}</td>
          <td>{{ organizationsMap[user.organization_id] || 'Unknown' }}</td>
          <td>{{ formatDate(user.created) }}</td>

          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <!-- Edit Button -->
            <router-link :to="{ name: 'user.edit', params: { id: user.id } }">
              <button class="edit-button">Edit</button>
            </router-link>
            <!-- Optional: Delete Button -->
            <button class="delete-button" @click="deleteOrganization(user.id)">
              Delete
            </button>
          </td>
          <!-- <td>{{ user.phone }}</td> -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
// const token = import.meta.env.VITE_TOKEN;
const token = localStorage.getItem('jwtToken');
export default {
  data() {
    return {
      users: [],
      organizationsMap: {}, // To store organization id-to-name mapping
    };
  },
  methods: {
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    },
    async fetchOrganizations() {
      try {
        console.log('Fetching organizations...');

        // Retrieve token (Ensure to remove hardcoded token in production)
        const token = localStorage.getItem('jwtToken');
        console.log('Using token:', token);

        const apiUrl = `${API_URL}/dashboard/api/organisation/list`;
        console.log('Request URL:', apiUrl);

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-CoPower-API': API_KEY,
        };

        console.log('Request Headers:', headers);

        const response = await axios.get(apiUrl, { headers });

        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
        this.organizationsMap = response.data.reduce((map, org) => {
          map[org.id] = org.name;
          return map;
        }, {});
        // return response.data;
      } catch (error) {
        console.error('Error fetching organizations:', error);

        if (error.response) {
          console.error('Response Data:', error.response.data);
          console.error('Response Status:', error.response.status);
          console.error('Response Headers:', error.response.headers);
        } else if (error.request) {
          console.error(
            'No response received. Request details:',
            error.request
          );
        } else {
          console.error('Request setup error:', error.message);
        }

        throw error; // Rethrow the error for handling upstream
      }
    },
    deleteOrganization(id) {
      if (confirm('Are you sure you want to delete this user?')) {
        axios
          .delete(`http://127.0.0.1:8000/users/${id}`)
          .then(() => {
            // Remove the deleted user from the list
            this.users = this.users.filter((user) => user.id !== id);
            alert('User deleted successfully.');
          })
          .catch((error) => {
            console.error('There was an error deleting the user:', error);
            alert('Failed to delete the user.');
          });
      }
    },
    async fetchUsers() {
      try {
        const response = await axios.get(`${API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add bearer token to headers
            'Content-Type': 'application/json',
            'X-CoPower-API': API_KEY,
          },
        });
        // this.users = response.data;
        this.users = response.data.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          created: user.created,
          password: '',
          phone: user.contact_number,
          role: user.access || 'user',
          organization_id: user.organisation,
          disabled: user.disabled || false,
        }));
      } catch (error) {
        console.error('There was an error fetching the users:', error);
      }
    },
  },
  async mounted() {
    await this.fetchOrganizations(); // Fetch organizations first
    await this.fetchUsers(); // Then fetch users
  },
};
</script>

<style scoped>
.disabledRow {
  background-color: #f9d6d5;
  color: #a1a1a1;
}
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}
.add-button {
  background-color: #4caf50; /* Green */
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 10px;
}
.add-button:hover {
  background-color: #45a049;
}
.delete-button {
  background-color: #f44336; /* Red */
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
}
.delete-button:hover {
  background-color: #d32f2f;
}
.edit-button {
  background-color: #faf6f6; /* Blue */
  color: black;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
}
.edit-button:hover {
  background-color: rgb(199, 195, 195);
}
</style>
