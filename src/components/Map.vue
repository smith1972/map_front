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
    import {fromLonLat, toLonLat} from "ol/proj";
    import LineString from 'ol/geom/LineString';
    import Point from 'ol/geom/Point';
    import VectorLayer from 'ol/layer/Vector';
    import VectorSource from 'ol/source/Vector';
    import {Stroke, Style, Circle as CircleStyle, Fill} from 'ol/style';
    import Feature from 'ol/Feature';
    import Tooltip from "./Tooltip";
    import $ from "jquery";
    import {getLength} from 'ol/sphere';

    export default {
        name: 'Map',
        components: {Tooltip},
        data: function() {
            return {
              map: null,
              view: null,
              sources: {
                road: new VectorSource(),
                millestone: new VectorSource(),
                selectedPointOnRoad: new VectorSource(),
                selectedRoad: new VectorSource(),
              },
              tooltipData: {
                  title: '',
                  message: '',
                  top: 200,
                  left: 100,
              },
              tooltipShow: false,
              mapClassObj: {
                'indicate-road': false
              },
              selectedRoadLength: 0
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
              }else if (type == 'road'){
                return new Style({
                  stroke: new Stroke({
                    color: '#666666',
                    width: 4
                  })
                })
              }else if (type == 'selectedPointOnRoad'){
                return new Style({
                  image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({color: 'white'}),
                    stroke: new Stroke({
                      color: 'red', width: 3
                    })
                  })
                })
              }else if (type == 'selectedRoad'){
                return new Style({
                  stroke: new Stroke({
                    color: 'red',
                    width: 6
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
                  type: 'milestone',
                  geometry: new Point(fromLonLat(el.p))
                }))
              })

              this.sources.millestone.clear();
              this.sources.millestone.addFeatures(features)
            },
            viewRoadLayer: function (highwayData, points){
              let features = [],
                  i, j,
                  lat = parseFloat(points[0].nodes[0][1]),
                  lon = parseFloat(points[0].nodes[0][0])

              let cnt = 0;
              for (i = 0; i < points.length; i++){
                for (j = 0; j < points[i].nodes.length - 1; j++) {
                  let feature = new Feature({
                    title: highwayData.name,
                    name: points[i].tags.name,
                    type: 'road',
                    geometry: new LineString(
                        [
                          fromLonLat(points[i].nodes[j]),
                          fromLonLat(points[i].nodes[j + 1])
                        ]
                    )
                  })
                  feature.setId(cnt)
                  features.push(feature)
                  cnt++;
                }
              }
              i--;
              lat = (lat + parseFloat(points[i].nodes[j][1])) / 2;
              lon = (lon + parseFloat(points[i].nodes[j][0])) / 2;

              this.sources.road.clear()
              this.sources.selectedRoad.clear()
              this.sources.selectedPointOnRoad.clear()
              this.selectedRoadLength = 0
              this.sources.road.addFeatures(features)
              this.view.setCenter(fromLonLat([lon, lat]))
            },
            sendedSectionRoad: function (data){
              console.log(data)
              this.sources.selectedRoad.clear()
              this.sources.selectedPointOnRoad.clear()
              this.selectedRoadLength = 0
            },
            viewSelectedRoad: function (pixel){
              let features = this.sources.selectedPointOnRoad.getFeatures();
              if (features.length == 0) return
              if (features.length == 1 && !this.mapClassObj["indicate-road"]) return

              let point1 = {
                  id: features[0].get('section'),
                  coordinates: features[0].getGeometry().getCoordinates()
                },
                point2 = {
                  id: -1,
                  coordinates: []
                }
              if (features.length == 2){
                point2 = {
                  id: features[1].get('section'),
                  coordinates: features[1].getGeometry().getCoordinates()
                }
              }else{
                let feature2 = this.map.forEachFeatureAtPixel(pixel, function(feature) {
                  if (feature.get('type') == 'road') return feature
                });
                point2 = {
                  id: feature2.getId(),
                  coordinates: this.map.getCoordinateFromPixel(pixel)
                }
              }
              this.drawSelectedRoad(point1, point2)
            },
            drawSelectedRoad: function (point1, point2){
              let i
              this.sources.selectedRoad.clear();
              if (point1.id == point2.id){
                this.sources.selectedRoad.addFeature(new Feature({
                  type: 'selectedRoad',
                  geometry: new LineString([point1.coordinates, point2.coordinates])
                }))
                return
              }

              let roadFeatures = this.sources.road.getFeatures();
              roadFeatures.sort(function (a, b){
                if (a.getId() < b.getId()) return -1
                return 1
              })
              if (point1.id > point2.id){
                let point = point2
                point2 = point1
                point1 = point
              }

              let coordinates = roadFeatures[point1.id].getGeometry().getCoordinates()
              let polyline = []
              polyline.push([point1.coordinates, coordinates[1]])
              for (i = point1.id + 1;i < point2.id; i++){
                polyline.push(roadFeatures[i].getGeometry().getCoordinates())
              }
              coordinates = roadFeatures[point2.id].getGeometry().getCoordinates()
              polyline.push([coordinates[0], point2.coordinates])

              for (i = 0; i < polyline.length; i++){
                this.sources.selectedRoad.addFeature(new Feature({
                  type: 'selectedRoad',
                  geometry: new LineString(polyline[i])
                }))
              }
              this.getSelectedRoadLength();
            },
            getSelectedRoadLength: function (){
              let $this = this,
                  lines = this.sources.selectedRoad.getFeatures()
              $this.selectedRoadLength = 0
              lines.forEach(function (line) {
                $this.selectedRoadLength += getLength(line.getGeometry())
              })
              $this.selectedRoadLength = Math.round($this.selectedRoadLength * 100) / 100
            },
            selectedPointOnRoad: function (pixel){
              if (!this.mapClassObj["indicate-road"]) return

              let feature = this.map.forEachFeatureAtPixel(pixel, function(feature) {
                if (feature.get('type') == 'road') return feature
                else return null
              });
              if (feature == null) return

              let id = this.sources.selectedPointOnRoad.getFeatures().length == 0 ? 1 : 2;
              let sFeature = new Feature({
                section: feature.getId(),
                name: id == 0 ? 'начало отрезка дороги' : 'конец отрезка дороги',
                type: 'selectedPointOnRoad',
                geometry: new Point(this.map.getCoordinateFromPixel(pixel))
              })
              sFeature.setId(id)
              this.sources.selectedPointOnRoad.addFeature(sFeature)
              if (id == 2){
                this.$emit('showSendSectionRoad', {
                  length: this.selectedRoadLength
                })
                this.tooltipShow = false
              }
            },
            filter: function (data){
              let $this = this;
              $.ajax(process.env.VUE_APP_API_URL + 'road/' + data.highway + '/points', {
                dataType: 'json',
                method: 'GET',
                mode: "no-cors",
              }).done(function (data) {

                $this.viewRoadLayer(data.data.highway, data.data.road)
                $this.viewMilestonesLayer(data.data.milestones)


              }).fail(function (data) {
                console.log('Oшибка получения данных: ' + data);
              });

            },
            lineLength: function (coord1, coord2){
              const r = 6371,
                  pi = 3.1415926535898
              let degreeToRad = (d) => {return d * pi / 180 }
              let dLat = degreeToRad(coord2[1] - coord1[1])
              let dLon = degreeToRad(coord2[0] - coord1[0])
              let a = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(degreeToRad(coord1[1])) *
                  Math.cos(degreeToRad(coord2[1])) * Math.pow(Math.sin(dLon / 2))
              let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
              return Math.round(r * c * 1000)
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
                    source: this.sources.road,
                    style: this.styles('road')
                  }),
                  new VectorLayer({
                    source: this.sources.millestone,
                    style: this.styles('millestone')
                  }),
                  new VectorLayer({
                    source: this.sources.selectedPointOnRoad,
                    style: this.styles('selectedPointOnRoad')
                  }),
                  new VectorLayer({
                    source: this.sources.selectedRoad,
                    style: this.styles('selectedRoad')
                  })

                ],
                view: this.view
            });

            let displayFeatureInfo = function(pixel) {
                let feature = map.forEachFeatureAtPixel(pixel, function(feature) {
                    if (feature.get('type') == 'road' || feature.get('type') == 'milestone') return feature;
                });
                if (feature) {
                  let coordinate = toLonLat(map.getCoordinateFromPixel(pixel))
                  let message = feature.get('name') + '<br><span style="font-size: 14px; color: yellow">' + coordinate[0] + '<br>' + coordinate[1] + '</span>'
                  if ($this.mapClassObj["indicate-road"] && $this.selectedRoadLength > 0) {
                    message += '<br><span style="font-size: 16px; color: yellow">' + $this.selectedRoadLength + ' м</span>'
                  }
                  $this.tooltipData = {
                      title: feature.get('title'),
                      message: message,
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
                return feature.get('type') == 'road' && $this.sources.selectedPointOnRoad.getFeatures().length < 2
              });
            }

            map.on('pointermove', function(evt) {
              if (evt.dragging) {
                  return
              }
              displayFeatureInfo(map.getEventPixel(evt.originalEvent))
              mouseCursorType(map.getEventPixel(evt.originalEvent))
              $this.viewSelectedRoad(map.getEventPixel(evt.originalEvent))
            });

            map.on('click', function(evt) {
                $this.selectedPointOnRoad(map.getEventPixel(evt.originalEvent))
            });

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