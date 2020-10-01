import {fromLonLat, toLonLat} from "ol/proj";
import {getLength} from "ol/sphere";
import {LineString} from "ol/geom";

class Calculate {

    static getRoadSection(highwayData, points)
    {
        if (highwayData.from == undefined) return []
        if (highwayData.to == undefined || highwayData.to == 0) return []

        let nodes = []
        for (let i = 0; i < points.length; i++){
            points[i].nodes.forEach((v) => nodes.push(fromLonLat(v)))
        }

        let length = highwayData.from * 1000,
            startPoint = nodes[0],
            startIndex = 0

        let findPoint = nodes.some((point, i) => {
            let l = Math.round(getLength(new LineString([startPoint, point])) * 100) / 100
            if (length > l){
                length -= l
                startPoint = point
                return false
            }
            startPoint = this.getPointOnLine(startPoint, point, length)
            startIndex = i
            return true
        })
        if (!findPoint) return []

        let section = [startPoint]
        length = (highwayData.to - highwayData.from) * 1000
        nodes.some((point, i) => {
            if (i < startIndex) return false

            let l = Math.round(getLength(new LineString([startPoint, point])) * 100) / 100
            if (length > l){
                length -= l
                startPoint = point
                section.push(point)
                return false
            }

            startPoint = this.getPointOnLine(startPoint, point, length)
            section.push(startPoint)
            return true
        })

        nodes = []
        section.forEach((v) => nodes.push(toLonLat(v)))

        return nodes
    }

    static getMilestonePoints(source){
        let roadFeatures = source.getFeatures(),
            k = 0,
            length = 1000,
            l = 0,
            points = []
        ;
        roadFeatures.sort(function (a, b){
            if (a.getId() < b.getId()) return -1
            return 1
        })
        let point1 = roadFeatures[0].getGeometry().getCoordinates()[0],
            point2;
        points.push({
            p: point1,
            k: k
        })
        for (let i = 0; i < roadFeatures.length; i++){
            point2 = roadFeatures[i].getGeometry().getCoordinates()[1]
            l = Math.round(getLength(new LineString([point1, point2])) * 100) / 100
            if (l < length){
                length = length - l
                point1 = point2
                continue
            }
            point2 = this.getPointOnLine(point1, point2, length)
            k++
            points.push({
                p: point2,
                k: k
            })
            point1 = point2
            length = 1000
        }

        let full = 0
        roadFeatures.forEach(function (rf){
          full += getLength(rf.getGeometry())
        })
        point2 = roadFeatures[roadFeatures.length - 1].getGeometry().getCoordinates()[1]
        points.push({
          p: point2,
          k: Math.round(full) / 1000
        })

        return points
    }

    static getPointOnLine(p1, p2, length){
        const DEGREES_IN_KM = 0.0088
        let ld = length * DEGREES_IN_KM / 1000,
            l = 0


        p1 = toLonLat(p1)
        p2 = toLonLat(p2)
        let dLat = p2[1] - p1[1],
            dLon = p2[0] - p1[0],
            k = ld / Math.sqrt(Math.pow(dLat, 2) + Math.pow(dLon, 2)),
            p = [],
            delta = 0,
            ad = 0,
            dk = 0.025

        let i = 0
        while (Math.abs(length - l) > 5){
            p[1] = p1[1] + dLat * k;
            p[0] = p1[0] + dLon * k;
            l = Math.round(getLength(new LineString([fromLonLat(p1), fromLonLat(p)])) * 100) / 100
            delta = length - l
            ad = Math.abs(delta)
            if (ad > 100){
                dk = 0.2
            }else if (ad > 50){
                dk = 0.1
            }else if (ad > 30){
                dk = 0.05
            }else if (ad > 10){
                dk = 0.025
            }else {
                dk = 0.01
            }
            k += delta > 0 ? dk : -1 * dk
            //console.log(i + '  d: ' + delta + '  k: ' + k + '  dk: ' + dk)
            i++
            if (i > 20) break
        }

        return fromLonLat(p);
    }
}

export default Calculate