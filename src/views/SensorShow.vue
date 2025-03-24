<!-- <template>
  <div v-if="loading">Loading...</div>
  <div v-else>
      <h1>Organization ID: {{ $route.params.id }} </h1>  
      <h2>Sensor ID:  {{ $route.params.sensorId }}</h2>
      <h3>Sensor Measurements</h3>
  </div>
</template>

<script>
export default {
props: ['id', 'sensorId'], //  receives route params
data() {
  return {
    loading: false,
  };
}
};
</script> -->



<!-- FETCHING SENSOR MEASUREMENTS FROM BACKEND API -->
 
<template>
  
  <div v-if="loading">Loading...</div>
  <div v-else class="sensor-detail">
      <!-- <h6>Organization ID: {{ $route.params.id }} </h6> 
      -->
      <!-- <h6>Sensor ID:  {{ $route.params.sensorId }}</h6>    -->
      <h2> {{ $route.query.sensorName }}</h2> 
      <h3>Sensor Measurements</h3>

    <div class="flex space-x-2">
    <button 
      v-for="option in timeOptions" 
      :key="option.value" 
      :class="['btn', { 'btn-active': selectedRange === option.value }]" 
      @click="setRange(option.value)">
      {{ option.label }}
    </button>
    </div>

      <!-- <DatePicker v-model="dates" selectionMode="range" :manualInput="false" :maxDate="maxDate" dateFormat="dd/mm/yy"/> -->
      <DatePicker 
      v-model="dates" 
      selectionMode="range" 
      :manualInput="false" 
      :maxDate="maxDate" 
      dateFormat="dd.mm.yy"
      placeholder="Select Date Range"
          />
      <Button label="Load" @click="fetchMeasurements"/>
      <SensorChart v-if="showChart" :measurements="measurements" :unit="sensorUnit"/>
      <!-- <div v-else-if="dataFetched && measurements.length === 0">
        <p>No measurements available for the given period.</p>
      </div> -->
      <!-- <SensorChart :measurements="measurements"/> -->
      <div v-if="measurements.length > 0">
          <table class="measurements-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(measurement, index) in measurements" :key="index">
                <td>{{ new Date(measurement.date).toLocaleString() }}</td>
                <td>{{ measurement.value }}</td>
              </tr>
          </tbody>
    </table>
  </div>
  <div v-else-if="dataFetched">No measurements available for the given period.</div>
</div>
</template>

<script>
import axios from 'axios';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import SensorChart from '../components/SensorChart.vue';
import { ref } from 'vue';

export default {
  props: ['organizationId', 'sensorId', 'sensorName'],

  components: {
    DatePicker,
    Button,
    SensorChart
  },
  setup() {
    const dates = ref(null); // or set a default date value
    maxDate: null;
    return { dates };
  },
    props: ['id', 'sensorId'],
        data() {
        return {
          sensorUnit: this.$route.state?.sensorUnit || 'Unit',
            dataFetched : false,
            loading: false,
            measurements: [],
            startTime: null,  
            endTime: null,
            maxDate: new Date(),
            maxDateRange: 30,
            showChart: false,
        };
    },
    watch: {
  dates(newDates) {
      if (newDates && newDates.length > 0) {
        this.startTime = new Date(newDates[0]).toISOString();

        // Set maxDate to 30 days after the selected start date
        let newMaxDate = new Date(newDates[0]);
        newMaxDate.setDate(newMaxDate.getDate() + 30);
        this.maxDate = newMaxDate; 

        if (newDates.length === 2) {
          this.endTime = new Date(newDates[1]).toISOString();
          if (newDates[1] < newDates[0]) {
            this.dates = [newDates[0]];
          }
        }
      }
  }


    },
    methods: {
      //with debugging
      async fetchMeasurements() {
        this.showChart=true,
        this.loading = true;
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

        console.log("Making API Request...");
        console.log("Endpoint:", `${apiUrl}/measurements/${this.$route.params.id}/${this.$route.params.sensorId}`);
        console.log("Method: POST");
        console.log("Headers:", {
            "X-CoPower-API": apiKey,
            "Content-Type": "application/json",
        });

        const response = await axios.post(`${apiUrl}/measurements/${this.$route.params.id}/${this.$route.params.sensorId}`, {
            startTime: this.startTime,
            endTime: this.endTime
        }, {
            headers: {
                // Authorization: `Bearer ${token}`,
                "X-CoPower-API": apiKey,
                "Content-Type": "application/json",
            },
        });

        console.log("Response Status:", response.status);
        console.log("Response Headers:", response.headers);
        console.log("Response Data:", JSON.stringify(response.data, null, 2));

        this.measurements = response.data;

    } catch (error) {
        if (error.response) {
            console.error("Error Response Status:", error.response.status);
            console.error("Error Response Headers:", error.response.headers);
            console.error("Error Response Data:", JSON.stringify(error.response.data, null, 2));

            if (error.response.status === 400) {
              console.error("Bad Request: Please check the request payload or parameters.");
              alert("Bad Request: Please check the selected date range or other input values.");
            }
        } else if (error.request) {
            console.error("No response received. Request details:", error.request);
        }
        else {
          console.log("som ting wong")
        }
    } finally {
        this.loading = false;
        this.dataFetched = true;
    }
}


      //old
        // fetchMeasurements() {
        //     const apiUrl = `${import.meta.env.VITE_API_URL}/measurements/${this.$route.params.id}/${this.$route.params.sensorId}`;
        //     const apiKey = import.meta.env.VITE_API_KEY;
        //     const jwtToken = localStorage.getItem('jwtToken');

        //     axios.post(apiUrl, {
        //         startTime: this.startTime,
        //         endTime: this.endTime
        //     }, {
        //         headers: {
        //             // Authorization: `Bearer ${jwtToken}`,
        //             'X-CoPower-API': apiKey
        //         }
        //     })
        //     .then(response => {
        //         this.measurements = response.data;
        //     })
        //     .catch(error => {
        //         console.error('Error fetching measurements:', error);
        //     })
        //     .finally(() => {
        //         this.loading = false;
        //     });
        // }
    }
};
</script>
<style>
h2 {
  padding-top: 30px;
}
.sensor-detail {
  padding: 20px;
}
</style>
