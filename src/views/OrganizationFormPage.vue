<template>
  <div>
    <h1>{{ isEditMode ? 'Edit Organization' : 'Create Organization' }}</h1>
    <OrganizationForm
      :organizationData="organization"
      :isEditMode="isEditMode"
      @create-organization="createOrganization"
      @update-organization="updateOrganization"
    />
    <ul>
      <li v-for="org in organizations" :key="org.id">
        {{ org.name }} - {{ org.disabled ? 'Disabled' : 'Active' }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import OrganizationForm from '@/components/OrganizationForm.vue';

export default {
  components: { OrganizationForm },
  data() {
    return {
      organization: { name: '', createdDate: '', disabled: false, id: null }, // Default empty data
      isEditMode: false, // Default to create mode
      organizations: [], // List of organizations (stored in-memory)
    };
  },
  methods: {
    async createOrganization(newOrg) {
      // console.log("isEditMode in createOrganization:", this.isEditMode);
      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/organizations',
          newOrg
        );
        this.organizations.push(response.data);
        console.log('New Organization Created:', response.data);

        // Reset form after successful creation
        this.resetForm();
      } catch (error) {
        console.error('Error creating organization:', error);
      }
    },
    async updateOrganization(updatedOrg) {
      // console.log("isEditMode in updateOrganization:", this.isEditMode);
      try {
        const response = await axios.put(
          `http://127.0.0.1:8000/organizations/${updatedOrg.id}`,
          updatedOrg
        );
        const index = this.organizations.findIndex(
          (org) => org.id === updatedOrg.id
        );
        if (index !== -1) {
          this.organizations.splice(index, 1, response.data); // Update the existing organization
        }
        // console.log("Organization Updated:", response.data);
        this.$router.push('/organizations');
        // Reset form after successful update
        this.resetForm();
      } catch (error) {
        console.error('Error updating organization:', error);
      }
    },
    resetForm() {
      // console.log("isEditMode before resetForm:", this.isEditMode);
      this.organization = {
        name: '',
        createdDate: '',
        disabled: false,
        id: null,
      };
      this.isEditMode = false;
      // console.log("isEditMode after resetForm:", this.isEditMode);
    },
  },
  created() {
    const orgId = this.$route.params.id; // Get ID from the route params (for editing)
    if (orgId) {
      this.isEditMode = true; // Switch to edit mode
      // console.log("isEditMode in created (edit mode):", this.isEditMode);
      const existingOrg = this.organizations.find(
        (org) => org.id === parseInt(orgId)
      );
      if (existingOrg) {
        this.organization = { ...existingOrg }; // Populate form with existing data
      }
    } else {
      this.isEditMode = false; // Ensure we are in create mode if there's no ID
      // console.log("isEditMode in created (create mode):", this.isEditMode);
    }
  },
  watch: {
    $route(to, from) {
      const orgId = to.params.id;
      if (!orgId) {
        // Reset to create mode when navigating to create page
        // console.log("isEditMode before resetting in watch:", this.isEditMode);
        this.isEditMode = false;
        this.organization = {
          name: '',
          createdDate: '',
          disabled: false,
          id: null,
        };
        // console.log("isEditMode after resetting in watch:", this.isEditMode);
      }
    },
  },
};
</script>
