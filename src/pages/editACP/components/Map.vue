<template>
  <div class="row">
    <div id="map" class="col-12">
      <tooltip :vals="tooltipData" v-show="tooltipShow" />
    </div>
  </div>
</template>

<script>
    import 'ol/ol.css';
    import {Map, View} from 'ol';
    import TileLayer from 'ol/layer/Tile';
    import XYZ from 'ol/source/XYZ';
    import {fromLonLat, toLonLat} from "ol/proj";
    import Icon from 'ol/style/Icon';
    import iconPlant from '@/assets/plant.png';
    import VectorLayer from 'ol/layer/Vector';
    import VectorSource from 'ol/source/Vector';
    import Style from 'ol/style/Style';
    import Tooltip from "@/components/Tooltip";
    import Point from "ol/geom/Point";
    import Feature from 'ol/Feature'
    import {Draw, Modify, Snap} from 'ol/interaction';
    import $ from "jquery";

    export default {
        name: 'Map',
        components: {Tooltip},
        data: function() {
            return {
                map: null,
                view: null,
                vector: null,
                styles: null,
                source: null,
                tooltipData: {
                    title: '',
                    top: 200,
                    left: 100,
                },
                tooltipMessage: '',
                tooltipShow: false,
            }
        },
        methods: {
          nameSelect: function (data){
            let feature = this.source.getFeatureById(data.feature)
            if (data.ext_id < 0){
              this.source.removeFeature(feature)
            }else{
              feature.setId(data.id)
            }
          }
        },
        mounted() {
          let $this = this;

          this.styles = new Style({
            image: new Icon({
              anchor: [0.5, 46],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              src: iconPlant
            })
          })

          this.view = new View({
                center: fromLonLat([28.2, 54]),
                zoom: 14
            })
          this.source = new VectorSource({});


          this.vector = new VectorLayer({
              source: this.source,
              style: this.styles
          })

          let map = new Map({
              target: 'map',
              layers: [
                  new TileLayer({
                      source: new XYZ({
                          url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                      })
                  }),
                  this.vector
              ],
              view: this.view
          });

          let modify = new Modify({source: this.source});
          map.addInteraction(modify);

          let draw = new Draw({
            source: this.source,
            type: 'Point',
          });
          map.addInteraction(draw);
          let snap = new Snap({source: this.source});
          map.addInteraction(snap);

          draw.on('drawend', function (e){
            let geometry = e.feature.getGeometry();
            if (!(geometry instanceof Point)) return;

            e.feature.setId(999999)
            let coordinates = geometry.getCoordinates();
            let lonlat = toLonLat(coordinates)

            $this.$emit('showBindName',
                {
                  lon: lonlat[0],
                  lat: lonlat[1],
                  feature: e.feature.getId()
                }
            )
          })

          let displayFeatureInfo = function(pixel) {
            let feature = map.forEachFeatureAtPixel(pixel, function(feature) {
              return feature;
            });
            if (feature instanceof Feature) {
              if ($this.tooltipMessage != undefined){
                $this.tooltipData = {
                  title: '',
                  message: feature.get('name'),
                  left: pixel[0],
                  top: pixel[1] - 30
                }
                $this.tooltipShow = true
              }else{
                $this.tooltipShow = false
              }

            }else{
              $this.tooltipShow = false
            }
          };

          map.on('pointermove', function(evt) {
            if (evt.dragging) {
              return;
            }
            displayFeatureInfo(map.getEventPixel(evt.originalEvent));
          });

          map.on('click', function(evt) {
            displayFeatureInfo(evt.pixel);
          });

          this.map = map;

          $.ajax(process.env.VUE_APP_API_URL + 'plant/list', {
            dataType: 'json',
            method: 'GET',
            mode: "no-cors",
          }).done(function (data) {
            if (data.data.length == 0) return;
            let plants = data.data;
            let i;
            for (i = 0; i < plants.length; i++){
              $this.source.addFeature(
                  new Feature({
                    id: plants[i].id,
                    name: plants[i].name,
                    geometry: new Point(fromLonLat([plants[i].lon, plants[i].lat])),
                    style: $this.styles
                  })
              )
            }
          }).fail(function (data) {
            console.log('Oшибка получения данных: ' + data);
          });

        }
    }
</script>

<style scoped>
    #map {
        height: 800px;
        position: relative;
    }

</style>