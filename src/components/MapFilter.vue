<template>
  <div id="map-filter">
    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar">
      <div class="btn-group mr-2" role="group" aria-label="Find group">
        <button v-for="(button, name, index) in buttons" type="button" :class="button.class" class="btn" :key="index"
                @click="buttonClick(name)" :title="button.title">
          <font-awesome-icon :icon="button.icon" />
        </button>
      </div>
    </div>


    <div class="row mt-3" v-if="buttons.roads.class == 'btn-success'">
      <div class="col-2">
        <select class="form-control" @change="highwaySelect">
          <option v-for="(highway, index) in highways" :key="index" :value="highway.id">{{ highway.name }}</option>
        </select>
      </div>
    </div>


    <div class="row mt-3" v-if="buttons.address.class == 'btn-success'">
      <div class="col-1 text-right">Район</div>
      <div class="col-2">
        <select class="form-control" v-model="district_id">
          <option v-for="(district, index) in address.district" :key="index" :value="district.id">{{ district.name }}</option>
        </select>
      </div>
      <div class="col-1 text-right">Нас.пункт</div>
      <div class="col-2">
        <select class="form-control" v-model="addrCoordinates"   @change="addrSelect">
          <option v-for="(addr, index) in addrList" :key="index" :value="index">{{ addr.name }}, {{ addr.prefix }}</option>
        </select>
      </div>
    </div>

    <div class="row mt-3" v-if="buttons.quarry.class == 'btn-success'">
      <div class="col-1 text-right">Карьер</div>
      <div class="col-2">
        <select class="form-control" v-model="quarry"   @change="quarrySelect">
          <option v-for="(item, index) in quarries" :key="index" :value="index">{{ item.name }}, {{ item.address }}</option>
        </select>
      </div>
    </div>

  </div>
</template>

<script>
  import $ from "jquery";
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { faRoad, faMapMarkedAlt, faSnowplow } from '@fortawesome/free-solid-svg-icons'

  library.add(faRoad, faMapMarkedAlt, faSnowplow)

  export default {
    name: 'MapFilter',
    components: {
      FontAwesomeIcon
    },
    data: function () {
      return {
        highways: [],
        quarries: [],
        address: {
          district: [],
          list: []
        },
        district_id: 0,
        quarry: 0,
        addrCoordinates: [],
        buttons: {
          roads: {
            icon: faRoad.iconName,
            class: 'btn-success',
            title: 'Поиск дороги'
          },
          address: {
            icon: faMapMarkedAlt.iconName,
            class: 'btn-light',
            title: 'Поиск адреса'
          },
          quarry: {
            icon: faSnowplow.iconName,
            class: 'btn-light',
            title: 'Карьеры'
          },

        }
      }
    },
    computed: {
      addrList: function (){
        let res = [],
            districtId = this.district_id
        ;
        this.address.list.forEach(function (v){
          if (v.district == districtId) res.push(v)
        })
        return res;
      }
    },
    methods: {
      highwaySelect: function (e) {
        this.$emit('filterOut', {
          highway: e.target.value
        })
      },
      addrSelect: function (e) {
        this.$emit('addrSelectOut', {
          addr: this.addrList[e.target.value]
        })
      },
      quarrySelect: function (e) {
        this.$emit('addrSelectOut', {
          addr: {
            lat: this.quarries[e.target.value].coordinates[0][1],
            lon: this.quarries[e.target.value].coordinates[0][0]
          }
        })
      },
      buttonClick: function (source) {
        for (let button in this.buttons){
          this.buttons[button].class = button == source ? 'btn-success' : 'button-light'
        }
      }
    },
    mounted() {
      let $this = this
      $.ajax(process.env.VUE_APP_API_URL + 'road/list', {
        dataType: 'json',
        method: 'GET',
        mode: "no-cors",
      }).done(function (data) {
        $this.highways = data.data
      }).fail(function (data) {
        console.log('Oшибка получения данных: ' + data);
      });

      $.ajax(process.env.VUE_APP_API_URL + 'address', {
        dataType: 'json',
        method: 'GET',
        mode: "no-cors",
      }).done(function (data) {
        $this.address = data.data
      }).fail(function (data) {
        console.log('Oшибка получения данных: ' + data);
      });

      $.ajax(process.env.VUE_APP_API_URL + 'quarry', {
        dataType: 'json',
        method: 'GET',
        mode: "no-cors",
      }).done(function (data) {
        $this.quarries = data.data
        $this.$emit('quarriesData', $this.quarries)
      }).fail(function (data) {
        console.log('Oшибка получения данных: ' + data);
      });

    }
  }
</script>

<style>
    #map-filter{
        text-align: left;
        margin-bottom: 20px;
    }

    #map-filter .btn-toolbar button{
      color: blue;
      line-height: 1;
      line-height: 1;
    }
    #map-filter .btn-toolbar button.btn-success{
      color: yellow;
    }

</style>