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
      default: 'N/A',
    },
    measurements: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    console.log('SensorChart Mounted');
    console.log('Unit passed:', this.unit);
    console.log('Label passed:', this.label);

    this.chartOptions.scales.y.title.text = this.unit;
  },
  watch: {
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
        labels: [],
        datasets: [
          {
            label: this.label,
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            tension: 0.4,
            fill: false,
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
              text: this.unit,
            },
          },
        },
      },
    };
  },
  mounted() {
    console.log('Unit passed to LineChart:', this.unit);
    this.chartOptions.scales.y.title.text = this.unit;
  },
  methods: {
    updateChartData(measurements) {
      const labels = measurements.map((item) =>
        new Date(item.date).toLocaleString()
      );
      const data = measurements.map((item) => item.value);

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
