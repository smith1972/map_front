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
        <select class="form-control" @change="highwaySelect" v-model="highway">
          <option v-for="(highway, index) in highways" :key="index" :value="highway.id">{{ highway.name }}</option>
        </select>
      </div>
      <div class="col-3">
        <button type="button" class="btn btn-light" @click="rotateRoad">
          <font-awesome-icon :icon="rotateButton.icon" :title="rotateButton.title" /> {{ rotateButton.title }}
        </button>
      </div>
      <div class="col-3">
        <button type="button" class="btn btn-light" @click="startRoad">
          <font-awesome-icon :icon="startRoadButton.icon" :title="startRoadButton.title" /> {{ startRoadButton.title }}
        </button>
      </div>
      <div class="col-3">
        <button type="button" class="btn btn-light" @click="shortestWay">
          Кратчайший путь
        </button>
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

    <div class="row mt-3" v-if="buttons.plant.class == 'btn-success'">
      <div class="col-1 text-right">Завод</div>
      <div class="col-2">
        <select class="form-control" v-model="plant"   @change="plantSelect">
          <option v-for="(item, index) in plants" :key="index" :value="index">{{ item.name }}, {{ item.address }}</option>
        </select>
      </div>
    </div>

    <div class="row mt-3" v-if="buttons.drsu.class == 'btn-success'">
      <div class="col-1 text-right">ДРСУ</div>
      <div class="col-2">
        <select class="form-control" v-model="drsu"   @change="drsuSelect">
          <option v-for="(item, index) in drsuList" :key="index" :value="index">{{ item.name }}</option>
        </select>
      </div>
    </div>

  </div>
</template>

<script>
  import $ from "jquery";
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { faRoad, faMapMarkedAlt, faSnowplow, faIndustry, faExchangeAlt, faBuilding, faBookmark } from '@fortawesome/free-solid-svg-icons'
  import GetMapData from "@/classes/GetMapData";

  library.add(faRoad, faMapMarkedAlt, faSnowplow, faIndustry, faExchangeAlt, faBuilding, faBookmark)

  export default {
    name: 'MapFilter',
    components: {
      FontAwesomeIcon
    },
    data: function () {
      return {
        highways: [],
        quarries: [],
        plants: [],
        drsuList: [],
        address: {
          district: [],
          list: []
        },
        highway: 0,
        district_id: 0,
        quarry: 0,
        plant: 0,
        drsu: 0,
        addrCoordinates: [],
        rotateButton: {
          icon: faExchangeAlt.iconName,
          class: 'btn-light',
          title: 'Изменить направление'
        },
        startRoadButton: {
          icon: faBookmark.iconName,
          class: 'btn-light',
          title: 'Начало дороги'
        },
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
          plant: {
            icon: faIndustry.iconName,
            class: 'btn-light',
            title: 'Заводы'
          },
          drsu: {
            icon: faBuilding.iconName,
            class: 'btn-light',
            title: 'ДРСУ'
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
      highwaySelect: function () {
        this.$emit('filterOut', {
          highway: this.highway
        })
      },
      addrSelect: function (e) {
        this.$emit('addrSelectOut', {
          addr: this.addrList[e.target.value]
        })
      },
      drsuSelect: function (e) {
        this.$emit('drsuSelectOut', {
          drsu: this.drsuList[e.target.value]
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
      plantSelect: function (e) {
        this.$emit('addrSelectOut', {
          addr: {
            lat: this.plants[e.target.value].coordinates[1],
            lon: this.plants[e.target.value].coordinates[0]
          }
        })
      },
      buttonClick: function (source) {
        for (let button in this.buttons){
          this.buttons[button].class = button == source ? 'btn-success' : 'button-light'
        }
        if (source == 'quarry'){
          this.$emit('quarriesData', this.quarries)
        }
        if (source == 'plant'){
          this.$emit('plantsData', this.plants)
        }
      },
      rotateRoad: function ()
      {
        if (!confirm('Изменить начало дороги ?')) {
          return
        }
        let $this = this
        $.ajax(process.env.VUE_APP_API_URL + 'road/rotate', {
          dataType: 'json',
          method: 'POST',
          mode: "no-cors",
          data: {
            id: this.highway,
          }
        }).done(function (data) {
          if (data.success == '1'){
            $this.highwaySelect()
          }else{
            alert(data.message)
          }
        }).fail(function (data) {
          console.log('Oшибка получения данных: ' + data);
        });
      },
      startRoad: function ()
      {
        let meter = prompt('Введите дистанцию в метрах, с которой начинается отображение дороги:', '0');
        if (meter == null) {
          return
        }
        meter = parseInt(meter.trim())
        if (isNaN(meter)){
          alert('Некорректное число.')
          return
        }

        let $this = this
        $.ajax(process.env.VUE_APP_API_URL + 'road/start', {
          dataType: 'json',
          method: 'POST',
          mode: "no-cors",
          data: {
            id: this.highway,
            start: meter
          }
        }).done(function (data) {
          if (data.success == '1'){
            $this.highwaySelect()
          }else{
            alert(data.message)
          }
        }).fail(function (data) {
          console.log('Oшибка получения данных: ' + data);
        });
      },
      shortestWay: function (){
        let getMapData = new GetMapData()
        getMapData.receive('graph', (data) => {
          this.$emit('pointsData', data.data)
        })
      }

    },
    mounted() {
      let getMapData = new GetMapData()

      getMapData.receive('road/list', (data) => {this.highways = data.data})
      getMapData.receive('address', (data) => {this.address = data.data})
      getMapData.receive('quarry', (data) => {
        this.quarries = data.data
        this.$emit('quarriesData', this.quarries)
      })
      getMapData.receive('plant', (data) => {
        this.plants = data.data
        this.$emit('plantsData', this.plants)
      })
      getMapData.receive('drsu', (data) => {this.drsuList = data.data})

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