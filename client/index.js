import {relaxPoints, initCenters} from "./utils/utils"
import {isInside} from "./utils/map_utils"
import {Biome} from "./biomes"
import {VoronoiObj} from "./voronoiObj"

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext('2d');
const width = canvas.width
const height = canvas.height
const num = 2000
const lloydButton = document.getElementById("lloydButton");
const randomButton = document.getElementById("randomMap");
const radialButton = document.getElementById("radialMap");
const biome = new Biome()

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
    context.fillRect(point[0],point[1],3,3)
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
    drawVoronoi()
}

const genRandomMap = () => {
    let i = 0
    for (i; i < centerList.length; i++) {
        let color = isInside(false, centerList[i].point, width) ? biome.colors.get(centerList[i].biome) : biome.colors.get("OCEAN")
        drawVoronoiCell(i, color)
    }
}

const genRadialMap = () => {
    let i = 0
    for (i; i < centerList.length; i++) {
        let color = isInside(true, centerList[i].point, width) ? biome.colors.get(centerList[i].biome) : biome.colors.get("OCEAN")
        drawVoronoiCell(i, color)
    }
}

const init = () => {
    let i = 0
    for (i; i < points.length; i++) {
        centerList.push(initCenters(points[i], i, voronoiObj))
    }
}

drawVoronoi()
init()

lloydButton.addEventListener('click', relaxVoronoi, false)
randomButton.addEventListener('click', genRandomMap)
radialButton.addEventListener('click', genRadialMap, false)



