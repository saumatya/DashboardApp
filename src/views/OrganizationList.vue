<template>
  <div>
    <h1>List of Organizations</h1>
    <!-- Add New Button -->
    <router-link to="/admin/organizations/new">
      <button class="add-button">Add New</button>
    </router-link>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Created Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="organization in organizations"
          :key="organization.id"
          :class="{ disabledRow: organization.disabled }"
        >
          <td>{{ organization.name }}</td>
          <td>{{ formatDate(organization.created) }}</td>
          <td>
            <!-- Edit Button -->
            <router-link
              :to="{
                name: 'organization.edit',
                params: { id: organization.id },
              }"
            >
              <button class="edit-button">Edit</button>
            </router-link>
            <!-- Optional: Delete Button -->
            <button
              class="delete-button"
              @click="deleteOrganization(organization.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      organizations: [],
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
    deleteOrganization(id) {
      if (confirm('Are you sure you want to delete this organization?')) {
        axios
          .delete(`http://127.0.0.1:8000/organizations/${id}`)
          .then(() => {
            // Remove the deleted organization from the list
            this.organizations = this.organizations.filter(
              (org) => org.id !== id
            );
            alert('Organization deleted successfully.');
          })
          .catch((error) => {
            console.error(
              'There was an error deleting the organization:',
              error
            );
            alert('Failed to delete the organization.');
          });
      }
    },
  },
  mounted() {
    axios
      .get('http://127.0.0.1:8000/organizations')
      .then((response) => {
        this.organizations = response.data;
      })
      .catch((error) => {
        console.error('There was an error fetching the organizations:', error);
      });
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
</style>
