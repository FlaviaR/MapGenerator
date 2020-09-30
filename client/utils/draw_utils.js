import { random_hex_color_code } from "./utils"
import { Biome } from "../biomes";
import { getNeighborsIndexes } from "./center_and_corner_utils"

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext('2d');
const biome = new Biome()

function drawPoints(index, points) {
    let point = points[index]

    context.fillStyle = "black";
    context.fillRect(point[0], point[1], 3, 3)
}

export function drawVoronoiCell(index, cellColor, voronoiObj, centerList) {
    context.lineWidth = 0;
    context.fillStyle = cellColor;

    context.beginPath();

    voronoiObj.voronoi.renderCell(index, context)
    context.fill();

    context.closePath()

    let center = centerList[index]
    if (center.isCoast) {
        let neighborsIndexes = getNeighborsIndexes(center, voronoiObj)
        let i = 0
        for (i; i < neighborsIndexes.length; i++) {
            let neighborIndex = neighborsIndexes[i]
            let neighbor = centerList[neighborIndex]
            if (neighbor.ocean) {
                let centerVertices = voronoiObj.voronoi.cellPolygon(center.index)
                let neighborVertices = voronoiObj.voronoi.cellPolygon(neighbor.index)

                let maxLen = Math.max(centerVertices.length, neighborVertices.length)
                let biggerArray = (maxLen == centerVertices.length) ? centerVertices : neighborVertices
                let smallerArray = (biggerArray == centerVertices) ? neighborVertices : centerVertices
                
                let j = 0
                let startPoint = null
                let endPoint = null
                for (j; j < biggerArray.length; j++) {
                    let k = 0
                    for (k; k < smallerArray.length; k++) {
            
                        if (biggerArray[j][0] === smallerArray[k][0] && 
                            biggerArray[j][1] === smallerArray[k][1]) {
                            if (startPoint == null) {
                                startPoint = biggerArray[j]
                                break
                            }
                            // The polygon closes on its original point
                            // Prevent the end point from being the polygon's origin point
                            if (biggerArray[j][0] != startPoint[0] && 
                                biggerArray[j][1] != startPoint[1]) {
                                endPoint = biggerArray[j]
                                break
                            }
                        }
                    }
                }
                context.beginPath();

                context.lineWidth = 3;
                context.moveTo(startPoint[0], startPoint[1])
                context.lineTo(endPoint[0], endPoint[1])
                context.stroke();
    
                context.closePath()

            }
        }
    }

}

// export function drawVoronoi(points, voronoiObj, centerList) {
//     let i = 0
//     for (i; i < points.length; i++) {
//         drawVoronoiCell(i, random_hex_color_code(), voronoiObj, centerList)
//         drawPoints(i, points)
//     }
// }


const drawRectangle = (p, ctx, color, text) => {
    ctx.fillStyle = color;
    ctx.fillRect(p[0], p[1], 20, 10);
    ctx.font = "15px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(text, p[0] + 30, p[1] + 10);
}

export const drawKey = () => {
    const biomeCanvas = document.getElementById("biomeKey");
    var ctx = biomeCanvas.getContext("2d");
    drawRectangle([20, 20], ctx, biome.colors.get("OCEAN"), "Ocean")
    drawRectangle([110, 20], ctx, biome.colors.get("BEACH"), "BEACH")
    drawRectangle([200, 20], ctx, biome.colors.get("MARSH"), "MARSH")
    drawRectangle([300, 20], ctx, biome.colors.get("ICE"), "ICE")
    drawRectangle([370, 20], ctx, biome.colors.get("WATER"), "WATER")
    drawRectangle([450, 20], ctx, biome.colors.get("SNOW"), "SNOW")
    drawRectangle([540, 20], ctx, biome.colors.get("TUNDRA"), "TUNDRA")
    drawRectangle([640, 20], ctx, biome.colors.get("BARE"), "BARE")
    drawRectangle([20, 50], ctx, biome.colors.get("SCORCHED"), "SCORCHED")
    drawRectangle([150, 50], ctx, biome.colors.get("TAIGA"), "TAIGA")
    drawRectangle([240, 50], ctx, biome.colors.get("SHRUBLAND"), "SHRUBLAND")
    drawRectangle([380, 50], ctx, biome.colors.get("TEMPERATE_RAIN_FOREST"), "TEMPERATE_RAIN_FOREST")
    drawRectangle([20, 80], ctx, biome.colors.get("TEMPERATE_DECIDUOUS_FOREST"), "TEMPERATE_DECIDUOUS_FOREST")
    drawRectangle([320, 80], ctx, biome.colors.get("GRASSLAND"), "GRASSLAND")
    drawRectangle([450, 80], ctx, biome.colors.get("TEMPERATE_DESERT"), "TEMPERATE_DESERT")
    drawRectangle([20, 110], ctx, biome.colors.get("TROPICAL_RAIN_FOREST"), "TROPICAL_RAIN_FOREST")
    drawRectangle([250, 110], ctx, biome.colors.get("TROPICAL_SEASONAL_FOREST"), "TROPICAL_SEASONAL_FOREST")
    drawRectangle([530, 110], ctx, biome.colors.get("SUBTROPICAL_DESERT"), "SUBTROPICAL_DESERT")

}
