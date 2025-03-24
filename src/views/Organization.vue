<template>
    <div class="home">
        <h1>Organizations </h1>
        <div class="organizations">
            <router-link 
            v-for="organization in organizations"
            :key="organization.id"
            :to="{name: 'organization.show', params: {id: organization.id}, query: {name: organization.name}}"


        >   
            <h2>{{ organization.name }}</h2>
            <img :src="`/images/${organization.image}`" :alt="organization.name" />
            </router-link>
        </div>
    </div>

</template>
<script>
// export default {
//     data() {
//         return {
//             organizations: [
//             {   id:1, name: 'Org 1', image: 'org1.jpg'},
//             {   id:2, name: 'Org 2', image: 'org2.jpg'},
//             {   id:3, name: 'Org 3', image: 'org3.jpg'},
//             {   id:4, name: 'Org 4', image: 'org4.jpg'},
//             {   id:5, name: 'Org 5', image: 'org5.jpg'},
//             {   id:6, name: 'Org 6', image: 'org6.jpg'},
//             {   id:7, name: 'Org 7', image: 'org7.jpg'},
//             {   id:8, name: 'Org 8', image: 'org8.jpg'},
//             {   id:9, name: 'Org 9', image: 'org9.jpg'},
//             {   id:10, name: 'Org 10', image: 'org10.jpg'},
//         ]
//         }
//     }
// }


//FETCHING ORGANIZATIONS FROM BACKEND API

import axios from 'axios';
export default {
  data() {
    return {
      organizations: [],
    };
  },
  created() {
    this.fetchOrganizations();
  },
  methods: {

    //with debugging
    async fetchOrganizations() {
    try {
        const token = localStorage.getItem("jwtToken");
        const apiUrl = import.meta.env.VITE_API_URL;
        const apiKey = import.meta.env.VITE_API_KEY;

        if (!token) {
            console.error("JWT token is missing from localStorage");
            return;
        }
        if (!apiUrl) {
            console.error("API URL is not defined");
            return;
        }
        if (!apiKey) {
            console.error("API Key is not defined");
            return;
        }

        // Log the request details before sending
        console.log("Making API Request...");
        console.log("Endpoint:", `${apiUrl}/organisation/list`);
        console.log("Method: GET");
        console.log("Headers:", {
            Authorization: `Bearer ${token}`,
            "X-CoPower-API": apiKey,
            "Content-Type": "application/json",
        });

        const response = await axios.get(`${apiUrl}/organisation/list`, {
            headers: {
                // Authorization: `Bearer ${token}`,
                "X-CoPower-API": apiKey,
                "Content-Type": "application/json",
            },
        });

        console.log("Response Status:", response.status);
        console.log("Response Headers:", response.headers);
        console.log("Response Data:", JSON.stringify(response.data, null, 2));

        this.organizations = response.data.map((org) => ({
            id: org.id,
            name: org.name,
        }));

    } catch (error) {
        console.error("Error fetching organizations:", error);

        if (error.response) {
            console.error("Error Response Status:", error.response.status);
            console.error("Error Response Headers:", error.response.headers);
            console.error("Error Response Data:", JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error("No response received. Request details:", error.request);
        }
    }
}


//original code
    // async fetchOrganizations() {
    //   try {
    //     const token = localStorage.getItem("jwtToken");
    //     const apiUrl = import.meta.env.VITE_API_URL
    //     const apiKey= import.meta.env.VITE_API_KEY

    //     console.log(apiUrl);
    //     console.log(apiKey);
    //     console.log(token);
    //     const response = await axios.get(`${apiUrl}/organisation/list`, {
    //       headers: {
    //         // Authorization: `Bearer ${token}`,
    //         "X-CoPower-API": apiKey,
    //       },
    //     });
    //     this.organizations = response.data.map((org) => ({
    //       id: org.id,
    //       name: org.name,
    //       image: 'default-image.jpg',
    //     }));
    //   } catch (error) {
    //     console.error("Error fetching organizations:", error);
    //   }
    // },

//     async fetchOrganizations() {
//     try {
//         const token = localStorage.getItem("jwtToken");
//         const apiUrl = import.meta.env.VITE_API_URL;
//         const apiKey = import.meta.env.VITE_API_KEY;

//         console.log("API URL:", apiUrl);
//         console.log("API Key:", apiKey);
//         console.log("JWT Token:", token);

//         if (!token) {
//             console.error("JWT token is missing from localStorage");
//             return;
//         }
//         if (!apiUrl) {
//             console.error("API URL is not defined");
//             return;
//         }
//         if (!apiKey) {
//             console.error("API Key is not defined");
//             return;
//         }

//         const response = await axios.get(`${apiUrl}/organisation/list`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 "X-CoPower-API": apiKey,
//             },
//         });

//         console.log("API Response:", response);

//         this.organizations = response.data.map((org) => ({
//             id: org.id,
//             name: org.name,
//             image: 'default-image.jpg',
//         }));
//     } catch (error) {
//         console.error("Error fetching organizations:", error);
//     }
// }


    
  },
};
</script>