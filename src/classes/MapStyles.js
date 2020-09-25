import {Circle as CircleStyle, Fill, Stroke, Style, Text} from "ol/style";
import Icon from "ol/style/Icon";
import iconPit from "@/assets/pit.png";
import iconPlant from "@/assets/plant.png";

class MapStyles {

    static millestone() {
        return new Style({
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({color: 'black'}),
                stroke: new Stroke({
                    color: 'white', width: 2
                })
            })
        })
    }

    static road(){
        return new Style({
            stroke: new Stroke({
                color: '#666666',
                width: 4
            })
        })
    }

    static selectedPointOnRoad() {
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

    static selectedRoad(){
        return new Style({
            stroke: new Stroke({
                color: 'red',
                width: 6
            })
        })
    }

    static quarry(){
        return new Style({
            stroke: new Stroke({
                color: 'red',
                width: 2,
            }),
            fill: new Fill({
                color: 'yellow',
            })
        })
    }

    static pit(){
        return new Style({
            image: new Icon({
                anchor: [0.5, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: iconPit
            })
        })
    }

    static plant(){
        return new Style({
            image: new Icon({
                anchor: [0.5, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: iconPlant
            })
        })
    }

    static label(){
        return  new Style({
            text: new Text({
                font: '14px Calibri,sans-serif',
                overflow: true,
                fill: new Fill({
                    color: 'blue',
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 3,
                }),
            }),
        });

    }

}

export default MapStyles