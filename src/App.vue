<template>
  <div id="app">
    <Header/>
    <div class="container">
      <MapFilter @filterOut="mapFilter" />
      <Map ref="Map" @showSendSectionRoad="showSendSectionRoad"></Map>
    </div>
    <Footer/>
    <SendSectionRoad ref="SendSectionRoad" @sendSectionRoad="sendSectionRoad" />
  </div>
</template>

<script>
import Header from './components/page/Header'
import Footer from "@/components/page/Footer";
import MapFilter from './components/MapFilter.vue'
import Map from './components/Map.vue'
import SendSectionRoad from "@/components/modal/SendSectionRoad";

export default {
  name: 'App',
  components: {
    SendSectionRoad,
    Footer,
    Header,
    MapFilter,
    Map
  },
  methods: {
    mapFilter: function (data) {
      this.$refs.Map.filter(data)
    },
    showSendSectionRoad: function (data){
      this.$refs.SendSectionRoad.show(data)
    },
    sendSectionRoad: function (data) {
      this.$refs.Map.sendedSectionRoad(data)
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

</style>
