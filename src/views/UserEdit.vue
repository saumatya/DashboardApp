<template>
    <div>
        <h1>Edit User</h1>
        <UserForm :userData="user" @update-user="updateUser" />
    </div>
</template>

<script>
import axios from 'axios';
import UserForm from '@/components/UserForm.vue';

export default {
    components: { UserForm },
    data() {
        return {
            user: {
                id: null,
                name: "",
                email: "",
                password: "",
                phone: "",
                role: "user",
                organization_id: "",
                disabled: false
            }
        };
    },
    methods: {
        async fetchUser() {
            const userId = this.$route.params.id;
            try {
                const response = await axios.get(`http://127.0.0.1:8000/users/${userId}`);
                console.log("Fetch response:", response.data); // Log fetch response
                // this.user = { ...response.data, password: "" }; // Ensure password is empty for security
                this.user = { ...response.data }; // Ensure password is empty for security

            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        },
        updateUser(updatedUser) {
            // Call API to update the user
            axios.put(`http://127.0.0.1:8000/users/${updatedUser.id}`, updatedUser)
                .then(response => {
                    console.log("User updated:", response.data);
                    this.$router.push('/admin/users'); // Redirect after successful update
                })
                .catch(error => {
                    console.error("Error updating user:", error);
                });
        }
    },
    created() {
        console.log("User in props:", this.user); // Log user in props
        this.fetchUser();
    }
};
</script>
