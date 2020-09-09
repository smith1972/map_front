<template>
  <div class="container">
    <div id="app">
      <!--<MapFilter @filterOut="mapFilter" @buttonClick="buttonClick" />-->
      <Map ref="Map" @showBindName="showBindName"  />
      <BindName ref="BindName" @plantNameSelect="plantNameSelect" />
    </div>
  </div>
</template>

<script>

import $ from 'jquery'
//import MapFilter from './components/MapFilter.vue'
import Map from './components/Map.vue'
import BindName from "@/pages/editACP/components/BindName";

export default {
  name: 'App',
  data: function () {
    return {
      plant: 0,
      ext_id: 0,
      lon: 0,
      lat: 0,
      feature: 0
    }
  },
  components: {
    BindName,
    Map
  },
  methods: {
    mapFilter: function (data) {
      this.$refs.Map.filter(data)
    },
    buttonClick: function (data) {
      this.$refs.Map.pointers(data)
    },
    showBindName: function (data){
      console.log(data)
      this.lon = data.lon
      this.lat = data.lat
      this.feature = data.feature
      this.$refs.BindName.show({})
    },
    plantNameSelect: function (data){
      let $this = this
      this.ext_id = data.ext_id

      if (this.ext_id == -1){
        this.$refs.Map.nameSelect({
          ext_id: -1,
          feature: this.feature
        })
      }else{
        $.ajax(process.env.VUE_APP_API_URL + 'plant/update', {
          dataType: 'json',
          method: 'POST',
          mode: "no-cors",
          data: {
            ext_id: this.ext_id,
            lat: this.lat,
            lon: this.lon
          }
        }).done(function (data) {
          $this.$refs.Map.nameSelect({
            id: data.data.id,
            ext_id: $this.ext_id,
            feature: $this.feature
          })
        }).fail(function (data) {
          console.log('Oшибка получения данных: ' + data);
        });

      }
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
