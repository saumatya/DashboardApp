<template>
  <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script>
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

export default {
  name: 'LineChart',
  components: { Line },
  props: {
    unit: {
      type: String,
      required: true,
      default: 'N/A',
    },
    label: {
      type: String,
      required: true,
    },
    measurements: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    console.log('SensorChart Mounted');
    console.log('Unit passed:', this.unit); // Log the unit passed to the component
    console.log('Label passed:', this.label); // Log the label passed to the component

    this.chartOptions.scales.y.title.text = this.unit; // Dynamically set the Y-axis title
  },
  watch: {
    // Watch for changes in the measurements prop and update the chart data
    measurements: {
      immediate: true,
      handler(newMeasurements) {
        if (newMeasurements && newMeasurements.length > 0) {
          this.updateChartData(newMeasurements);
        }
      },
    },
  },
  data() {
    return {
      chartData: {
        labels: [], // Dates will go here
        datasets: [
          {
            label: this.label,
            data: [], // Values will go here
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            tension: 0.4, // Smooth curve for the line
            fill: false, // Do not fill under the line
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: '',
            },
          },
        },
      },
    };
  },
  mounted() {
    console.log('Unit passed to LineChart:', this.unit);
    this.chartOptions.scales.y.title.text = this.unit; // Dynamically set the Y-axis title
  },
  methods: {
    updateChartData(measurements) {
      // Extract dates and values from the measurements array
      const labels = measurements.map((item) =>
        new Date(item.date).toLocaleString()
      );
      const data = measurements.map((item) => item.value);

      // Update the chart data
      this.chartData.labels = labels;
      this.chartData.datasets[0].data = data;
    },
  },
};
</script>
<style>
#my-chart-id {
  height: 400px;
}
</style>
