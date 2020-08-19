import { Delaunay } from "d3-delaunay";
import {relaxPoints} from "./utils"
import {generateRandomMap} from "./map_utils"
import {Biome} from "./biomes"

// TODO: 
// lloyd relaxation
// land / water separation
const canvas = document.getElementById("myCanvas");
const context = canvas.getContext('2d');
const width = canvas.width
const height = canvas.height
const num = 700
const lloydButton = document.getElementById("lloydButton");
const randomButton = document.getElementById("randomMap");
const radialButton = document.getElementById("radialMap");
const biome = new Biome()

let points = Array.from({ length: num }, () => [Math.random() * width, Math.random() * height]);

let delaunay = Delaunay.from(points);
let voronoi = delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5]);

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

    voronoi.renderCell(index, context)

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
    points = relaxPoints(voronoi, points)

    delaunay = Delaunay.from(points)
    voronoi = delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5]);
    
    // voronoi.update(points)

    drawVoronoi()
}

const genRandomMap = () => {
    points.map(point => generateRandomMap(point))
    let i = 0
    for (i; i < points.length; i++) {
        let color = generateRandomMap(points[i]) ? biome.beach : biome.ocean
        drawVoronoiCell(i, color)
    }
}

drawVoronoi()

lloydButton.addEventListener('click', relaxVoronoi, false)
randomButton.addEventListener('click', genRandomMap)
// radialButton.addEventListener('click', relaxVoronoi, false)



