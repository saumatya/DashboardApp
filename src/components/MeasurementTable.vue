<!-- MeasurementTable.vue -->
<template>
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
    <div v-else>No measurements available for the given period.</div>
  </template>
  
  <script>
  export default {
    props: {
      measurements: Array,
    },
  };
  </script>
  