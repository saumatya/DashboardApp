<template>
    <form @submit.prevent="handleSubmit">
        <div>
            <label for="name">Organization Name:</label>
            <input type="text" id="name" v-model="organization.name" required />
        </div>
<!-- 
        <div>
            <label for="created">Created Date:</label>
            <input type="date" id="created" v-model="organization.created" required />
        </div> -->

        <div>
            <label for="disabled">Disabled:</label>
            <input type="checkbox" id="disabled" v-model="organization.disabled" />
        </div>

        <button type="submit">{{ isEditMode ? "Update" : "Create" }}</button>
    </form>
</template>

<script>
export default {
    props: {
        organizationData: Object, // Used when editing
        // isEditMode: Boolean, // Passed from parent to determine whether we're in edit mode
    },
    data() {
        // console.log("isEditMode in data():", this.isEditMode);
        return {
            // Initialize organization data for both create and edit modes
            organization: this.organizationData
                ? { ...this.organizationData ,created: this.formatDate(this.organizationData.created) } // If in edit mode, copy the existing data
                : { name: "", created: "", disabled: false, id: null } // Default for create mode
        };
    },
    computed: {
        isEditMode() {
            const mode = this.organizationData && this.organizationData.id != null;
            // console.log("isEditMode in computed property:", mode);
            return mode;
        }
    },
    methods: {
        formatDate(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];  // Extracts "yyyy-MM-dd" format
    },
        handleSubmit() {
            // console.log("isEditMode in handleSubmit:", this.isEditMode);
            if (this.isEditMode) {
                this.$emit("update-organization", this.organization);  // Emit update event for editing
            } else {
                this.$emit("create-organization", this.organization);  // Emit create event for new organization
            }
        this.$router.push('/admin/organizations'); 
        }
    },
    watch: {
        organizationData(newData) {
            // console.log("isEditMode in watch (organizationData):", this.isEditMode);
            if (newData) {
                this.organization = { ...newData };
            }
        }
    },
    mounted() {
        // console.log("isEditMode in mounted:", this.isEditMode);
    }
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
