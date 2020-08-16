import { Delaunay } from "d3-delaunay";
import {relaxPoints} from "./utils"

// TODO: 
// lloyd relaxation
// land / water separation
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext('2d');
var width = canvas.width
var height = canvas.height
var num = 500
var button = document.getElementById("lloydButton");

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
    
    drawVoronoi()
}

drawVoronoi()

button.addEventListener('click', relaxVoronoi, false)



