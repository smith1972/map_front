<template>
    <div id="map-filter" class="row">
      <div class="col-2">
        <select class="form-control" @change="highwaySelect">
          <option v-for="(highway, index) in highways" :key="index" :value="highway.id">{{ highway.name }}</option>
        </select>
      </div>
      <!--<div class="col-2">
        <button class="btn btn-info" @click="buttonClick">Click</button>
      </div>-->

    </div>
</template>

<script>
    import $ from "jquery";

    export default {
        name: 'MapFilter',
        data: function () {
            return {
                highways: []
            }
        },
        methods: {
            highwaySelect: function (e) {
                this.$emit('filterOut', {
                  highway: e.target.value
                })
            },
            buttonClick: function () {
                this.$emit('buttonClick', {})
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
    #map-filter button{
        margin: 0 20px;
    }
</style>