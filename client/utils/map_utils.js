import {mapState} from './center_and_corner_utils'
import {Biome} from "../biomes"
import {drawVoronoiCell} from "./draw_utils"
import {generateRandomMap, generateRadialMap, generateLongMap} from '../islandShapes'

export const generateMap = (curMap, centerList, width, displayBiome, voronoiObj) => {
    let i = 0
    let center = null
    let color = ""
    const biome = new Biome()

    for (i; i < centerList.length; i++) {
        center = centerList[i]
        if (isInside(curMap, center.point, width)) {
            color = (displayBiome) ? biome.colors.get(center.biome) : biome.colors.get("BEACH")
            centerList[i].ocean = false
        } else {
            centerList[i].ocean = true
            color =  biome.colors.get("OCEAN")
        }
        drawVoronoiCell(i, color, voronoiObj)
    }
    console.log(centerList)
    return centerList
}

export function redrawMap(centerList, displayBiome, voronoiObj) {
    let i = 0
    const biome = new Biome()
    for (i; i < centerList.length; i++) {
        let color = ""
        let center = centerList[i]
        if (displayBiome) {
            color = (center.ocean ? biome.colors.get("OCEAN") : biome.colors.get(center.biome))
        } else {
            color = (center.ocean ? biome.colors.get("OCEAN") : biome.colors.get("BEACH"))
        }
        drawVoronoiCell(i, color, voronoiObj)
    }
    console.log(centerList)

}

// CHeck to see whether a given point is inside land or in water
export function isInside(type, point, width) {
    if (type === mapState[2]) {
        // The point has to be normalized to be between -1.0 and +1.0
        let pt = [1.5 * (point[0] / width - 0.5), 1.5 * (point[1] / width - 0.5)];
        return generateRadialMap(pt);
    } else if (type === mapState[3]) {
        let pt = [1.5 * (point[0] / width - 0.5), 1.5 * (point[1] / width - 0.5)];
        return generateLongMap(pt)
    }
    else return generateRandomMap(point);
}

// Return the distance from (0, 0) to this point
export function pointLength(point) {
    return Math.sqrt(Math.pow(point[0], 2.0) + Math.pow(point[1], 2.0));
}

