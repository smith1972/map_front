<template>
  <div id="map-filter">
    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar">
      <div class="btn-group mr-2" role="group" aria-label="Find group">
        <button v-for="(button, name, index) in buttons" type="button" :class="button.class" class="btn" :key="index" @click="buttonClick(name)">
          <span class="material-icons">{{ button.icon }}</span>
        </button>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-2">
        <select class="form-control" @change="highwaySelect">
          <option v-for="(highway, index) in highways" :key="index" :value="highway.id">{{ highway.name }}</option>
        </select>
      </div>
    </div>
    <!--<div class="col-2">
      <button class="btn btn-info" @click="buttonClick">Click</button>
    </div>-->

  </div>
</template>

<script>
  import $ from "jquery";
  import '@/assets/material-icons/material-icons.css'

  export default {
    name: 'MapFilter',
    data: function () {
      return {
        highways: [],
        buttons: {
          roads: {
            icon: 'timeline',
            class: 'btn-success'
          },
          address: {
            icon: 'place',
            class: 'btn-light'
          },
          points: {
            icon: 'touch_app',
            class: 'btn-light'
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
        console.log(source)
        //this.$emit('buttonClick', {})
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