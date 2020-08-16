import { Delaunay } from "d3-delaunay";

// TODO: 
// lloyd relaxation
// land / water separation
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext('2d');
var width = canvas.width
var height = canvas.height
var num = 500
const particles = Array.from({ length: num }, () => [Math.random() * width, Math.random() * height]);

const delaunay = Delaunay.from(particles);
const voronoi = delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5]);

context.clearRect(0, 0, width, height);

const random_hex_color_code = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
};

function drawPoints(index) {
    var point = particles[i]

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

var i = 0
for (i; i < particles.length; i++) {
    drawVoronoiCell(i, random_hex_color_code())
    drawPoints(i)
}
