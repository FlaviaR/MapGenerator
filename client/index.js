import { Delaunay } from "d3-delaunay";

// TODO: 
// lloyd relaxation
// land / water separation
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext('2d');
var width = canvas.width
var height = canvas.height
var num = 400
const particles = Array.from({length: num}, () => [Math.random() * width, Math.random() * height]);

const delaunay = Delaunay.from(particles);
const voronoi = delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5]);

context.clearRect(0, 0, width, height);

context.beginPath();
voronoi.render(context);
voronoi.renderBounds(context);
context.strokeStyle = "#000";
context.stroke();

context.beginPath();
context.fill();



console.log(context)
console.log(voronoi.render())