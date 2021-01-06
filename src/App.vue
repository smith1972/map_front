<template>
  <div id="app">
    <Header/>
    <div class="container">
      <MapFilter @filterOut="mapFilter" @addrSelectOut="mapViewAddr" @quarriesData="mapViewQuarries"
                 @plantsData="mapViewPlants" @drsuSelectOut="mapViewDrsu" @pointsData="mapViewPoints"  />
      <Map ref="Map" @showSendSectionRoad="showSendSectionRoad"></Map>
    </div>
    <Footer/>
    <SendSectionRoad ref="SendSectionRoad" @sendSectionRoad="sendSectionRoad" />
    <Login/>
  </div>
</template>

<script>
import Header from './components/page/Header'
import Footer from "@/components/page/Footer";
import MapFilter from './components/MapFilter.vue'
import Map from './components/Map.vue'
import SendSectionRoad from "@/components/modal/SendSectionRoad";
import Login from "@/components/modal/Login";

export default {
  name: 'App',
  components: {
    SendSectionRoad,
    Login,
    Footer,
    Header,
    MapFilter,
    Map
  },
  methods: {
    mapFilter: function (data) {
      this.$refs.Map.filter(data)
    },
    mapViewAddr: function (data) {
      this.$refs.Map.viewAddr(data)
    },
    mapViewDrsu: function (data) {
      this.$refs.Map.viewDrsu(data)
    },
    mapViewQuarries: function (data){
      this.$refs.Map.viewQuarriesLayer(data)
    },
    mapViewPlants: function (data){
      this.$refs.Map.viewPlantsLayer(data)
    },
    mapViewPoints: function (data){
      this.$refs.Map.viewPointsLayer(data)
      //this.$refs.Map.viewEdges(data)
    },
    showSendSectionRoad: function (data){
      this.$refs.SendSectionRoad.show(data)
    },
    sendSectionRoad: function () {
      this.$refs.Map.sendedSectionRoad()
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
  color: #2c3e50;
}

#app .container{
  width: 90%;
  max-width: unset;
}

.error{
  color: red;
  font-size: 12px;
  font-style: italic;
  margin-top: 4px;
  font-weight: bold;
  display: none;
}

</style>
