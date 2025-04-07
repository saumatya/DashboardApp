<template>
  <div v-if="loading">Loading...</div>
  <div v-else class="sensor-detail">
    <!-- <h6>Organization ID: {{ $route.params.id }} </h6> 
      -->
    <!-- <h6>Sensor ID:  {{ $route.params.sensorId }}</h6>    -->
    <h2>{{ $route.query.sensorName }}</h2>
    <h3>Sensor Measurements</h3>

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
        v-for="(measurement, index) in measurements"
        :key="index"
        v-if="showChart"
        :measurements="measurement"
        :unit="sensorDetails[index].unit"
        :label="sensorDetails[index].name"
      />

      <!-- :unit="sensorUnits[sensor]"
      :label="sensorLabels[sensor]" -->
    </div>

    <!-- <div v-else-if="dataFetched && measurements.length === 0">
        <p>No measurements available for the given period.</p>
      </div> -->
    <!-- <SensorChart :measurements="measurements"/> -->
    <div v-if="measurements.length > 0">
      <!-- <table class="measurements-table">
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
      </table> -->
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
      sensorNames: [],
      sensorUnits: [],
      measurements: {},
      sensorDetails: [],
      // sensorUnits: {
      //   sensor1: '°C',
      //   sensor2: 'Pa',
      //   sensor3: 'm/s',
      //   sensor4: 'ppm',
      // },
      // sensorLabels: {
      //   temperature: 'Temperature',
      //   humidity: 'WindSpeed',
      //   pressure: 'Cloudiness',
      //   power: 'Spot Electricity Prices',
      // },

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
    getJwtClaims(token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = atob(base64);
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error('Invalid token', error);
        return null;
      }
    },
    onMonthOrYearChange() {
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

      this.fetchMeasurements(startTime, endTime);
    },
    setRange(range) {
      this.selectedRange = range;
      console.log('Selected Range:', range);
      const now = new Date();
      let startTime, endTime;

      if (range === 'day') {
        // startTime = new Date(now.setHours(0, 0, 0, 0)).toISOString(); // Start of today
        // endTime = new Date(now.setHours(23, 59, 59, 999)).toISOString(); // End of today
        //hardcoded
        startTime = new Date('2024-10-01T00:00:00').toISOString(); // Start of October 1, 2024
        endTime = new Date('2024-10-01T23:59:59.999').toISOString(); // End of October 1, 2024
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
        console.log('Custom range selected. Waiting for user to select dates.');
        return;
      }

      this.fetchMeasurements(startTime, endTime);
    },

    ///anohter
    async fetchMeasurements(startTime, endTime) {
      this.showChart = true;
      this.loading = true;

      try {
        const token = localStorage.getItem('jwtToken');
        let orgid;
        if (token) {
          orgid = this.getJwtClaims(token).organisation;
        } else {
          console.log('No token found');
        }
        // const orgid = this.getJwtClaims(token).organisation;
        const apiUrl = import.meta.env.VITE_API_URL + '/dashboard/api';
        const apiKey = import.meta.env.VITE_API_KEY;

        if (!token || !apiUrl || !apiKey) {
          console.error(
            'Missing required configuration (token, API URL, or API key)'
          );
          return;
        }

        console.log('Making API Request...');
        console.log('Payload:', { startTime, endTime });

        //not required fetched from claims
        // const orgRes = await axios.get(`${apiUrl}/organisation/list`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     'X-CoPower-API': apiKey,
        //     'Content-Type': 'application/json',
        //   },
        // });

        // if (!orgRes.data || orgRes.data.length === 0) {
        //   console.error('No organisations found.');
        //   return;
        // }

        console.log('Org ID:', orgid);

        const sensorRes = await axios.get(`${apiUrl}/sensor/${orgid}/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-CoPower-API': apiKey,
            'Content-Type': 'application/json',
          },
        });

        if (!sensorRes.data || sensorRes.data.length === 0) {
          console.error('No sensors found for the organisation.');
          return;
        }

        // const sensorEndpoints = sensorRes.data.map((sensor) => {
        //   return `${apiUrl}/measurements/${orgid}/${sensor.token}`;
        // });

        // Directly map the sensors to endpoints, including name and unit
        this.sensorDetails = sensorRes.data.map((sensor) => ({
          endpoint: `${apiUrl}/measurements/${orgid}/${sensor.token}`,
          name: sensor.name,
          unit: sensor.unit,
        }));

        // const fetchWithRetry = async (endpoint, retries = 3, delay = 1000) => {
        //   try {
        //     const res = await axios.post(
        //       endpoint,
        //       { startTime, endTime },
        //       {
        //         headers: {
        //           Authorization: `Bearer ${token}`,
        //           'X-CoPower-API': apiKey,
        //           'Content-Type': 'application/json',
        //         },
        //       }
        //     );
        //     return res.data;
        //   } catch (error) {
        //     if (retries > 0) {
        //       console.warn(
        //         `Request failed, retrying... (${retries} retries left)`
        //       );
        //       await new Promise((resolve) => setTimeout(resolve, delay));
        //       return fetchWithRetry(endpoint, retries - 1, delay * 2);
        //     } else {
        //       console.error(`Failed after multiple retries: ${error}`);
        //       return null;
        //     }
        //   }
        // };

        const fetchData = async (endpoint) => {
          try {
            const res = await axios.post(
              endpoint,
              { startTime, endTime },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'X-CoPower-API': apiKey,
                  'Content-Type': 'application/json',
                },
              }
            );
            return res.data;
          } catch (error) {
            console.error(`Request failed: ${error}`);
            return null;
          }
        };

        const responses = await Promise.allSettled(
          this.sensorDetails.map((sensor) => fetchData(sensor.endpoint))
        );

        responses.forEach((response, index) => {
          if (response.status === 'fulfilled') {
            console.log(
              `Sensor ${index} data fetched successfully:`,
              response.value
            );
          } else {
            console.error(
              `Sensor ${index} failed to fetch data:`,
              response.reason
            );
          }
        });

        // const responses = await Promise.allSettled(
        //   sensorDetails.map((sensor) => fetchWithRetry(sensor.endpoint))
        // );

        this.measurements = responses
          .filter((res) => res.status === 'fulfilled' && res.value)
          .map((res) => res.value);

        // this.measurements = responses
        //   .filter((res) => res.status === 'fulfilled' && res.value)
        //   .map((res, index) => ({
        //     ...res.value,
        //     name: sensorDetails[index].name, // Add the sensor name
        //     unit: sensorDetails[index].unit, // Add the sensor unit
        //   }));

        // this.measurements = responses
        //   .filter((res) => res.status === 'fulfilled' && res.value)
        //   .map((res, index) => {
        //     const measurement = {
        //       ...res.value,
        //       name: sensorDetails[index].name, // Add the sensor name for other purposes
        //       unit: sensorDetails[index].unit, // Add the sensor unit for other purposes
        //     };

        //     //
        //     console.log(measurement);

        //     return measurement;
        //   });

        console.log('Fetched Measurements:', this.measurements);
      } catch (error) {
        console.error('Error fetching measurements:', error);
      } finally {
        this.loading = false;
        this.dataFetched = true;
      }
    },
  },
  mounted() {
    // Log the unit value for each sensor during the loop
    // Object.keys(this.sensorUnits).forEach((sensor) => {
    //   console.log('Unit for sensor', sensor, ':', this.sensorUnits[sensor]);
    // });
    // Object.keys(this.sensorLabels).forEach((sensor) => {
    //   console.log('Labels for sensor', sensor, ':', this.sensorLabels[sensor]);
    // });
    this.setRange('day');
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
  flex-wrap: wrap;
  gap: 16px;
}

.sensor-chart-container > * {
  flex-basis: calc(50% - 8px);
  box-sizing: border-box;
}

.btn {
  padding: 10px 20px;
  border: 1px solid #ccc;
  background-color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s;
}
.btn-active {
  background-color: #4abc67;
  color: white;
  border-color: #00b31b;
}
.btn:hover:not(.btn-active) {
  background-color: #ebf6e7;
  border-color: #00b31b;
}
.dropdown-container {
  display: flex;
  gap: 10px;
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
  border-color: #007bff;
}
.sensor-chart-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  width: 100%;
  max-width: 100vw;
}

.sensor-chart-grid > * {
  width: 100%;
  max-width: 500px;
  height: 250px;
}
</style>
