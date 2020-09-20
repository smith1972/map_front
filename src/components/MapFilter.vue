<template>
  <div id="map-filter">
    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar">
      <div class="btn-group mr-2" role="group" aria-label="Find group">
        <button v-for="(button, name, index) in buttons" type="button" :class="button.class" class="btn" :key="index"
                @click="buttonClick(name)" :title="button.title">
          <component v-bind:is="button.icon"  :title="button.title" />
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

  </div>
</template>

<script>
  import $ from "jquery";
  import LocationEnter from 'vue-material-design-icons/LocationEnter';
  import Road from 'vue-material-design-icons/Road';

  export default {
    name: 'MapFilter',
    components: {
      Road,
      LocationEnter
    },
    data: function () {
      return {
        highways: [],
        buttons: {
          roads: {
            icon: 'road',
            class: 'btn-success',
            title: 'Поиск дороги'
          },
          address: {
            icon: 'location-enter',
            class: 'btn-light',
            title: 'Поиск адреса'
          },

        }
      }
    },
    methods: {
      highwaySelect: function (e) {
        this.$emit('filterOut', {
          highway: e.target.value
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