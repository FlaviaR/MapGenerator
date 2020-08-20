import { relaxPoints, initCenters } from "./utils/utils"
import { isInside } from "./utils/map_utils"
import { Biome } from "./biomes"
import { VoronoiObj } from "./voronoiObj"

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext('2d');
const width = canvas.width
const height = canvas.height
const num = 2000
const lloydButton = document.getElementById("lloydButton");
const randomButton = document.getElementById("randomMap");
const radialButton = document.getElementById("radialMap");
const displayBiomesCheckbox = document.getElementById("displayBiomes");

const biome = new Biome()
let displayBiome = false
const mapState = ["basic", "random", "radial"]
let curMap = mapState[0]

let points = Array.from({ length: num }, () => [Math.random() * width, Math.random() * height]);
let centerList = []
let voronoiObj = new VoronoiObj(points, width, height)

context.clearRect(0, 0, width, height);

const random_hex_color_code = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
};

function drawPoints(index) {
    let point = points[index]

    context.fillStyle = "black";
    context.fillRect(point[0], point[1], 3, 3)
}

function drawVoronoiCell(index, cellColor) {
    context.strokeStyle = "#fff";
    context.lineWidth = 0;
    context.fillStyle = cellColor;

    context.beginPath();

    voronoiObj.voronoi.renderCell(index, context)

    context.fill();
    context.stroke();

    context.closePath()
}

function drawVoronoi() {
    let i = 0
    for (i; i < points.length; i++) {
        drawVoronoiCell(i, random_hex_color_code())
        drawPoints(i)
    }
}

const relaxVoronoi = () => {
    points = relaxPoints(voronoiObj.voronoi, points)
    voronoiObj.updateVoronoi(points)
    init()
    drawVoronoi()
}

const genRandomMap = () => {
    curMap = mapState[1]
    let i = 0
    for (i; i < centerList.length; i++) {
        let color = isInside(false, centerList[i].point, width) ?
            ((displayBiome) ? biome.colors.get(centerList[i].biome) : biome.colors.get("BEACH")) : biome.colors.get("OCEAN")
        drawVoronoiCell(i, color)
    }
}

const genRadialMap = () => {
    curMap = mapState[2]

    let i = 0
    for (i; i < centerList.length; i++) {
        let color = isInside(true, centerList[i].point, width) ?
            ((displayBiome) ? biome.colors.get(centerList[i].biome) : biome.colors.get("BEACH")) : biome.colors.get("OCEAN")
        drawVoronoiCell(i, color)
    }
}

const init = () => {
    let i = 0
    for (i; i < points.length; i++) {
        centerList.push(initCenters(points[i], i, voronoiObj))
    }
}

const drawRectangle = (p, ctx, color, text) => {
    ctx.fillStyle = color;
    ctx.fillRect(p[0], p[1], 20, 10);
    ctx.font = "15px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(text, p[0] + 30, p[1] + 10);
}

const drawKey = () => {
    const biomeCanvas = document.getElementById("biomeKey");
    var ctx = biomeCanvas.getContext("2d");
    drawRectangle([20, 20], ctx, biome.colors.get("OCEAN"), "Ocean")
    drawRectangle([110, 20], ctx, biome.colors.get("BEACH"), "BEACH")
    drawRectangle([200, 20], ctx, biome.colors.get("MARSH"), "MARSH")
    drawRectangle([300, 20], ctx, biome.colors.get("ICE"), "ICE")
    drawRectangle([370, 20], ctx, biome.colors.get("LAKE"), "LAKE")
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

drawVoronoi()
drawKey()
init()

lloydButton.addEventListener('click', relaxVoronoi, false)
randomButton.addEventListener('click', genRandomMap)
radialButton.addEventListener('click', genRadialMap, false)
displayBiomesCheckbox.addEventListener('change', function () {
    if (this.checked) {
        displayBiome = true
    } else {
        displayBiome = false
    }
    if (curMap == mapState[1]) genRandomMap()
    else if (curMap == mapState[2]) genRadialMap()
});


