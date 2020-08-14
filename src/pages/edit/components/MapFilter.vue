<template>
    <div id="map-filter" class="row">
      <div class="col-2">
        <button class="btn btn-info" @click="buttonClick" data-type="1">АБЗ</button>
      </div>
      <div class="col-2">
        <button class="btn btn-info" @click="buttonClick" data-type="2">Карьер</button>
      </div>

    </div>
</template>

<script>
    export default {
        name: 'MapFilter',
        methods: {
            buttonClick: function () {
                this.$emit('buttonClick', {})
            }
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