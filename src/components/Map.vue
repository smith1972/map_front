<template>
  <div class="row">
    <div id="map" v-bind:class="mapClassObj" class="col-12">
      <tooltip :vals="tooltipData" v-show="tooltipShow" />
    </div>
  </div>
</template>

<script>
    import 'ol/ol.css';
    import {Map, View} from 'ol';
    import TileLayer from 'ol/layer/Tile';
    import XYZ from 'ol/source/XYZ';
    import {fromLonLat} from "ol/proj";
    import LineString from 'ol/geom/LineString';
    import Point from 'ol/geom/Point';
    import VectorLayer from 'ol/layer/Vector';
    import VectorSource from 'ol/source/Vector';
    import {Stroke, Style, Circle as CircleStyle, Fill} from 'ol/style';
    import Feature from 'ol/Feature';
    import Tooltip from "./Tooltip";
    import $ from "jquery";

    export default {
        name: 'Map',
        components: {Tooltip},
        data: function() {
            return {
              map: null,
              view: null,
              sourceHighway: new VectorSource(),
              sourceMillestone: new VectorSource(),
              sourceSelectedRoad: new VectorSource(),
              tooltipData: {
                  title: '',
                  message: '',
                  top: 200,
                  left: 100,
              },
              tooltipShow: false,
              mapClassObj: {
                'indicate-road': false
              }
            }
        },
        methods: {
            styles: function (type){
              if (type == 'millestone'){
                return new Style({
                  image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({color: 'black'}),
                    stroke: new Stroke({
                      color: 'white', width: 2
                    })
                  })
                })
              }else if (type == 'highway'){
                return new Style({
                  stroke: new Stroke({
                    color: '#666666',
                    width: 4
                  })
                })
              }else if (type == 'selectedRoad'){
                return new Style({
                  image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({color: 'white'}),
                    stroke: new Stroke({
                      color: 'red', width: 3
                    })
                  })
                })
              }

            },
            viewMilestonesLayer : function (milestones){
              let features = [];
              milestones.forEach(function (el) {
                features.push(new Feature({
                  id: el.n,
                  name: el.n + ' км',
                  type: 'millestone',
                  geometry: new Point(fromLonLat(el.p))
                }))
              })

              this.sourceMillestone.clear();
              this.sourceMillestone.addFeatures(features)
            },
            viewHighwayLayer: function (highwayData, points){
              let features = [],
                  i, j,
                  lat = parseFloat(points[0].nodes[0][1]),
                  lon = parseFloat(points[0].nodes[0][0])

              for (i = 0; i < points.length; i++){
                for (j = 0; j < points[i].nodes.length - 1; j++) {
                  features.push(
                      new Feature({
                        title: highwayData.name + '   ' + i + ':' + j,
                        name: points[i].tags.name,
                        type: 'road',
                        geometry: new LineString(
                            [
                              fromLonLat(points[i].nodes[j]),
                              fromLonLat(points[i].nodes[j + 1])
                            ]
                        )
                      })
                  )
                }
              }
              i--;
              lat = (lat + parseFloat(points[i].nodes[j][1])) / 2;
              lon = (lon + parseFloat(points[i].nodes[j][0])) / 2;

              this.sourceHighway.clear()
              this.sourceHighway.addFeatures(features)
              this.view.setCenter(fromLonLat([lon, lat]))
            },
            filter: function (data){
              let $this = this;
              $.ajax(process.env.VUE_APP_API_URL + 'road/' + data.highway + '/points', {
                dataType: 'json',
                method: 'GET',
                mode: "no-cors",
              }).done(function (data) {

                $this.viewHighwayLayer(data.data.highway, data.data.road)
                $this.viewMilestonesLayer(data.data.milestones)


              }).fail(function (data) {
                console.log('Oшибка получения данных: ' + data);
              });

            }
        },
        mounted() {
            const $this = this;

            this.view = new View({
                center: fromLonLat([28.2, 54]),
                zoom: 14
            })

            let map = new Map({
                target: 'map',
                layers: [
                  new TileLayer({
                      source: new XYZ({
                          url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                      })
                  }),
                  new VectorLayer({
                    source: this.sourceHighway,
                    style: this.styles('highway')
                  }),
                  new VectorLayer({
                    source: this.sourceMillestone,
                    style: this.styles('millestone')
                  })
                ],
                view: this.view
            });

            let displayFeatureInfo = function(pixel) {
                let feature = map.forEachFeatureAtPixel(pixel, function(feature) {
                    return feature;
                });
                if (feature) {
                  $this.tooltipData = {
                      title: feature.get('title'),
                      message: feature.get('name'),
                      left: pixel[0],
                      top: pixel[1] - 30
                  }
                  $this.tooltipShow = true
                }else{
                  $this.tooltipShow = false
                }
            };

            let mouseCursorType = function (pixel){
              $this.mapClassObj["indicate-road"] = map.forEachFeatureAtPixel(pixel, function(feature) {
                return feature.get('type') == 'road'
              });
            }

            map.on('pointermove', function(evt) {
              if (evt.dragging) {
                  return;
              }
              displayFeatureInfo(map.getEventPixel(evt.originalEvent));
              mouseCursorType(map.getEventPixel(evt.originalEvent));
            });
            /*
            map.on('click', function(evt) {
                displayFeatureInfo(evt.pixel);
            });
             */
            this.map = map;
        }
    }
</script>

<style scoped>
    #map {
        height: 800px;
        position: relative;
    }

    #map.indicate-road{
      cursor: cell;
    }

</style>