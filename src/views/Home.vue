<template>
    <div class="home">
        <h1>Homepage </h1>
        <!-- <div class="organizations">
            <router-link 
            v-for="organization in organizations"
            :key="organization.id"
            :to="{name: 'organization.show', params: {id: organization.id}}"

        >    -->
            <!-- <h2>{{ destination.id }}</h2> -->
            <!-- <h2>{{ organization.name }}</h2>
            <img :src="`/images/${organization.image}`" :alt="organization.name" />
            </router-link> -->
        <!-- </div> -->
         <div class = "organization">
            <h6></h6>
         </div>
    </div>

</template>
<script>
export default {
    data() {
        return {
            organizations: [
            {   id:1, name: 'Org 1', image: 'org1.jpg'},
            {   id:2, name: 'Org 2', image: 'org2.jpg'},
            {   id:3, name: 'Org 3', image: 'org3.jpg'},
            {   id:4, name: 'Org 4', image: 'org4.jpg'},
            {   id:5, name: 'Org 5', image: 'org5.jpg'},
            {   id:6, name: 'Org 6', image: 'org6.jpg'},
            {   id:7, name: 'Org 7', image: 'org7.jpg'},
            {   id:8, name: 'Org 8', image: 'org8.jpg'},
            {   id:9, name: 'Org 9', image: 'org9.jpg'},
            {   id:10, name: 'Org 10', image: 'org10.jpg'},
        ]
        }
    }
}
</script>