import { mapState } from './center_and_corner_utils'
import { Biome } from "../biomes"
import { drawVoronoiCell } from "./draw_utils"
import { generateRandomMap, generateRadialMap, generateLongMap } from '../islandShapes'

export const generateMap = (curMap, centerList, width, createNewMap=true) => {
    // Do not recompute "isInside"" if only applying lloyd relaxation or updating biomes
    if (createNewMap) {
        let i = 0
        for (i; i < centerList.length; i++) {
            let center = centerList[i]
            if (isInside(curMap, center.point, width) && !center.isBorder) { // land
                centerList[i].ocean = false
                centerList[i].isWater = false
            } else { // water
                centerList[i].ocean = false
                centerList[i].isWater = true
            }
        }
    }

    return centerList
}

export function drawMap(centerList, displayBiome, voronoiObj) {
    let i = 0
    const biome = new Biome()
    for (i; i < centerList.length; i++) {
        let color = ""
        let center = centerList[i]

        if (displayBiome) {
            color = (center.isCoast) ? biome.colors.get("BEACH") : biome.colors.get(center.biome)
            if (center.isWater) color = biome.colors.get("WATER")

        } else {
            // Bottom line - gets rid of lakes
            // color = (center.ocean ? biome.colors.get("OCEAN") : biome.colors.get("BEACH"))
            color = (center.isWater ? biome.colors.get("WATER") : biome.colors.get("BEACH"))
        }
        if (center.ocean || center.isBorder) color = biome.colors.get("OCEAN")

        drawVoronoiCell(i, color, voronoiObj, centerList)
    }
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

