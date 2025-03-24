<template>
  <section class="organization">
    <!-- <h1>{{ organization.name }}</h1> -->
    <!--
     <h1>Sensors List</h1>
     <h2>Organization {{ $route.params.id }}</h2>
     <h2>Organization {{ name }}</h2>
    <div class="organization-details">
        <div class="sensors">
            <router-link 
            v-for="sensor in sensors"
            :key="sensor.token"
            :to="{name: 'sensor.show', params:  { organizationId: id, sensorId: sensor.token }}"

            >   
            
            <h2>{{ sensor.name }}</h2>
            <h6>{{ sensor.unit }}</h6>>
            </router-link>
            <router-view></router-view> 
        </div>
    </div>
-->
    <div v-if="loading">Loading...</div>
    <div v-else>
      <!-- <h6>Organization ID: {{ $route.params.id }} </h6>  -->
      <h1>{{ $route.query.name }}</h1>

      <h3>Sensors List</h3>
      <div class="sensors-details">
        <div v-if="sensors.length > 0">
          <div class="sensors">
            <router-link
              v-for="sensor in sensors"
              :key="sensor.sensorId"
              :to="{
                name: 'sensor.show',
                // params:  { organizationId: id, sensorId: sensor.sensorId },
                params: { sensorId: sensor.sensorId },
                query: { sensorName: sensor.name },
                state: { sensorUnit: sensor.unit },
              }"
            >
              <h2>{{ sensor.name }}</h2>
              <!-- <h6>{{ sensor.unit }}</h6>> -->
            </router-link>
            <router-view></router-view>
            <!-- Renders nested SensorShow.vue -->
          </div>
        </div>
        <div v-else>No measurements available for the given period.</div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
export default {
  props: ['id', 'name'],
  data() {
    return {
      loading: true, // Flag to show loading message
      sensors: [
        // {id:1, name: 'Sensor 1', image: 'sensor1.jpg'},
        // {id:2, name: 'Sensor 2', image: 'sensor2.jpg'},
        // {id:3, name: 'Sensor 3', image: 'sensor3.jpg'},
        // {id:4, name: 'Sensor 4', image: 'sensor4.jpg'},
        // {id:5, name: 'Sensor 5', image: 'sensor5.jpg'},
        // {id:6, name: 'Sensor 6', image: 'sensor6.jpg'},
      ],
    };
  },
  created() {
    console.log('Org ID:', this.id);
    console.log('Org Name:', this.name);
    this.fetchSensors();
  },
  methods: {
    async fetchSensors() {
      try {
        const token = localStorage.getItem('jwtToken');
        const apiUrl = import.meta.env.VITE_API_URL;
        const apiKey = import.meta.env.VITE_API_KEY;

        if (!token) {
          console.error('JWT token is missing from localStorage');
          return;
        }
        if (!apiUrl) {
          console.error('API URL is not defined');
          return;
        }
        if (!apiKey) {
          console.error('API Key is not defined');
          return;
        }

        // Log the request details before sending
        console.log('Making API Request...');
        console.log('Endpoint:', `${apiUrl}/sensor/${this.id}/list`);
        console.log('Method: GET');
        console.log('Headers:', {
          Authorization: `Bearer ${token}`,
          'X-CoPower-API': apiKey,
          'Content-Type': 'application/json',
        });

        const response = await axios.get(`${apiUrl}/sensor/${this.id}/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-CoPower-API': apiKey,
            'Content-Type': 'application/json',
          },
        });

        console.log('Response Status:', response.status);
        console.log('Response Headers:', response.headers);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));

        this.sensors = response.data.map((sensor) => ({
          sensorId: sensor.token,
          name: sensor.name,
          unit: sensor.unit,
        }));
      } catch (error) {
        // console.error("Error fetching sensors:", error);

        if (error.response) {
          console.error('Error Response Status:', error.response.status);
          console.error('Error Response Headers:', error.response.headers);
          console.error(
            'Error Response Data:',
            JSON.stringify(error.response.data, null, 2)
          );
        } else if (error.request) {
          console.error(
            'No response received. Request details:',
            error.request
          );
        }
      } finally {
        this.loading = false;
      }
    },

    // fetchSensors() {
    //     const apiUrl = `${import.meta.env.VITE_API_URL}/sensor/${this.id}/list`;  // Construct the API URL using the organization ID
    //     const apiKey = import.meta.env.VITE_API_KEY;
    //     const jwtToken = localStorage.getItem('jwtToken');

    //     axios.get(apiUrl, {
    //         headers: {
    //             // Authorization: `Bearer ${jwtToken}`,
    //             'X-CoPower-API': apiKey
    //         }
    //     })
    //     .then(response => {
    //         this.sensors = response.data;
    //     })
    //     .catch(error => {
    //         console.error('Error fetching sensors:', error);
    //     });
    // }
  },
};
</script>
