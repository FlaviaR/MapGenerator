import { random_hex_color_code } from "./utils"
import { Biome } from "../biomes";
import { getNeighborsIndexes } from "./center_and_corner_utils"
import { createNoisyPolygonList } from "./noiseUtils"

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext('2d');
const biome = new Biome()

function drawPoints(x, y) {
    context.fillStyle = "red";
    context.fillRect(x, y, 3, 3)
}

export function drawNoisyCell(index, cellColor, voronoiObj, noisyPolygonList) {
    let center = noisyPolygonList[index].center
    let edges = noisyPolygonList[index].edges

    const grdOcean = context.createLinearGradient(0, 0, 900, 0);
    grdOcean.addColorStop(0, biome.colors.get("OCEAN"));
    grdOcean.addColorStop(1, "#072042");
    context.fillStyle = cellColor;

    if (center.ocean) {
        context.fillStyle = grdOcean;
    }

    let i = 0
    context.beginPath();
    context.moveTo(edges[0][0][0], edges[0][0][1])

    for (i; i < edges.length; i++) {
        let j = 0
        for (j; j < edges[i].length - 1; j++) {
            let edge = edges[i]

            context.strokeStyle = "white";
            let x = edge[j + 1][0]
            let y = edge[j + 1][1]
            context.lineTo(x, y)

            if (!center.ocean) {
                context.lineWidth = 1;
                context.strokeStyle = "grey";

                context.stroke()
            }
        }
    }

    context.fill()

    //Draw black map outline - fix this whenever you feel too happy
    if (center.isCoast) {
        let neighborsIndexes = getNeighborsIndexes(center, voronoiObj)
        let i = 0
        for (i; i < neighborsIndexes.length; i++) {
            let neighborIndex = neighborsIndexes[i]
            let neighbor = noisyPolygonList.filter(obj => {
                return obj.center.index === neighborIndex
            })
            let neighborCenter = neighbor[0].center
            neighbor = neighbor[0]
            if (neighbor) {
                if (neighborCenter.ocean) {
                    let centerVertices = voronoiObj.voronoi.cellPolygon(center.index)
                    let neighborVertices = voronoiObj.voronoi.cellPolygon(neighborCenter.index)
                    let maxLen = Math.max(centerVertices.length, neighborVertices.length)
                    let biggerArray = (maxLen == centerVertices.length) ? centerVertices : neighborVertices
                    let smallerArray = (biggerArray == centerVertices) ? neighborVertices : centerVertices

                    // Find shared edge
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
                    if (startPoint && endPoint) {
                        let a = 0
                        let res = []
                        for (a; a < neighbor.edges.length; a++) {
                            let edges = neighbor.edges[a]
                            let edgesStr = edges.map(JSON.stringify);
                            if (edgesStr.indexOf(JSON.stringify(startPoint)) >= 0 && edgesStr.indexOf(JSON.stringify(endPoint)) >= 0) {
                                res = edges
                                break
                            }
                        }

                        context.beginPath();
                        context.strokeStyle = "black";
                        context.lineWidth = 3;
                        context.moveTo(res[0][0], res[0][1])

                        let r = 0
                        for (r; r < res.length; r++) {
                            let point = res[r]

                            let x = point[0]
                            let y = point[1]
                            context.lineTo(x, y)
                            context.stroke();
                        }
                    }
                    // context.strokeStyle = "black";

                    // context.lineWidth = 4;
                    // context.moveTo(startPoint[0], startPoint[1])
                    // context.lineTo(endPoint[0], endPoint[1])
                    // context.stroke();

                }


            }
        }
    }
}


export function drawVoronoiCell(index, cellColor, voronoiObj, centerList) {
    let center = centerList[index]

    context.beginPath();
    const grdOcean = context.createLinearGradient(0, 0, 900, 0);
    grdOcean.addColorStop(0, biome.colors.get("OCEAN"));
    grdOcean.addColorStop(1, "#072042");
    context.fillStyle = cellColor;

    if (center.ocean) {
        context.fillStyle = grdOcean;
    }

    voronoiObj.voronoi.renderCell(index, context)


    if (!center.ocean) {
        context.lineWidth = 1;
        context.strokeStyle = "grey";

        context.stroke()
    }

    context.fill();
    context.closePath()


    // Draw black map outline
    if (center.isCoast) {
        let neighborsIndexes = getNeighborsIndexes(center, voronoiObj)
        let i = 0
        for (i; i < neighborsIndexes.length; i++) {
            let neighborIndex = neighborsIndexes[i]
            let neighbor = centerList[neighborIndex]
            if (neighbor) { // for some reason sometimes this is undefined
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
                    context.strokeStyle = "black";

                    context.lineWidth = 4;
                    context.moveTo(startPoint[0], startPoint[1])
                    context.lineTo(endPoint[0], endPoint[1])
                    context.stroke();

                    context.closePath()

                }
            }
        }
    }

}


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
