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
    import {LineString, Point, Polygon} from 'ol/geom';
    import VectorLayer from 'ol/layer/Vector';
    import VectorSource from 'ol/source/Vector';
    import Feature from 'ol/Feature';
    import Tooltip from "./Tooltip";
    import {getLength} from 'ol/sphere';
    import MapStyles from "@/classes/MapStyles"
    import Calculate from "@/classes/Calculate";
    import GetMapData from "@/classes/GetMapData";

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
                quarries: new VectorSource(),
                plants: new VectorSource(),
                points: new VectorSource(),
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
            viewRoadLayer: function (highwayData, points, many){
              let features = [],
                  i, j,
                  lat = parseFloat(points[0].nodes[0][1]),
                  lon = parseFloat(points[0].nodes[0][0]),
                  section = Calculate.getRoadSection(highwayData, points)

              if (section.length > 0){
                let name = points[0].tags.name
                points = [{
                  nodes: section,
                  is_second: false,
                  tags: {
                    name: name
                  }
                }]
              }

              let cnt = 0;
              for (i = 0; i < points.length; i++){
                for (j = 0; j < points[i].nodes.length - 1; j++) {
                  let feature = new Feature({
                    title: highwayData.name,
                    name: points[i].tags.name,
                    type: 'road',
                    is_second: points[i].is_second,
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

              if (!many){
                this.sources.road.clear()
                this.sources.selectedRoad.clear()
                this.sources.selectedPointOnRoad.clear()
                this.selectedRoadLength = 0
                this.view.setCenter(fromLonLat([lon, lat]))
              }
              this.sources.road.addFeatures(features)
            },
            viewQuarriesLayer: function (data)
            {
              let features = []
              this.sources.quarries.clear()
              if (data == undefined) return
              for (let i = 0; i < data.length; i++){
                let coordinates = []
                data[i].coordinates.forEach(function (val){
                  coordinates.push(fromLonLat(val))
                })

                features.push(new Feature({
                  title: data[i].name,
                  name: data[i].address,
                  type: 'quarry',
                  geometry: new Polygon([coordinates])
                }))

                features.push(new Feature({
                  type: 'pit',
                  geometry: new Point(coordinates[0]),
                  style: MapStyles.pit()
                }))
              }
              this.sources.quarries.addFeatures(features)
            },
            viewPlantsLayer: function (data)
            {
              let features = []
              this.sources.plants.clear()
              if (data == undefined) return
              for (let i = 0; i < data.length; i++){
                features.push(new Feature({
                  title: data[i].name,
                  name: data[i].address,
                  type: 'plant',
                  geometry: new Point(fromLonLat(data[i].coordinates)),
                  style: MapStyles.plant()
                }))
              }
              this.sources.plants.addFeatures(features)
            },
          viewPointsLayer: function (data)
          {
            let features = []
            this.sources.points.clear()
            if (data == undefined) return
            for (let i = 0; i < data.length; i++){
              features.push(new Feature({
                title: data[i].name,
                name: data[i].node,
                type: 'point',
                geometry: new Point(fromLonLat(data[i].coordinates)),
                style: MapStyles.selectedPointOnRoad()
              }))
            }
            this.sources.points.addFeatures(features)
          },
          viewEdges: function (edges){
            let features = []

            edges.forEach(function (edge){
              let feature = new Feature({
                title: edge.id,
                type: 'road',
                geometry: new LineString(
                    [
                      fromLonLat(edge.nd1),
                      fromLonLat(edge.nd2)
                    ]
                )
              })
              features.push(feature)
            })

            this.sources.road.clear()
            this.sources.selectedRoad.clear()
            this.sources.selectedPointOnRoad.clear()
            this.selectedRoadLength = 0
            this.sources.road.addFeatures(features)
          },
            viewDrsu: function (data){
              console.log(data)
              let getMapData = new GetMapData()

              getMapData.receive('quarry/drsu/' + data.drsu.id, (data) => {this.viewQuarriesLayer(data.data)})
              getMapData.receive('plant/drsu/' + data.drsu.id, (data) => {this.viewPlantsLayer(data.data)})
              getMapData.receive('road/drsu/' + data.drsu.id, (data) => {

                this.sources.road.clear()
                this.sources.selectedRoad.clear()
                this.sources.selectedPointOnRoad.clear()
                this.selectedRoadLength = 0

                if (data.data == undefined) return

                data.data.forEach((road) => {
                  this.viewRoadLayer(road.highway, road.road, true)
                })
              })
              this.view.setZoom(8)
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
              let getMapData = new GetMapData()

              getMapData.receive('road/' + data.highway + '/points', (data) => {
                this.viewRoadLayer(data.data.highway, data.data.road, false)
                this.drawMilestonePoints(data.data.highway.start)
              })
            },
            viewAddr: function (data){
              this.view.setCenter(fromLonLat([data.addr.lon, data.addr.lat]))
              this.view.setZoom(14)
            },
            drawMilestonePoints: function (start){
              let points = Calculate.getMilestonePoints(this.sources.road, start)
              let features = [];
              for (let i = 0; i < points.length; i++){
                features.push(new Feature({
                  name: points[i].k + ' км',
                  type: 'milestone',
                  geometry: new Point(points[i].p)
                }))
              }
              this.sources.millestone.clear()
              this.sources.millestone.addFeatures(features)
            },
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
                    style: MapStyles.road()
                  }),
                  new VectorLayer({
                    source: this.sources.millestone,
                    style: function (feature) {
                      let labelStyle = MapStyles.label()
                      labelStyle.getText().setText(feature.get('name'))
                      return [MapStyles.millestone(), labelStyle]
                    }
                  }),
                  new VectorLayer({
                    source: this.sources.selectedPointOnRoad,
                    style: MapStyles.selectedPointOnRoad()
                  }),
                  new VectorLayer({
                    source: this.sources.quarries,
                    style: [MapStyles.quarry(), MapStyles.pit()]
                  }),
                  new VectorLayer({
                    source: this.sources.plants,
                    style: MapStyles.plant()
                  }),
                  new VectorLayer({
                    source: this.sources.points,
                    style: MapStyles.selectedPointOnRoad()
                  }),
                  new VectorLayer({
                    source: this.sources.selectedRoad,
                    style: MapStyles.selectedRoad()
                  })

                ],
                view: this.view
            });

            let displayFeatureInfo = function(pixel) {
                let feature = map.forEachFeatureAtPixel(pixel, function(feature) {
                  const types = ['road', 'milestone', 'quarry', 'plant', 'point']
                  if (types.includes(feature.get('type'))) return feature
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