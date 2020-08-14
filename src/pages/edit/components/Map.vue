<template>
  <div class="row">
    <div id="map" class="col-12">
      <tooltip :vals="tooltipData" v-show="tooltipShow">{{ tooltipMessage }}</tooltip>
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
    import iconPit from '@/assets/pit.png';
    import VectorLayer from 'ol/layer/Vector';
    import VectorSource from 'ol/source/Vector';
    import Style from 'ol/style/Style';
    import Tooltip from "./Tooltip";
    import Point from "ol/geom/Point";
    import Feature from 'ol/Feature'
    import {Draw, Modify, Snap} from 'ol/interaction';

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
        mounted() {
          let features = [];

          this.styles = new Style({
            image: new Icon({
              anchor: [0.5, 46],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              src: iconPit
            })
          })

          features.push(
              new Feature({
                name: 'АБЗ 1',
                geometry: new Point(fromLonLat([28.2, 54])),
                style: this.styles
              })
          )
          features.push(
              new Feature({
                name: 'АБЗ 2',
                geometry: new Point(fromLonLat([29.2, 54])),
                style: this.styles
              })
          )

          features.push(
              new Feature({
                name: 'АБЗ 3',
                geometry: new Point(fromLonLat([28.2, 55])),
                style: this.styles
              })
          )

          features.push(
              new Feature({
                name: 'АБЗ 4',
                geometry: new Point(fromLonLat([28.2, 53])),
                style: this.styles
              })
          )


          this.view = new View({
                center: fromLonLat([28.2, 54]),
                zoom: 14
            })

            this.source = new VectorSource({
              features: features
            });
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

            let coordinates = geometry.getCoordinates();
            console.log(toLonLat(coordinates))
          })

          this.map = map;
        }
    }
</script>

<style scoped>
    #map {
        height: 800px;
        position: relative;
    }

</style>