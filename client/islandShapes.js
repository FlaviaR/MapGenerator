import {mapState} from "./utils/center_and_corner_utils"
import {Biome} from "./biomes"
import {isInside} from "./utils/map_utils"
import {drawVoronoiCell} from "./utils/draw_utils"

const biome = new Biome()

export const genRandomMap = (centerList, width, displayBiome, voronoiObj) => {
    let curMap = mapState[1]

    let i = 0
    for (i; i < centerList.length; i++) {
        let color = isInside(curMap, centerList[i].point, width) ?
            ((displayBiome) ? biome.colors.get(centerList[i].biome) : biome.colors.get("BEACH")) : biome.colors.get("OCEAN")
        drawVoronoiCell(i, color, voronoiObj)
    }
    return curMap
}

export const genRadialMap = (centerList, width, displayBiome, voronoiObj) => {
    let curMap = mapState[2]

    let i = 0
    for (i; i < centerList.length; i++) {
        let color = isInside(curMap, centerList[i].point, width) ?
            ((displayBiome) ? biome.colors.get(centerList[i].biome) : biome.colors.get("BEACH")) : biome.colors.get("OCEAN")
        drawVoronoiCell(i, color, voronoiObj)
    }

    return curMap
}

export const genLongMap = (centerList, width, displayBiome, voronoiObj) => {
    let curMap = mapState[3]

    let i = 0
    for (i; i < centerList.length; i++) {
        let color = isInside(curMap, centerList[i].point, width) ?
            ((displayBiome) ? biome.colors.get(centerList[i].biome) : biome.colors.get("BEACH")) : biome.colors.get("OCEAN")
        drawVoronoiCell(i, color, voronoiObj)
    }

    return curMap
}