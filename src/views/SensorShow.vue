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
    <h2>{{ $route.query.sensorName }}</h2>
    <h3>Sensor Measurements</h3>
    <!-- <Dropdown
      v-model="selectedMonth"
      :options="months"
      optionLabel="month"
      placeholder="Select a Month"
      class="w-full md:w-14rem"
    /> -->

    <div class="flex space-x-2">
      <button
        v-for="option in timeOptions"
        :key="option.value"
        :class="['btn', { 'btn-active': selectedRange === option.value }]"
        @click="setRange(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
    <div class="dropdown-container">
      <div class="month-dropdown">
        <select
          name="months"
          id="months"
          v-model="selectedMonth"
          @change="onMonthOrYearChange"
        >
          <option v-for="(month, index) in months" :key="month" :value="index">
            {{ month }}
          </option>
        </select>
      </div>
      <div class="year-dropdown">
        <select
          name="years"
          id="years"
          v-model="selectedYear"
          @change="onMonthOrYearChange"
        >
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="selectedRange === 'custom'" class="custom-select">
      <!-- <DatePicker v-model="dates" selectionMode="range" :manualInput="false" :maxDate="maxDate" dateFormat="dd/mm/yy"/> -->
      <DatePicker
        v-model="dates"
        selectionMode="range"
        :manualInput="false"
        :maxDate="maxDate"
        dateFormat="dd.mm.yy"
        placeholder="Select Date Range"
      />
      <!-- <Button label="Load" @click="fetchMeasurements" /> -->
      <Button label="Load" @click="handleCustomRange" />
    </div>

    <!-- <div class="sensor-chart-container">
      <SensorChart
        v-if="showChart"
        :measurements="measurements"
        :unit="sensorUnit"
      />
    </div> -->
    <div class="sensor-chart-grid">
      <SensorChart
        v-for="(measurement, sensor) in measurements"
        :key="sensor"
        v-if="showChart"
        :measurements="measurement"
        :unit="'Celsius'"
        :label="'Temperature'"
      />

      <!-- :unit="sensorUnits[sensor]"
      :label="sensorLabels[sensor]" -->
    </div>

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
    <div v-else-if="dataFetched">
      No measurements available for the given period.
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import DatePicker from 'primevue/datepicker';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import SensorChart from '../components/SensorChart.vue';
import { ref, onMounted } from 'vue';

const selectedRange = ref('day'); // Default: "Today"

// const timeOptions = [
//   { label: 'Today', value: 'day' },
//   { label: 'This Week', value: 'week' },
//   { label: 'This Month', value: 'month' },
// ];

// const setRange = (range) => {
//   selectedRange.value = range;
//   fetchMeasurements(); // Fetch data when a button is clicked
// };

