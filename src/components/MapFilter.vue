<template>
    <div id="map-filter" class="row">
      <div class="col-2">
        <select class="form-control" @change="highwaySelect">
          <option v-for="(highway, index) in highways" :key="index" :value="highway">{{ highway }}</option>
        </select>
      </div>
      <div class="col-2">
        <button class="btn btn-info" @click="buttonClick">Click</button>
      </div>

    </div>
</template>

<script>
    export default {
        name: 'MapFilter',
        data: function () {
            return {
                highways: ['M1', 'M2', 'M3']
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
            fetch(process.env.VUE_APP_API_URL + '/get.php?do=names')
                .then(r => r.json())
                .then(json => {
                    this.highways = json
                })
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