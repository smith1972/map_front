<template>
  <div class="container">
    <div id="app">
      <MapFilter @filterOut="mapFilter" @buttonClick="buttonClick" />
      <Map ref="Map"></Map>
    </div>
  </div>
</template>

<script>
import MapFilter from './components/MapFilter.vue'
import Map from './components/Map.vue'

export default {
  name: 'App',
  components: {
    MapFilter,
    Map
  },
  methods: {
    mapFilter: function (data) {
      this.$refs.Map.filter(data)
    },
    buttonClick: function (data) {
      this.$refs.Map.pointers(data)
    }
  }
}
</script>

<style>
@import '~bootstrap/dist/css/bootstrap.css';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
