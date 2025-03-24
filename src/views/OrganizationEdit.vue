<template>
    <div>
        <h1>Edit Organization</h1>
        <OrganizationForm :organizationData="organization" @update-organization="updateOrganization" />
    </div>
</template>

<script>
import axios from 'axios';
import OrganizationForm from '@/components/OrganizationForm.vue';

export default {
    components: { OrganizationForm },
    data() {
        return {
            organization: { name: "", createdDate: "", disabled: false, id: null }
        };
    },
    methods: {
        async fetchOrganization() {
            const orgId = this.$route.params.id;
            try {
                const response = await axios.get(`http://127.0.0.1:8000/organizations/${orgId}`);
                console.log("Fetch response:", response.data); // Log fetch response
                this.organization = response.data;
            } catch (error) {
                console.error("Error fetching organization data:", error);
            }
        },
        updateOrganization(updatedOrg) {
            // Call API to update the organization
            const { id, createdDate, ...updateData } = updatedOrg;
            axios.put(`http://127.0.0.1:8000/organizations/${updatedOrg.id}`, updatedOrg)
                .then(response => {
                    console.log("Organization updated:", response.data);
                    this.$router.push('/admin/organizations');  // Redirect after successful update
                })
                .catch(error => {
                    console.error("Error updating organization:", error);
                });
        }
    },
    created() {
        console.log("Organization in props:", this.organization); // Log organization in props
        this.fetchOrganization();
    }
};
</script>