export default {
  props: ['organizationId', 'sensorId', 'sensorName'],

  components: {
    DatePicker,
    Button,
    SensorChart,
    Dropdown,
  },
  setup() {
    const dates = ref(null); // or set a default date value
    maxDate: null;
    return { dates };
  },
  props: ['id', 'sensorId'],
  data() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    return {
      sensorUnit: this.$route.state?.sensorUnit || 'Unit',
      dataFetched: false,
      loading: false,
      measurements: [],
      measurements: {
        sensor1: [],
        sensor2: [],
        sensor3: [],
        sensor4: [],
      },
      sensorUnits: {
        sensor1: '°C',
        sensor2: 'Pa',
        sensor3: 'm/s',
        sensor4: 'ppm',
      },
      sensorLabels: {
        temperature: 'Temperature',
        humidity: 'WindSpeed',
        pressure: 'Cloudiness',
        power: 'Spot Electricity Prices',
      },

      startTime: null,
      endTime: null,
      maxDate: new Date(),
      maxDateRange: 30,
      showChart: false,
      selectedRange: 'day',
      timeOptions: [
        { label: 'Today', value: 'day' },
        { label: 'This Week', value: 'week' },
        { label: 'This Month', value: 'month' },
        { label: 'Custom', value: 'custom' },
      ],
      years: Array.from({ length: 5 }, (_, i) => currentYear - i),
      selectedMonth: currentMonth,
      selectedYear: currentYear,
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
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
    },
  },
  methods: {
    handleCustomRange() {
      if (this.dates && this.dates.length === 2) {
        const startTime = new Date(this.dates[0]).toISOString();
        const endTime = new Date(this.dates[1]).toISOString();
        console.log('Fetching measurements for custom range:', {
          startTime,
          endTime,
        });
        this.fetchMeasurements(startTime, endTime);
      } else {
        alert('Please select a valid date range.');
      }
    },
    onMonthOrYearChange() {
      // Calculate the start and end time for the selected month and year
      const startOfMonth = new Date(this.selectedYear, this.selectedMonth, 1);
      const endOfMonth = new Date(
        this.selectedYear,
        this.selectedMonth + 1,
        0,
        23,
        59,
        59,
        999
      );

      const startTime = startOfMonth.toISOString();
      const endTime = endOfMonth.toISOString();

      console.log('Fetching measurements for:', { startTime, endTime });

      // Call fetchMeasurements with the calculated time range
      this.fetchMeasurements(startTime, endTime);
    },
    setRange(range) {
      this.selectedRange = range;
      console.log('Selected Range:', range);
      // Determine startTime and endTime based on the selected range
      const now = new Date();
      let startTime, endTime;

      if (range === 'day') {
        startTime = new Date(now.setHours(0, 0, 0, 0)).toISOString(); // Start of today
        endTime = new Date(now.setHours(23, 59, 59, 999)).toISOString(); // End of today
      } else if (range === 'week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Start of the week (Sunday)
        startTime = new Date(startOfWeek.setHours(0, 0, 0, 0)).toISOString();
        endTime = new Date(now.setHours(23, 59, 59, 999)).toISOString(); // End of today
      } else if (range === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the month
        startTime = new Date(startOfMonth.setHours(0, 0, 0, 0)).toISOString();
        endTime = new Date(now.setHours(23, 59, 59, 999)).toISOString(); // End of today
      } else if (range === 'custom') {
        // Do nothing for "Custom" range; wait for user input
        console.log('Custom range selected. Waiting for user to select dates.');
        return;
      }

      // Call fetchMeasurements with the calculated time range
      this.fetchMeasurements(startTime, endTime);
    },
    //old one
    // async fetchMeasurements() {
    //   (this.showChart = true), (this.loading = true);
    //   try {
    //     const token = localStorage.getItem('jwtToken');
    //     const apiUrl = import.meta.env.VITE_API_URL;
    //     const apiKey = import.meta.env.VITE_API_KEY;

    //     if (!token) {
    //       console.error('JWT token is missing from localStorage');
    //       return;
    //     }
    //     if (!apiUrl) {
    //       console.error('API URL is not defined');
    //       return;
    //     }
    //     if (!apiKey) {
    //       console.error('API Key is not defined');
    //       return;
    //     }

    //     console.log('Making API Request...');
    //     console.log(
    //       'Endpoint:',
    //       `${apiUrl}/measurements/${this.$route.params.id}/${this.$route.params.sensorId}`
    //     );
    //     console.log('Method: POST');
    //     console.log('Headers:', {
    //       Authorization: `Bearer ${token}`,
    //       'X-CoPower-API': apiKey,
    //       'Content-Type': 'application/json',
    //     });

    //     const response = await axios.post(
    //       `${apiUrl}/measurements/${this.$route.params.id}/${this.$route.params.sensorId}`,
    //       {
    //         startTime: this.startTime,
    //         endTime: this.endTime,
    //       },
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //           'X-CoPower-API': apiKey,
    //           'Content-Type': 'application/json',
    //         },
    //       }
    //     );

    //     console.log('Response Status:', response.status);
    //     console.log('Response Headers:', response.headers);
    //     console.log('Response Data:', JSON.stringify(response.data, null, 2));

    //     this.measurements = response.data;
    //   } catch (error) {
    //     if (error.response) {
    //       console.error('Error Response Status:', error.response.status);
    //       console.error('Error Response Headers:', error.response.headers);
    //       console.error(
    //         'Error Response Data:',
    //         JSON.stringify(error.response.data, null, 2)
    //       );

    //       if (error.response.status === 400) {
    //         console.error(
    //           'Bad Request: Please check the request payload or parameters.'
    //         );
    //         alert(
    //           'Bad Request: Please check the selected date range or other input values.'
    //         );
    //       }
    //     } else if (error.request) {
    //       console.error(
    //         'No response received. Request details:',
    //         error.request
    //       );
    //     } else {
    //       console.log('som ting wong');
    //     }
    //   } finally {
    //     this.loading = false;
    //     this.dataFetched = true;
    //   }
    // },
    // //new one for visualization
    async fetchMeasurements(startTime, endTime) {
      this.showChart = true;
      this.loading = true;

      console.log(
        'Fetching from startTime:',
        startTime,
        'to endTime:',
        endTime
      );
      ///// remove later
      return;
      ////
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

        console.log('Making API Request...');
        console.log('Payload:', { startTime, endTime });

        const response = await axios.post(
          `${apiUrl}/measurements/${this.$route.params.id}/${this.$route.params.sensorId}`,
          {
            startTime,
            endTime,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-CoPower-API': apiKey,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Response Data:', response.data);
        this.measurements = response.data;
      } catch (error) {
        console.error('Error fetching measurements:', error);
      } finally {
        this.loading = false;
        this.dataFetched = true;
      }
    },

    //multiple fetch sensors
    // async fetchMeasurements(startTime, endTime) {
    //   this.showChart = true;
    //   this.loading = true;

    //   console.log(
    //     'Fetching from startTime:',
    //     startTime,
    //     'to endTime:',
    //     endTime
    //   );
    //   ///// remove later
    //   // return;
    //   ////
    //   try {
    //     const token = localStorage.getItem('jwtToken');
    //     const apiUrl = import.meta.env.VITE_API_URL;
    //     const apiKey = import.meta.env.VITE_API_KEY;

    //     if (!token || !apiUrl || !apiKey) {
    //       console.error(
    //         'Missing required configuration (token, API URL, or API key)'
    //       );
    //       return;
    //     }

    //     console.log('Making API Request...');
    //     console.log('Payload:', { startTime, endTime });

    //     const sensorEndpoints = [
    //       `${apiUrl}/measurements/${this.$route.params.id}/sensor1`,
    //       `${apiUrl}/measurements/${this.$route.params.id}/sensor2`,
    //       `${apiUrl}/measurements/${this.$route.params.id}/sensor3`,
    //       `${apiUrl}/measurements/${this.$route.params.id}/sensor4`,
    //     ];

    //     const responses = await Promise.allSettled(
    //       sensorEndpoints.map((endpoint) =>
    //         axios.post(
    //           endpoint,
    //           { startTime, endTime },
    //           {
    //             headers: {
    //               Authorization: `Bearer ${token}`,
    //               'X-CoPower-API': apiKey,
    //               'Content-Type': 'application/json',
    //             },
    //           }
    //         )
    //       )
    //     );
    //     this.measurements = responses
    //       .filter((res) => res.status === 'fulfilled')
    //       .map((res) => res.value.data);
    //     console.log('Fetched Measurements:', this.measurements);
    //   } catch (error) {
    //     console.error('Error fetching measurements:', error);
    //   } finally {
    //     this.loading = false;
    //     this.dataFetched = true;
    //   }
    // },

    //mock
    async fetchMeasurements(startTime, endTime) {
      this.showChart = true;
      this.loading = true;

      console.log(
        'Fetching from startTime:',
        startTime,
        'to endTime:',
        endTime
      );

      try {
        const token = localStorage.getItem('jwtToken');
        const apiUrl = import.meta.env.VITE_API_URL;
        const apiKey = import.meta.env.VITE_API_KEY;

        // if (!token) {
        //   console.error('Missing required configuration: token');
        //   return;
        // }

        if (!apiUrl) {
          console.error('Missing required configuration: API URL');
          return;
        }

        if (!apiKey) {
          console.error('Missing required configuration: API key');
          return;
        }

        console.log('Making API Request...');
        console.log('Payload:', { startTime, endTime });

        const sensorEndpoints = [
          `${apiUrl}/measurements/${this.$route.params.id}/sensor1`,
          `${apiUrl}/measurements/${this.$route.params.id}/sensor2`,
          `${apiUrl}/measurements/${this.$route.params.id}/sensor3`,
          `${apiUrl}/measurements/${this.$route.params.id}/sensor4`,
        ];

        const responses = await Promise.all(
          sensorEndpoints.map((endpoint) =>
            axios
              .post(
                endpoint,
                { startTime, endTime },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'X-CoPower-API': apiKey,
                    'Content-Type': 'application/json',
                  },
                }
              )
              .catch((error) => {
                console.error(`Error fetching data from ${endpoint}:`, error);
                return null; // Prevents `Promise.all` from failing completely
              })
          )
        );

        // Generate 24-hour mock data
        const generateMockData = () => {
          const now = new Date();
          return Array.from({ length: 24 }, (_, i) => {
            const time = new Date(now);
            time.setHours(now.getHours() - i);
            return {
              date: time.toISOString(), // ✅ Ensure correct field name & format
              value: (Math.random() * 100).toFixed(2),
            };
          }).reverse(); // Keep timestamps in ascending order
        };

        // Check if API responses are valid, otherwise use mock data
        this.measurements = responses.map((response, index) => {
          if (response && response.data) {
            return response.data;
          } else {
            console.warn(`Using mock data for sensor ${index + 1}`);
            return generateMockData();
          }
        });
      } catch (error) {
        console.error('Error fetching measurements:', error);
      } finally {
        this.loading = false;
        this.dataFetched = true;
      }
    },
  },
  mounted() {
    this.setRange('day');

    // Log the unit value for each sensor during the loop
    Object.keys(this.sensorUnits).forEach((sensor) => {
      console.log('Unit for sensor', sensor, ':', this.sensorUnits[sensor]);
    });
    Object.keys(this.sensorLabels).forEach((sensor) => {
      console.log('Labels for sensor', sensor, ':', this.sensorLabels[sensor]);
    });
  },
  // onMounted() {
  //   fetchMeasurements();
  // },
};
</script>
<style>
h2 {
  padding-top: 30px;
}
.sensor-detail {
  padding: 10px;
}
.sensor-chart-container {
  display: flex;
  flex-wrap: wrap; /* Allow the flex items to wrap onto a new line */
  gap: 16px; /* Space between charts */
}

.sensor-chart-container > * {
  flex-basis: calc(
    50% - 8px
  ); /* Ensure each chart takes 50% width minus the gap */
  box-sizing: border-box; /* Make sure the padding or border does not affect the width */
}

.btn {
  padding: 10px 20px;
  border: 1px solid #ccc;
  background-color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s;
}
.btn-active {
  background-color: #4abc67; /* Highlight color */
  color: white;
  border-color: #00b31b;
}
.btn:hover:not(.btn-active) {
  background-color: #ebf6e7;
  border-color: #00b31b;
}
.dropdown-container {
  display: flex;
  gap: 10px; /* Spacing between dropdowns */
  align-items: center;
}

select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  background: white;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: #007bff; /* Highlight on focus */
}
.sensor-chart-grid {
  display: grid;
  grid-template-columns: repeat(
    2,
    minmax(0, 1fr)
  ); /* Ensure charts shrink properly */
  gap: 10px;
  width: 100%;
  max-width: 100vw; /* Prevent overflow */
}

.sensor-chart-grid > * {
  width: 100%; /* Make sure charts fit inside grid */
  max-width: 500px; /* Set a reasonable max width */
  height: 250px; /* Adjust height as needed */
}
</style>
