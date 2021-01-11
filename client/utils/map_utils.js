import { mapState, fetchBiome, getNeighborsIndexes } from './center_and_corner_utils'
import { Biome } from "../biomes"
import { drawVoronoiCell, drawNoisyCell } from "./draw_utils"
import { generateRandomMap, generateRadialMap, generateLongMap } from '../islandShapes'

export const generateMap = (curMap, centerList, width, createNewMap = true) => {
    // Do not recompute "isInside"" if only applying lloyd relaxation or updating biomes
    let i = 0
    for (i; i < centerList.length; i++) {
        let center = centerList[i]
        if (createNewMap) {

            if (isInside(curMap, center.point, width) && !center.isBorder) { // land
                center.ocean = false
                center.isWater = false
            } else { // water
                center.ocean = false
                center.isWater = true
            }
        } else { // create lakes when applying lloyd relaxation
            if (center.ocean) {
                center.ocean = false
                center.isWater = true
            }
        }

    }
    return centerList
}

function moistureControl(moistureAmount, center) {
    if (moistureAmount) {
        moistureAmount = parseFloat(moistureAmount)

        if (moistureAmount < 0.9) {
            center.moisture = center.moistureOriginal - moistureAmount
        }
        else if (0.9 < moistureAmount && moistureAmount < 1.1) {
            center.moisture = center.moistureOriginal
        }
        else if (moistureAmount > 1.1) {
            let moistureAmountCulled = moistureAmount - 1
            center.moisture = center.moistureOriginal + moistureAmountCulled
        }

        if (center.moisture < 0) center.moisture = 0
        else if (center.moisture > 1) center.moisture = 1

        center.biome = fetchBiome(center)
    }
    return center
}

function elevationControl(elevationAmount, center) {
    if (elevationAmount) {
        elevationAmount = parseFloat(elevationAmount)

        if (elevationAmount < 0.9) {
            center.elevation = center.elevation - elevationAmount
        }
        else if (0.9 < elevationAmount && elevationAmount < 1.1) {
            center.elevation = center.elevationOriginal
        }
        else if (elevationAmount > 1.1) {
            let elevationAmountCulled = elevationAmount - 1
            center.elevation = center.elevation + elevationAmountCulled
        }

        if (center.elevation < 0) center.elevation = 0
        else if (center.elevation > 1) center.elevation = 1

        center.biome = fetchBiome(center)
    }
    return center
}

function updateLake(center, noisyPolygonList, voronoiObj) {
    if ((center.isWater && !center.ocean && !center.isCoast) || center.isDriedUpLake) {
        const neighborIndexes = getNeighborsIndexes(center, voronoiObj)
        let moistureAverage = 0
        let j = 0
        for (j; j < neighborIndexes.length; j++) {
            let neighbor = noisyPolygonList[neighborIndexes[j]]
            moistureAverage += neighbor.center.moisture
        }
        moistureAverage /= neighborIndexes.length
        console.log(moistureAverage)
        if (moistureAverage < 0.35) {
            center.isWater = false
            center.biome = "BARE"
            center.isDriedUpLake = true
        } else {
            if (center.isDriedUpLake) {
                center.isWater = true
                center.isDriedUpLake = false
                center.biome = fetchBiome(center)
            }
        }
    }
    return center
}

export function drawNoisyMap(noisyPolygonList, displayBiome, voronoiObj, moistureAmount, elevationAmount) {
    let i = 0
    const biome = new Biome()
    for (i; i < noisyPolygonList.length; i++) {
        let color = ""
        let center = noisyPolygonList[i].center

        center = moistureControl(moistureAmount, center)
        center = elevationControl(elevationAmount, center)
        center = updateLake(center, noisyPolygonList, voronoiObj)

        if (displayBiome) {
            color = (center.isCoast) ? biome.colors.get("BEACH") : biome.colors.get(center.biome)
            if (center.isWater) color = biome.colors.get("WATER")

        } else {
            // Bottom line - gets rid of lakes
            // color = (center.ocean ? biome.colors.get("OCEAN") : biome.colors.get("BEACH"))
            color = (center.isWater ? biome.colors.get("WATER") : biome.colors.get("BEACH"))
        }
        if (center.ocean || center.isBorder) color = biome.colors.get("OCEAN")
        drawNoisyCell(i, color, voronoiObj, noisyPolygonList)
    }
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

